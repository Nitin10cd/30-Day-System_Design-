const express = require('express');
const router = express.Router();
const { ProductPrimary, ProductReplica } = require('../models/Product');
const replicationService = require('../services/replicationService');
const { replicaCircuitBreaker } = require('../services/circuitBreaker');

// CREATE — always writes to primary, then replicates
router.post('/products', async (req, res) => {
  try {
    const product = await ProductPrimary.create(req.body);
    await replicationService.replicate('INSERT', product);

    res.status(201).json({
      success: true,
      source:  'primary',
      data:    product,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// READ ALL — tries replica first, falls back to primary if circuit is open
router.get('/products', async (req, res) => {
  try {
    const products = await replicaCircuitBreaker.call(async () => {
      return await ProductReplica.find();
    });

    res.json({ success: true, source: 'replica', data: products });

  } catch (err) {
    // Replica unavailable — fallback to primary
    console.log(`[Fallback] Replica failed, reading from primary. Reason: ${err.message}`);
    const products = await ProductPrimary.find();
    res.json({ success: true, source: 'primary (fallback)', data: products });
  }
});

// READ ONE — same fallback logic
router.get('/products/:id', async (req, res) => {
  try {
    const product = await replicaCircuitBreaker.call(async () => {
      return await ProductReplica.findById(req.params.id);
    });

    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, source: 'replica', data: product });

  } catch (err) {
    console.log(`[Fallback] Reading from primary. Reason: ${err.message}`);
    const product = await ProductPrimary.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, source: 'primary (fallback)', data: product });
  }
});

// UPDATE — writes to primary, replicates
router.put('/products/:id', async (req, res) => {
  try {
    const product = await ProductPrimary.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    await replicationService.replicate('UPDATE', product);
    res.json({ success: true, source: 'primary', data: product });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE — writes to primary, replicates
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await ProductPrimary.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    await replicationService.replicate('DELETE', product);
    res.json({ success: true, message: 'Product deleted', data: product });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// RECOVERY — call this when replica comes back online
router.post('/recover', async (req, res) => {
  try {
    const result = await replicationService.recover();
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// REPLICATION LAG — check how many entries are pending
router.get('/lag', async (req, res) => {
  try {
    const lag = await replicationService.getLag();
    res.json({ success: true, ...lag });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CIRCUIT BREAKER STATUS — check current state
router.get('/circuit-status', (req, res) => {
  res.json({ success: true, circuitBreaker: replicaCircuitBreaker.getStatus() });
});

module.exports = router;