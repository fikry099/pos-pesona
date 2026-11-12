import { User, Calendar } from 'lucide-react';

export default function NavbarAdmin() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex justify-between items-center sticky top-0 z-30 shadow-xs">
      {/* Date Info */}
      <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
        <Calendar className="w-4 h-4 text-red-600" />
        <span>Hari ini: <span className="text-gray-800">{todayFormatted}</span></span>
      </div>

      {/* User Status Badge */}
      <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200/80 px-3.5 py-1.5 rounded-xl text-xs">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <User className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-extrabold text-gray-800">{user.name || 'User'}</span>
        <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
          {user.role}
        </span>
      </div>
    </header>
  );
}