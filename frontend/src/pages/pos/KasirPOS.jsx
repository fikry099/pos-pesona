import axios from 'axios';
import {
  Minus,
  Plus,
  Receipt,
  RefreshCw,
  ShoppingCart,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import AdminLayout from '../../components/common/AdminLayout';

export default function KasirPOS() {
  const [products, setProducts] = useState([]);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [orderType, setOrderType] = useState('DINE_IN');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Modal Pilih Potongan Ayam di Kasir
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState('Dada');
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  // Fetch Data Produk & Jumlah Pending Orders untuk Badge Sidebar
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resProducts, resTransactions] = await Promise.all([
        axios.get('http://localhost:5000/api/products'),
        axios.get('http://localhost:5000/api/transactions'),
      ]);

      if (resProducts.data.success) setProducts(resProducts.data.data);
      if (resTransactions.data.success) {
        const pending = resTransactions.data.data.filter(
          (t) => t.orderSource === 'LANDING_PAGE' && t.status === 'PENDING'
        );
        setPendingOrdersCount(pending.length);
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Koneksi Server',
        text: 'Pastikan Back-End Express di Port 5000 aktif!',
        confirmColor: '#DC2626'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 1. Klik Tombol "+ Tambah Ke Nota" di Produk
  const handleOpenVariantModal = (product) => {
    if (product.stock <= 0) {
      Swal.fire({ icon: 'warning', title: 'Stok Habis!', confirmColor: '#DC2626' });
      return;
    }

    // Cek apakah produk membutuhkan pilihan bagian potongan ayam
    const lowerName = product.name ? product.name.toLowerCase() : '';
    const isChickenProduct =
      lowerName.includes('ayam') ||
      lowerName.includes('campur') ||
      lowerName.includes('geprek');

    // Jika BUKAN produk ayam (misal: Es Teh Manis atau Nasi Putih), langsung masuk ke Nota Kasir
    if (!isChickenProduct) {
      setCart((prevCart) => {
        const existingIndex = prevCart.findIndex(
          (item) => item.productId === product.id && item.variantPiece === 'Standard'
        );

        if (existingIndex > -1) {
          const updated = [...prevCart];
          if (updated[existingIndex].qty + 1 > product.stock) {
            Swal.fire({ icon: 'warning', title: 'Jumlah Melebihi Stok!', confirmColor: '#DC2626' });
            return prevCart;
          }
          updated[existingIndex].qty += 1;
          return updated;
        } else {
          return [
            ...prevCart,
            {
              productId: product.id,
              name: product.name,
              price: product.price,
              variantPiece: 'Standard',
              qty: 1,
              maxStock: product.stock,
            },
          ];
        }
      });
      return;
    }

    // Jika produk merupakan Olahan Ayam, buka modal pilihan potongan
    setSelectedProduct(product);
    setSelectedVariant('Dada');
    setIsVariantModalOpen(true);
  };

  // 2. Konfirmasi Varian Ayam ke Nota Kasir
  const handleConfirmAddToCart = () => {
    if (!selectedProduct) return;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === selectedProduct.id && item.variantPiece === selectedVariant
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        if (updated[existingIndex].qty + 1 > selectedProduct.stock) {
          Swal.fire({ icon: 'warning', title: 'Jumlah Melebihi Stok!', confirmColor: '#DC2626' });
          return prevCart;
        }
        updated[existingIndex].qty += 1;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            productId: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            variantPiece: selectedVariant,
            qty: 1,
            maxStock: selectedProduct.stock,
          },
        ];
      }
    });

    setIsVariantModalOpen(false);
    setSelectedProduct(null);
  };

  // Update Quantity di Nota
  const updateQty = (productId, variantPiece, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.productId === productId && item.variantPiece === variantPiece) {
            const newQty = item.qty + delta;
            if (newQty > item.maxStock) {
              Swal.fire({ icon: 'warning', title: 'Stok tidak mencukupi!', confirmColor: '#DC2626' });
              return item;
            }
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Proses Checkout Transaksi Kasir
  const handleCheckout = async () => {
    if (cart.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Keranjang Masih Kosong', confirmColor: '#DC2626' });
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        orderType,
        orderSource: 'POS',
        paymentMethod,
        items: cart.map((item) => ({
          productId: item.productId,
          variantPiece: item.variantPiece,
          qty: item.qty,
        })),
      };

      const res = await axios.post('http://localhost:5000/api/transactions/checkout', payload);

      if (res.data.success) {
        const invoiceNo = res.data.data.invoiceNo;
        setCart([]);
        fetchData();

        Swal.fire({
          icon: 'success',
          title: 'Transaksi Berhasil!',
          text: `No. Nota: ${invoiceNo}`,
          showCancelButton: true,
          confirmButtonText: 'Cetak Struk 🖨️',
          cancelButtonText: 'Tutup',
          confirmButtonColor: '#16A34A',
          cancelButtonColor: '#6B7280'
        }).then((result) => {
          if (result.isConfirmed) {
            alert(`Mencetak Struk Kasir untuk Invoice: ${invoiceNo}`);
          }
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Checkout Gagal',
        text: err.response?.data?.message || 'Gagal memproses transaksi.',
        confirmColor: '#DC2626'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout pendingCount={pendingOrdersCount}>
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Top Header POS Langsung */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-2xs border border-gray-100">
          <div>
            <h1 className="font-extrabold text-base text-gray-900">Kasir POS (Transaksi Langsung)</h1>
            <p className="text-xs text-gray-400 mt-0.5">Pilih menu makanan & buat nota belanja kasir secara instan</p>
          </div>

          <button
            onClick={fetchData}
            className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition flex items-center gap-1.5 text-xs font-bold"
            title="Refresh Data Menu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>

        {/* ================= KASIR LANGSUNG (POS) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Area Katalog Menu (8 Kolom di Tablet/Desktop) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {loading ? (
              <div className="text-center py-12 text-gray-400 text-xs">Memuat data menu...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-100 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md">
                        {product.category}
                      </span>
                      <h3 className="font-extrabold text-gray-900 text-xs mt-2 line-clamp-1">{product.name}</h3>
                      <p className="text-red-600 font-black text-sm mt-1">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Stok Sisa: {product.stock} porsi</p>
                    </div>

                    <button
                      onClick={() => handleOpenVariantModal(product)}
                      disabled={product.stock <= 0}
                      className={`mt-3 w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                        product.stock > 0
                          ? 'bg-red-600 text-white hover:bg-red-700 shadow-xs'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {product.stock > 0 ? 'Tambah Ke Nota' : 'Stok Habis'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Area Nota Kasir (4-5 Kolom di Tablet/Desktop - Sticky Side) */}
          <div className="lg:col-span-5 xl:col-span-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-xs sticky top-20">
            <div className="flex items-center gap-2 border-b pb-3 border-gray-100">
              <ShoppingCart className="w-4 h-4 text-red-600" />
              <h2 className="font-extrabold text-gray-800 text-sm">Nota Belanja Kasir</h2>
            </div>

            {/* Toggle Tipe Pesanan */}
            <div className="grid grid-cols-2 gap-2 my-3">
              <button
                onClick={() => setOrderType('DINE_IN')}
                className={`py-2 text-xs font-bold rounded-xl border transition ${
                  orderType === 'DINE_IN'
                    ? 'bg-red-50 border-red-600 text-red-600 shadow-2xs font-black'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                Makan Di Sini
              </button>
              <button
                onClick={() => setOrderType('TAKE_AWAY')}
                className={`py-2 text-xs font-bold rounded-xl border transition ${
                  orderType === 'TAKE_AWAY'
                    ? 'bg-red-50 border-red-600 text-red-600 shadow-2xs font-black'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                Bungkus / Dibawa
              </button>
            </div>

            {/* Item Keranjang */}
            <div className="overflow-y-auto max-h-[280px] space-y-2 pr-1 my-2">
              {cart.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-xs">Keranjang masih kosong</div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.productId}-${item.variantPiece}`} className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl text-xs">
                    <div className="flex-1 pr-2">
                      <p className="font-extrabold text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-gray-500 text-[10px]">
                        {item.variantPiece !== 'Standard' ? `${item.variantPiece} • ` : ''}Rp {item.price.toLocaleString('id-ID')} x {item.qty}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-gray-200">
                      <button
                        onClick={() => updateQty(item.productId, item.variantPiece, -1)}
                        className="p-0.5 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold w-4 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.productId, item.variantPiece, 1)}
                        className="p-0.5 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Ringkasan Bayar */}
            <div className="border-t border-gray-100 pt-3 mt-2 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-semibold">Metode Bayar:</span>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg text-xs p-1 font-bold text-gray-700 focus:outline-none"
                >
                  <option value="CASH">Tunai (Cash)</option>
                  <option value="QRIS">QRIS / Non-Tunai</option>
                </select>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-dashed">
                <span className="font-bold text-gray-700 text-xs">Total Bayar:</span>
                <span className="font-black text-base text-red-600">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || isSubmitting}
                className={`w-full py-2.5 rounded-xl font-extrabold text-xs text-white shadow-sm transition flex items-center justify-center gap-2 ${
                  cart.length > 0 && !isSubmitting
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>{isSubmitting ? 'Memproses...' : 'Proses Checkout'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Cepat Varian Potongan Ayam Kasir */}
        {isVariantModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white w-full max-w-xs rounded-2xl shadow-2xl p-5 space-y-4 animate-scale-up border border-gray-100">
              <div className="flex justify-between items-center border-b pb-2.5">
                <h3 className="font-extrabold text-sm text-gray-900">Pilih Potongan Ayam</h3>
                <button onClick={() => setIsVariantModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <p className="font-bold text-xs text-gray-800">{selectedProduct.name}</p>
                <p className="text-xs text-red-600 font-black mt-0.5">Rp {selectedProduct.price.toLocaleString('id-ID')}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-600 block">Bagian Ayam:</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Dada', 'Paha Atas', 'Paha Bawah', 'Sayap'].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`p-2 rounded-xl border text-xs font-bold transition ${
                        selectedVariant === v
                          ? 'bg-red-50 border-red-600 text-red-600'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleConfirmAddToCart}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-xs shadow-xs transition"
              >
                + Masukkan ke Nota
              </button>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}