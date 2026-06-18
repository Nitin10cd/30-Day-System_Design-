// Here we have the 3 states
// CLOSED -> ALL OK, REQUESTS TRAVERS PROPERLY
// OPEN -> TOO MANY FAILURES , BLOCK REPLICA 
// HALF OPEN -> AFTER TIMEOUT HIT REQ FOR TEST


const STATES = {
  CLOSED:    'CLOSED',
  OPEN:      'OPEN',
  HALF_OPEN: 'HALF_OPEN',
};

class CircuitBreaker {
  constructor(name) {
    this.name             = name;
    this.state            = STATES.CLOSED;
    this.failureCount     = 0;
    this.lastFailureTime  = null;
    this.failureThreshold = parseInt(process.env.CB_FAILURE_THRESHOLD) || 3;
    this.recoveryTimeout  = parseInt(process.env.CB_RECOVERY_TIMEOUT)  || 15000;
  }

  async call(asyncFn) {
    if (this.state === STATES.OPEN) {
      const elapsed = Date.now() - this.lastFailureTime;

      if (elapsed >= this.recoveryTimeout) {
        console.log(`[CB] Timeout passed → HALF_OPEN`);
        this.state = STATES.HALF_OPEN;
      } else {
        const remaining = Math.ceil((this.recoveryTimeout - elapsed) / 1000);
        throw new Error(`Circuit OPEN. Retry in ${remaining}s`);
      }
    }

    try {
      const result = await asyncFn();
      this._onSuccess();
      return result;
    } catch (err) {
      this._onFailure(err);
      throw err;
    }
  }

  _onSuccess() {
    this.failureCount = 0;
    if (this.state === STATES.HALF_OPEN) {
      console.log(`[CB:${this.name}]  Replica wapas aaya → CLOSED`);
    }
    this.state = STATES.CLOSED;
  }

  _onFailure(err) {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    console.log(`[CB:${this.name}] Failure ${this.failureCount}/${this.failureThreshold}`);

    if (this.failureCount >= this.failureThreshold || this.state === STATES.HALF_OPEN) {
      this.state = STATES.OPEN;
      console.log(`[CB:${this.name}]  Circuit OPEN — ${this.recoveryTimeout / 1000}s ke liye block`);
    }
  }

  getStatus() {
    return {
      name:         this.name,
      state:        this.state,
      failureCount: this.failureCount,
      recoveryIn:   this.state === STATES.OPEN
        ? Math.max(0, Math.ceil((this.recoveryTimeout - (Date.now() - this.lastFailureTime)) / 1000)) + 's'
        : null,
    };
  }
}

const replicaCircuitBreaker = new CircuitBreaker('replica-db');

module.exports = { replicaCircuitBreaker };


/**
 *  CIRCCUIT BREAKER FLOW  => 
 * 1: REPLICA FAIL 1ST TIME -> FAILURE COUNT = 1
 * REPLICA FAIL 2ND TIEM -> FAILUER COUNT = 2
 * IF AGAIN FAILED 3RD TIME THEN CIRCUIT OPEN MEANS BLOCK 
 * 
 * 2: AFTER 15 SEC HALF OPEN AND IF THE REQUEST PASSED THEN CLOSE  
 * 
 * IF FAIL AGAIN OPEN CIRCUIT 
 * 
 * 
 */

