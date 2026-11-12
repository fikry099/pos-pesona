import axios from 'axios';
import { Clock, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import AdminLayout from '../../components/common/AdminLayout';
import OrderTable from '../../components/pos/OrderTable';
import OrderDetailModal from '../../components/pos/OrderDetailModal';

export default function PesananMasuk() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Modal Detail Pesanan
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Fetch Pesanan Pre-Order yang Menunggu Persetujuan
  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/transactions');
      if (res.data.success) {
        const pending = res.data.data.filter(
          (t) => t.orderSource === 'LANDING_PAGE' && t.status === 'PENDING'
        );
        setPendingOrders(pending);
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Pesanan',
        text: 'Terjadi kesalahan saat mengambil daftar pre-order masuk.',
        confirmColor: '#DC2626',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  // Buka Modal Detail Pesanan
  const handleOpenDetailModal = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // Approve Pre-Order Masuk
  const handleApproveOrder = async (order) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/transactions/${order.id}/approve`
      );
      if (res.data.success) {
        setIsDetailModalOpen(false);

        Swal.fire({
          icon: 'success',
          title: 'Pesanan Disetujui!',
          text: `Pesanan ${order.invoiceNo} telah disetujui.`,
          confirmButtonText: 'Kirim WA Verifikasi 📲',
          confirmButtonColor: '#16A34A',
        }).then((result) => {
          if (result.isConfirmed && order.customerPhone) {
            const waMessage = `Halo kak *${order.customerName}*, pesanan Ayam Geprek Pesona Anda dengan No. Nota *${order.invoiceNo}* telah *DISETUJUI & DIPROSES* oleh Kasir. Terima kasih!`;
            const waUrl = `https://api.whatsapp.com/send?phone=${order.customerPhone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(waMessage)}`;
            window.open(waUrl, '_blank');
          }
        });

        fetchPendingOrders();
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Approve Pesanan',
        text: err.response?.data?.message || 'Terjadi kesalahan pada server.',
        confirmColor: '#DC2626',
      });
    }
  };

  return (
    <AdminLayout pendingCount={pendingOrders.length}>
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Header Pesanan Masuk */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-2xs border border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-black shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-gray-900">
                Pre-Order Masuk (Web Landing Page)
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Verifikasi & setujui pesanan yang masuk dari pelanggan online
              </p>
            </div>
          </div>

          <button
            onClick={fetchPendingOrders}
            className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition flex items-center gap-1.5 text-xs font-bold"
            title="Refresh Data Pesanan"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Pesanan</span>
          </button>
        </div>

        {/* Tabel Pre-Order Masuk */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-extrabold text-sm text-gray-900">
              Daftar Pre-Order Menunggu Persetujuan
            </h2>
            <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full">
              {pendingOrders.length} Pesanan Menunggu
            </span>
          </div>

          <OrderTable
            pendingOrders={pendingOrders}
            loading={loading}
            onOpenDetail={handleOpenDetailModal}
            onApprove={handleApproveOrder}
          />
        </div>

        {/* Modal Detail Pesanan */}
        <OrderDetailModal
          order={selectedOrder}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onApprove={handleApproveOrder}
        />

      </div>
    </AdminLayout>
  );
}