import { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, CheckCircle2 } from 'lucide-react';

export default function VariantModal({ isOpen, onClose, product, onAddToCart }) {
  const [selectedVariant, setSelectedVariant] = useState('Dada');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setQty(1);
      setSelectedVariant('Dada');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  // Cek apakah produk memerlukan opsi bagian ayam
  const lowerName = product.name ? product.name.toLowerCase() : '';
  const isChickenProduct =
    lowerName.includes('ayam') ||
    lowerName.includes('campur') ||
    lowerName.includes('geprek');

  // Helper Pemilihan Gambar Dinamis Berdasarkan Varian Potongan Ayam / Produk
  const getDynamicProductImage = () => {
    if (isChickenProduct) {
      switch (selectedVariant) {
        case 'Dada':
          return '/dada.png';
        case 'Paha Atas':
          return '/paha-atas.png';
        case 'Paha Bawah':
          return '/paha-bawah.png';
        case 'Sayap':
          return '/sayap.png';
        default:
          return '/dada.png';
      }
    }

    // Jika BUKAN produk olahan ayam (misal Es Teh atau Nasi)
    if (lowerName.includes('es teh') || lowerName.includes('teh') || lowerName.includes('minuman')) {
      return '/es-teh.png';
    }
    if (lowerName.includes('nasi') && !lowerName.includes('ayam')) {
      return '/nasi.png';
    }
    if (lowerName.includes('campur')) {
      return '/paket-campur.png';
    }

    return '/paket-lengkap.png';
  };

  // Helper Keterangan Rincian Isi Porsi
  const getMenuDescription = () => {
    if (lowerName.includes('campur')) {
      return 'Nasi + Ayam + Sayur + Mie';
    }
    if (lowerName.includes('es teh') || lowerName.includes('paket') || (lowerName.includes('nasi') && lowerName.includes('ayam'))) {
      return 'Nasi + Ayam + Sambal + Es Teh';
    }
    return product.name;
  };

  const handleConfirm = () => {
    onAddToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      variantPiece: isChickenProduct ? selectedVariant : 'Standard',
      qty: qty,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      {/* Ukuran Modal Diperlebar ke max-w-2xl */}
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-scale-up relative">
        
        {/* Tombol Close Pojok Atas */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white text-gray-500 hover:text-gray-800 rounded-full shadow-md backdrop-blur-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Layout Grid 2 Kolom Seimbang (6:6) */}
        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch min-h-[380px]">
          
          {/* Kolom Kiri: Display Gambar Penuh Berukuran Proporsional */}
          <div className="md:col-span-6 bg-gradient-to-br from-orange-50/80 via-amber-50/50 to-orange-100/30 p-4 sm:p-5 flex flex-col justify-between items-center relative overflow-hidden border-b md:border-b-0 md:border-r border-gray-100">
            
            {/* Badge Kategori */}
            <span className="self-start bg-white/90 backdrop-blur-md text-red-600 font-extrabold text-[10px] uppercase px-3 py-1 rounded-lg shadow-2xs border border-red-100/80 z-10">
              {product.category || 'Spesial'}
            </span>

            {/* Gambar Utama Diperbesar Mengisi Ruang Panel */}
            <div className="w-full my-2 flex-1 flex items-center justify-center relative min-h-[220px]">
              <img
                key={selectedVariant}
                src={getDynamicProductImage()}
                alt={selectedVariant}
                className="w-full h-full max-h-[260px] object-cover rounded-2xl shadow-lg border-2 border-white transition-all duration-300 transform hover:scale-105 animate-fade-in"
              />
            </div>

            {/* Badge Status Potongan Terpilih */}
            {isChickenProduct && (
              <p className="text-xs font-black text-amber-900 bg-amber-200/80 backdrop-blur-xs px-3.5 py-1 rounded-full border border-amber-300/50 shadow-2xs">
                Potongan Terpilih: <span className="text-red-700">{selectedVariant}</span>
              </p>
            )}
          </div>

          {/* Kolom Kanan: Detail & Form Pemilihan Varian */}
          <div className="md:col-span-6 p-6 flex flex-col justify-between space-y-4 bg-white">
            <div>
              <h3 className="text-xl font-black text-gray-900 leading-tight pr-6">{product.name}</h3>
              <p className="text-2xl font-black text-red-600 mt-1">
                Rp {product.price.toLocaleString('id-ID')}
              </p>
              
              {/* Keterangan Rincian Isi Porsi */}
              <div className="mt-3 bg-orange-50/80 border border-orange-100 px-3.5 py-2.5 rounded-2xl">
                <span className="text-[10px] uppercase font-extrabold text-orange-800 tracking-wider block">
                  Isi Porsi:
                </span>
                <p className="text-xs font-bold text-gray-700 mt-0.5">
                  {getMenuDescription()}
                </p>
              </div>
            </div>

            {/* Opsi Bagian Ayam */}
            {isChickenProduct && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">Pilih Bagian Ayam:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Dada', label: 'Dada (Daging)' },
                    { id: 'Paha Atas', label: 'Paha Atas' },
                    { id: 'Paha Bawah', label: 'Paha Bawah' },
                    { id: 'Sayap', label: 'Sayap (Renyah)' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between ${
                        selectedVariant === v.id
                          ? 'bg-red-50 border-red-600 text-red-600 shadow-2xs font-black'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="truncate">{v.label}</span>
                      {selectedVariant === v.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pemilih Jumlah Porsi */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-700">Jumlah Porsi:</span>
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-3 py-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  className="font-bold text-gray-500 hover:text-red-600 text-xs p-0.5"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-black text-sm w-4 text-center">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((prev) => prev + 1)}
                  className="font-bold text-gray-500 hover:text-red-600 text-xs p-0.5"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tombol Konfirmasi */}
            <button
              onClick={handleConfirm}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white rounded-2xl font-extrabold text-xs shadow-md shadow-red-600/20 flex items-center justify-center gap-2 transition hover:scale-[1.02]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Tambah ke Keranjang • Rp {(product.price * qty).toLocaleString('id-ID')}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}