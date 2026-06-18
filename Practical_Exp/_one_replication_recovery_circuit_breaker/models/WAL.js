const mongoose = require('mongoose');
const { primaryConn } = require('../config/db');


// WAL => write Ahed log , every write log here so in case replica crash we can recover 
const walSchema = new mongoose.Schema({
  operation:        { type: String, enum: ['INSERT', 'UPDATE', 'DELETE'], required: true },
  documentId:       { type: mongoose.Schema.Types.ObjectId },
  data:             { type: Object },
  appliedToReplica: { type: Boolean, default: false },
  timestamp:        { type: Date, default: Date.now },
});

// wal only stored in the primary DB
const WAL = primaryConn.model('WAL', walSchema);

module.exports = WAL;
