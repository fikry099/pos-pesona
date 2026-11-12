// src/controllers/transactionController.js
const prisma = require('../config/prisma');

// Helper: Generator Nomor Invoice Unik (Contoh: INV-20260926-8392)
const generateInvoiceNo = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `INV-${dateStr}-${randomNum}`;
};

// 1. CREATE TRANSACTION (Checkout Kasir POS & Pre-Order Landing Page)
const createTransaction = async (req, res) => {
  try {
    const {
      orderType,       // 'DINE_IN' atau 'TAKE_AWAY'
      orderSource,     // 'POS' atau 'LANDING_PAGE'
      shippingType,    // 'DELIVERY' atau 'PICKUP' (DITAMBAHKAN)
      shippingAddress, // Alamat Lengkap Pengiriman (DITAMBAHKAN)
      paymentMethod,   // 'CASH' atau 'QRIS'
      items,           // Array of items: [{ productId, variantPiece, qty }]
      customerName,    // Khusus Pre-Order Landing Page
      customerPhone,   // Khusus Pre-Order Landing Page
      pickupTime,      // Khusus Pre-Order Landing Page
      cashierId        // ID User Kasir yang melayani
    } = req.body;

    // Validasi sederhana
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Keranjang belanja tidak boleh kosong' });
    }

    let totalAmount = 0;
    let totalCogs = 0;
    const transactionDetailsData = [];

    // Gunakan Prisma $transaction agar seluruh alur checkout bersifat Atomik
    const newTransaction = await prisma.$transaction(async (tx) => {
      
      // Loop setiap item yang dibeli untuk hitung total & cek ketersediaan stok
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });

        if (!product) {
          throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan`);
        }

        if (product.stock < item.qty) {
          throw new Error(`Stok menu "${product.name}" tidak mencukupi (Sisa stok: ${product.stock})`);
        }

        const subtotal = product.price * item.qty;
        const subtotalCogs = product.cogs * item.qty;

        totalAmount += subtotal;
        totalCogs += subtotalCogs;

        // Siapkan data detail transaksi
        transactionDetailsData.push({
          productId: item.productId,
          variantPiece: item.variantPiece || 'Standar',
          qty: item.qty,
          price: product.price,
          subtotal: subtotal
        });

        // Potong stok produk secara otomatis
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.qty }
        });

        // Catat di StockLog sebagai bukti audit stok keluar
        await tx.stockLog.create({
          data: {
            productId: item.productId,
            type: 'OUT',
            qty: item.qty,
            note: `Penjualan Nota ${orderSource}`
          }
        });
      }

      // Tentukan status awal berdasarkan Sumber Pesanan
      const isPOS = orderSource === 'POS';
      const initialStatus = isPOS ? 'COMPLETED' : 'PENDING';
      const paymentStatus = isPOS ? 'PAID' : 'PENDING';

      // Simpan Transaksi Header + Details (Nested Write)
      const transaction = await tx.transaction.create({
        data: {
          invoiceNo: generateInvoiceNo(),
          orderType: orderType || 'DINE_IN',
          orderSource: orderSource || 'POS',
          shippingType: shippingType || (orderType === 'TAKE_AWAY' ? 'DELIVERY' : 'PICKUP'), // <-- DIPERBARUI
          shippingAddress: shippingType === 'DELIVERY' ? shippingAddress : 'Diambil di Toko', // <-- DIPERBARUI
          totalAmount: totalAmount,
          totalCogs: totalCogs,
          paymentMethod: paymentMethod || 'CASH',
          paymentStatus: paymentStatus,
          status: initialStatus,
          customerName: customerName || null,
          customerPhone: customerPhone || null,
          pickupTime: pickupTime ? new Date(pickupTime) : null,
          cashierId: cashierId || null,
          // NESTED WRITE: Membuat anak relasi TransactionDetail sekaligus
          details: {
            create: transactionDetailsData
          }
        },
        include: {
          details: {
            include: { product: true }
          }
        }
      });

      return transaction;
    });

    res.status(201).json({
      success: true,
      message: 'Transaksi berhasil diproses!',
      data: newTransaction
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 2. GET ALL TRANSACTIONS (Riwayat Transaksi Kasir & Owner)
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        details: {
          include: { product: true }
        },
        cashier: {
          select: { id: true, name: true, username: true }
        }
      }
    });

    res.json({
      success: true,
      message: 'Berhasil mengambil riwayat transaksi',
      data: transactions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. UPDATE TRANSACTION STATUS (Kasir Terima/Selesaikan Pre-Order)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body; // status: 'APPROVED', 'PROCESSING', 'COMPLETED', 'CANCELLED'

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus })
      }
    });

    res.json({
      success: true,
      message: 'Status pesanan berhasil diperbarui',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. APPROVE PRE-ORDER
const approveOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        status: 'APPROVED',
        paymentStatus: 'PAID'
      }
    });

    res.json({
      success: true,
      message: 'Pesanan berhasil disetujui!',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  updateOrderStatus,
  approveOrder
};
