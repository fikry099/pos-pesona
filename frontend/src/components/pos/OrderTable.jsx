import { Check, Eye, Store, Truck } from 'lucide-react';

export default function OrderTable({ pendingOrders, loading, onOpenDetail, onApprove }) {
  if (loading) {
    return (
      <div className="text-center py-12 text-xs text-gray-400">
        Memuat data pesanan masuk...
      </div>
    );
  }

  if (pendingOrders.length === 0) {
    return (
      <div className="text-center py-12 text-xs text-gray-400">
        Tidak ada pesanan pre-order baru yang menanti saat ini.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-gray-50 text-gray-500 uppercase font-black text-[10px] tracking-wider border-b border-gray-100">
          <tr>
            <th className="py-3.5 px-4">No. Invoice</th>
            <th className="py-3.5 px-4">Nama Pemesan</th>
            <th className="py-3.5 px-4">No. WhatsApp</th>
            <th className="py-3.5 px-4">Metode</th>
            <th className="py-3.5 px-4">Rencana Jam</th>
            <th className="py-3.5 px-4">Total Bayar</th>
            <th className="py-3.5 px-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {pendingOrders.map((order) => (
            <tr
              key={order.id}
              onClick={() => onOpenDetail(order)}
              className="hover:bg-orange-50/40 transition cursor-pointer group"
            >
              <td className="py-3.5 px-4 font-mono font-black text-red-600">
                {order.invoiceNo}
              </td>
              <td className="py-3.5 px-4 font-extrabold text-gray-900 group-hover:text-red-600 transition">
                {order.customerName}
              </td>
              <td className="py-3.5 px-4 font-semibold text-gray-600">
                {order.customerPhone}
              </td>
              <td className="py-3.5 px-4">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-orange-100 text-orange-800">
                  {order.shippingType === 'DELIVERY' ? (
                    <Truck className="w-3 h-3" />
                  ) : (
                    <Store className="w-3 h-3" />
                  )}
                  {order.shippingType === 'DELIVERY' ? 'DELIVERY' : 'PICKUP'}
                </span>
              </td>
              <td className="py-3.5 px-4 font-medium text-gray-500">
                {order.pickupTime
                  ? new Date(order.pickupTime).toLocaleString('id-ID', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : '-'}
              </td>
              <td className="py-3.5 px-4 font-black text-gray-900">
                Rp {order.totalAmount.toLocaleString('id-ID')}
              </td>
              <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onOpenDetail(order)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1"
                    title="Lihat Detail Pesanan"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Detail</span>
                  </button>
                  <button
                    onClick={() => onApprove(order)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-extrabold shadow-xs transition flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Setujui</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}