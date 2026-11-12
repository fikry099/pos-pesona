import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { X, ShoppingBag, Truck, Store, User, Phone, MapPin, Clock, ArrowRight, Utensils } from 'lucide-react';
import { generateWAOrderLink } from '../../utils/waHelper';

export default function CartDrawer({ isOpen, onClose, cart, updateQty, updateVariant, clearCart }) {
  const [shippingType, setShippingType] = useState('DELIVERY');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleSubmitCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Keranjang Kosong',
        text: 'Pilih minimal 1 menu pesanan terlebih dahulu!',
        confirmColor: '#DC2626'
      });
      return;
    }

    if (shippingType === 'DELIVERY' && !shippingAddress) {
      Swal.fire({
        icon: 'warning',
        title: 'Alamat Belum Diisi',
        text: 'Mohon isi alamat lengkap pengiriman pesanan Anda!',
        confirmColor: '#DC2626'
      });
      return;
    }

    if (!pickupTime) {
      Swal.fire({
        icon: 'warning',
        title: 'Waktu Belum Ditentukan',
        text: shippingType === 'DELIVERY' 
          ? 'Mohon tentukan rencana jam pengantaran pesanan!' 
          : 'Mohon tentukan rencana jam pengambilan pesanan!',
        confirmColor: '#DC2626'
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // PAYLOAD DIPERBARUI AGAR SINKRON DENGAN PRISMA SCHEMA & CONTROLLER
      const payload = {
        orderType: shippingType === 'DELIVERY' ? 'TAKE_AWAY' : 'DINE_IN',
        orderSource: 'LANDING_PAGE',
        shippingType: shippingType, // 'DELIVERY' atau 'PICKUP'
        paymentMethod: 'QRIS',
        customerName,
        customerPhone,
        shippingAddress: shippingType === 'DELIVERY' ? shippingAddress : 'Diambil di Toko',
        pickupTime: new Date(pickupTime).toISOString(),
        items: cart.map((item) => ({
          productId: item.productId,
          variantPiece: item.variantPiece || 'Dada',
          qty: item.qty,
        })),
      };

      const res = await axios.post('http://localhost:5000/api/transactions/checkout', payload);

      if (res.data.success) {
        const transactionData = res.data.data;

        const waUrl = generateWAOrderLink({
          invoiceNo: transactionData.invoiceNo,
          customerName,
          customerPhone,
          shippingType,
          shippingAddress: shippingType === 'DELIVERY' ? shippingAddress : 'Diambil di Toko',
          pickupTime,
          items: cart,
          totalAmount,
        });

        Swal.fire({
          icon: 'success',
          title: 'Pesanan Berhasil Dibuat!',
          text: `No. Nota: ${transactionData.invoiceNo}. Anda akan diarahkan ke WhatsApp untuk konfirmasi pesanan.`,
          confirmButtonText: 'Lanjutkan ke WhatsApp 📲',
          confirmButtonColor: '#16A34A',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            window.open(waUrl, '_blank');
          }
        });

        clearCart();
        setCustomerName('');
        setCustomerPhone('');
        setShippingAddress('');
        setPickupTime('');
        onClose();
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memproses Pesanan',
        text: err.response?.data?.message || 'Terjadi kesalahan pada server. Coba lagi nanti.',
        confirmColor: '#DC2626'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-4xl h-[580px] sm:h-[620px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-up border border-gray-100">
        
        {/* SISI KIRI */}
        <div className="hidden md:flex md:w-2/5 relative overflow-hidden bg-gray-900 h-full">
          <img
            src="/tumpukan-ayam.png"
            alt="Tumpukan Ayam Geprek"
            className="absolute inset-0 w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />
          <div className="relative z-10 p-6 flex flex-col justify-between h-full text-white w-full">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-10 h-10 object-contain bg-white rounded-xl p-1 shadow-md"
                />
                <span className="font-black text-lg tracking-tight text-white">
                  Ayam Geprek <span className="text-amber-400">Pesona</span>
                </span>
              </div>
              <p className="text-[11px] text-gray-200 leading-relaxed font-medium">
                Daging ayam pilihan dipadukan bumbu rempah khas & sambal ulek segar.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-[11px] space-y-1">
              <p className="font-extrabold text-amber-300 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5" /> Jaminan Segar & Halal
              </p>
              <p className="text-gray-200 text-[10px] leading-tight">
                Setiap porsi digoreng krispi dan diulek dadakan sesuai nomor pesananmu.
              </p>
            </div>
          </div>
        </div>

        {/* SISI KANAN */}
        <div className="flex-1 flex flex-col justify-between h-full overflow-hidden bg-white">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center bg-white text-gray-900 shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-red-600" />
              <h2 className="font-extrabold text-base tracking-wide text-gray-900">Konfirmasi Pre-Order</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                Item Pesanan & Pilihan Potongan
              </p>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400 border border-dashed rounded-2xl">
                  Belum ada menu yang dipilih
                </div>
              ) : (
                <div className={`space-y-2.5 overflow-y-auto pr-1 transition-all duration-300 ${
                  shippingType === 'DELIVERY' ? 'max-h-[125px]' : 'max-h-[180px]'
                }`}>
                  {cart.map((item) => (
                    <div key={item.productId} className="bg-orange-50/40 p-2.5 rounded-2xl border border-orange-100/80 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <div className="flex-1 pr-2">
                          <p className="font-extrabold text-gray-800 text-xs">{item.name}</p>
                          <p className="text-[11px] text-red-600 font-bold mt-0.5">
                            Rp {item.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-2 py-0.5 rounded-xl border border-gray-200">
                          <button type="button" onClick={() => updateQty(item.productId, -1)} className="font-bold text-gray-500 hover:text-red-600">-</button>
                          <span className="font-extrabold text-xs w-4 text-center">{item.qty}</span>
                          <button type="button" onClick={() => updateQty(item.productId, 1)} className="font-bold text-gray-500 hover:text-red-600">+</button>
                        </div>
                      </div>

                      {(item.name.toLowerCase().includes('ayam') || item.name.toLowerCase().includes('campur') || item.name.toLowerCase().includes('geprek')) && (
                        <div className="pt-1.5 border-t border-orange-100/80 flex items-center justify-between text-[11px]">
                          <span className="text-gray-500 font-semibold">Bagian Ayam:</span>
                          <select
                            value={item.variantPiece || 'Dada'}
                            onChange={(e) => updateVariant && updateVariant(item.productId, e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg text-xs px-2 py-0.5 font-bold text-gray-700 focus:outline-none focus:border-red-500"
                          >
                            <option value="Dada">Dada (Banyak Daging)</option>
                            <option value="Paha Atas">Paha Atas (Juicy)</option>
                            <option value="Paha Bawah">Paha Bawah (Geprek Crispy)</option>
                            <option value="Sayap">Sayap (Gurih Renyah)</option>
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <form id="checkout-form" onSubmit={handleSubmitCheckout} className="space-y-3 pt-2.5 border-t border-gray-100">
                <p className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">Metode Pengiriman & Data Pemesan</p>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShippingType('DELIVERY')}
                    className={`p-2 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      shippingType === 'DELIVERY'
                        ? 'bg-red-50 border-red-600 text-red-600 shadow-2xs font-black'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    Diantarkan Kurir
                  </button>
                  <button
                    type="button"
                    onClick={() => setShippingType('PICKUP')}
                    className={`p-2 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      shippingType === 'PICKUP'
                        ? 'bg-red-50 border-red-600 text-red-600 shadow-2xs font-black'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    Ambil di Toko
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gray-400" /> Nama Pemesan
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap Anda"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 bg-gray-50/50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-gray-400" /> No. WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 bg-gray-50/50"
                    />
                  </div>
                </div>

                {shippingType === 'DELIVERY' && (
                  <div className="animate-fade-in">
                    <label className="text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" /> Alamat Lengkap Pengiriman
                    </label>
                    <textarea
                      required
                      placeholder="Jalan, No. Rumah, RT/RW, Patokan Lokasi..."
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full text-xs p-2 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 bg-gray-50/50 h-14 resize-none"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" /> 
                    {shippingType === 'DELIVERY' ? 'Rencana Jam Pengantaran' : 'Rencana Jam Pengambilan'}
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full text-xs p-2 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 bg-gray-50/50 text-gray-700 font-medium"
                  />
                </div>

              </form>
            )}

          </div>

          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
              <div>
                <span className="text-[10px] text-gray-400 block font-semibold">Total Pembayaran</span>
                <span className="text-lg font-black text-red-600">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-extrabold text-xs shadow-md shadow-red-600/20 flex items-center justify-center gap-2 transition hover:scale-[1.02]"
              >
                <span>{isSubmitting ? 'Memproses...' : 'Kirim Pesanan Ke WhatsApp'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}