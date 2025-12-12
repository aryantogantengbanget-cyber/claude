'use client';

import { useState } from 'react';
import { Grid3x3, Maximize2, TrendingUp, Target, Layers, CheckCircle } from 'lucide-react';

interface Pattern {
  id: number;
  name: string;
  type: string;
  spacing: string;
  efficiency: number;
  yieldIncrease: number;
  recommended: boolean;
}

const patterns: Pattern[] = [
  {
    id: 1,
    name: 'Square Pattern',
    type: 'Pola Persegi',
    spacing: '50cm x 50cm',
    efficiency: 85,
    yieldIncrease: 25,
    recommended: false,
  },
  {
    id: 2,
    name: 'Rectangular Pattern',
    type: 'Pola Persegi Panjang',
    spacing: '60cm x 40cm',
    efficiency: 88,
    yieldIncrease: 30,
    recommended: false,
  },
  {
    id: 3,
    name: 'Triangle Pattern',
    type: 'Pola Segitiga',
    spacing: '45cm (offset)',
    efficiency: 95,
    yieldIncrease: 40,
    recommended: true,
  },
  {
    id: 4,
    name: 'Row Pattern',
    type: 'Pola Baris',
    spacing: '70cm x 30cm',
    efficiency: 82,
    yieldIncrease: 20,
    recommended: false,
  },
];

const cropRecommendations = [
  { crop: 'Padi', pattern: 'Triangle', spacing: '25cm x 25cm', population: '160,000/ha' },
  { crop: 'Jagung', pattern: 'Rectangular', spacing: '75cm x 25cm', population: '53,000/ha' },
  { crop: 'Kedelai', pattern: 'Row', spacing: '40cm x 15cm', population: '166,000/ha' },
  { crop: 'Cabai', pattern: 'Square', spacing: '60cm x 60cm', population: '27,700/ha' },
  { crop: 'Tomat', pattern: 'Rectangular', spacing: '70cm x 50cm', population: '28,500/ha' },
];

export default function PlantingPattern() {
  const [selectedPattern, setSelectedPattern] = useState<Pattern>(patterns[2]);
  const [gridSize, setGridSize] = useState(10);

  const renderPattern = (pattern: Pattern) => {
    const cells = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        let shouldPlant = false;

        if (pattern.name === 'Square Pattern') {
          shouldPlant = i % 2 === 0 && j % 2 === 0;
        } else if (pattern.name === 'Rectangular Pattern') {
          shouldPlant = i % 3 === 0 && j % 2 === 0;
        } else if (pattern.name === 'Triangle Pattern') {
          shouldPlant = i % 2 === 0 ? j % 2 === 0 : j % 2 === 1;
        } else if (pattern.name === 'Row Pattern') {
          shouldPlant = i % 3 === 0;
        }

        cells.push(
          <div
            key={`${i}-${j}`}
            className={`aspect-square rounded-sm transition-all ${
              shouldPlant
                ? 'bg-green-500 shadow-md scale-110'
                : 'bg-gray-200'
            }`}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <Grid3x3 className="w-10 h-10 mb-4" />
          <div className="text-3xl font-bold mb-1">95%</div>
          <div className="text-green-100">Efisiensi Optimal</div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
          <TrendingUp className="w-10 h-10 mb-4" />
          <div className="text-3xl font-bold mb-1">+40%</div>
          <div className="text-amber-100">Peningkatan Hasil</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
          <Maximize2 className="w-10 h-10 mb-4" />
          <div className="text-3xl font-bold mb-1">2.5 Ha</div>
          <div className="text-blue-100">Lahan Teroptimasi</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <Target className="w-10 h-10 mb-4" />
          <div className="text-3xl font-bold mb-1">98%</div>
          <div className="text-purple-100">Akurasi Prediksi</div>
        </div>
      </div>

      {/* Pattern Comparison */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Perbandingan Pola Tanam</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {patterns.map((pattern) => (
            <div
              key={pattern.id}
              onClick={() => setSelectedPattern(pattern)}
              className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                selectedPattern.id === pattern.id
                  ? 'border-green-500 bg-green-50 shadow-lg'
                  : 'border-gray-200 hover:border-green-300 hover:shadow-md'
              } ${pattern.recommended ? 'ring-2 ring-amber-400' : ''}`}
            >
              {pattern.recommended && (
                <div className="flex items-center gap-1 mb-2">
                  <CheckCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-amber-600">Rekomendasi AI</span>
                </div>
              )}
              <h4 className="font-bold text-gray-800 mb-2">{pattern.type}</h4>
              <p className="text-sm text-gray-600 mb-3">{pattern.spacing}</p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Efisiensi</span>
                    <span className="font-bold text-green-600">{pattern.efficiency}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${pattern.efficiency}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Peningkatan</span>
                    <span className="font-bold text-amber-600">+{pattern.yieldIncrease}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ width: `${pattern.yieldIncrease * 2}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Visualisasi Pola: {selectedPattern.type}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setGridSize(Math.max(5, gridSize - 1))}
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                -
              </button>
              <button
                onClick={() => setGridSize(Math.min(15, gridSize + 1))}
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                +
              </button>
            </div>
          </div>
          <div
            className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border-2 border-amber-200"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gap: '4px',
            }}
          >
            {renderPattern(selectedPattern)}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-600">Titik Tanam</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span className="text-gray-600">Area Kosong</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Detail Pola Terpilih</h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-800 mb-3">{selectedPattern.type}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Jarak Tanam:</span>
                  <span className="font-bold text-gray-800">{selectedPattern.spacing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Efisiensi Lahan:</span>
                  <span className="font-bold text-green-600">{selectedPattern.efficiency}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Peningkatan Hasil:</span>
                  <span className="font-bold text-amber-600">+{selectedPattern.yieldIncrease}%</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-800 mb-3">Keunggulan</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Memaksimalkan penggunaan lahan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Sirkulasi udara optimal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Akses cahaya merata</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Memudahkan pemeliharaan</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-800 mb-3">Estimasi Populasi</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Per Hektar:</span>
                  <span className="font-bold text-gray-800">
                    {selectedPattern.name === 'Triangle Pattern' ? '88,000' :
                     selectedPattern.name === 'Rectangular Pattern' ? '41,600' :
                     selectedPattern.name === 'Square Pattern' ? '40,000' : '47,600'} tanaman
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Untuk 2.5 Ha:</span>
                  <span className="font-bold text-amber-600">
                    {selectedPattern.name === 'Triangle Pattern' ? '220,000' :
                     selectedPattern.name === 'Rectangular Pattern' ? '104,000' :
                     selectedPattern.name === 'Square Pattern' ? '100,000' : '119,000'} tanaman
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Crop-Specific Recommendations */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Layers className="w-6 h-6 text-amber-500" />
          <h3 className="text-xl font-bold text-gray-800">Rekomendasi per Jenis Tanaman</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cropRecommendations.map((rec, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-xl p-4 hover:border-green-400 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-800">{rec.crop}</h4>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                  Optimal
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pola:</span>
                  <span className="font-semibold text-gray-800">{rec.pattern}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jarak:</span>
                  <span className="font-semibold text-gray-800">{rec.spacing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Populasi:</span>
                  <span className="font-semibold text-amber-600">{rec.population}</span>
                </div>
              </div>
              <button className="mt-3 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg text-sm font-semibold hover:from-green-600 hover:to-emerald-600 transition">
                Terapkan Pola
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Implementation Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Panduan Implementasi</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Persiapan Lahan</h4>
                <p className="text-sm text-gray-600">Ratakan dan bersihkan lahan dari gulma dan sisa tanaman</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Marking System</h4>
                <p className="text-sm text-gray-600">Gunakan tali dan ajir untuk menandai titik tanam sesuai pola</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Penanaman</h4>
                <p className="text-sm text-gray-600">Tanam bibit pada titik yang telah ditandai dengan kedalaman seragam</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Monitoring</h4>
                <p className="text-sm text-gray-600">Pantau pertumbuhan dan lakukan penyesuaian jika diperlukan</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Analisis Benefit</h3>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Efisiensi Lahan</span>
                <span className="text-2xl font-bold text-green-600">+35%</span>
              </div>
              <p className="text-xs text-gray-600">Dibanding metode konvensional</p>
            </div>

            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Penghematan Bibit</span>
                <span className="text-2xl font-bold text-amber-600">Rp 2.5 Jt</span>
              </div>
              <p className="text-xs text-gray-600">Per musim tanam untuk 2.5 ha</p>
            </div>

            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Peningkatan Produksi</span>
                <span className="text-2xl font-bold text-blue-600">+40%</span>
              </div>
              <p className="text-xs text-gray-600">Estimasi hasil panen lebih tinggi</p>
            </div>

            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">ROI Estimasi</span>
                <span className="text-2xl font-bold text-purple-600">285%</span>
              </div>
              <p className="text-xs text-gray-600">Return on investment dalam 1 tahun</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
