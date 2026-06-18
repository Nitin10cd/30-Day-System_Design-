const mongoose = require('mongoose');
require('dotenv').config();

// connection 
const primaryConn = mongoose.createConnection(process.env.MONGO_PRIMARY);
const replicaConn = mongoose.createConnection(process.env.MONGO_REPLICA);

primaryConn.on('connected', () => console.log('Primary DB connected'));
replicaConn.on('connected', () => console.log('Replica DB connected'));

primaryConn.on('error', (err) => console.log('Primary error:', err.message));
replicaConn.on('error', (err) => console.log('Replica error:', err.message));

module.exports = { primaryConn, replicaConn };