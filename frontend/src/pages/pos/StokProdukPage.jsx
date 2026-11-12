import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Package, PlusCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import AdminLayout from '../../components/common/AdminLayout';

export default function StokProdukPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/products');
      if (res.data.success) setProducts(res.data.data);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Ambil Data',
        text: 'Gagal mengambil data stok produk.',
        confirmColor: '#DC2626'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpdateStock = async (product) => {
    const { value: addQty } = await Swal.fire({
      title: `Tambah Stok ${product.name}`,
      text: `Stok saat ini: ${product.stock} porsi`,
      input: 'number',
      inputLabel: 'Jumlah porsi tambahan',
      inputPlaceholder: 'Contoh: 20',
      showCancelButton: true,
      confirmButtonText: 'Simpan Stok',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#16A34A',
      inputValidator: (value) => {
        if (!value || parseInt(value) <= 0) {
          return 'Masukkan jumlah angka yang valid!';
        }
      }
    });

    if (addQty) {
      try {
        const newStock = product.stock + parseInt(addQty);
        const res = await axios.patch(`http://localhost:5000/api/products/${product.id}`, {
          stock: newStock
        });

        if (res.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Stok Diperbarui!',
            text: `Stok ${product.name} menjadi ${newStock} porsi.`,
            timer: 1500,
            showConfirmButton: false
          });
          fetchProducts();
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Update Stok',
          text: err.response?.data?.message || 'Terjadi kesalahan.',
          confirmColor: '#DC2626'
        });
      }
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Header Section */}
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-red-600" />
              Manajemen Stok Produk Harian
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Pantau ketersediaan porsi dan update stok awal sebelum operasional toko
            </p>
          </div>
          <button
            onClick={fetchProducts}
            className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tabel Data Stok */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 font-extrabold text-xs text-gray-800 uppercase tracking-wider">
            Daftar Stok Produk Ayam & Minuman
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 font-bold uppercase text-[10px] text-gray-400">
                <tr>
                  <th className="p-3.5">Nama Produk</th>
                  <th className="p-3.5">Kategori</th>
                  <th className="p-3.5">Harga Jual</th>
                  <th className="p-3.5 text-center">Status & Sisa Stok</th>
                  <th className="p-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="p-3.5 font-bold text-gray-900">{p.name}</td>
                    <td className="p-3.5">
                      <span className="bg-orange-50 text-orange-700 font-bold text-[10px] px-2 py-0.5 rounded-md">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-red-600">Rp {p.price.toLocaleString('id-ID')}</td>
                    <td className="p-3.5 text-center">
                      {p.stock <= 5 ? (
                        <span className="bg-red-50 text-red-600 font-extrabold text-[11px] px-2.5 py-1 rounded-full inline-flex items-center gap-1 border border-red-100">
                          <AlertTriangle className="w-3 h-3" /> Hampir Habis ({p.stock} porsi)
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[11px] px-2.5 py-1 rounded-full border border-emerald-100">
                          Tersedia ({p.stock} porsi)
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleUpdateStock(p)}
                        className="bg-gray-900 hover:bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition inline-flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Tambah Stok
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}