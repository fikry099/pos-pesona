import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  ShoppingCart, Package, History, BellRing, BookOpen, 
  LayoutDashboard, TrendingUp, LogOut, Home, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function Sidebar({ pendingCount = 0, isCollapsed, onToggleCollapse }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    Swal.fire({
      title: 'Konfirmasi Logout',
      text: 'Apakah Anda yakin ingin keluar dari sistem POS?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Logout',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'rounded-3xl'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    });
  };

  return (
    <aside
      className={`relative bg-slate-900 text-white min-h-screen flex flex-col justify-between shadow-2xl transition-all duration-300 ease-in-out shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Tombol Toggle Buka-Tutup (Persempit Sidebar) */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3.5 top-7 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg transition duration-200 z-50 border-2 border-slate-900"
        title={isCollapsed ? 'Perluas Sidebar' : 'Persempit Sidebar'}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* bagian atas: Header Brand & Navigasi Menu */}
      <div>
        {/* Brand Header */}
        <div className={`p-4 border-b border-slate-800 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <img src="/logo.png" alt="Logo" className="w-9 h-9 object-contain bg-white rounded-xl p-1 shadow-md shrink-0" />
          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap transition-all duration-300">
              <h2 className="font-black text-sm tracking-wide text-white leading-none">System POS</h2>
              <p className="text-[10px] text-orange-400 font-extrabold uppercase tracking-wider mt-1">Ayam Geprek Pesona</p>
            </div>
          )}
        </div>

        {/* Dynamic Navigation Menu Based on Role */}
        <nav className="px-3 mt-4 space-y-1">
          {/* MENU ROLE KASIR */}
          {(user.role === 'KASIR' || user.role === 'OWNER') && (
            <>
              {!isCollapsed && (
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 mb-2">
                  Operasional Kasir
                </p>
              )}

              {/* POS Kasir */}
              <Link
                to="/kasir"
                title="POS Kasir"
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                  isCollapsed ? 'justify-center' : ''
                } ${
                  isActive('/kasir')
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <ShoppingCart className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap">POS Kasir</span>}
              </Link>

              {/* Stok Produk */}
              <Link
                to="/kasir/stok"
                title="Stok Produk"
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                  isCollapsed ? 'justify-center' : ''
                } ${
                  isActive('/kasir/stok')
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Package className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap">Stok Produk</span>}
              </Link>

              {/* Pesanan Masuk */}
              <Link
                to="/kasir/pesanan"
                title="Pesanan Masuk"
                className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition relative ${
                  isCollapsed ? 'justify-center' : ''
                } ${
                  isActive('/kasir/pesanan')
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BellRing className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span className="whitespace-nowrap">Pesanan Masuk</span>}
                </div>
                {pendingCount > 0 && (
                  <span
                    className={`bg-amber-400 text-slate-950 font-black text-[10px] rounded-full animate-pulse ${
                      isCollapsed
                        ? 'absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center'
                        : 'px-2 py-0.5'
                    }`}
                  >
                    {pendingCount}
                  </span>
                )}
              </Link>

              {/* Riwayat Transaksi */}
              <Link
                to="/kasir/riwayat"
                title="Riwayat Transaksi"
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                  isCollapsed ? 'justify-center' : ''
                } ${
                  isActive('/kasir/riwayat')
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <History className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap">Riwayat Transaksi</span>}
              </Link>

              {/* Pembukuan Harian */}
              <Link
                to="/kasir/pembukuan"
                title="Pembukuan Harian"
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                  isCollapsed ? 'justify-center' : ''
                } ${
                  isActive('/kasir/pembukuan')
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BookOpen className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap">Pembukuan Harian</span>}
              </Link>
            </>
          )}

          {/* MENU ROLE OWNER */}
          {user.role === 'OWNER' && (
            <>
              {!isCollapsed && (
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 pt-4 mb-2">
                  Audit & Prediksi Owner
                </p>
              )}

              {/* Dashboard Keuangan */}
              <Link
                to="/owner"
                title="Dashboard Keuangan"
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                  isCollapsed ? 'justify-center' : ''
                } ${
                  isActive('/owner')
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap">Dashboard Keuangan</span>}
              </Link>

              {/* Rekomendasi Stok ML */}
              <Link
                to="/owner/prediksi"
                title="Rekomendasi Stok ML"
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                  isCollapsed ? 'justify-center' : ''
                } ${
                  isActive('/owner/prediksi')
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <TrendingUp className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap">Rekomendasi Stok ML</span>}
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Bagian Bawah: Pintasan Web & Profil User Logout */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        {/* Lihat Web Publik */}
        <Link
          to="/"
          target="_blank"
          title="Lihat Web Publik"
          className={`flex items-center gap-3 px-3.5 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <Home className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">Lihat Web Publik</span>}
        </Link>

        {/* Profil User + Tombol Logout di Paling Bawah */}
        <button
          onClick={handleLogout}
          title="Klik untuk Logout / Keluar"
          className={`w-full bg-slate-800/80 hover:bg-red-600/20 border border-slate-700/60 hover:border-red-500/40 p-2.5 rounded-2xl flex items-center justify-between group transition duration-200 text-left ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 bg-red-600 group-hover:bg-red-700 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-md shrink-0 transition">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden whitespace-nowrap">
                <p className="text-xs font-bold text-white group-hover:text-red-300 transition truncate">{user.name || 'Kasir Utama'}</p>
                <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded font-extrabold uppercase border border-amber-400/20 inline-block">
                  {user.role || 'KASIR'}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition shrink-0 ml-1" />
          )}
        </button>
      </div>
    </aside>
  );
}