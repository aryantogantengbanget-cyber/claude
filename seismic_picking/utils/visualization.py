"""
Visualization and Analysis Tools for Seismic Picking
Includes STA/LTA detector and plotting functions
"""

import numpy as np
import matplotlib.pyplot as plt
from scipy import signal
import matplotlib.gridspec as gridspec


class STALTADetector:
    """
    Classic STA/LTA (Short-Term Average / Long-Term Average) detector
    for seismic phase picking validation
    """

    def __init__(self, sampling_rate=100):
        """
        Args:
            sampling_rate: Sampling rate in Hz
        """
        self.sampling_rate = sampling_rate

    def compute_sta_lta(self, waveform, sta_window=0.5, lta_window=5.0):
        """
        Compute STA/LTA characteristic function

        Args:
            waveform: 1D array of seismic data
            sta_window: Short-term window in seconds
            lta_window: Long-term window in seconds

        Returns:
            sta_lta: STA/LTA ratio array
        """
        # Convert to samples
        nsta = int(sta_window * self.sampling_rate)
        nlta = int(lta_window * self.sampling_rate)

        # Square the waveform
        waveform_sq = waveform ** 2

        # Compute STA (short-term average)
        sta = np.convolve(waveform_sq, np.ones(nsta) / nsta, mode='same')

        # Compute LTA (long-term average)
        lta = np.convolve(waveform_sq, np.ones(nlta) / nlta, mode='same')

        # Compute ratio (avoid division by zero)
        sta_lta = np.divide(sta, lta, where=lta != 0)
        sta_lta[lta == 0] = 0

        return sta_lta

    def detect_arrival(self, waveform, threshold=4.0, sta_window=0.5, lta_window=5.0):
        """
        Detect phase arrival using STA/LTA

        Returns:
            arrival_time: Sample index of detected arrival (or None)
            sta_lta: STA/LTA characteristic function
        """
        sta_lta = self.compute_sta_lta(waveform, sta_window, lta_window)

        # Find first crossing of threshold
        above_threshold = np.where(sta_lta > threshold)[0]

        if len(above_threshold) > 0:
            return above_threshold[0], sta_lta
        else:
            return None, sta_lta


class SeismicPlotter:
    """
    Visualization tools for seismic waveforms and picking results
    """

    def __init__(self, sampling_rate=100):
        self.sampling_rate = sampling_rate

    def plot_waveform_with_picks(self, waveform, time=None, p_pick=None, s_pick=None,
                                 p_pred=None, s_pred=None, title="Seismic Waveform",
                                 component=0):
        """
        Plot seismic waveform with P and S picks

        Args:
            waveform: Waveform array (time, channels)
            time: Time array (optional)
            p_pick: True P arrival time
            s_pick: True S arrival time
            p_pred: Predicted P arrival time
            s_pred: Predicted S arrival time
            component: Which component to plot (0=Z, 1=N, 2=E)
        """
        if time is None:
            time = np.arange(len(waveform)) / self.sampling_rate

        plt.figure(figsize=(14, 6))

        # Select component
        if len(waveform.shape) > 1:
            trace = waveform[:, component]
        else:
            trace = waveform

        plt.plot(time, trace, 'k-', linewidth=0.5, label='Waveform')

        # Plot true picks
        if p_pick is not None:
            p_time = p_pick / self.sampling_rate if isinstance(p_pick, (int, np.integer)) else p_pick
            plt.axvline(p_time, color='blue', linestyle='--', linewidth=2, label=f'P: {p_time:.2f}s')

        if s_pick is not None:
            s_time = s_pick / self.sampling_rate if isinstance(s_pick, (int, np.integer)) else s_pick
            plt.axvline(s_time, color='red', linestyle='--', linewidth=2, label=f'S: {s_time:.2f}s')

        # Plot predicted picks
        if p_pred is not None:
            p_pred_time = p_pred / self.sampling_rate if isinstance(p_pred, (int, np.integer)) else p_pred
            plt.axvline(p_pred_time, color='cyan', linestyle=':', linewidth=2, label=f'P pred: {p_pred_time:.2f}s')

        if s_pred is not None:
            s_pred_time = s_pred / self.sampling_rate if isinstance(s_pred, (int, np.integer)) else s_pred
            plt.axvline(s_pred_time, color='orange', linestyle=':', linewidth=2, label=f'S pred: {s_pred_time:.2f}s')

        plt.xlabel('Time (s)', fontsize=12)
        plt.ylabel('Amplitude', fontsize=12)
        plt.title(title, fontsize=14, fontweight='bold')
        plt.legend(loc='upper right')
        plt.grid(True, alpha=0.3)
        plt.tight_layout()

        return plt.gcf()

    def plot_sta_lta_detection(self, waveform, p_pick=None, s_pick=None, title="Seismic Analysis"):
        """
        Create comprehensive plot with waveform and STA/LTA detection
        Similar to the example image provided
        """
        if len(waveform.shape) > 1:
            trace_z = waveform[:, 0]
        else:
            trace_z = waveform

        time = np.arange(len(trace_z)) / self.sampling_rate

        # Initialize detector
        detector = STALTADetector(self.sampling_rate)

        # Compute STA/LTA for P-wave (Z component, higher frequency)
        sta_lta_p = detector.compute_sta_lta(trace_z, sta_window=0.5, lta_window=5.0)

        # Compute STA/LTA for S-wave (broader window)
        sta_lta_s = detector.compute_sta_lta(trace_z, sta_window=1.0, lta_window=10.0)

        # Create figure with subplots
        fig = plt.figure(figsize=(15, 10))
        gs = gridspec.GridSpec(3, 1, height_ratios=[2, 1, 1], hspace=0.3)

        # Calculate S-P time if both picks available
        sp_time = None
        if p_pick is not None and s_pick is not None:
            p_time = p_pick / self.sampling_rate if isinstance(p_pick, (int, np.integer)) else p_pick
            s_time = s_pick / self.sampling_rate if isinstance(s_pick, (int, np.integer)) else s_pick
            sp_time = s_time - p_time

        # Title with S-P time
        if sp_time is not None:
            main_title = f"{title} | S-P: {sp_time:.2f}s"
        else:
            main_title = title

        # Subplot 1: Seismic Waveform
        ax1 = plt.subplot(gs[0])
        ax1.plot(time, trace_z, 'k-', linewidth=0.7, label='Waveform')

        if p_pick is not None:
            p_time = p_pick / self.sampling_rate if isinstance(p_pick, (int, np.integer)) else p_pick
            ax1.axvline(p_time, color='blue', linestyle='--', linewidth=2.5, label=f'P: {p_time:.2f}s')

        if s_pick is not None:
            s_time = s_pick / self.sampling_rate if isinstance(s_pick, (int, np.integer)) else s_pick
            ax1.axvline(s_time, color='red', linestyle='--', linewidth=2.5, label=f'S: {s_time:.2f}s')

        ax1.set_ylabel('Amplitude', fontsize=11, fontweight='bold')
        ax1.set_title('Seismic Waveform', fontsize=12, fontweight='bold')
        ax1.legend(loc='upper right', fontsize=10)
        ax1.grid(True, alpha=0.3)
        ax1.set_xlim([time[0], time[-1]])

        # Subplot 2: P-wave Detection (STA/LTA)
        ax2 = plt.subplot(gs[1])
        ax2.plot(time, sta_lta_p, 'b-', linewidth=1.2)
        ax2.axhline(4.0, color='gray', linestyle=':', linewidth=1.5, label='Threshold')

        if p_pick is not None:
            p_time = p_pick / self.sampling_rate if isinstance(p_pick, (int, np.integer)) else p_pick
            ax2.axvline(p_time, color='blue', linestyle='--', linewidth=2.5)

        ax2.set_ylabel('STA/LTA', fontsize=11, fontweight='bold')
        ax2.set_title('P-wave Detection', fontsize=12, fontweight='bold')
        ax2.legend(loc='upper right', fontsize=9)
        ax2.grid(True, alpha=0.3)
        ax2.set_xlim([time[0], time[-1]])
        ax2.set_ylim([0, max(20, np.percentile(sta_lta_p, 99))])

        # Subplot 3: S-wave Detection (STA/LTA)
        ax3 = plt.subplot(gs[2])
        ax3.plot(time, sta_lta_s, 'r-', linewidth=1.2)
        ax3.axhline(2.5, color='gray', linestyle=':', linewidth=1.5, label='Threshold')

        if s_pick is not None:
            s_time = s_pick / self.sampling_rate if isinstance(s_pick, (int, np.integer)) else s_pick
            ax3.axvline(s_time, color='red', linestyle='--', linewidth=2.5)

        ax3.set_xlabel('Time (s)', fontsize=11, fontweight='bold')
        ax3.set_ylabel('STA/LTA', fontsize=11, fontweight='bold')
        ax3.set_title('S-wave Detection', fontsize=12, fontweight='bold')
        ax3.legend(loc='upper right', fontsize=9)
        ax3.grid(True, alpha=0.3)
        ax3.set_xlim([time[0], time[-1]])
        ax3.set_ylim([0, max(15, np.percentile(sta_lta_s, 99))])

        plt.suptitle(main_title, fontsize=14, fontweight='bold', y=0.995)
        plt.tight_layout()

        return fig

    def plot_3component_waveform(self, waveform, p_pick=None, s_pick=None, title="3-Component Seismogram"):
        """
        Plot all three components (Z, N, E)
        """
        time = np.arange(len(waveform)) / self.sampling_rate

        fig, axes = plt.subplots(3, 1, figsize=(14, 10), sharex=True)
        components = ['Z (Vertical)', 'N (North)', 'E (East)']

        for i, (ax, comp) in enumerate(zip(axes, components)):
            ax.plot(time, waveform[:, i], 'k-', linewidth=0.7)

            if p_pick is not None:
                p_time = p_pick / self.sampling_rate if isinstance(p_pick, (int, np.integer)) else p_pick
                ax.axvline(p_time, color='blue', linestyle='--', linewidth=2, alpha=0.7)

            if s_pick is not None:
                s_time = s_pick / self.sampling_rate if isinstance(s_pick, (int, np.integer)) else s_pick
                ax.axvline(s_time, color='red', linestyle='--', linewidth=2, alpha=0.7)

            ax.set_ylabel(f'{comp}\nAmplitude', fontsize=10)
            ax.grid(True, alpha=0.3)

        axes[-1].set_xlabel('Time (s)', fontsize=11)
        plt.suptitle(title, fontsize=14, fontweight='bold')
        plt.tight_layout()

        return fig

    def plot_training_history(self, history):
        """
        Plot training history (loss and accuracy)
        """
        fig, axes = plt.subplots(1, 2, figsize=(14, 5))

        # Loss
        axes[0].plot(history.history['loss'], label='Training Loss', linewidth=2)
        axes[0].plot(history.history['val_loss'], label='Validation Loss', linewidth=2)
        axes[0].set_xlabel('Epoch', fontsize=11)
        axes[0].set_ylabel('Loss', fontsize=11)
        axes[0].set_title('Model Loss', fontsize=12, fontweight='bold')
        axes[0].legend()
        axes[0].grid(True, alpha=0.3)

        # Accuracy
        axes[1].plot(history.history['accuracy'], label='Training Accuracy', linewidth=2)
        axes[1].plot(history.history['val_accuracy'], label='Validation Accuracy', linewidth=2)
        axes[1].set_xlabel('Epoch', fontsize=11)
        axes[1].set_ylabel('Accuracy', fontsize=11)
        axes[1].set_title('Model Accuracy', fontsize=12, fontweight='bold')
        axes[1].legend()
        axes[1].grid(True, alpha=0.3)

        plt.tight_layout()

        return fig

    def plot_confusion_matrix(self, y_true, y_pred, classes=['Noise', 'P-wave', 'S-wave']):
        """
        Plot confusion matrix
        """
        from sklearn.metrics import confusion_matrix
        import seaborn as sns

        # Get class indices
        y_true_idx = np.argmax(y_true, axis=1)
        y_pred_idx = np.argmax(y_pred, axis=1)

        cm = confusion_matrix(y_true_idx, y_pred_idx)

        plt.figure(figsize=(10, 8))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                   xticklabels=classes, yticklabels=classes,
                   cbar_kws={'label': 'Count'})
        plt.xlabel('Predicted Label', fontsize=12, fontweight='bold')
        plt.ylabel('True Label', fontsize=12, fontweight='bold')
        plt.title('Confusion Matrix', fontsize=14, fontweight='bold')
        plt.tight_layout()

        return plt.gcf()

    def plot_predictions_comparison(self, waveform, p_true, s_true, p_pred, s_pred):
        """
        Plot comparison between true picks and predictions
        """
        detector = STALTADetector(self.sampling_rate)

        if len(waveform.shape) > 1:
            trace = waveform[:, 0]
        else:
            trace = waveform

        time = np.arange(len(trace)) / self.sampling_rate

        # Compute STA/LTA
        sta_lta_p = detector.compute_sta_lta(trace, sta_window=0.5, lta_window=5.0)

        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(15, 8), sharex=True)

        # Waveform
        ax1.plot(time, trace, 'k-', linewidth=0.7, label='Waveform')

        # True picks
        if p_true is not None:
            p_t = p_true / self.sampling_rate if isinstance(p_true, (int, np.integer)) else p_true
            ax1.axvline(p_t, color='blue', linestyle='--', linewidth=2.5, label=f'P True: {p_t:.2f}s')

        if s_true is not None:
            s_t = s_true / self.sampling_rate if isinstance(s_true, (int, np.integer)) else s_true
            ax1.axvline(s_t, color='red', linestyle='--', linewidth=2.5, label=f'S True: {s_t:.2f}s')

        # Predicted picks
        if p_pred is not None:
            p_p = p_pred / self.sampling_rate if isinstance(p_pred, (int, np.integer)) else p_pred
            ax1.axvline(p_p, color='cyan', linestyle=':', linewidth=3, label=f'P Pred: {p_p:.2f}s')

        if s_pred is not None:
            s_p = s_pred / self.sampling_rate if isinstance(s_pred, (int, np.integer)) else s_pred
            ax1.axvline(s_p, color='orange', linestyle=':', linewidth=3, label=f'S Pred: {s_p:.2f}s')

        ax1.set_ylabel('Amplitude', fontsize=11, fontweight='bold')
        ax1.set_title('Waveform with Picks Comparison', fontsize=12, fontweight='bold')
        ax1.legend(loc='upper right', fontsize=9)
        ax1.grid(True, alpha=0.3)

        # STA/LTA with picks
        ax2.plot(time, sta_lta_p, 'b-', linewidth=1.2, label='STA/LTA')
        ax2.axhline(4.0, color='gray', linestyle=':', linewidth=1.5)

        if p_true is not None:
            ax2.axvline(p_t, color='blue', linestyle='--', linewidth=2.5)

        if p_pred is not None:
            ax2.axvline(p_p, color='cyan', linestyle=':', linewidth=3)

        ax2.set_xlabel('Time (s)', fontsize=11, fontweight='bold')
        ax2.set_ylabel('STA/LTA', fontsize=11, fontweight='bold')
        ax2.set_title('STA/LTA Detection', fontsize=12, fontweight='bold')
        ax2.grid(True, alpha=0.3)
        ax2.set_ylim([0, max(20, np.percentile(sta_lta_p, 99))])

        plt.tight_layout()

        return fig
