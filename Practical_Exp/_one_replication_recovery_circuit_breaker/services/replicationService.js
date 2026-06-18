const { ProductPrimary, ProductReplica } = require('../models/Product');
const WAL = require('../models/WAL');
const { replicaCircuitBreaker } = require('./circuitBreaker');

const replicationService = {

  // Called after every write to primary DB
  async replicate(operation, document) {

    // Step 1 — log to WAL before attempting replication
    // This ensures we never lose a write even if replica is down
    const walEntry = await WAL.create({
      operation,
      documentId:       document._id,
      data:             document.toObject(),
      appliedToReplica: false,
    });

    console.log(`[WAL] Logged ${operation} for document ${document._id}`);

    // Step 2 — attempt replication through circuit breaker
    // Circuit breaker will block the call if replica has been failing
    try {
      await replicaCircuitBreaker.call(async () => {
        await this._applyToReplica(operation, document.toObject());
      });

      // Step 3 — mark WAL entry as applied on success
      walEntry.appliedToReplica = true;
      await walEntry.save();
      console.log(`[Replication] ${operation} successfully synced to replica`);

    } catch (err) {
      // Replica is down or circuit is open
      // WAL entry remains with appliedToReplica: false
      // It will be replayed during recovery
      console.log(`[Replication] Replica unavailable. Entry saved in WAL for later recovery. Reason: ${err.message}`);
    }
  },

  // Applies a single operation directly to the replica DB
  async _applyToReplica(operation, data) {
    if (operation === 'INSERT' || operation === 'UPDATE') {
      await ProductReplica.findByIdAndUpdate(
        data._id,
        data,
        { upsert: true, new: true }
      );
    } else if (operation === 'DELETE') {
      await ProductReplica.findByIdAndDelete(data._id);
    }
  },

  // Replays all pending WAL entries to bring replica back in sync
  // Call this endpoint when replica comes back online after a crash
  async recover() {
    const pending = await WAL.find({ appliedToReplica: false }).sort({ timestamp: 1 });

    if (pending.length === 0) {
      return { message: 'Replica is already in sync. Nothing to recover.', recovered: 0 };
    }

    console.log(`[Recovery] Found ${pending.length} pending WAL entries. Starting replay...`);

    let recovered = 0;
    const errors  = [];

    for (const entry of pending) {
      try {
        await replicaCircuitBreaker.call(async () => {
          await this._applyToReplica(entry.operation, entry.data);
        });

        entry.appliedToReplica = true;
        await entry.save();
        recovered++;
        console.log(`[Recovery] Replayed ${entry.operation} for document ${entry.documentId}`);

      } catch (err) {
        errors.push({ docId: entry.documentId, error: err.message });
        console.log(`[Recovery] Failed to replay entry: ${err.message}`);
        break; // stop replay if circuit is still open
      }
    }

    return {
      message:   'Recovery complete',
      recovered,
      failed:    errors.length,
      remaining: pending.length - recovered,
      errors,
    };
  },

  // Returns how many WAL entries are still pending replication
  // Use this to monitor replication lag
  async getLag() {
    const total   = await WAL.countDocuments();
    const pending = await WAL.countDocuments({ appliedToReplica: false });

    return {
      totalWalEntries:  total,
      appliedToReplica: total - pending,
      pendingSync:      pending,
      inSync:           pending === 0,
    };
  },
};

module.exports = replicationService;