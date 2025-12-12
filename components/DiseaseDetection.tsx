'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, Eye, Camera, TrendingDown, Activity } from 'lucide-react';

interface Detection {
  id: number;
  location: string;
  disease: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  timestamp: string;
  treatment: string;
  area: string;
}

const detections: Detection[] = [
  {
    id: 1,
    location: 'Zona A - Baris 12',
    disease: 'Bercak Daun Bakteri',
    severity: 'high',
    confidence: 94,
    timestamp: '2 jam lalu',
    treatment: 'Semprot bakterisida + isolasi tanaman',
    area: '15 m²'
  },
  {
    id: 2,
    location: 'Zona B - Baris 8',
    disease: 'Jamur Karat',
    severity: 'medium',
    confidence: 87,
    timestamp: '4 jam lalu',
    treatment: 'Aplikasi fungisida sistemik',
    area: '8 m²'
  },
  {
    id: 3,
    location: 'Zona C - Baris 5',
    disease: 'Defisiensi Nitrogen',
    severity: 'low',
    confidence: 92,
    timestamp: '6 jam lalu',
    treatment: 'Pemupukan nitrogen tambahan',
    area: '5 m²'
  },
  {
    id: 4,
    location: 'Zona D - Baris 15',
    disease: 'Busuk Akar',
    severity: 'high',
    confidence: 89,
    timestamp: '8 jam lalu',
    treatment: 'Perbaikan drainase + fungisida',
    area: '20 m²'
  },
];

const diseaseStats = [
  { disease: 'Bercak Daun', count: 12, trend: 'up' },
  { disease: 'Jamur Karat', count: 8, trend: 'down' },
  { disease: 'Busuk Akar', count: 5, trend: 'up' },
  { disease: 'Defisiensi Nutrisi', count: 15, trend: 'stable' },
  { disease: 'Hama Kutu', count: 6, trend: 'down' },
];

export default function DiseaseDetection() {
  const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <AlertTriangle className="w-10 h-10 mb-4" />
          <div className="text-3xl font-bold mb-1">4</div>
          <div className="text-red-100">Deteksi Aktif</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <CheckCircle className="w-10 h-10 mb-4" />
          <div className="text-3xl font-bold mb-1">95%</div>
          <div className="text-green-100">Tanaman Sehat</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
          <Camera className="w-10 h-10 mb-4" />
          <div className="text-3xl font-bold mb-1">1,247</div>
          <div className="text-blue-100">Gambar Dianalisis</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <Activity className="w-10 h-10 mb-4" />
          <div className="text-3xl font-bold mb-1">91%</div>
          <div className="text-purple-100">Akurasi AI</div>
        </div>
      </div>

      {/* Active Detections */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Deteksi Penyakit Aktif</h3>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition">
            Scan Sekarang
          </button>
        </div>

        <div className="space-y-4">
          {detections.map((detection) => (
            <div
              key={detection.id}
              className={`border-l-4 p-4 rounded-r-xl cursor-pointer transition hover:shadow-md ${
                detection.severity === 'high'
                  ? 'border-red-500 bg-red-50'
                  : detection.severity === 'medium'
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-green-500 bg-green-50'
              } ${selectedDetection?.id === detection.id ? 'ring-2 ring-blue-400' : ''}`}
              onClick={() => setSelectedDetection(detection)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-lg font-bold text-gray-800">{detection.disease}</h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        detection.severity === 'high'
                          ? 'bg-red-500 text-white'
                          : detection.severity === 'medium'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      {detection.severity === 'high' ? 'Tinggi' : detection.severity === 'medium' ? 'Sedang' : 'Rendah'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{detection.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">Akurasi: {detection.confidence}%</p>
                  <p className="text-xs text-gray-500">{detection.timestamp}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Area Terinfeksi</p>
                  <p className="font-semibold text-gray-800">{detection.area}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rekomendasi Penanganan</p>
                  <p className="font-semibold text-gray-800">{detection.treatment}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg text-sm font-semibold hover:from-green-600 hover:to-emerald-600 transition">
                  Tandai Selesai
                </button>
                <button className="flex-1 border-2 border-blue-500 text-blue-500 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition">
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disease Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Statistik Penyakit</h3>
          <div className="space-y-3">
            {diseaseStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{stat.count}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{stat.disease}</span>
                </div>
                <div className="flex items-center gap-2">
                  {stat.trend === 'up' && <TrendingDown className="w-5 h-5 text-red-500" />}
                  {stat.trend === 'down' && <TrendingDown className="w-5 h-5 text-green-500 transform rotate-180" />}
                  {stat.trend === 'stable' && <div className="w-5 h-0.5 bg-gray-400"></div>}
                  <span className={`text-sm font-semibold ${
                    stat.trend === 'up' ? 'text-red-600' : stat.trend === 'down' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {stat.trend === 'up' ? 'Naik' : stat.trend === 'down' ? 'Turun' : 'Stabil'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Analisis Mingguan</h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Deteksi Dini Berhasil</span>
                <span className="text-2xl font-bold text-green-600">23</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">92% dari total kasus</p>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Kasus Parah</span>
                <span className="text-2xl font-bold text-red-600">2</span>
              </div>
              <div className="w-full bg-red-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '8%' }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">8% memerlukan tindakan intensif</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Pemulihan Berhasil</span>
                <span className="text-2xl font-bold text-blue-600">18</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">95% tingkat kesembuhan</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Preview */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Preview Analisis AI</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sample Image Analysis */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 transition cursor-pointer">
              <div className="aspect-video bg-gradient-to-br from-green-200 to-emerald-300 rounded-lg mb-3 flex items-center justify-center">
                <Camera className="w-16 h-16 text-white opacity-50" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Analisis #{item}</span>
                  <Eye className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    item === 1 ? 'bg-red-500' : item === 2 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-xs text-gray-600">
                    {item === 1 ? 'Penyakit Terdeteksi' : item === 2 ? 'Perlu Monitoring' : 'Sehat'}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Akurasi: {item === 1 ? '94' : item === 2 ? '87' : '96'}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Treatment Guide */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Panduan Penanganan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4">
            <h4 className="font-bold text-gray-800 mb-2">Pencegahan</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Rotasi tanaman setiap musim</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Jaga kebersihan lahan dari gulma</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Monitor kelembaban secara teratur</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>Gunakan varietas tahan penyakit</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl p-4">
            <h4 className="font-bold text-gray-800 mb-2">Tindakan Cepat</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">⚡</span>
                <span>Isolasi tanaman terinfeksi segera</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">⚡</span>
                <span>Aplikasi pestisida/fungisida sesuai jenis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">⚡</span>
                <span>Perbaiki kondisi lingkungan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">⚡</span>
                <span>Dokumentasi untuk analisis lanjutan</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
