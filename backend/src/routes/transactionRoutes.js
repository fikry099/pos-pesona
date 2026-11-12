// backend/src/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getAllTransactions,
  updateOrderStatus,
  approveOrder,
} = require('../controllers/transactionController');

// 1. Endpoint Checkout Transaksi (POS & Pre-Order Landing Page)
router.post('/checkout', createTransaction);

// 2. Endpoint Ambil Seluruh Riwayat Transaksi
router.get('/', getAllTransactions);

// 3. Endpoint Update Status Transaksi Generik (Bisa ubah status/paymentStatus via req.body)
router.patch('/:id/status', updateOrderStatus);

// 4. Endpoint Khusus Approve Pre-Order Masuk (Mengubah status menjadi APPROVED & paymentStatus PAID)
router.patch('/:id/approve', approveOrder);

module.exports = router;