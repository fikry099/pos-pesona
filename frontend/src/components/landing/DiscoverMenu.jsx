import { useState } from 'react';
import { Plus, Check, Search } from 'lucide-react';

export default function DiscoverMenu({ products = [], loading = false, onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Helper Pemilihan Gambar Produk Berdasarkan Nama / Kategori
  const getProductImage = (name) => {
    const lowerName = name ? name.toLowerCase() : '';
    
    // 1. Nasi Campur
    if (lowerName.includes('campur')) {
      return '/paket-campur.png';
    }
    // 2. Paket Nasi Ayam + Es Teh / Paket Lengkap
    if (lowerName.includes('paket') || (lowerName.includes('nasi') && lowerName.includes('ayam'))) {
      return '/paket-lengkap.png';
    }
    // 3. Sub Menu: Es Teh Manis
    if (lowerName.includes('es teh') || lowerName.includes('teh') || lowerName.includes('minuman')) {
      return '/es-teh.png';
    }
    // 4. Sub Menu: Nasi Putih / Nasi Saja
    if (lowerName.includes('nasi')) {
      return '/nasi.png';
    }
    // 5. Ayam Saja / A-la-carte
    if (lowerName.includes('ayam') || lowerName.includes('ala carte') || lowerName.includes('geprek')) {
      return '/ayam-saja.png';
    }
    
    return '/paket-lengkap.png';
  };

  // Ekstrak Kategori Unik
  const categories = ['ALL', ...new Set(products.map((p) => p.category).filter(Boolean))];

  // Filter Logic
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <section className="relative py-12 bg-orange-50/40 overflow-hidden">
      {/* CSS Animasi Bergerak Halus Background */}
      <style>{`
        @keyframes floatingPattern {
          0% {
            background-position: 0px 0px;
          }
          50% {
            background-position: 100px 100px;
          }
          100% {
            background-position: 0px 0px;
          }
        }
        .animate-floating-pattern {
          animation: floatingPattern 40s ease-in-out infinite;
        }
      `}</style>

      {/* Pattern Overlay Logo Kepala Ayam Bergerak Animasi */}
      <div 
        className="absolute inset-0 opacity-[0.045] pointer-events-none z-0 animate-floating-pattern transform -rotate-12 scale-125"
        style={{
          backgroundImage: `url('/logo-kepala-ayam.png')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '220px 220px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50/90 backdrop-blur-sm px-3.5 py-1 rounded-full border border-red-100/80 shadow-2xs">
            Our Delicious Menu
          </span>
          <h2 className="text-3xl font-black text-gray-900">Discover Menu Favorit</h2>
          <p className="text-xs text-gray-500">Pilih menu santapan lezat untuk dipesan hari ini</p>
        </div>

        {/* Layout Grid: Category Sidebar (Kiri) & Product Grid (Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left Category Sidebar & Search Filter */}
          <div className="space-y-4 bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-extrabold uppercase text-gray-400 px-3 mb-2">Kategori Menu</p>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex justify-between items-center transition duration-200 ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'text-gray-600 hover:bg-orange-50 hover:text-red-600'
                  }`}
                >
                  <span>{cat === 'ALL' ? 'Semua Menu' : cat}</span>
                  {selectedCategory === cat && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Right Product Grid Display */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-20 text-gray-400">Memuat katalog menu...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-100 text-gray-400 text-xs">
                Menu tidak ditemukan
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100/90 p-4 shadow-xs hover:shadow-xl transition duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Kontainer Gambar Zoom Penuh */}
                      <div className="h-48 rounded-xl overflow-hidden bg-orange-50 mb-4 relative">
                        <img
                          src={getProductImage(product.name)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                        <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md text-red-600 font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-lg shadow-sm z-10">
                          {product.category || 'Spesial'}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-gray-900 text-base group-hover:text-red-600 transition">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {product.category === 'Minuman'
                          ? 'Es teh manis segar pelepas dahaga.'
                          : product.category === 'Pendamping'
                          ? 'Nasi putih pulen hangat porsi pas.'
                          : 'Ayam geprek crispy dengan bumbu pilihan dan rasa pedas yang mantap.'}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Harga Porsi</span>
                        <span className="text-base font-black text-red-600">
                          Rp {product.price.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <button
                        onClick={() => onAddToCart(product)}
                        disabled={product.stock <= 0}
                        className={`p-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                          product.stock > 0
                            ? 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Pesan</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}