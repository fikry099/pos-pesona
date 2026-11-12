import { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarPublic from '../../components/landing/NavbarPublic';
import HeroSection from '../../components/landing/HeroSection';
import DiscoverMenu from '../../components/landing/DiscoverMenu';
import FooterPublic from '../../components/landing/FooterPublic';
import CartDrawer from '../../components/landing/CartDrawer';
import VariantModal from '../../components/landing/VariantModal';
import FloatingCart from '../../components/common/FloatingCart';

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // State Modal Pilih Varian & Potongan Ayam
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isVariantOpen, setIsVariantOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/products');
        if (res.data.success && isMounted) {
          setProducts(res.data.data);
        }
      } catch (err) {
        if (isMounted) console.error('Gagal mengambil menu:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => { isMounted = false; };
  }, []);

  // Handler 1: Buka Modal Varian saat tombol + Pesan diklik
  const handleOpenVariant = (product) => {
    setSelectedProduct(product);
    setIsVariantOpen(true);
  };

  // Handler 2: Tambah ke Keranjang dari Modal Varian
  const handleAddToCartFromModal = (newItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === newItem.productId && item.variantPiece === newItem.variantPiece
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].qty += newItem.qty;
        return updated;
      }
      return [...prev, newItem];
    });
  };

  // Handler 3: Update Qty di Modal Checkout
  const updateQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Handler 4: Update Potongan Ayam di Modal Checkout
  const updateVariant = (productId, variantPiece) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, variantPiece } : item
      )
    );
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative">
      {/* Navbar Header */}
      <NavbarPublic cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)} />
      
      {/* Main Content */}
      <main className="flex-1">
        <HeroSection />
        <DiscoverMenu products={products} loading={loading} onAddToCart={handleOpenVariant} />
      </main>

      {/* Footer */}
      <FooterPublic />

      {/* Tombol Keranjang Melayang di Kanan Bawah */}
      <FloatingCart cart={cart} onClick={() => setIsCartOpen(true)} />

      {/* Modal 1: Pilih Potongan Ayam & Jumlah Porsi */}
      <VariantModal
        isOpen={isVariantOpen}
        onClose={() => setIsVariantOpen(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCartFromModal}
      />

      {/* Modal 2: Checkout Pre-Order Utama */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQty={updateQty}
        updateVariant={updateVariant}
        clearCart={() => setCart([])}
      />
    </div>
  );
}