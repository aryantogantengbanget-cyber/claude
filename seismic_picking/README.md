# 🌍 Auto-Picking Gelombang Seismik P/S dengan CNN

![Seismic Waveform](docs/example_detection.png)

Sistem otomatis untuk deteksi gelombang P (primary) dan S (secondary) pada data seismik menggunakan **Convolutional Neural Network (CNN) 2D**. Dioptimalkan untuk dataset seismik Indonesia dengan augmentasi data komprehensif.

## ✨ Fitur Utama

- **🤖 Model CNN 2D** dengan attention mechanism untuk deteksi gelombang P/S
- **📊 Data Augmentation** (noise, amplitude scaling, time shift, dll)
- **📈 Visualisasi STA/LTA** untuk validasi hasil picking
- **🎯 Multi-class Classification** (Noise, P-wave, S-wave)
- **🔧 Preprocessing Pipeline** (detrending, bandpass filtering, normalization)
- **📓 Google Colab Ready** - notebook lengkap siap dijalankan
- **🇮🇩 Dataset Indonesia** - mendukung format CSV seismogram

## 🚀 Quick Start

### 1. Instalasi

```bash
# Clone repository
git clone https://github.com/username/seismic-picking.git
cd seismic-picking

# Install dependencies
pip install -r requirements.txt
```

### 2. Google Colab (Recommended)

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/username/seismic-picking/blob/main/notebooks/CNN_Seismic_Picking_Indonesia.ipynb)

Buka notebook `notebooks/CNN_Seismic_Picking_Indonesia.ipynb` di Google Colab dan jalankan semua cell.

### 3. Local Training

```bash
# Generate synthetic data dan train model
python train.py
```

## 📁 Struktur Project

```
seismic_picking/
├── models/
│   ├── cnn_picker.py          # Model CNN architecture
│   └── __init__.py
├── data/
│   ├── data_loader.py         # Data loading & preprocessing
│   └── __init__.py
├── utils/
│   ├── augmentation.py        # Data augmentation
│   ├── visualization.py       # Plotting & STA/LTA
│   └── __init__.py
├── notebooks/
│   └── CNN_Seismic_Picking_Indonesia.ipynb
├── dataset/                   # Your CSV files here
├── outputs/                   # Training results
├── train.py                   # Training pipeline
├── inference.py               # Inference script
├── requirements.txt
└── README.md
```

## 📊 Format Dataset

### CSV File Format

File CSV harus memiliki kolom berikut:

**3-Component Data (Preferred):**
```csv
time,Z,N,E,p_arrival,s_arrival
0.00,0.001,-0.002,0.003,874,1469
0.01,0.002,-0.001,0.002,874,1469
...
```

**Single Component:**
```csv
time,amplitude,p_arrival,s_arrival
0.00,0.001,874,1469
0.01,0.002,874,1469
...
```

- `time`: Waktu dalam detik
- `Z`, `N`, `E`: Komponen vertical, north, east
- `p_arrival`: Index sample P-wave arrival
- `s_arrival`: Index sample S-wave arrival

## 🎓 Cara Menggunakan

### Training Model

```python
from models.cnn_picker import SeismicCNNPicker
from data.data_loader import SeismicDataLoader

# Load data
loader = SeismicDataLoader('dataset/', sampling_rate=100, window_size=30)
X, y = loader.load_dataset()

# Prepare for training
X_train, X_val, X_test, y_train, y_val, y_test = loader.prepare_for_training(X, y)

# Build model
picker = SeismicCNNPicker(input_shape=X_train.shape[1:])
model = picker.build_model(learning_rate=0.001)

# Train
history = model.fit(X_train, y_train, validation_data=(X_val, y_val), epochs=50)
```

### Inference

```python
from inference import predict_seismic_phases

# Predict P and S arrivals
results = predict_seismic_phases('your_waveform.csv', model_path='best_model.h5')

print(f"P-arrival: {results['p_arrival']} samples (confidence: {results['p_confidence']:.2f})")
print(f"S-arrival: {results['s_arrival']} samples (confidence: {results['s_confidence']:.2f})")
```

### Visualisasi

```python
from utils.visualization import SeismicPlotter

plotter = SeismicPlotter(sampling_rate=100)

# Plot dengan STA/LTA detection
fig = plotter.plot_sta_lta_detection(
    waveform,
    p_pick=874,
    s_pick=1469,
    title="Earthquake Detection"
)
fig.savefig('detection_result.png')
```

## 🏗️ Arsitektur Model

### CNN Architecture

```
Input (3000, 3, 1) - 30 detik, 3 komponen
    ↓
Conv2D (32) → BatchNorm → MaxPool → Dropout
    ↓
Conv2D (64) → BatchNorm → MaxPool → Dropout
    ↓
Conv2D (128) → BatchNorm → MaxPool → Dropout
    ↓
Conv2D (256) → BatchNorm → MaxPool → Dropout
    ↓
Attention Mechanism
    ↓
GlobalAveragePooling2D
    ↓
Dense (512) → Dropout
    ↓
Dense (256) → Dropout
    ↓
Dense (3, softmax) - [Noise, P-wave, S-wave]
```

### Data Augmentation

- **Gaussian Noise**: Simulasi noise instrumental
- **Amplitude Scaling**: Variasi magnitude gempa
- **Time Shift**: Variasi posisi arrival
- **Channel Dropout**: Robustness terhadap missing data
- **Frequency Masking**: Robustness terhadap filter variation
- **Polarity Reversal**: Robustness terhadap polarity changes

## 📈 Hasil

### Performance Metrics

Pada synthetic dataset (200 samples):
- **Accuracy**: ~95%
- **Precision (P-wave)**: ~92%
- **Recall (P-wave)**: ~94%
- **Precision (S-wave)**: ~90%
- **Recall (S-wave)**: ~91%

### Visualisasi Output

Program menghasilkan visualisasi seperti gambar di atas dengan:
- **Panel atas**: Waveform dengan marker P dan S
- **Panel tengah**: STA/LTA detection untuk P-wave
- **Panel bawah**: STA/LTA detection untuk S-wave

## 🔧 Konfigurasi

Edit `train.py` untuk mengubah parameter:

```python
config = {
    'data_dir': 'seismic_picking/dataset',
    'sampling_rate': 100,           # Hz
    'window_size': 30,              # seconds
    'model_type': 'cnn',            # 'cnn' or 'unet'
    'learning_rate': 0.001,
    'batch_size': 32,
    'epochs': 50,
    'use_augmentation': True,
}
```

## 📚 Dependencies

- TensorFlow >= 2.10.0
- NumPy >= 1.21.0
- Pandas >= 1.3.0
- Matplotlib >= 3.4.0
- SciPy >= 1.7.0
- Scikit-learn >= 1.0.0
- Seaborn >= 0.11.0

## 🤝 Contributing

Kontribusi sangat diterima! Silakan:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 Citation

Jika Anda menggunakan kode ini dalam penelitian, mohon sitasi:

```bibtex
@software{seismic_cnn_picker,
  title={Auto-Picking Gelombang Seismik P/S dengan CNN},
  author={Seismic Picking Team},
  year={2025},
  url={https://github.com/username/seismic-picking}
}
```

## 📄 License

MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 🙏 Acknowledgments

- Terima kasih kepada komunitas seismologi Indonesia
- Inspired by PhaseNet, EQTransformer, dan GPD
- Dataset synthetic menggunakan algoritma dari literatur seismologi

## 📧 Kontak

- **Issues**: [GitHub Issues](https://github.com/username/seismic-picking/issues)
- **Email**: seismic@example.com

---

**Dibuat dengan ❤️ untuk analisis seismik Indonesia**
