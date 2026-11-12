// src/routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const {
  createExpense,
  getAllExpenses,
  getFinancialSummary
} = require('../controllers/expenseController');

router.post('/', createExpense);
router.get('/', getAllExpenses);
router.get('/summary', getFinancialSummary);

module.exports = router;