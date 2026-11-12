import axios from 'axios';
import { BookOpen, Calculator } from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import AdminLayout from '../../components/common/AdminLayout';

export default function PembukuanHarianPage() {
  const [cashRegister, setCashRegister] = useState('');
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const fetchTodaySales = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/transactions');
        if (res.data.success) {
          const total = res.data.data
            .filter((t) => t.status === 'APPROVED' || t.status === 'COMPLETED' || t.orderSource === 'POS')
            .reduce((acc, t) => acc + t.totalAmount, 0);
          setTotalSales(total);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTodaySales();
  }, []);

  const handleMatchCash = (e) => {
    e.preventDefault();
    const cashVal = parseFloat(cashRegister || 0);
    const diff = cashVal - totalSales;

    if (diff === 0) {
      Swal.fire({
        icon: 'success',
        title: 'Pembukuan Sesuai! 🎉',
        text: 'Uang di laci kasir cocok $100\%$ dengan catatan transaksi harian.',
        confirmColor: '#16A34A'
      });
    } else if (diff < 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Uang Laci Kurang!',
        text: `Terdapat selisih minus sebesar Rp ${Math.abs(diff).toLocaleString('id-ID')}`,
        confirmColor: '#DC2626'
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Uang Laci Lebih!',
        text: `Terdapat kelebihan uang sebesar Rp ${diff.toLocaleString('id-ID')}`,
        confirmColor: '#2563EB'
      });
    }
  };

  return (
    <AdminLayout>
      <div className>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2"> 
            <BookOpen className="w-5 h-5 text-red-600" />
            Pembukuan Harian Kasir
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Kalkulasi total omzet sistem dan pencocokan uang tunai fisik di laci kasir toko
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card Total Penjualan Sistem */}
          <div className="bg-gradient-to-br from-red-600 to-orange-500 text-white p-6 rounded-2xl shadow-md space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-red-100">Total Penjualan Sistem Hari Ini</span>
            <p className="text-3xl font-black">
              Rp {totalSales.toLocaleString('id-ID')}
            </p>
            <p className="text-[11px] text-red-100">
              Hasil akumulasi transaksi POS dan Pre-Order lunas.
            </p>
          </div>

          {/* Form Cocokkan Laci */}
          <form onSubmit={handleMatchCash} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-4 h-4 text-red-600" />
              Pencocokan Uang Laci Kasir
            </h3>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Hitung Fisik Uang di Laci (Rp)
              </label>
              <input
                type="number"
                required
                placeholder="Contoh: 1500000"
                value={cashRegister}
                onChange={(e) => setCashRegister(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 bg-gray-50/50 font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gray-900 hover:bg-red-600 text-white rounded-xl font-extrabold text-xs shadow-xs transition"
            >
              Cocokkan Pembukuan
            </button>
          </form>
        </div>

      </div>
    </AdminLayout>
  );
}