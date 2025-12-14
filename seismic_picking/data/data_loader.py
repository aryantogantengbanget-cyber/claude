"""
Data Loading and Preprocessing for Seismic Dataset
Supports CSV format with Indonesian seismic data
"""

import os
import numpy as np
import pandas as pd
from scipy import signal
from sklearn.model_selection import train_test_split
import glob


class SeismicDataLoader:
    """
    Load and preprocess seismic data from CSV files
    """

    def __init__(self, data_dir, sampling_rate=100, window_size=30):
        """
        Args:
            data_dir: Directory containing CSV files
            sampling_rate: Sampling rate in Hz (default 100 Hz)
            window_size: Window size in seconds (default 30s)
        """
        self.data_dir = data_dir
        self.sampling_rate = sampling_rate
        self.window_size = window_size
        self.n_samples = int(sampling_rate * window_size)

    def load_csv_file(self, filepath):
        """
        Load single CSV file containing seismic waveform
        Expected columns: time, Z, N, E, p_arrival, s_arrival
        or: time, amplitude, p_arrival, s_arrival (single channel)
        """
        try:
            df = pd.read_csv(filepath)

            # Check available columns
            if 'Z' in df.columns and 'N' in df.columns and 'E' in df.columns:
                # 3-component data
                waveform = df[['Z', 'N', 'E']].values
            elif 'amplitude' in df.columns:
                # Single component - replicate to 3 channels
                amp = df['amplitude'].values.reshape(-1, 1)
                waveform = np.repeat(amp, 3, axis=1)
            else:
                # Use first 3 numeric columns
                numeric_cols = df.select_dtypes(include=[np.number]).columns
                if len(numeric_cols) >= 3:
                    waveform = df[numeric_cols[:3]].values
                else:
                    waveform = df[numeric_cols].values
                    # Pad if less than 3 channels
                    if waveform.shape[1] < 3:
                        padding = np.zeros((waveform.shape[0], 3 - waveform.shape[1]))
                        waveform = np.hstack([waveform, padding])

            # Get P and S arrival times (in samples or seconds)
            p_arrival = df['p_arrival'].iloc[0] if 'p_arrival' in df.columns else None
            s_arrival = df['s_arrival'].iloc[0] if 's_arrival' in df.columns else None

            return waveform, p_arrival, s_arrival

        except Exception as e:
            print(f"Error loading {filepath}: {e}")
            return None, None, None

    def preprocess_waveform(self, waveform, apply_filter=True):
        """
        Preprocess seismic waveform
        - Detrend
        - Bandpass filter
        - Normalize
        """
        if waveform is None:
            return None

        processed = waveform.copy()

        # Detrend each channel
        for i in range(processed.shape[1]):
            processed[:, i] = signal.detrend(processed[:, i])

        # Bandpass filter (1-20 Hz typical for local earthquakes)
        if apply_filter:
            nyquist = self.sampling_rate / 2
            low = 1.0 / nyquist
            high = 20.0 / nyquist
            b, a = signal.butter(4, [low, high], btype='band')

            for i in range(processed.shape[1]):
                processed[:, i] = signal.filtfilt(b, a, processed[:, i])

        # Normalize each channel
        for i in range(processed.shape[1]):
            max_val = np.max(np.abs(processed[:, i]))
            if max_val > 0:
                processed[:, i] = processed[:, i] / max_val

        return processed

    def create_windows(self, waveform, p_arrival, s_arrival, overlap=0.5):
        """
        Create sliding windows from waveform
        Returns windows with labels
        """
        windows = []
        labels = []

        if waveform is None:
            return np.array([]), np.array([])

        # Calculate step size
        step = int(self.n_samples * (1 - overlap))

        # Generate windows
        for start in range(0, len(waveform) - self.n_samples + 1, step):
            end = start + self.n_samples
            window = waveform[start:end, :]

            # Determine label based on P and S arrivals
            window_center = (start + end) / 2

            if p_arrival is not None and s_arrival is not None:
                if abs(window_center - p_arrival) < self.n_samples / 4:
                    label = 1  # P-wave
                elif abs(window_center - s_arrival) < self.n_samples / 4:
                    label = 2  # S-wave
                else:
                    label = 0  # Noise
            else:
                label = 0  # Unknown/Noise

            windows.append(window)
            labels.append(label)

        return np.array(windows), np.array(labels)

    def create_arrival_labels(self, waveform_length, p_arrival, s_arrival):
        """
        Create pixel-wise labels for U-Net style models
        Returns: (time_samples, 3) array with probabilities for [Noise, P, S]
        """
        labels = np.zeros((waveform_length, 3))

        # Default to noise
        labels[:, 0] = 1.0

        # Create Gaussian distributions around arrivals
        sigma = self.sampling_rate * 0.5  # 0.5 second spread

        if p_arrival is not None:
            p_idx = int(p_arrival)
            for i in range(waveform_length):
                prob = np.exp(-0.5 * ((i - p_idx) / sigma) ** 2)
                labels[i, 1] = prob
                labels[i, 0] = max(0, labels[i, 0] - prob)

        if s_arrival is not None:
            s_idx = int(s_arrival)
            for i in range(waveform_length):
                prob = np.exp(-0.5 * ((i - s_idx) / sigma) ** 2)
                labels[i, 2] = prob
                labels[i, 0] = max(0, labels[i, 0] - prob)

        # Normalize
        labels = labels / (labels.sum(axis=1, keepdims=True) + 1e-10)

        return labels

    def load_dataset(self, max_files=None):
        """
        Load entire dataset from directory
        Returns: X (waveforms), y (labels), metadata
        """
        csv_files = glob.glob(os.path.join(self.data_dir, '*.csv'))

        if max_files:
            csv_files = csv_files[:max_files]

        print(f"Found {len(csv_files)} CSV files")

        all_windows = []
        all_labels = []
        metadata = []

        for idx, filepath in enumerate(csv_files):
            if idx % 100 == 0:
                print(f"Processing file {idx + 1}/{len(csv_files)}")

            waveform, p_arrival, s_arrival = self.load_csv_file(filepath)

            if waveform is None:
                continue

            # Preprocess
            waveform = self.preprocess_waveform(waveform)

            # Create windows
            windows, labels = self.create_windows(waveform, p_arrival, s_arrival)

            all_windows.extend(windows)
            all_labels.extend(labels)

            metadata.append({
                'filename': os.path.basename(filepath),
                'p_arrival': p_arrival,
                's_arrival': s_arrival,
                'n_windows': len(windows)
            })

        X = np.array(all_windows)
        y = np.array(all_labels)

        print(f"Loaded dataset shape: X={X.shape}, y={y.shape}")

        return X, y, metadata

    def prepare_for_training(self, X, y, test_size=0.2, val_size=0.1):
        """
        Prepare data for training
        Returns: X_train, X_val, X_test, y_train, y_val, y_test
        """
        # Reshape for CNN: (samples, time, channels, 1)
        X = X.reshape(X.shape[0], X.shape[1], X.shape[2], 1)

        # Convert labels to categorical
        from tensorflow.keras.utils import to_categorical
        y_cat = to_categorical(y, num_classes=3)

        # First split: train+val and test
        X_temp, X_test, y_temp, y_test = train_test_split(
            X, y_cat, test_size=test_size, random_state=42, stratify=y
        )

        # Second split: train and val
        val_ratio = val_size / (1 - test_size)
        X_train, X_val, y_train, y_val = train_test_split(
            X_temp, y_temp, test_size=val_ratio, random_state=42
        )

        print(f"Training set: {X_train.shape}")
        print(f"Validation set: {X_val.shape}")
        print(f"Test set: {X_test.shape}")

        return X_train, X_val, X_test, y_train, y_val, y_test


class SyntheticDataGenerator:
    """
    Generate synthetic seismic data for testing
    """

    def __init__(self, sampling_rate=100):
        self.sampling_rate = sampling_rate

    def generate_synthetic_waveform(self, duration=30, p_time=8.74, s_time=14.69):
        """
        Generate synthetic seismic waveform with P and S arrivals
        """
        n_samples = int(duration * self.sampling_rate)
        time = np.linspace(0, duration, n_samples)

        # Initialize waveform
        waveform = np.zeros((n_samples, 3))

        # Add noise
        noise_level = 0.1
        waveform += np.random.normal(0, noise_level, (n_samples, 3))

        # P-wave arrival
        p_idx = int(p_time * self.sampling_rate)
        p_freq = 8  # Hz
        p_duration = 3  # seconds
        p_envelope = signal.windows.tukey(int(p_duration * self.sampling_rate), alpha=0.5)
        p_signal = p_envelope * np.sin(2 * np.pi * p_freq * np.linspace(0, p_duration, len(p_envelope)))

        # Add P-wave (primarily on Z component)
        end_idx = min(p_idx + len(p_signal), n_samples)
        waveform[p_idx:end_idx, 0] += p_signal[:end_idx - p_idx] * 0.3

        # S-wave arrival
        s_idx = int(s_time * self.sampling_rate)
        s_freq = 4  # Hz
        s_duration = 8  # seconds
        s_envelope = signal.windows.tukey(int(s_duration * self.sampling_rate), alpha=0.3)
        s_signal = s_envelope * np.sin(2 * np.pi * s_freq * np.linspace(0, s_duration, len(s_envelope)))

        # Add S-wave (all components, stronger on horizontals)
        end_idx = min(s_idx + len(s_signal), n_samples)
        waveform[s_idx:end_idx, 0] += s_signal[:end_idx - s_idx] * 0.5
        waveform[s_idx:end_idx, 1] += s_signal[:end_idx - s_idx] * 0.7
        waveform[s_idx:end_idx, 2] += s_signal[:end_idx - s_idx] * 0.7

        return time, waveform, p_idx, s_idx

    def save_synthetic_csv(self, output_dir, n_samples=100):
        """
        Generate and save synthetic dataset
        """
        os.makedirs(output_dir, exist_ok=True)

        for i in range(n_samples):
            # Randomize P and S times
            p_time = np.random.uniform(5, 15)
            s_time = p_time + np.random.uniform(3, 10)
            duration = max(30, s_time + 10)

            time, waveform, p_idx, s_idx = self.generate_synthetic_waveform(
                duration=duration, p_time=p_time, s_time=s_time
            )

            # Create DataFrame
            df = pd.DataFrame({
                'time': time,
                'Z': waveform[:, 0],
                'N': waveform[:, 1],
                'E': waveform[:, 2],
                'p_arrival': p_idx,
                's_arrival': s_idx
            })

            # Save to CSV
            filename = os.path.join(output_dir, f'synthetic_event_{i:04d}.csv')
            df.to_csv(filename, index=False)

        print(f"Generated {n_samples} synthetic seismograms in {output_dir}")
