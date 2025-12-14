1. Arsitektur Model CNN (seismic_picking/models/cnn_picker.py)

    SeismicCNNPicker: CNN 2D dengan 4 blok konvolusi + attention mechanism
    UNetPicker: Arsitektur U-Net untuk pixel-wise detection
    Support untuk classification dan regression model

2. Data Processing (seismic_picking/data/data_loader.py)

    SeismicDataLoader: Load dan preprocess CSV seismogram
    SyntheticDataGenerator: Generate data synthetic untuk testing
    Preprocessing: detrending, bandpass filter (1-20 Hz), normalisasi
    Windowing dengan overlap untuk training

3. Data Augmentation (seismic_picking/utils/augmentation.py)

    Gaussian noise injection
    Amplitude scaling (0.7-1.3x)
    Time shift
    Channel dropout
    Frequency masking
    Polarity reversal
    Custom data generator dengan augmentasi on-the-fly

4. Visualisasi & Analisis (seismic_picking/utils/visualization.py)

    STALTADetector: Classic STA/LTA untuk validasi
    SeismicPlotter: Plot waveform + STA/LTA detection (seperti gambar contoh)
    Plot 3-component seismogram
    Confusion matrix dan training history
    Comparison plot (true vs predicted picks)

5. Training Pipeline (seismic_picking/train.py)

    Pipeline lengkap end-to-end
    Auto-generate synthetic data jika dataset kosong
    Training dengan augmentation
    Callbacks: EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
    Auto-save hasil (model, plots, metadata)

6. Inference Script (seismic_picking/inference.py)

    Command-line interface untuk prediksi
    Support CSV input
    Auto-visualisasi hasil
    Export hasil ke JSON

7. Google Colab Notebook (seismic_picking/notebooks/CNN_Seismic_Picking_Indonesia.ipynb)

    Notebook lengkap siap pakai
    Step-by-step dari data loading sampai testing
    Visualisasi interaktif
    Dokumentasi lengkap dalam Bahasa Indonesia

🚀 Cara Menggunakan
Option 1: Google Colab (Recommended)

    Upload notebook seismic_picking/notebooks/CNN_Seismic_Picking_Indonesia.ipynb ke Google Colab
    Jalankan semua cell secara berurutan
    Upload dataset CSV Anda atau gunakan synthetic data
    Model akan otomatis ter-train dan menghasilkan visualisasi

Option 2: Local Training

# Install dependencies
cd seismic_picking
pip install -r requirements.txt

# Training (akan generate synthetic data jika dataset kosong)
python train.py

Output akan tersimpan di seismic_picking/outputs/:

    best_model.h5 - Model terbaik
    training_history.png - Plot loss & accuracy
    confusion_matrix.png - Confusion matrix
    test_waveform_detection.png - Visualisasi seperti gambar contoh Anda

Option 3: Inference pada Data Baru

# Prediksi dengan model yang sudah di-train
python inference.py your_waveform.csv --model best_model.h5

# Hasilnya akan tersimpan di outputs/

📊 Format Dataset CSV

Siapkan file CSV dengan format:

time,Z,N,E,p_arrival,s_arrival
0.00,0.001,-0.002,0.003,874,1469
0.01,0.002,-0.001,0.002,874,1469
...

Keterangan:

    time: Waktu dalam detik
    Z, N, E: Komponen vertical, north, east (normalized)
    p_arrival: Index sample P-wave arrival
    s_arrival: Index sample S-wave arrival

🎯 Fitur Utama

✅ Model CNN 2D dengan attention mechanism
✅ Data augmentation komprehensif (8 teknik berbeda)
✅ Visualisasi STA/LTA untuk validasi (seperti gambar contoh)
✅ Multi-class classification (Noise, P-wave, S-wave)
✅ Support dataset Indonesia dari folder CSV
✅ Google Colab ready - notebook lengkap
✅ Synthetic data generator untuk testing
✅ Inference script dengan CLI
📈 Output Visualisasi

Program menghasilkan visualisasi persis seperti gambar yang Anda berikan:

    Panel atas: Seismic Waveform dengan marker P dan S
    Panel tengah: P-wave Detection (STA/LTA)
    Panel bawah: S-wave Detection (STA/LTA)

File: seismic_picking/outputs/test_waveform_detection.png
📁 Struktur File

seismic_picking/
├── models/
│   ├── cnn_picker.py          # Arsitektur CNN & U-Net
│   └── __init__.py
├── data/
│   ├── data_loader.py         # Data loading & preprocessing
│   └── __init__.py
├── utils/
│   ├── augmentation.py        # Data augmentation
│   ├── visualization.py       # STA/LTA & plotting
│   └── __init__.py
├── notebooks/
│   └── CNN_Seismic_Picking_Indonesia.ipynb
├── dataset/                   # Letakkan CSV di sini
├── outputs/                   # Hasil training & visualisasi
├── train.py                   # Training pipeline
├── inference.py               # Inference script
├── requirements.txt
└── README.md                  # Dokumentasi lengkap

🔧 Konfigurasi Training

Edit parameter di train.py:

config = {
    'data_dir': 'seismic_picking/dataset',
    'sampling_rate': 100,           # Hz
    'window_size': 30,              # detik
    'model_type': 'cnn',            # atau 'unet'
    'learning_rate': 0.001,
    'batch_size': 32,
    'epochs': 50,
    'use_augmentation': True,
}
