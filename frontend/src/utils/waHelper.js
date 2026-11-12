// src/utils/waHelper.js

export const generateWAOrderLink = ({
  ownerPhoneNumber = '6281222774404',
  invoiceNo,
  customerName,
  customerPhone,
  shippingType,
  shippingAddress,
  pickupTime,
  items,
  totalAmount,
}) => {
  const isDelivery = shippingType === 'DELIVERY';

  // Format daftar item pesanan
  const itemListText = items
    .map((item, index) => {
      const isChicken =
        item.name.toLowerCase().includes('ayam') ||
        item.name.toLowerCase().includes('campur') ||
        item.name.toLowerCase().includes('geprek');

      const variantText =
        isChicken && item.variantPiece && item.variantPiece !== 'Standard'
          ? ` (${item.variantPiece})`
          : '';

      return `${index + 1}. *${item.name}*${variantText} x${item.qty} = Rp ${(
        item.price * item.qty
      ).toLocaleString('id-ID')}`;
    })
    .join('\n');

  // Format tanggal & waktu lokal
  const formattedTime = pickupTime
    ? new Date(pickupTime).toLocaleString('id-ID', {
        dateStyle: 'full',
        timeStyle: 'short',
      })
    : '-';

  // Teks Pesanan
  const line1 = `Halo *Ayam Geprek Pesona*, saya mau konfirmasi Pre-Order via Website:`;
  const line2 = `📄 *NO. NOTA:* ${invoiceNo}`;
  const line3 = `👤 *NAMA:* ${customerName}`;
  const line4 = `📱 *NO. WA:* ${customerPhone}`;
  const line5 = `📦 *METODE:* ${isDelivery ? 'DIANTARKAN (DELIVERY)' : 'AMBIL SENDIRI (PICKUP)'}`;
  const line6 = isDelivery
    ? `📍 *ALAMAT PENGIRIMAN:* ${shippingAddress || '-'}\n🕜 *JAM PENGANTARAN:* ${formattedTime}`
    : `🕜 *JAM PENGAMBILAN:* ${formattedTime}`;
  const line7 = `🛒 *DETAIL PESANAN:*\n${itemListText}`;
  const line8 = `💰 *TOTAL BAYAR:* Rp ${totalAmount.toLocaleString('id-ID')}`;
  const line9 = `Mohon segera diperiksa dan dikonfirmasi pesanan saya. Terima kasih!`;

  // Gabungkan seluruh baris
  const fullText = `${line1}\n\n${line2}\n${line3}\n${line4}\n${line5}\n${line6}\n\n${line7}\n\n${line8}\n\n${line9}`;

  // Menggunakan API Resmi WhatsApp (api.whatsapp.com/send) untuk menjaga kecocokan emoji di Desktop
  const cleanPhone = ownerPhoneNumber.replace(/[^0-9]/g, '');
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(fullText)}`;
};