const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'pesona_secret_key_123';

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi!' });
    }

    // Cari user berdasarkan username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Username tidak ditemukan!' });
    }

    // Cek password (bisa plaintext awal atau bcrypt)
    let isPasswordValid = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      isPasswordValid = user.password === password; // fallback pencocokan biasa
    }

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Password salah!' });
    }

    // Generate Token JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      message: 'Login berhasil!',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { login };