'use client';

import Link from 'next/link';
import { Sprout, Cpu, Eye, Droplets, TrendingUp, AlertTriangle, Grid3x3 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sprout className="w-8 h-8 text-amber-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-green-600 bg-clip-text text-transparent">
                AgriSmart AI
              </span>
            </div>
            <div className="hidden md:flex space-x-6 items-center">
              <a href="#features" className="text-gray-700 hover:text-amber-600 transition">Fitur</a>
              <Link href="/ai-assistant" className="text-gray-700 hover:text-amber-600 transition">AI Assistant</Link>
              <Link href="/marketplace" className="text-gray-700 hover:text-amber-600 transition">Marketplace</Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-amber-600 transition">Dashboard</Link>
              <Link href="/auth/login" className="text-amber-600 font-semibold hover:text-amber-700 transition">
                Masuk
              </Link>
              <Link href="/auth/register" className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-6 py-2 rounded-full hover:from-amber-600 hover:to-yellow-600 transition shadow-md">
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-600 via-yellow-500 to-green-600 bg-clip-text text-transparent">
              Pertanian Presisi
              <br />
              Masa Depan
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Teknologi AI dengan rover dan drone untuk monitoring real-time, analisis data, dan rekomendasi cerdas untuk pertanian yang lebih efisien dan produktif
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-amber-600 hover:to-yellow-600 transition shadow-lg transform hover:scale-105">
                Mulai Sekarang
              </Link>
              <a href="#features" className="bg-white text-amber-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition shadow-lg border-2 border-amber-500 transform hover:scale-105">
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white rounded-2xl p-8 shadow-xl text-center transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-amber-600 mb-2">95%</div>
              <div className="text-gray-600">Akurasi Deteksi Penyakit</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl text-center transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-yellow-600 mb-2">40%</div>
              <div className="text-gray-600">Penghematan Air & Pupuk</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl text-center transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Monitoring Real-time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Fitur Unggulan</h2>
            <p className="text-xl text-gray-600">Teknologi canggih untuk pertanian modern</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Monitoring Sensor Real-time</h3>
              <p className="text-gray-600">
                Pantau suhu, kelembaban, dan cahaya dari sensor rover dan drone secara real-time dengan visualisasi grafik interaktif
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Rekomendasi Pupuk AI</h3>
              <p className="text-gray-600">
                Dapatkan rekomendasi jenis dan jumlah pupuk yang optimal berdasarkan analisis data sensor dan kondisi tanaman
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-6">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Penyemprotan Air Presisi</h3>
              <p className="text-gray-600">
                Identifikasi titik-titik yang memerlukan penyiraman dengan presisi tinggi untuk efisiensi penggunaan air
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Deteksi Penyakit Tanaman</h3>
              <p className="text-gray-600">
                Deteksi dini penyakit tanaman dengan computer vision dan AI untuk pencegahan dan penanganan cepat
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
                <Grid3x3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Model Tata Tanam Optimal</h3>
              <p className="text-gray-600">
                Rekomendasi pola dan jarak tanam yang optimal berdasarkan jenis tanaman dan kondisi lahan
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Dashboard Komprehensif</h3>
              <p className="text-gray-600">
                Interface intuitif untuk memantau semua aspek pertanian Anda dalam satu platform terpadu
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Teknologi Kami</h2>
            <p className="text-xl text-gray-600">Kombinasi AI, IoT, dan Robotika</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Rover Otomatis</h3>
                  <p className="text-gray-600">Robot bergerak dengan sensor canggih untuk mengumpulkan data tanah dan tanaman secara detail</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Drone Pertanian</h3>
                  <p className="text-gray-600">Monitoring udara dengan kamera multispektral untuk analisis kesehatan tanaman dari atas</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">AI & Machine Learning</h3>
                  <p className="text-gray-600">Algoritma pembelajaran mesin untuk prediksi dan rekomendasi yang semakin akurat</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Cloud Computing</h3>
                  <p className="text-gray-600">Penyimpanan dan pemrosesan data di cloud untuk akses dimana saja, kapan saja</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-100 to-green-100 rounded-3xl p-12 shadow-2xl">
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-gray-700">Sensor Aktif</span>
                    <span className="text-green-500 font-bold">24/24</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{width: '100%'}}></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-gray-700">Data Terkumpul</span>
                    <span className="text-amber-500 font-bold">15.2 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full" style={{width: '87%'}}></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-gray-700">Akurasi AI</span>
                    <span className="text-blue-500 font-bold">95.8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{width: '95.8%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-amber-100 via-yellow-100 to-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">Manfaat untuk Pertanian Anda</h2>
            <p className="text-xl text-gray-600">Tingkatkan produktivitas dan efisiensi dengan teknologi presisi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-amber-600">Efisiensi Biaya</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Pengurangan penggunaan pupuk hingga 40%</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Penghematan air dengan penyiraman presisi</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Minimalisasi kerugian dari penyakit tanaman</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-green-600">Peningkatan Produktivitas</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Hasil panen meningkat hingga 35%</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Kualitas produk lebih konsisten</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Waktu kerja lebih efektif dan efisien</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Keberlanjutan</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>Pengurangan dampak lingkungan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>Praktik pertanian yang lebih ramah lingkungan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span>Pelestarian kesuburan tanah jangka panjang</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-purple-600">Data-Driven Decisions</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  <span>Keputusan berdasarkan data real-time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  <span>Prediksi akurat untuk perencanaan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">✓</span>
                  <span>Laporan komprehensif untuk analisis</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-green-500 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Siap Mengubah Pertanian Anda?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Mulai perjalanan menuju pertanian yang lebih cerdas, efisien, dan produktif
            </p>
            <Link href="/dashboard" className="inline-block bg-white text-amber-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition shadow-lg transform hover:scale-105">
              Akses Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sprout className="w-8 h-8 text-amber-500" />
                <span className="text-2xl font-bold">AgriSmart AI</span>
              </div>
              <p className="text-gray-400">
                Membawa teknologi AI ke pertanian Indonesia untuk masa depan yang lebih produktif dan berkelanjutan
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Tautan Cepat</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-amber-500 transition">Fitur</a></li>
                <li><a href="#technology" className="hover:text-amber-500 transition">Teknologi</a></li>
                <li><a href="#benefits" className="hover:text-amber-500 transition">Manfaat</a></li>
                <li><Link href="/dashboard" className="hover:text-amber-500 transition">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Kontak</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@agrismart.ai</li>
                <li>Telepon: +62 xxx xxx xxx</li>
                <li>Alamat: Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AgriSmart AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
