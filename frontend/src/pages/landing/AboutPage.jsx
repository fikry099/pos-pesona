import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import NavbarPublic from '../../components/landing/NavbarPublic';
import FooterPublic from '../../components/landing/FooterPublic';
import { MapPin, Phone, Clock, ShieldCheck, Heart, Award, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  const handleOpenCartWarning = () => {
    Swal.fire({
      icon: 'info',
      title: 'Lihat Katalog Menu',
      text: 'Silakan pindah ke Halaman Menu untuk memilih porsi makanan favoritmu!',
      showCancelButton: true,
      confirmButtonText: 'Buka Halaman Menu 🍽️',
      cancelButtonText: 'Nanti Saja',
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      customClass: {
        popup: 'rounded-3xl'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/menu');
      }
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <NavbarPublic cartCount={0} onOpenCart={handleOpenCartWarning} />

      {/* Banner About */}
      <section className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white py-12 text-center shadow-inner">
        <h1 className="text-3xl md:text-4xl font-black">Tentang Ayam Geprek Pesona</h1>
        <p className="text-orange-100 text-xs md:text-sm mt-2 max-w-xl mx-auto">
          Mengenal lebih dekat komitmen rasa, cita rasa bumbu rempah asli, dan layanan ramah kami.
        </p>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full">
              Cerita & Rekam Jejak
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">
              Resep Bumbu Rempah Pilihan & Sambal Ulek Asli
            </h2>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              Ayam Geprek Pesona berdedikasi menyajikan kuliner ayam geprek berkualitas tinggi. Kami hanya menggunakan daging ayam potong segar setiap hari, dibalut tepung berbumbu gurih renyah, serta diulek langsung bersama cabai segar pilihan sesuai tingkat kepedasan favoritmu.
            </p>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="flex flex-col items-center text-center p-3 bg-orange-50 rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-red-600 mb-1" />
                <span className="text-xs font-extrabold text-gray-800">100% Halal</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-orange-50 rounded-2xl">
                <Heart className="w-6 h-6 text-red-600 mb-1" />
                <span className="text-xs font-extrabold text-gray-800">Bumbu Segar</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 bg-orange-50 rounded-2xl">
                <Award className="w-6 h-6 text-red-600 mb-1" />
                <span className="text-xs font-extrabold text-gray-800">Cita Rasa Khas</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-gray-50">
            <img
              src="/img-toko.png"
              alt="Warung Ayam Geprek Pesona Punggolaka"
              className="w-full h-80 object-cover hover:scale-105 transition duration-500"
            />
          </div>
        </div>

        {/* Informasi Kontak & Peta */}
        <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-200/60 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-gray-900">Kunjungi Warung Kami</h3>
            <p className="text-xs text-gray-500">
              Silakan mampir untuk menikmati sajian hangat di tempat atau gunakan layanan Pre-Order agar pesananmu siap tanpa antre.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-800">Alamat Lengkap</p>
                  <p className="text-gray-500">Jl. Pesona Raya Punggolaka, Kendari</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-800">Jam Buka Warung</p>
                  <p className="text-gray-500">Senin - Minggu: 09.00 - 21.00 WITA</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-800">Kontak WhatsApp</p>
                  <p className="text-gray-500">+62 812-3456-7890</p>
                </div>
              </div>
            </div>

            {/* Tombol Buka di Google Maps Aplikasi */}
            <a
              href="https://maps.google.com/?q=Ayam+Geprek+PESONA+punggolaka"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              <span>Buka Petunjuk Arah Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Embed Google Maps dengan Fallback Handling */}
          <div className="lg:col-span-2 h-64 lg:h-auto rounded-2xl overflow-hidden border border-gray-200 shadow-xs relative bg-gray-100">
            <iframe
              title="Google Maps Lokasi Warung"
              src="https://maps.google.com/maps?q=-3.9660793,122.4922275&z=17&output=embed"
              className="w-full h-full border-0 min-h-[260px]"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </main>

      <FooterPublic />
    </div>
  );
}