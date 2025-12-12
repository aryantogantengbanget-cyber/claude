'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sprout,
  Home,
  TrendingUp,
  Droplets,
  AlertTriangle,
  Grid3x3,
  Cpu,
  Thermometer,
  CloudRain,
  Sun,
  Activity
} from 'lucide-react';
import SensorCharts from '@/components/SensorCharts';
import FertilizerRecommendation from '@/components/FertilizerRecommendation';
import WaterSprayingMap from '@/components/WaterSprayingMap';
import DiseaseDetection from '@/components/DiseaseDetection';
import PlantingPattern from '@/components/PlantingPattern';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <Sprout className="w-8 h-8 text-amber-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-green-600 bg-clip-text text-transparent">
              AgriSmart AI
            </span>
          </Link>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-amber-50'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('sensors')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'sensors'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-amber-50'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Data Sensor</span>
            </button>

            <button
              onClick={() => setActiveTab('fertilizer')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'fertilizer'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-amber-50'
              }`}
            >
              <Cpu className="w-5 h-5" />
              <span>Rekomendasi Pupuk</span>
            </button>

            <button
              onClick={() => setActiveTab('watering')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'watering'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-amber-50'
              }`}
            >
              <Droplets className="w-5 h-5" />
              <span>Penyemprotan Air</span>
            </button>

            <button
              onClick={() => setActiveTab('disease')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'disease'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-amber-50'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Deteksi Penyakit</span>
            </button>

            <button
              onClick={() => setActiveTab('planting')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === 'planting'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-amber-50'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
              <span>Tata Tanam</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'sensors' && 'Data Sensor Real-time'}
            {activeTab === 'fertilizer' && 'Rekomendasi Pupuk AI'}
            {activeTab === 'watering' && 'Penyemprotan Air Presisi'}
            {activeTab === 'disease' && 'Deteksi Penyakit Tanaman'}
            {activeTab === 'planting' && 'Model Tata Tanam Optimal'}
          </h1>
          <p className="text-gray-600">
            {activeTab === 'overview' && 'Monitoring dan analisis pertanian presisi'}
            {activeTab === 'sensors' && 'Monitoring sensor dari rover dan drone'}
            {activeTab === 'fertilizer' && 'Analisis dan rekomendasi pemupukan'}
            {activeTab === 'watering' && 'Titik penyiraman berdasarkan kebutuhan'}
            {activeTab === 'disease' && 'Deteksi dini penyakit dengan AI'}
            {activeTab === 'planting' && 'Optimasi pola dan jarak tanam'}
          </p>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <Thermometer className="w-10 h-10" />
                  <Activity className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold mb-1">28.5°C</div>
                <div className="text-amber-100">Suhu Rata-rata</div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <CloudRain className="w-10 h-10" />
                  <Activity className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold mb-1">65%</div>
                <div className="text-blue-100">Kelembaban</div>
              </div>

              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <Sun className="w-10 h-10" />
                  <Activity className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold mb-1">850 lux</div>
                <div className="text-yellow-100">Intensitas Cahaya</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <Sprout className="w-10 h-10" />
                  <Activity className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold mb-1">95%</div>
                <div className="text-green-100">Kesehatan Tanaman</div>
              </div>
            </div>

            {/* Quick Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Status Perangkat</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Rover #1</span>
                    </div>
                    <span className="text-green-600 font-semibold">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Rover #2</span>
                    </div>
                    <span className="text-green-600 font-semibold">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Drone #1</span>
                    </div>
                    <span className="text-green-600 font-semibold">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-700">Drone #2</span>
                    </div>
                    <span className="text-yellow-600 font-semibold">Charging</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Notifikasi Terkini</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Area A siap panen</p>
                      <p className="text-xs text-gray-600">2 jam yang lalu</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Kelembaban rendah di Zona B</p>
                      <p className="text-xs text-gray-600">5 jam yang lalu</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Pemupukan selesai di Area C</p>
                      <p className="text-xs text-gray-600">1 hari yang lalu</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Aksi Cepat</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('sensors')}
                  className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl hover:shadow-md transition"
                >
                  <TrendingUp className="w-8 h-8 text-amber-600 mb-2" />
                  <p className="text-sm font-semibold text-gray-700">Lihat Sensor</p>
                </button>
                <button
                  onClick={() => setActiveTab('fertilizer')}
                  className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition"
                >
                  <Cpu className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-sm font-semibold text-gray-700">Cek Pupuk</p>
                </button>
                <button
                  onClick={() => setActiveTab('watering')}
                  className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition"
                >
                  <Droplets className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-sm font-semibold text-gray-700">Titik Air</p>
                </button>
                <button
                  onClick={() => setActiveTab('disease')}
                  className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl hover:shadow-md transition"
                >
                  <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
                  <p className="text-sm font-semibold text-gray-700">Deteksi Penyakit</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sensors Tab */}
        {activeTab === 'sensors' && <SensorCharts />}

        {/* Fertilizer Tab */}
        {activeTab === 'fertilizer' && <FertilizerRecommendation />}

        {/* Watering Tab */}
        {activeTab === 'watering' && <WaterSprayingMap />}

        {/* Disease Tab */}
        {activeTab === 'disease' && <DiseaseDetection />}

        {/* Planting Tab */}
        {activeTab === 'planting' && <PlantingPattern />}
      </main>
    </div>
  );
}
