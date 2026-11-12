// src/controllers/productController.js
const prisma = require('../config/prisma');

// 1. Get All Products (Mengambil semua menu untuk Kasir & Landing Page)
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({
      success: true,
      message: 'Berhasil mengambil daftar produk',
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get Product By ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Create Product (Fitur Owner Kelola Menu)
const createProduct = async (req, res) => {
  try {
    const { name, price, cogs, stock, category } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        cogs: parseFloat(cogs),
        stock: parseInt(stock) || 0,
        category
      }
    });

    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan',
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Update Stock (Fitur Kasir/Owner Tambah/Ubah Stok)
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, type, note } = req.body; // type: 'IN' / 'OUT'

    const currentProduct = await prisma.product.findUnique({ where: { id } });
    if (!currentProduct) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    // Kalkulasi stok baru
    const qtyChange = parseInt(stock);
    const newStock = type === 'IN' 
      ? currentProduct.stock + qtyChange 
      : currentProduct.stock - qtyChange;

    // Gunakan Transaction Prisma untuk update stok + buat audit log bersamaan
    const updated = await prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id },
        data: { stock: newStock }
      });

      await tx.stockLog.create({
        data: {
          productId: id,
          type: type || 'IN',
          qty: qtyChange,
          note: note || 'Update stok manual'
        }
      });

      return updatedProduct;
    });

    res.json({
      success: true,
      message: 'Stok berhasil diperbarui',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateStock
};