'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CartItem {
  product: any;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadCart();
    loadUserData();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const loadUserData = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setShippingAddress({
        ...shippingAddress,
        name: user.name,
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  };

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (productId: string, delta: number) => {
    const newCart = cart.map(item => {
      if (item.product._id === productId) {
        const newQuantity = item.quantity + delta;
        if (newQuantity > 0 && newQuantity <= item.product.stock) {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    });
    saveCart(newCart);
  };

  const removeItem = (productId: string) => {
    const newCart = cart.filter(item => item.product._id !== productId);
    saveCart(newCart);
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const getShippingCost = () => {
    return cart.length > 0 ? 50000 : 0; // Flat shipping cost
  };

  const getTotal = () => {
    return getSubtotal() + getShippingCost();
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Keranjang kosong!');
      return;
    }

    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address) {
      alert('Mohon lengkapi alamat pengiriman!');
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Silakan login terlebih dahulu');
        router.push('/auth/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          products: cart.map(item => ({
            productId: item.product._id,
            quantity: item.quantity
          })),
          shippingAddress,
          paymentMethod
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      // Redirect to Midtrans payment page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert('Pembayaran berhasil dibuat!');
        localStorage.removeItem('cart');
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Gagal melakukan checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-yellow-600 text-white py-8">
        <div className="container mx-auto px-4">
          <Link href="/marketplace" className="inline-flex items-center text-white mb-4 hover:underline">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Marketplace
          </Link>
          <h1 className="text-4xl font-bold">🛒 Keranjang Belanja</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Keranjang Kosong
            </h3>
            <p className="text-gray-500 mb-6">Belum ada produk di keranjang Anda</p>
            <Link href="/marketplace">
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                Mulai Belanja
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Produk ({cart.length})</h2>

              {cart.map(item => (
                <div key={item.product._id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gradient-to-br from-green-200 to-yellow-200 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-green-600" />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{item.product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.product.location.city}, {item.product.location.province}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      Rp {item.product.price.toLocaleString('id-ID')} / {item.product.unit}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product._id, -1)}
                        className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, 1)}
                        className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mt-2">
                      Subtotal: <span className="font-bold">
                        Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-2xl font-semibold mb-4">Ringkasan Pesanan</h2>

                {/* Shipping Address */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Alamat Pengiriman</h3>
                  <input
                    type="text"
                    placeholder="Nama"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="tel"
                    placeholder="No. Telepon"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <textarea
                    placeholder="Alamat Lengkap"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Kota"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="text"
                      placeholder="Provinsi"
                      value={shippingAddress.province}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, province: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Metode Pembayaran</h3>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="bank_transfer">Transfer Bank</option>
                    <option value="gopay">GoPay</option>
                    <option value="ovo">OVO</option>
                    <option value="dana">DANA</option>
                    <option value="qris">QRIS</option>
                    <option value="credit_card">Kartu Kredit</option>
                  </select>
                </div>

                {/* Price Summary */}
                <div className="border-t border-gray-200 pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rp {getSubtotal().toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Ongkir</span>
                    <span>Rp {getShippingCost().toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
                    <span>Total</span>
                    <span>Rp {getTotal().toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Memproses...' : 'Checkout Sekarang'}
                </button>

                <p className="text-xs text-gray-500 mt-3 text-center">
                  Pembayaran aman dengan Midtrans
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
