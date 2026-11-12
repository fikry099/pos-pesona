import { useState } from 'react';
import Sidebar from './Sidebar';
import NavbarAdmin from './NavbarAdmin';

export default function AdminLayout({ children, pendingCount = 0 }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar Navigasi Kiri */}
      <Sidebar
        pendingCount={pendingCount}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Area Utama (Navbar Topbar + Konten Halaman) */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <NavbarAdmin />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}