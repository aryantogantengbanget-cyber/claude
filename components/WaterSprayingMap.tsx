'use client';

import { useState } from 'react';
import { Droplets, MapPin, TrendingDown, TrendingUp, Activity } from 'lucide-react';

interface WaterPoint {
  id: number;
  x: number;
  y: number;
  moisture: number;
  priority: 'high' | 'medium' | 'low';
  area: string;
}

const waterPoints: WaterPoint[] = [
  { id: 1, x: 15, y: 20, moisture: 25, priority: 'high', area: 'Zona A-1' },
  { id: 2, x: 35, y: 15, moisture: 35, priority: 'high', area: 'Zona A-2' },
  { id: 3, x: 55, y: 25, moisture: 45, priority: 'medium', area: 'Zona B-1' },
  { id: 4, x: 75, y: 30, moisture: 55, priority: 'medium', area: 'Zona B-2' },
  { id: 5, x: 25, y: 50, moisture: 65, priority: 'low', area: 'Zona C-1' },
  { id: 6, x: 45, y: 55, moisture: 48, priority: 'medium', area: 'Zona C-2' },
  { id: 7, x: 65, y: 60, moisture: 32, priority: 'high', area: 'Zona D-1' },
  { id: 8, x: 85, y: 65, moisture: 58, priority: 'low', area: 'Zona D-2' },
  { id: 9, x: 20, y: 80, moisture: 38, priority: 'high', area: 'Zona E-1' },
  { id: 10, x: 50, y: 85, moisture: 52, priority: 'medium', area: 'Zona E-2' },
  { id: 11, x: 80, y: 88, moisture: 62, priority: 'low', area: 'Zona E-3' },
];

const zones = [
  { name: 'Zona A', avgMoisture: 30, waterNeeded: 450, status: 'critical' },
  { name: 'Zona B', avgMoisture: 50, waterNeeded: 250, status: 'moderate' },
  { name: 'Zona C', avgMoisture: 56, waterNeeded: 180, status: 'good' },
  { name: 'Zona D', avgMoisture: 45, waterNeeded: 320, status: 'moderate' },
  { name: 'Zona E', avgMoisture: 51, waterNeeded: 240, status: 'good' },
];

export default function WaterSprayingMap() {
  const [selectedPoint, setSelectedPoint] = useState<WaterPoint | null>(null);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
          <Droplets className="w-10 h-10 mb-4" />
          <div className="text-3xl font-bold mb-1">1,440 L</div>
          <div className="text-blue-100">Total Air Dibutuhkan</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <TrendingDown className="w-10 h-10 mb-4" />
          <div className="text-3xl font-bold mb-1">5</div>
          <div className="text-red-100">Titik Prioritas Tinggi</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <TrendingUp className="w-10 h-10 mb-4" />
          <div className="text-3xl font-bold mb-1">45%</div>
          <div className="text-green-100">Penghematan Air</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <Activity className="w-10 h-10 mb-4" />
          <div className="text-3xl font-bold mb-1">11</div>
          <div className="text-purple-100">Titik Monitoring</div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Peta Penyemprotan Air Presisi</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Prioritas Tinggi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Prioritas Sedang</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Prioritas Rendah</span>
            </div>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-8 h-[500px] border-4 border-green-300">
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 opacity-20">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="border border-green-400"></div>
            ))}
          </div>

          {/* Water points */}
          {waterPoints.map((point) => (
            <div
              key={point.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125"
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              onClick={() => setSelectedPoint(point)}
            >
              <div
                className={`relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                  point.priority === 'high'
                    ? 'bg-red-500'
                    : point.priority === 'medium'
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                } ${selectedPoint?.id === point.id ? 'ring-4 ring-blue-400' : ''}`}
              >
                <Droplets className="w-4 h-4 text-white" />
              </div>
              {/* Ripple effect for high priority */}
              {point.priority === 'high' && (
                <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></div>
              )}
            </div>
          ))}

          {/* Selected point info */}
          {selectedPoint && (
            <div
              className="absolute bg-white rounded-xl shadow-2xl p-4 w-64 border-2 border-blue-400 z-10"
              style={{
                left: `${selectedPoint.x > 70 ? selectedPoint.x - 35 : selectedPoint.x + 5}%`,
                top: `${selectedPoint.y > 70 ? selectedPoint.y - 25 : selectedPoint.y + 5}%`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-800">{selectedPoint.area}</h4>
                <button
                  onClick={() => setSelectedPoint(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Kelembaban:</span>
                  <span className="font-semibold text-blue-600">{selectedPoint.moisture}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prioritas:</span>
                  <span
                    className={`font-semibold ${
                      selectedPoint.priority === 'high'
                        ? 'text-red-600'
                        : selectedPoint.priority === 'medium'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {selectedPoint.priority === 'high'
                      ? 'Tinggi'
                      : selectedPoint.priority === 'medium'
                      ? 'Sedang'
                      : 'Rendah'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Air Dibutuhkan:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedPoint.priority === 'high' ? '180L' : selectedPoint.priority === 'medium' ? '120L' : '60L'}
                  </span>
                </div>
              </div>
              <button className="mt-3 w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition">
                Aktifkan Penyiraman
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Zone Analysis */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Analisis per Zona</h3>
        <div className="space-y-4">
          {zones.map((zone, index) => (
            <div key={index} className="border rounded-xl p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-800">{zone.name}</h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    zone.status === 'critical'
                      ? 'bg-red-100 text-red-700'
                      : zone.status === 'moderate'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {zone.status === 'critical' ? 'Kritis' : zone.status === 'moderate' ? 'Sedang' : 'Baik'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Kelembaban Rata-rata</p>
                  <p className="text-lg font-bold text-blue-600">{zone.avgMoisture}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Air Dibutuhkan</p>
                  <p className="text-lg font-bold text-cyan-600">{zone.waterNeeded} L</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Target Kelembaban</p>
                  <p className="text-lg font-bold text-green-600">65%</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full ${
                    zone.avgMoisture < 40
                      ? 'bg-gradient-to-r from-red-500 to-orange-500'
                      : zone.avgMoisture < 60
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500'
                  }`}
                  style={{ width: `${(zone.avgMoisture / 100) * 100}%` }}
                ></div>
              </div>

              <div className="flex gap-2 mt-3">
                <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition">
                  Mulai Penyiraman
                </button>
                <button className="flex-1 border-2 border-blue-500 text-blue-500 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition">
                  Jadwalkan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Watering Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Jadwal Penyiraman Hari Ini</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Zona A</p>
                  <p className="text-xs text-gray-500">06:00 - 07:00</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                Selesai
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-blue-400">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Zona D</p>
                  <p className="text-xs text-gray-500">14:00 - 15:00</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-semibold">
                Berjalan
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Zona E</p>
                  <p className="text-xs text-gray-500">17:00 - 18:00</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full font-semibold">
                Dijadwalkan
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Efisiensi Penyiraman</h3>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Penggunaan Air Hari Ini</span>
                <span className="text-lg font-bold text-blue-600">856 L</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">65% dari target 1,320 L</p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Penghematan Bulanan</span>
                <span className="text-lg font-bold text-green-600">12,500 L</span>
              </div>
              <p className="text-xs text-gray-500">45% lebih efisien dari metode konvensional</p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Biaya Air Bulanan</span>
                <span className="text-lg font-bold text-amber-600">Rp 385,000</span>
              </div>
              <p className="text-xs text-gray-500">Hemat Rp 315,000 per bulan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
