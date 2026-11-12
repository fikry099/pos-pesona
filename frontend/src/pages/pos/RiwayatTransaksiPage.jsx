import { useState, useEffect } from 'react';
import axios from 'axios';
import { History, RefreshCw, FileText, ShoppingBag } from 'lucide-react';
import AdminLayout from '../../components/common/AdminLayout';

export default function RiwayatTransaksiPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/transactions');
      if (res.data.success) {
        setTransactions(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <History className="w-5 h-5 text-red-600" />
              Riwayat Transaksi Penjualan
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Daftar pencatatan histori seluruh pesanan masuk dari Kasir POS dan Pre-Order Website
            </p>
          </div>
          <button
            onClick={fetchTransactions}
            className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tabel Riwayat */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 font-bold uppercase text-[10px] text-gray-400">
                <tr>
                  <th className="p-3.5">No. Invoice</th>
                  <th className="p-3.5">Tanggal & Jam</th>
                  <th className="p-3.5">Sumber Pesanan</th>
                  <th className="p-3.5">Metode Bayar</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Total Transaksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-400">Belum ada riwayat transaksi</td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50/50">
                      <td className="p-3.5 font-mono font-bold text-red-600">{t.invoiceNo}</td>
                      <td className="p-3.5 text-gray-500">{new Date(t.createdAt).toLocaleString('id-ID')}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                          t.orderSource === 'POS' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'
                        }`}>
                          {t.orderSource}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-gray-700">{t.paymentMethod}</td>
                      <td className="p-3.5">
                        <span className="bg-emerald-50 text-emerald-700 font-black text-[10px] px-2 py-0.5 rounded-md">
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-black text-gray-900">
                        Rp {t.totalAmount.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}