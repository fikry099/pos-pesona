// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateStock
} = require('../controllers/productController');

// Endpoint URL
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.patch('/:id/stock', updateStock);

module.exports = router;