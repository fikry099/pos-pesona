import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function FloatingCart({ cart, onClick }) {
  if (cart.length === 0) return null;

  const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-bounce-short">
      <button
        onClick={onClick}
        className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-5 py-3.5 rounded-full shadow-2xl shadow-red-600/50 flex items-center gap-4 group transition duration-300 border-2 border-white/20"
      >
        <div className="relative">
          <ShoppingBag className="w-6 h-6 text-amber-300" />
          <span className="absolute -top-2 -right-2 bg-white text-red-600 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md">
            {totalCount}
          </span>
        </div>

        <div className="text-left">
          <p className="text-[10px] text-red-100 uppercase font-bold tracking-wider leading-none">Keranjang Saya</p>
          <p className="text-sm font-black text-white mt-0.5">
            Rp {totalAmount.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition">
          <ArrowRight className="w-4 h-4 text-white" />
        </div>
      </button>
    </div>
  );
}