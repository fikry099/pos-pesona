import axios from 'axios';
import {
    DollarSign,
    PlusCircle, RefreshCw,
    ShoppingBag,
    TrendingDown,
    TrendingUp,
    Wallet
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import AdminLayout from '../../components/common/AdminLayout';

export default function DashboardOwner() {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalCogs: 0,
    grossProfit: 0,
    totalExpense: 0,
    netProfit: 0,
  });
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State Tambah Pengeluaran
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('OPERATIONAL');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Ringkasan Keuangan & Pengeluaran
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [resSummary, resExpenses] = await Promise.all([
        axios.get('http://localhost:5000/api/expenses/summary'),
        axios.get('http://localhost:5000/api/expenses'),
      ]);

      if (resSummary.data.success) setSummary(resSummary.data.data);
      if (resExpenses.data.success) setExpenses(resExpenses.data.data);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Ambil Data',
        text: 'Gagal mengambil data ringkasan keuangan toko.',
        confirmColor: '#DC2626'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Submit Pengeluaran Baru
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!title || !amount) {
      Swal.fire({ icon: 'warning', title: 'Data Belum Lengkap', text: 'Judul dan Nominal wajib diisi!', confirmColor: '#DC2626' });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post('http://localhost:5000/api/expenses', {
        title,
        amount: parseFloat(amount),
        category,
        note,
      });

      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil Catat Pengeluaran!',
          timer: 1500,
          showConfirmButton: false,
        });
        setTitle('');
        setAmount('');
        setNote('');
        fetchDashboardData();
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mencatat',
        text: 'Terjadi kesalahan saat menyimpan data pengeluaran.',
        confirmColor: '#DC2626'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Dashboard */}
        <div className="flex justify-between items-center bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-xl font-black text-gray-900">Dashboard Keuangan Owner</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Ringkasan Omzet, Modal HPP, Pengeluaran, & Laba Bersih Otomatis
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="p-2.5 text-gray-500 hover:text-red-600 rounded-xl hover:bg-gray-100 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* ================= CARD SUMMARY METRICS (4 KOTAK METRIK) ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Omzet */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-emerald-600">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Omzet</span>
              <DollarSign className="w-5 h-5 bg-emerald-50 p-1 rounded-lg" />
            </div>
            <p className="text-2xl font-black text-emerald-600">
              Rp {summary.totalRevenue.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-gray-400">Pendapatan kotor dari transaksi lunas</p>
          </div>

          {/* Total HPP / Modal */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-orange-600">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Modal (HPP)</span>
              <ShoppingBag className="w-5 h-5 bg-orange-50 p-1 rounded-lg" />
            </div>
            <p className="text-2xl font-black text-orange-600">
              Rp {summary.totalCogs.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-gray-400">Harga Pokok Penjualan (Bahan Baku Ayam)</p>
          </div>

          {/* Total Pengeluaran */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-red-600">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Operasional / Bumbu</span>
              <TrendingDown className="w-5 h-5 bg-red-50 p-1 rounded-lg" />
            </div>
            <p className="text-2xl font-black text-red-600">
              Rp {summary.totalExpense.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-gray-400">Gaji, minyak, listrik, & sewa</p>
          </div>

          {/* LABA BERSIH */}
          <div className="bg-gradient-to-br from-red-600 to-orange-500 text-white p-5 rounded-3xl shadow-lg shadow-red-600/20 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-100">Laba Bersih</span>
              <Wallet className="w-5 h-5 bg-white/20 p-1 rounded-lg" />
            </div>
            <p className="text-2xl font-black">
              Rp {summary.netProfit.toLocaleString('id-ID')}
            </p>
            <p className="text-[10px] text-red-100">Omzet - Modal HPP - Pengeluaran</p>
          </div>

        </div>

        {/* ================= FORM CATAT PENGELUARAN & RIWAYAT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Form Input Pengeluaran (1 Kolom) */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-2 border-b pb-3">
              <PlusCircle className="w-5 h-5 text-red-600" />
              Catat Pengeluaran Toko
            </h3>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Judul Pengeluaran</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beli Minyak Goreng 5L"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 75000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 bg-gray-50/50 font-bold text-gray-700"
                >
                  <option value="OPERATIONAL">Operasional Toko</option>
                  <option value="BUMBU_TAMBAHAN">Bumbu & Sembako</option>
                  <option value="GAJI">Gaji Karyawan</option>
                  <option value="LAINNYA">Lain-Lain</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Catatan Tambahan</label>
                <textarea
                  placeholder="Opsional"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 bg-gray-50/50 h-20 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-extrabold text-xs shadow-md transition"
              >
                {isSubmitting ? 'Simpan Data...' : 'Simpan Pengeluaran'}
              </button>
            </form>
          </div>

          {/* Tabel Riwayat Pengeluaran (2 Kolom) */}
          <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-2 border-b pb-3">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Riwayat Catatan Pengeluaran Toko
            </h3>

            <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
              <table className="w-full text-left text-xs text-gray-600">
                <thead className="bg-gray-50 font-bold uppercase text-[10px] text-gray-400 sticky top-0">
                  <tr>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Keterangan</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-gray-400">Belum ada riwayat pengeluaran</td>
                    </tr>
                  ) : (
                    expenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50/50">
                        <td className="p-3 text-gray-400">{new Date(expense.date).toLocaleDateString('id-ID')}</td>
                        <td className="p-3 font-bold text-gray-800">{expense.title}</td>
                        <td className="p-3">
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono text-[10px]">
                            {expense.category}
                          </span>
                        </td>
                        <td className="p-3 text-right font-bold text-red-600">
                          Rp {expense.amount.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}