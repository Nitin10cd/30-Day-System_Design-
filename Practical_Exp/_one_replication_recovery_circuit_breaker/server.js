require('dotenv').config();
const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(express.json());
app.use('/api', productRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Replication Demo Server Running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});