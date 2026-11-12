import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Utensils, Info, Home } from 'lucide-react';

export default function NavbarPublic({ cartCount = 0, onOpenCart }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo Menggunakan File Gambar */}
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="/logo.png" 
            alt="Ayam Geprek Pesona" 
            className="w-12 h-12 object-contain group-hover:scale-105 transition duration-300 drop-shadow-sm"
          />
          <div>
            <span className="font-black text-xl tracking-tight text-gray-900 block leading-none">
              Ayam Geprek <span className="text-red-600">Pesona</span>
            </span>
            <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-widest block mt-0.5">
              Cita Rasa Pedas Gurih
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-100/80 p-1.5 rounded-full border border-gray-200/50">
          <Link
            to="/"
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition duration-200 ${
              isActive('/')
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-gray-600 hover:text-red-600'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          <Link
            to="/menu"
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition duration-200 ${
              isActive('/menu')
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-gray-600 hover:text-red-600'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            Menu
          </Link>
          <Link
            to="/about"
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition duration-200 ${
              isActive('/about')
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-gray-600 hover:text-red-600'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            About
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCart}
            className="relative bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 p-3 rounded-2xl transition duration-200 flex items-center justify-center"
            title="Lihat Keranjang"
          >
            <ShoppingBag className="w-5 h-5 text-red-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          <Link
            to="/menu"
            className="hidden sm:inline-flex bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md shadow-red-600/20 hover:shadow-lg transition duration-200"
          >
            Pesan Online
          </Link>
        </div>

      </div>
    </header>
  );
}