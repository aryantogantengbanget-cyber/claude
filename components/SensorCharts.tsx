'use client';

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data - in production, this would come from your API
const temperatureData = [
  { time: '00:00', rover1: 24, rover2: 23, drone1: 25, drone2: 24 },
  { time: '04:00', rover1: 22, rover2: 21, drone1: 23, drone2: 22 },
  { time: '08:00', rover1: 26, rover2: 27, drone1: 28, drone2: 27 },
  { time: '12:00', rover1: 31, rover2: 32, drone1: 33, drone2: 32 },
  { time: '16:00', rover1: 29, rover2: 30, drone1: 31, drone2: 30 },
  { time: '20:00', rover1: 25, rover2: 26, drone1: 27, drone2: 26 },
];

const humidityData = [
  { time: '00:00', rover1: 75, rover2: 73, drone1: 72, drone2: 74 },
  { time: '04:00', rover1: 80, rover2: 82, drone1: 79, drone2: 81 },
  { time: '08:00', rover1: 68, rover2: 70, drone1: 67, drone2: 69 },
  { time: '12:00', rover1: 55, rover2: 58, drone1: 54, drone2: 57 },
  { time: '16:00', rover1: 60, rover2: 62, drone1: 59, drone2: 61 },
  { time: '20:00', rover1: 70, rover2: 72, drone1: 69, drone2: 71 },
];

const lightData = [
  { time: '00:00', rover1: 0, rover2: 0, drone1: 0, drone2: 0 },
  { time: '04:00', rover1: 50, rover2: 48, drone1: 52, drone2: 49 },
  { time: '08:00', rover1: 450, rover2: 460, drone1: 480, drone2: 470 },
  { time: '12:00', rover1: 950, rover2: 970, drone1: 1000, drone2: 980 },
  { time: '16:00', rover1: 600, rover2: 620, drone1: 640, drone2: 630 },
  { time: '20:00', rover1: 100, rover2: 95, drone1: 105, drone2: 98 },
];

export default function SensorCharts() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Suhu Saat Ini</h3>
          <div className="text-4xl font-bold text-red-600 mb-1">28.5°C</div>
          <p className="text-sm text-gray-600">Rata-rata dari 4 sensor</p>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">↑ 2.3°C</span>
            <span className="text-gray-500 ml-2">dari 6 jam lalu</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Kelembaban</h3>
          <div className="text-4xl font-bold text-blue-600 mb-1">65%</div>
          <p className="text-sm text-gray-600">Rata-rata dari 4 sensor</p>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-600">↓ 5%</span>
            <span className="text-gray-500 ml-2">dari 6 jam lalu</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Intensitas Cahaya</h3>
          <div className="text-4xl font-bold text-yellow-600 mb-1">850 lux</div>
          <p className="text-sm text-gray-600">Rata-rata dari 4 sensor</p>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">↑ 150 lux</span>
            <span className="text-gray-500 ml-2">dari 6 jam lalu</span>
          </div>
        </div>
      </div>

      {/* Temperature Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Grafik Suhu (24 Jam Terakhir)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={temperatureData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="rover1" stroke="#f59e0b" strokeWidth={2} name="Rover 1" />
            <Line type="monotone" dataKey="rover2" stroke="#ef4444" strokeWidth={2} name="Rover 2" />
            <Line type="monotone" dataKey="drone1" stroke="#3b82f6" strokeWidth={2} name="Drone 1" />
            <Line type="monotone" dataKey="drone2" stroke="#8b5cf6" strokeWidth={2} name="Drone 2" />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-amber-50 rounded-lg">
            <p className="text-sm text-gray-600">Rover 1</p>
            <p className="text-lg font-bold text-amber-600">29°C</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">Rover 2</p>
            <p className="text-lg font-bold text-red-600">30°C</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Drone 1</p>
            <p className="text-lg font-bold text-blue-600">31°C</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Drone 2</p>
            <p className="text-lg font-bold text-purple-600">30°C</p>
          </div>
        </div>
      </div>

      {/* Humidity Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Grafik Kelembaban (24 Jam Terakhir)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={humidityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis label={{ value: '%', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="rover1" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} name="Rover 1" />
            <Area type="monotone" dataKey="rover2" stackId="2" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} name="Rover 2" />
            <Area type="monotone" dataKey="drone1" stackId="3" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Drone 1" />
            <Area type="monotone" dataKey="drone2" stackId="4" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} name="Drone 2" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-cyan-50 rounded-lg">
            <p className="text-sm text-gray-600">Rover 1</p>
            <p className="text-lg font-bold text-cyan-600">62%</p>
          </div>
          <div className="text-center p-3 bg-sky-50 rounded-lg">
            <p className="text-sm text-gray-600">Rover 2</p>
            <p className="text-lg font-bold text-sky-600">64%</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Drone 1</p>
            <p className="text-lg font-bold text-blue-600">66%</p>
          </div>
          <div className="text-center p-3 bg-indigo-50 rounded-lg">
            <p className="text-sm text-gray-600">Drone 2</p>
            <p className="text-lg font-bold text-indigo-600">68%</p>
          </div>
        </div>
      </div>

      {/* Light Intensity Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Grafik Intensitas Cahaya (24 Jam Terakhir)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lightData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis label={{ value: 'lux', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="rover1" stroke="#facc15" strokeWidth={2} name="Rover 1" />
            <Line type="monotone" dataKey="rover2" stroke="#fbbf24" strokeWidth={2} name="Rover 2" />
            <Line type="monotone" dataKey="drone1" stroke="#f59e0b" strokeWidth={2} name="Drone 1" />
            <Line type="monotone" dataKey="drone2" stroke="#ea580c" strokeWidth={2} name="Drone 2" />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">Rover 1</p>
            <p className="text-lg font-bold text-yellow-600">830 lux</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">Rover 2</p>
            <p className="text-lg font-bold text-yellow-600">850 lux</p>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-lg">
            <p className="text-sm text-gray-600">Drone 1</p>
            <p className="text-lg font-bold text-amber-600">870 lux</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">Drone 2</p>
            <p className="text-lg font-bold text-orange-600">855 lux</p>
          </div>
        </div>
      </div>

      {/* Sensor Status */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Status Sensor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-green-200 rounded-xl bg-green-50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-800">Rover 1</h4>
              <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full">Online</span>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600">Lokasi: Area A - Sektor 3</p>
              <p className="text-gray-600">Baterai: 87%</p>
              <p className="text-gray-600">Last Update: 2 menit lalu</p>
            </div>
          </div>

          <div className="p-4 border border-green-200 rounded-xl bg-green-50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-800">Rover 2</h4>
              <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full">Online</span>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600">Lokasi: Area B - Sektor 1</p>
              <p className="text-gray-600">Baterai: 92%</p>
              <p className="text-gray-600">Last Update: 1 menit lalu</p>
            </div>
          </div>

          <div className="p-4 border border-green-200 rounded-xl bg-green-50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-800">Drone 1</h4>
              <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full">Online</span>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600">Lokasi: Aerial Scan - Zone C</p>
              <p className="text-gray-600">Baterai: 65%</p>
              <p className="text-gray-600">Last Update: 3 menit lalu</p>
            </div>
          </div>

          <div className="p-4 border border-yellow-200 rounded-xl bg-yellow-50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-800">Drone 2</h4>
              <span className="px-3 py-1 bg-yellow-500 text-white text-xs rounded-full">Charging</span>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600">Lokasi: Base Station</p>
              <p className="text-gray-600">Baterai: 45% (Charging)</p>
              <p className="text-gray-600">Last Update: 15 menit lalu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
