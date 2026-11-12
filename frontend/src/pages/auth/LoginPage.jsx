import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Lock, User, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });

      if (res.data.success) {
        // Simpan Session ke LocalStorage
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.data.user));

        Swal.fire({
          icon: 'success',
          title: 'Selamat Datang!',
          text: `Login berhasil sebagai ${res.data.data.user.role}`,
          timer: 1500,
          showConfirmButton: false,
        });

        // Redirect sesuai Hak Akses
        if (res.data.data.user.role === 'OWNER') {
          navigate('/owner');
        } else {
          navigate('/kasir');
        }
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Login',
        text: err.response?.data?.message || 'Username atau password salah!',
        confirmColor: '#DC2626',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 space-y-6 border border-gray-100 animate-scale-up">
        
        {/* Logo & Heading */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl mx-auto flex items-center justify-center p-2 shadow-inner">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Login Internal POS</h1>
          <p className="text-xs text-gray-400">Ayam Geprek Pesona Omnichannel System</p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-gray-400" /> Username
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan username Anda"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 bg-gray-50/50 font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-gray-400" /> Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 bg-gray-50/50 font-semibold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Memverifikasi...' : 'Masuk Ke System'}</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-[11px] font-bold text-gray-400 hover:text-red-600 transition">
            ← Kembali ke Website Publik
          </a>
        </div>

      </div>
    </div>
  );
}