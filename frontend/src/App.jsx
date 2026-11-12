import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import MenuPage from './pages/landing/MenuPage';
import AboutPage from './pages/landing/AboutPage';
import KasirPOS from './pages/pos/KasirPOS';
import PesananMasuk from './pages/pos/PesananMasuk';
import StokProdukPage from './pages/pos/StokProdukPage';
import RiwayatTransaksiPage from './pages/pos/RiwayatTransaksiPage';
import PembukuanHarianPage from './pages/pos/PembukuanHarianPage';
import DashboardOwner from './pages/pos/DashboardOwner';
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <main className="flex-1">
          <Routes>
            {/* Route Akses Publik */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Route Kasir */}
            <Route
              path="/kasir"
              element={
                <ProtectedRoute allowedRoles={['KASIR', 'OWNER']}>
                  <KasirPOS />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kasir/stok"
              element={
                <ProtectedRoute allowedRoles={['KASIR', 'OWNER']}>
                  <StokProdukPage />
                </ProtectedRoute>
              }
            />
            {/* Mengarahkan ke komponen PesananMasuk */}
            <Route
              path="/kasir/pesanan"
              element={
                <ProtectedRoute allowedRoles={['KASIR', 'OWNER']}>
                  <PesananMasuk />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kasir/riwayat"
              element={
                <ProtectedRoute allowedRoles={['KASIR', 'OWNER']}>
                  <RiwayatTransaksiPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kasir/pembukuan"
              element={
                <ProtectedRoute allowedRoles={['KASIR', 'OWNER']}>
                  <PembukuanHarianPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Route Owner */}
            <Route
              path="/owner"
              element={
                <ProtectedRoute allowedRoles={['OWNER']}>
                  <DashboardOwner />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}