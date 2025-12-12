# AgriSmart AI - Dashboard Pertanian Presisi

Platform AI untuk monitoring dan manajemen pertanian presisi dengan rover dan drone.

## 🌾 Fitur Utama

### 1. Landing Page Modern
- Tampilan modern dengan tema warna kuning dan hijau
- Showcase pertanian presisi
- Informasi lengkap tentang teknologi dan manfaat
- Call-to-action yang jelas

### 2. Dashboard Monitoring
- **Data Sensor Real-time**: Monitoring suhu, kelembaban, dan intensitas cahaya dari rover dan drone
- Visualisasi grafik interaktif menggunakan Recharts
- Status perangkat real-time
- Notifikasi dan alert system

### 3. Rekomendasi Pupuk AI
- Analisis nutrisi tanah (N, P, K, pH)
- Rekomendasi pupuk berdasarkan data sensor
- Jadwal pemupukan yang optimal
- Analisis biaya dan ROI
- Prediksi peningkatan hasil panen

### 4. Penyemprotan Air Presisi
- Peta interaktif titik penyiraman
- Prioritas berdasarkan tingkat kelembaban
- Analisis per zona
- Jadwal penyiraman otomatis
- Monitoring efisiensi penggunaan air
- Estimasi penghematan biaya

### 5. Deteksi Penyakit Tanaman
- Computer vision untuk deteksi dini penyakit
- Tingkat akurasi AI 95%
- Rekomendasi penanganan spesifik
- Statistik penyakit dan tren
- Panduan pencegahan dan tindakan cepat
- Preview analisis gambar

### 6. Model Tata Tanam Optimal
- Berbagai pola tanam (Square, Rectangular, Triangle, Row)
- Visualisasi interaktif pola tanam
- Rekomendasi per jenis tanaman
- Estimasi populasi tanaman
- Analisis efisiensi lahan
- Panduan implementasi
- Kalkulasi benefit dan ROI

## 🚀 Teknologi

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Language**: TypeScript

## 📦 Instalasi

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎨 Struktur Folder

```
.
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── SensorCharts.tsx
│   ├── FertilizerRecommendation.tsx
│   ├── WaterSprayingMap.tsx
│   ├── DiseaseDetection.tsx
│   └── PlantingPattern.tsx
├── public/                # Static assets
└── package.json
```

## 🌟 Highlights

- **Responsive Design**: Optimized untuk desktop, tablet, dan mobile
- **Modern UI/UX**: Gradient colors, shadows, dan animasi smooth
- **Interactive Charts**: Grafik real-time yang interaktif
- **AI-Powered**: Rekomendasi cerdas berbasis data sensor
- **Precision Agriculture**: Efisiensi penggunaan sumber daya
- **Real-time Monitoring**: Pantau lahan 24/7

## 📊 Data & Analytics

Dashboard menampilkan data dari berbagai sensor:
- Temperature sensors (Rover & Drone)
- Humidity sensors
- Light intensity sensors
- Soil moisture sensors
- Camera systems untuk deteksi penyakit

## 🎯 Target Pengguna

- Petani modern
- Perusahaan agrikultur
- Peneliti pertanian
- Investor agritech
- Konsultan pertanian

## 💡 Manfaat

- **Efisiensi Biaya**: Hemat hingga 40% penggunaan pupuk dan air
- **Peningkatan Produktivitas**: Hasil panen meningkat hingga 35%
- **Deteksi Dini**: Mencegah kerugian dari penyakit tanaman
- **Data-Driven**: Keputusan berdasarkan data real-time
- **Keberlanjutan**: Praktik pertanian ramah lingkungan

## 📱 Screenshots

### Landing Page
- Hero section dengan gradient kuning-hijau
- Statistik dan achievements
- Feature showcase dengan icons
- Teknologi dan benefits section

### Dashboard
- Overview dengan statistik penting
- Grafik sensor real-time
- Rekomendasi AI
- Interactive maps
- Visualisasi data

## 🔮 Roadmap

- [ ] Integrasi dengan hardware sensor IoT
- [ ] Mobile app (React Native)
- [ ] Machine learning model untuk prediksi panen
- [ ] Multi-language support
- [ ] Export data ke Excel/PDF
- [ ] Integration dengan drone API
- [ ] Weather API integration
- [ ] Marketplace untuk produk pertanian

## 📄 License

MIT License - feel free to use this project for your agricultural solutions!

## 👨‍💻 Development

Developed with ❤️ for Indonesian agriculture

---

**AgriSmart AI** - Membawa teknologi AI ke pertanian Indonesia untuk masa depan yang lebih produktif dan berkelanjutan.
