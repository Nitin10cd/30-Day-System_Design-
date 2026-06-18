const mongoose = require('mongoose');
const { primaryConn, replicaConn } = require('../config/db');


// schema 
const productSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  stock:    { type: Number, default: 0 },
  category: { type: String, default: 'general' },
}, { timestamps: true });


// TWO Diff Diff Connections for the diff replicas registration
const ProductPrimary = primaryConn.model('Product', productSchema);
const ProductReplica = replicaConn.model('Product', productSchema);

module.exports = { ProductPrimary, ProductReplica };

