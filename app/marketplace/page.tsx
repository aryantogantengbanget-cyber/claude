'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, Star, MapPin, Package } from 'lucide-react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  images: string[];
  location: {
    province: string;
    city: string;
  };
  seller: {
    name: string;
    email: string;
  };
  rating: number;
  quality: string;
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'Semua Produk' },
    { value: 'kakao', label: 'Kakao' },
    { value: 'palm_oil', label: 'Kelapa Sawit' },
    { value: 'coconut', label: 'Kelapa' },
    { value: 'fertilizer', label: 'Pupuk' },
    { value: 'equipment', label: 'Peralatan' },
    { value: 'seeds', label: 'Bibit' }
  ];

  useEffect(() => {
    fetchProducts();
    loadCart();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCart = (newCart: typeof cart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product._id === product._id);

    if (existing) {
      const newCart = cart.map(item =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveCart(newCart);
    } else {
      saveCart([...cart, { product, quantity: 1 }]);
    }

    alert(`${product.name} ditambahkan ke keranjang!`);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getCategoryLabel = (value: string) => {
    return categories.find(c => c.value === value)?.label || value;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-yellow-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">🛒 Marketplace AgriSmart</h1>
              <p className="text-white text-opacity-90">
                Jual beli produk pertanian terpercaya
              </p>
            </div>
            <Link href="/marketplace/cart">
              <div className="relative bg-white text-green-600 p-4 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                <ShoppingCart className="w-8 h-8" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white w-full md:w-64"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Memuat produk...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Tidak ada produk ditemukan
            </h3>
            <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Menampilkan {filteredProducts.length} produk
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="h-48 bg-gradient-to-br from-green-200 to-yellow-200 flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-16 h-16 text-green-600" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Category Badge */}
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full mb-2">
                      {getCategoryLabel(product.category)}
                    </span>

                    {/* Product Name */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {product.rating.toFixed(1)} / 5.0
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{product.location.city}, {product.location.province}</span>
                    </div>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          Rp {product.price.toLocaleString('id-ID')}
                        </p>
                        <p className="text-xs text-gray-500">per {product.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Stok</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {product.stock} {product.unit}
                        </p>
                      </div>
                    </div>

                    {/* Seller */}
                    <p className="text-xs text-gray-500 mb-3">
                      Dijual oleh: <span className="font-semibold">{product.seller.name}</span>
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Tambah
                      </button>
                      <Link href={`/marketplace/products/${product._id}`}>
                        <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                          Detail
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Action Button */}
      <Link href="/marketplace/sell">
        <button className="fixed bottom-8 right-8 bg-yellow-500 text-white p-4 rounded-full shadow-2xl hover:bg-yellow-600 transition-colors z-20">
          <span className="text-xl font-bold">+ Jual Produk</span>
        </button>
      </Link>
    </div>
  );
}
