"""
Data Augmentation Techniques for Seismic Waveforms
Enhances model robustness and generalization
"""

import numpy as np
from scipy import signal
import tensorflow as tf


class SeismicAugmentor:
    """
    Augmentation techniques specifically designed for seismic data
    """

    def __init__(self, augmentation_prob=0.5):
        """
        Args:
            augmentation_prob: Probability of applying each augmentation
        """
        self.prob = augmentation_prob

    def add_noise(self, waveform, noise_level=0.05):
        """
        Add Gaussian noise to waveform
        """
        if np.random.random() < self.prob:
            noise = np.random.normal(0, noise_level, waveform.shape)
            return waveform + noise
        return waveform

    def amplitude_scaling(self, waveform, scale_range=(0.8, 1.2)):
        """
        Random amplitude scaling
        """
        if np.random.random() < self.prob:
            scale = np.random.uniform(*scale_range)
            return waveform * scale
        return waveform

    def time_shift(self, waveform, max_shift=50):
        """
        Random time shift (circular shift)
        """
        if np.random.random() < self.prob:
            shift = np.random.randint(-max_shift, max_shift)
            return np.roll(waveform, shift, axis=0)
        return waveform

    def channel_dropout(self, waveform, dropout_prob=0.2):
        """
        Randomly zero out one channel
        """
        if np.random.random() < self.prob:
            channel = np.random.randint(0, waveform.shape[1])
            waveform_aug = waveform.copy()
            waveform_aug[:, channel] = 0
            return waveform_aug
        return waveform

    def add_spikes(self, waveform, n_spikes=3, spike_amplitude=0.5):
        """
        Add random spikes (simulating instrumental noise)
        """
        if np.random.random() < self.prob:
            waveform_aug = waveform.copy()
            for _ in range(n_spikes):
                spike_idx = np.random.randint(0, len(waveform))
                channel = np.random.randint(0, waveform.shape[1])
                waveform_aug[spike_idx, channel] += np.random.uniform(-spike_amplitude, spike_amplitude)
            return waveform_aug
        return waveform

    def apply_gap(self, waveform, gap_length=50):
        """
        Simulate data gaps
        """
        if np.random.random() < self.prob:
            waveform_aug = waveform.copy()
            gap_start = np.random.randint(0, len(waveform) - gap_length)
            waveform_aug[gap_start:gap_start + gap_length, :] = 0
            return waveform_aug
        return waveform

    def frequency_masking(self, waveform, sampling_rate=100, mask_freq_range=(5, 10)):
        """
        Mask specific frequency band
        """
        if np.random.random() < self.prob:
            waveform_aug = waveform.copy()
            nyquist = sampling_rate / 2

            # Random frequency to mask
            low_freq = np.random.uniform(*mask_freq_range)
            high_freq = low_freq + np.random.uniform(1, 5)

            # Create notch filter
            low = low_freq / nyquist
            high = min(high_freq / nyquist, 0.99)

            b, a = signal.butter(2, [low, high], btype='bandstop')

            for i in range(waveform_aug.shape[1]):
                waveform_aug[:, i] = signal.filtfilt(b, a, waveform_aug[:, i])

            return waveform_aug
        return waveform

    def polarity_reversal(self, waveform):
        """
        Reverse polarity of random channels
        """
        if np.random.random() < self.prob:
            waveform_aug = waveform.copy()
            for i in range(waveform.shape[1]):
                if np.random.random() < 0.5:
                    waveform_aug[:, i] *= -1
            return waveform_aug
        return waveform

    def apply_all_augmentations(self, waveform, sampling_rate=100):
        """
        Apply random combination of augmentations
        """
        waveform_aug = waveform.copy()

        # Apply augmentations in random order
        augmentations = [
            lambda x: self.add_noise(x, noise_level=np.random.uniform(0.01, 0.1)),
            lambda x: self.amplitude_scaling(x, scale_range=(0.7, 1.3)),
            lambda x: self.time_shift(x, max_shift=int(sampling_rate * 0.5)),
            lambda x: self.channel_dropout(x),
            lambda x: self.add_spikes(x, n_spikes=np.random.randint(1, 5)),
            lambda x: self.apply_gap(x, gap_length=np.random.randint(10, 100)),
            lambda x: self.frequency_masking(x, sampling_rate),
            lambda x: self.polarity_reversal(x)
        ]

        # Shuffle and apply subset of augmentations
        np.random.shuffle(augmentations)
        n_augmentations = np.random.randint(1, 4)

        for aug_func in augmentations[:n_augmentations]:
            waveform_aug = aug_func(waveform_aug)

        return waveform_aug


class TensorflowDataAugmentation:
    """
    Data augmentation using TensorFlow for GPU acceleration
    """

    @staticmethod
    def augment_batch(waveforms, labels, augmentation_prob=0.5):
        """
        Apply augmentation to a batch during training
        """

        def augment(waveform, label):
            # Random noise
            if tf.random.uniform([]) < augmentation_prob:
                noise = tf.random.normal(tf.shape(waveform), stddev=0.05)
                waveform = waveform + noise

            # Random amplitude scaling
            if tf.random.uniform([]) < augmentation_prob:
                scale = tf.random.uniform([], 0.8, 1.2)
                waveform = waveform * scale

            # Random time shift
            if tf.random.uniform([]) < augmentation_prob:
                shift = tf.random.uniform([], -50, 50, dtype=tf.int32)
                waveform = tf.roll(waveform, shift, axis=0)

            return waveform, label

        return tf.map_fn(lambda x: augment(x[0], x[1]),
                        (waveforms, labels),
                        dtype=(tf.float32, tf.float32))


class MixupAugmentation:
    """
    Mixup augmentation for better generalization
    """

    def __init__(self, alpha=0.2):
        """
        Args:
            alpha: Beta distribution parameter for mixup
        """
        self.alpha = alpha

    def mixup(self, x1, x2, y1, y2):
        """
        Perform mixup on two samples
        """
        lambda_param = np.random.beta(self.alpha, self.alpha)

        x_mixed = lambda_param * x1 + (1 - lambda_param) * x2
        y_mixed = lambda_param * y1 + (1 - lambda_param) * y2

        return x_mixed, y_mixed

    def mixup_batch(self, X_batch, y_batch):
        """
        Apply mixup to entire batch
        """
        batch_size = len(X_batch)
        indices = np.random.permutation(batch_size)

        X_mixed = []
        y_mixed = []

        for i in range(batch_size):
            x_mix, y_mix = self.mixup(
                X_batch[i], X_batch[indices[i]],
                y_batch[i], y_batch[indices[i]]
            )
            X_mixed.append(x_mix)
            y_mixed.append(y_mix)

        return np.array(X_mixed), np.array(y_mixed)


class CustomDataGenerator(tf.keras.utils.Sequence):
    """
    Custom data generator with on-the-fly augmentation
    """

    def __init__(self, X, y, batch_size=32, augmentor=None, shuffle=True):
        """
        Args:
            X: Input data
            y: Labels
            batch_size: Batch size
            augmentor: SeismicAugmentor instance
            shuffle: Whether to shuffle data
        """
        self.X = X
        self.y = y
        self.batch_size = batch_size
        self.augmentor = augmentor
        self.shuffle = shuffle
        self.indices = np.arange(len(X))

        if self.shuffle:
            np.random.shuffle(self.indices)

    def __len__(self):
        """Number of batches per epoch"""
        return int(np.ceil(len(self.X) / self.batch_size))

    def __getitem__(self, idx):
        """Get batch at index idx"""
        batch_indices = self.indices[idx * self.batch_size:(idx + 1) * self.batch_size]

        X_batch = self.X[batch_indices]
        y_batch = self.y[batch_indices]

        # Apply augmentation
        if self.augmentor is not None:
            X_augmented = []
            for x in X_batch:
                # Remove extra dimension for augmentation
                x_squeeze = np.squeeze(x, axis=-1)
                x_aug = self.augmentor.apply_all_augmentations(x_squeeze)
                # Add dimension back
                x_aug = np.expand_dims(x_aug, axis=-1)
                X_augmented.append(x_aug)
            X_batch = np.array(X_augmented)

        return X_batch, y_batch

    def on_epoch_end(self):
        """Shuffle indices after each epoch"""
        if self.shuffle:
            np.random.shuffle(self.indices)
