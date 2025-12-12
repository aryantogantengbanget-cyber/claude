'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Leaf, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const soilData = [
  { nutrient: 'Nitrogen (N)', current: 65, optimal: 80, unit: 'ppm' },
  { nutrient: 'Phosphorus (P)', current: 45, optimal: 50, unit: 'ppm' },
  { nutrient: 'Potassium (K)', current: 70, optimal: 75, unit: 'ppm' },
  { nutrient: 'pH Level', current: 6.2, optimal: 6.5, unit: '' },
];

const radarData = [
  { subject: 'N', A: 65, B: 80, fullMark: 100 },
  { subject: 'P', A: 45, B: 50, fullMark: 100 },
  { subject: 'K', A: 70, B: 75, fullMark: 100 },
  { subject: 'Ca', A: 55, B: 60, fullMark: 100 },
  { subject: 'Mg', A: 50, B: 55, fullMark: 100 },
  { subject: 'S', A: 40, B: 45, fullMark: 100 },
];

const recommendations = [
  {
    id: 1,
    type: 'Pupuk NPK 15-15-15',
    amount: '250 kg/ha',
    reason: 'Meningkatkan nitrogen dan fosfor',
    priority: 'high',
    timing: 'Minggu 1 & 3',
    cost: 'Rp 750,000',
  },
  {
    id: 2,
    type: 'Urea (46-0-0)',
    amount: '100 kg/ha',
    reason: 'Boost nitrogen untuk pertumbuhan vegetatif',
    priority: 'medium',
    timing: 'Minggu 2',
    cost: 'Rp 250,000',
  },
  {
    id: 3,
    type: 'KCl (0-0-60)',
    amount: '75 kg/ha',
    reason: 'Meningkatkan potasium untuk kualitas hasil',
    priority: 'medium',
    timing: 'Minggu 4',
    cost: 'Rp 180,000',
  },
  {
    id: 4,
    type: 'Pupuk Organik',
    amount: '500 kg/ha',
    reason: 'Meningkatkan struktur tanah dan mikroorganisme',
    priority: 'low',
    timing: 'Setiap bulan',
    cost: 'Rp 400,000',
  },
];

export default function FertilizerRecommendation() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <Leaf className="w-10 h-10 mb-4" />
          <div className="text-3xl font-bold mb-1">85%</div>
          <div className="text-green-100">Kesehatan Tanah</div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
          <TrendingUp className="w-10 h-10 mb-4" />
          <div className="text-3xl font-bold mb-1">4</div>
          <div className="text-amber-100">Rekomendasi Aktif</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
          <AlertCircle className="w-10 h-10 mb-4" />
          <div className="text-3xl font-bold mb-1">2</div>
          <div className="text-blue-100">Nutrisi Rendah</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <CheckCircle className="w-10 h-10 mb-4" />
          <div className="text-3xl font-bold mb-1">40%</div>
          <div className="text-purple-100">Efisiensi Pupuk</div>
        </div>
      </div>

      {/* Soil Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Analisis Nutrisi Tanah</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={soilData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nutrient" angle={-15} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" fill="#f59e0b" name="Saat Ini" />
              <Bar dataKey="optimal" fill="#10b981" name="Optimal" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Profil Nutrisi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Saat Ini" dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              <Radar name="Target" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Nutrient Status */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Status Nutrisi Detail</h3>
        <div className="space-y-4">
          {soilData.map((item, index) => (
            <div key={index} className="border-l-4 border-amber-500 pl-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{item.nutrient}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.current < item.optimal * 0.8
                    ? 'bg-red-100 text-red-700'
                    : item.current < item.optimal
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {item.current < item.optimal * 0.8
                    ? 'Rendah'
                    : item.current < item.optimal
                    ? 'Sedang'
                    : 'Optimal'}
                </span>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-sm text-gray-600">
                  Saat Ini: <span className="font-bold text-amber-600">{item.current} {item.unit}</span>
                </span>
                <span className="text-sm text-gray-600">
                  Target: <span className="font-bold text-green-600">{item.optimal} {item.unit}</span>
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    item.current < item.optimal * 0.8
                      ? 'bg-red-500'
                      : item.current < item.optimal
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${(item.current / item.optimal) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Rekomendasi AI Pemupukan</h3>
          <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full text-sm font-semibold">
            AI Powered
          </span>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`border-l-4 p-4 rounded-r-xl ${
                rec.priority === 'high'
                  ? 'border-red-500 bg-red-50'
                  : rec.priority === 'medium'
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-green-500 bg-green-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-lg font-bold text-gray-800">{rec.type}</h4>
                  <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    rec.priority === 'high'
                      ? 'bg-red-500 text-white'
                      : rec.priority === 'medium'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {rec.priority === 'high' ? 'Prioritas Tinggi' : rec.priority === 'medium' ? 'Prioritas Sedang' : 'Prioritas Rendah'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500">Jumlah</p>
                  <p className="font-bold text-gray-800">{rec.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Waktu Aplikasi</p>
                  <p className="font-bold text-gray-800">{rec.timing}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Estimasi Biaya</p>
                  <p className="font-bold text-gray-800">{rec.cost}</p>
                </div>
              </div>

              <button className="mt-4 w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-yellow-600 transition">
                Terapkan Rekomendasi
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Analisis Biaya</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Investasi Pupuk</span>
              <span className="text-2xl font-bold text-amber-600">Rp 1,580,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Penghematan vs Metode Konvensional</span>
              <span className="text-xl font-bold text-green-600">40%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">ROI Estimasi</span>
              <span className="text-xl font-bold text-blue-600">235%</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Prediksi Hasil</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Peningkatan Hasil Panen</span>
              <span className="text-2xl font-bold text-green-600">+35%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Kualitas Produk</span>
              <span className="text-xl font-bold text-amber-600">Grade A</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Waktu Panen Optimal</span>
              <span className="text-xl font-bold text-blue-600">85 Hari</span>
            </div>
          </div>
        </div>
      </div>

      {/* Application Schedule */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Jadwal Pemupukan</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border-2 border-amber-500 rounded-xl p-4 bg-amber-50">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Minggu 1</div>
              <div className="font-bold text-gray-800">NPK 15-15-15</div>
              <div className="text-xs text-gray-500 mt-2">125 kg/ha</div>
              <div className="mt-3">
                <span className="px-3 py-1 bg-amber-500 text-white text-xs rounded-full">Segera</span>
              </div>
            </div>
          </div>

          <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Minggu 2</div>
              <div className="font-bold text-gray-800">Urea</div>
              <div className="text-xs text-gray-500 mt-2">100 kg/ha</div>
              <div className="mt-3">
                <span className="px-3 py-1 bg-gray-400 text-white text-xs rounded-full">Dijadwalkan</span>
              </div>
            </div>
          </div>

          <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Minggu 3</div>
              <div className="font-bold text-gray-800">NPK 15-15-15</div>
              <div className="text-xs text-gray-500 mt-2">125 kg/ha</div>
              <div className="mt-3">
                <span className="px-3 py-1 bg-gray-400 text-white text-xs rounded-full">Dijadwalkan</span>
              </div>
            </div>
          </div>

          <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Minggu 4</div>
              <div className="font-bold text-gray-800">KCl</div>
              <div className="text-xs text-gray-500 mt-2">75 kg/ha</div>
              <div className="mt-3">
                <span className="px-3 py-1 bg-gray-400 text-white text-xs rounded-full">Dijadwalkan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
