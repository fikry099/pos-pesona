// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Memulai proses seeding data awal...');

  // 1. Bersihkan Data Lama
  await prisma.transactionDetail.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.stockLog.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Data User (Owner & Kasir)
  const owner = await prisma.user.create({
    data: {
      name: 'Owner Pesona',
      username: 'owner',
      password: 'password123',
      role: 'OWNER',
    },
  });

  const kasir = await prisma.user.create({
    data: {
      name: 'Kasir Utama',
      username: 'kasir',
      password: 'password123',
      role: 'KASIR',
    },
  });

  console.log('✅ User berhasil dibuat:', { owner: owner.username, kasir: kasir.username });

  // 3. Seed Menu Utama & Sub Menu (Minuman/Pendamping) Ayam Geprek Pesona
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Nasi Ayam + Es Teh',
        price: 15000,
        cogs: 11000, // HPP / Modal
        stock: 50,
        category: 'Paket Lengkap',
      },
      {
        name: 'Ayam',
        price: 10000,
        cogs: 8500,
        stock: 40,
        category: 'A-la-carte',
      },
      {
        name: 'Nasi Campur',
        price: 15000,
        cogs: 9000,
        stock: 30,
        category: 'Paket Campur',
      },
      {
        name: 'Es Teh Manis',
        price: 3000,
        cogs: 1000,
        stock: 100,
        category: 'Minuman',
      },
      {
        name: 'Nasi Putih',
        price: 5000,
        cogs: 2500,
        stock: 60,
        category: 'Pendamping',
      },
    ],
  });

  console.log(`✅ ${products.count} Produk (Menu Utama & Sub Menu) berhasil dibuat!`);
}

main()
  .catch((e) => {
    console.error('❌ Gagal melakukan seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });