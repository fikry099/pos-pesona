import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSection() {
  const heroSlides = [
    {
      image: '/paket-lengkap.png',
      title: 'Paket Nasi Ayam + Es Teh',
      tag: 'FAVORIT KELUARGA',
      price: 'Rp 15.000',
    },
    {
      image: '/paket-campur.png',
      title: 'Nasi Campur Spesial',
      tag: 'MENU LENGKAP',
      price: 'Rp 15.000',
    },
    {
      image: '/tumpukan-ayam.png',
      title: 'Ayam Crispy Ulek Fresh',
      tag: '100% RENYAH',
      price: 'Rp 10.000',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-orange-600 text-white py-12 lg:py-16">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-900/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* ================= SISI KIRI: TYPOGRAPHY & CTA (7 KOLOM) ================= */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-amber-300 border border-white/10 shadow-xs">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>Kuliner Pedas Favorit Keluarga</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Pedasnya Pas, <br />
            <span className="text-amber-300 underline decoration-wavy decoration-orange-400">
              Dagingnya Empuk!
            </span>
          </h1>

          <p className="text-red-100 text-sm sm:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
            Rasakan kenikmatan racikan bumbu rempah tradisional dan sambal ulek segar pilihan. Pesan online sekarang tanpa antre, siap diantarkan atau diambil langsung di toko.
          </p>

          {/* Tombol Utama */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
            <Link
              to="/menu"
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-red-950 font-black text-sm px-8 py-3.5 rounded-2xl shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 transition duration-300 hover:scale-105"
            >
              Pesan Menu Sekarang
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-8 py-3.5 rounded-2xl border border-white/20 flex items-center justify-center transition duration-300"
            >
              Lokasi Warung
            </Link>
          </div>

          {/* Badges Keunggulan */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center lg:text-left">
            <div>
              <p className="font-black text-base sm:text-lg text-amber-300">100% Halal</p>
              <p className="text-[11px] text-red-200 mt-0.5">Ayam Segar Potong</p>
            </div>
            <div>
              <p className="font-black text-base sm:text-lg text-amber-300">Cabai Asli</p>
              <p className="text-[11px] text-red-200 mt-0.5">Ulek Fresh Setiap Hari</p>
            </div>
            <div>
              <p className="font-black text-base sm:text-lg text-amber-300">Pre-Order</p>
              <p className="text-[11px] text-red-200 mt-0.5">Bebas Antre Toko</p>
            </div>
          </div>
        </div>

        {/* ================= SISI KANAN: FRAME SHOWCASE (5 KOLOM) ================= */}
        <div className="lg:col-span-5 relative flex flex-col items-center">
          
          {/* Outer Frame Wrapper */}
          <div className="relative w-full max-w-lg bg-orange-950/20 p-3 sm:p-3.5 rounded-3xl backdrop-blur-md border border-white/15 shadow-2xl space-y-3">
            
            {/* Image Slide Item */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-gray-900 group">
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                    index === currentSlide
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-105 pointer-events-none'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay Gradien Bawah */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Caption Judul & Harga (Di Dalam Gambar Bottom Left/Right) */}
                  <div className="absolute bottom-3 left-3 right-3 text-white flex justify-between items-end">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider bg-red-600 text-amber-300 px-2 py-0.5 rounded-md">
                        {slide.tag}
                      </span>
                      <h4 className="font-extrabold text-sm text-white mt-1 drop-shadow-md">
                        {slide.title}
                      </h4>
                    </div>
                    <span className="font-black text-xs text-amber-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15">
                      {slide.price}
                    </span>
                  </div>
                </div>
              ))}

              {/* Tombol Panah Navigasi Minimalis (Atas Gambar) */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-red-600 text-white rounded-full backdrop-blur-md border border-white/20 shadow-md transition duration-200 opacity-80 hover:opacity-100 z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-red-600 text-white rounded-full backdrop-blur-md border border-white/20 shadow-md transition duration-200 opacity-80 hover:opacity-100 z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Indikator Dots Slide (Di Luar/Bawah Gambar) */}
            <div className="flex justify-center gap-1.5 py-0.5">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'w-6 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            {/* Floating Card Rating (Pojok Kanan Atas Di Luar Gambar) */}
            <div className="absolute -top-4 -right-2 sm:-right-4 bg-white text-slate-900 px-3 py-2 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 z-20">
              <div className="w-7 h-7 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-black shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
              </div>
              <div>
                <p className="text-[11px] font-black text-slate-900 leading-none">4.9 / 5.0 Rating</p>
                <p className="text-[9px] font-bold text-gray-400 mt-0.5">500+ Ulasan Pembeli</p>
              </div>
            </div>

          </div>

          {/* Floating Card Jam Operasional (Dipindah Murni Ke Bawah Frame) */}
          <div className="mt-3.5 bg-slate-900/90 text-white backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-white/15 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 rounded-xl flex items-center justify-center font-black shadow-xs shrink-0">
              <Clock className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <p className="text-[9px] font-black uppercase tracking-wider text-amber-300">Buka Setiap Hari</p>
                </div>
                <p className="text-xs font-black text-white mt-0.5">09.00 - 21.00 WITA</p>
              </div>
              <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 font-bold text-red-200">
                PESONA Punggolaka
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}