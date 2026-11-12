// src/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

// Middlewares
app.use(cors());
app.use(express.json());

// Main Routes Prefix
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API POS Ayam Geprek Pesona Berhasil Jalan!',
    status: 'Server Aktif'
  });
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🟢 Server POS running on http://localhost:${PORT}`);
  console.log(`=================================`);
});