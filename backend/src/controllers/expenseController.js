// src/controllers/expenseController.js
const prisma = require('../config/prisma');

// 1. TAMBAH PENGELUARAN BARU
const createExpense = async (req, res) => {
  try {
    const { title, category, amount, note } = req.body;

    const newExpense = await prisma.expense.create({
      data: {
        title,
        category: category || 'OPERATIONAL', // OPERATIONAL, BUMBU_TAMBAHAN, GAJI, LAINNYA
        amount: parseFloat(amount),
        note
      }
    });

    res.status(201).json({
      success: true,
      message: 'Pengeluaran berhasil dicatat',
      data: newExpense
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. AMBIL SEMUA LIST PENGELUARAN
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: 'desc' }
    });

    res.json({
      success: true,
      message: 'Berhasil mengambil data pengeluaran',
      data: expenses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GET DASHBOARD SUMMARY (Kalkulasi Laba Rugi Otomatis Owner)
const getFinancialSummary = async (req, res) => {
  try {
    // Hitung Total Omzet & Total HPP Modal dari Transaksi Berstatus COMPLETED/PAID
    const transactions = await prisma.transaction.aggregate({
      _sum: {
        totalAmount: true,
        totalCogs: true
      },
      where: {
        paymentStatus: 'PAID'
      }
    });

    // Hitung Total Pengeluaran (Expense)
    const expenses = await prisma.expense.aggregate({
      _sum: {
        amount: true
      }
    });

    const totalRevenue = transactions._sum.totalAmount || 0; // Total Omzet
    const totalCogs = transactions._sum.totalCogs || 0;       // Total Modal/HPP
    const totalExpense = expenses._sum.amount || 0;           // Total Pengeluaran Operasional
    
    // Kalkulasi
    const grossProfit = totalRevenue - totalCogs;             // Laba Kotor
    const netProfit = grossProfit - totalExpense;            // Laba Bersih

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalCogs,
        grossProfit,
        totalExpense,
        netProfit
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createExpense,
  getAllExpenses,
  getFinancialSummary
};