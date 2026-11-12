import { MapPin, Phone, Clock } from 'lucide-react';

export default function FooterPublic() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-800">
        
        {/* Brand Info Menggunakan Logo Gambar */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo Ayam Geprek Pesona" className="w-10 h-10 object-contain" />
            <span className="font-black text-xl text-white">Ayam Geprek <span className="text-red-500">Pesona</span></span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Menyajikan ayam geprek dengan cita rasa terbaik, daging empuk, dan sambal ulek segar pilihan. Siap melayani Pre-Order katering & makan tempat.
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-white text-sm">Hubungi Kami</h4>
          <div className="flex items-start gap-2 text-gray-400">
            <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>Jl. Pesona Raya Punggolaka, Kendari</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Phone className="w-4 h-4 text-red-500 shrink-0" />
            <span>+62 812-3456-7890 (WhatsApp)</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4 text-red-500 shrink-0" />
            <span>Setiap Hari: 09.00 - 21.00 WITA</span>
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-white text-sm">Layanan Pesanan</h4>
          <p className="text-gray-400">Menerima pesanan partai besar/katering untuk acara ulang tahun, rapat, dan syukuran.</p>
          <span className="inline-block bg-red-600/20 text-red-400 font-bold px-3 py-1 rounded-full text-[11px] border border-red-500/20">
            Bebas Antre via Pre-Order Web
          </span>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 text-center text-[11px] text-gray-500">
        © 2026 Ayam Geprek Pesona. All rights reserved. Built for Omnichannel POS.
      </div>
    </footer>
  );
}