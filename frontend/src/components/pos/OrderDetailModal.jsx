import {
  Calendar,
  Check,
  MapPin,
  Phone,
  ShoppingBag,
  Store,
  Truck,
  User,
  X,
} from 'lucide-react';

export default function OrderDetailModal({ order, isOpen, onClose, onApprove }) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-scale-up">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <span className="font-mono text-xs font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
              {order.invoiceNo}
            </span>
            <h3 className="font-extrabold text-sm text-gray-900 mt-1">
              Detail Pre-Order Masuk
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Modal Detail */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Informasi Pemesan */}
          <div className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-gray-700 font-bold">
              <User className="w-4 h-4 text-red-600" />
              <span>Nama: <strong className="text-gray-900">{order.customerName}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 font-bold">
              <Phone className="w-4 h-4 text-red-600" />
              <span>No. WA: <strong className="text-gray-900">{order.customerPhone}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 font-bold">
              {order.shippingType === 'DELIVERY' ? (
                <Truck className="w-4 h-4 text-red-600" />
              ) : (
                <Store className="w-4 h-4 text-red-600" />
              )}
              <span>
                Metode:{' '}
                <strong className="text-orange-600">
                  {order.shippingType === 'DELIVERY' ? 'DIANTARKAN KURIR' : 'AMBIL DI TOKO'}
                </strong>
              </span>
            </div>
            <div className="flex items-start gap-2 text-gray-700 font-bold pt-1 border-t border-gray-200/60">
              <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black">Alamat / Detail Lokasi:</p>
                <p className="text-gray-800">{order.shippingAddress || 'Diambil di Toko'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-gray-700 font-bold pt-1 border-t border-gray-200/60">
              <Calendar className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black">Rencana Jam Pengantaran / Pengambilan:</p>
                <p className="text-gray-800">
                  {order.pickupTime
                    ? new Date(order.pickupTime).toLocaleString('id-ID', {
                        dateStyle: 'full',
                        timeStyle: 'short',
                      })
                    : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Rincian Menu Pesanan */}
          <div className="space-y-2">
            <p className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-red-600" /> Rincian Item Makanan
            </p>
            
            <div className="bg-orange-50/40 border border-orange-100 rounded-2xl p-3 space-y-2.5">
              {order.details && order.details.length > 0 ? (
                order.details.map((item, idx) => {
                  const productName = item.product?.name || 'Menu Pesanan';
                  const itemPrice = item.price || item.product?.price || 0;

                  return (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-xs border-b border-orange-100/60 last:border-none pb-2 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow-xs shrink-0 min-w-[32px] text-center">
                          {item.qty}x
                        </span>
                        <div>
                          <p className="font-extrabold text-gray-900 text-xs sm:text-sm">
                            {productName}
                          </p>
                          <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                            {item.variantPiece &&
                            item.variantPiece !== 'Standar' &&
                            item.variantPiece !== 'Standard' ? (
                              <span className="text-orange-700 font-bold bg-orange-100 px-1.5 py-0.5 rounded mr-1">
                                Potongan: {item.variantPiece}
                              </span>
                            ) : null}
                            <span>@ Rp {itemPrice.toLocaleString('id-ID')}</span>
                          </p>
                        </div>
                      </div>

                      <span className="font-black text-gray-900 text-xs sm:text-sm shrink-0">
                        Rp {(item.subtotal || itemPrice * item.qty).toLocaleString('id-ID')}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-gray-400 text-center py-2">
                  Rincian item tidak tersedia
                </p>
              )}
            </div>
          </div>

          {/* Total Bayar */}
          <div className="flex justify-between items-center bg-gray-900 text-white p-3.5 rounded-2xl">
            <span className="text-xs font-bold text-gray-300">Total Pembayaran:</span>
            <span className="text-base font-black text-amber-400">
              Rp {order.totalAmount.toLocaleString('id-ID')}
            </span>
          </div>

        </div>

        {/* Footer Action Modal */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-extrabold text-xs rounded-xl transition"
          >
            Tutup
          </button>
          <button
            onClick={() => onApprove(order)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Setujui & Notif WA
          </button>
        </div>

      </div>
    </div>
  );
}