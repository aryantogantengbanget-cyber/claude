"""
Inference Script for Seismic Phase Picking
Predict P and S wave arrivals from seismic waveform CSV files
"""

import os
import sys
import numpy as np
import pandas as pd
import argparse
import tensorflow as tf
from tensorflow import keras

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data.data_loader import SeismicDataLoader
from utils.visualization import SeismicPlotter


def predict_seismic_phases(waveform_csv_path, model_path='best_model.h5',
                          sampling_rate=100, visualize=True, output_dir='outputs'):
    """
    Predict P and S wave arrivals from seismic waveform CSV

    Args:
        waveform_csv_path: Path to CSV file containing waveform
        model_path: Path to trained model (.h5 file)
        sampling_rate: Sampling rate in Hz
        visualize: Whether to create visualization
        output_dir: Directory to save outputs

    Returns:
        dict: Dictionary containing prediction results
    """
    print("=" * 60)
    print("SEISMIC PHASE PICKER - INFERENCE")
    print("=" * 60)

    # Check if files exist
    if not os.path.exists(waveform_csv_path):
        raise FileNotFoundError(f"Waveform CSV not found: {waveform_csv_path}")

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model not found: {model_path}")

    # Load model
    print(f"\n📦 Loading model from {model_path}...")
    model = keras.models.load_model(model_path)
    print("✅ Model loaded successfully")

    # Load and preprocess waveform
    print(f"\n📊 Loading waveform from {waveform_csv_path}...")
    loader = SeismicDataLoader('.', sampling_rate=sampling_rate, window_size=30)

    df = pd.read_csv(waveform_csv_path)
    print(f"   CSV shape: {df.shape}")
    print(f"   Columns: {list(df.columns)}")

    # Extract waveform
    if 'Z' in df.columns and 'N' in df.columns and 'E' in df.columns:
        waveform = df[['Z', 'N', 'E']].values
        print("   Using 3-component data (Z, N, E)")
    elif 'amplitude' in df.columns:
        amp = df['amplitude'].values.reshape(-1, 1)
        waveform = np.repeat(amp, 3, axis=1)
        print("   Using single component data (replicated to 3 channels)")
    else:
        raise ValueError("CSV must contain either (Z, N, E) or (amplitude) columns")

    # Get true arrivals if available
    p_true = df['p_arrival'].iloc[0] if 'p_arrival' in df.columns else None
    s_true = df['s_arrival'].iloc[0] if 's_arrival' in df.columns else None

    # Preprocess
    print("\n🔧 Preprocessing waveform...")
    waveform_processed = loader.preprocess_waveform(waveform)
    print("✅ Preprocessing complete")

    # Create windows for prediction
    print("\n🔍 Creating windows for prediction...")
    # Use small overlap for prediction
    windows, _ = loader.create_windows(waveform_processed,
                                      p_arrival=0,
                                      s_arrival=0,
                                      overlap=0.75)

    # Reshape for CNN
    windows = windows.reshape(windows.shape[0], windows.shape[1], windows.shape[2], 1)
    print(f"   Created {len(windows)} windows of shape {windows.shape[1:]}")

    # Predict
    print("\n🤖 Running prediction...")
    predictions = model.predict(windows, verbose=0)
    print("✅ Prediction complete")

    # Find P and S arrivals (windows with highest probabilities)
    noise_probs = predictions[:, 0]
    p_probs = predictions[:, 1]
    s_probs = predictions[:, 2]

    # Get window indices with highest P and S probabilities
    p_window_idx = np.argmax(p_probs)
    s_window_idx = np.argmax(s_probs)

    # Convert window indices to sample indices
    window_step = int(loader.n_samples * 0.25)  # 75% overlap means 25% step
    p_arrival_pred = p_window_idx * window_step + loader.n_samples // 2
    s_arrival_pred = s_window_idx * window_step + loader.n_samples // 2

    # Calculate times in seconds
    p_time_pred = p_arrival_pred / sampling_rate
    s_time_pred = s_arrival_pred / sampling_rate
    sp_time_pred = s_time_pred - p_time_pred

    # Results
    results = {
        'p_arrival_sample': int(p_arrival_pred),
        's_arrival_sample': int(s_arrival_pred),
        'p_arrival_time': float(p_time_pred),
        's_arrival_time': float(s_time_pred),
        'sp_time': float(sp_time_pred),
        'p_confidence': float(p_probs[p_window_idx]),
        's_confidence': float(s_probs[s_window_idx]),
    }

    # Add true values if available
    if p_true is not None:
        results['p_arrival_true'] = int(p_true)
        results['p_error_samples'] = int(p_arrival_pred - p_true)
        results['p_error_seconds'] = float((p_arrival_pred - p_true) / sampling_rate)

    if s_true is not None:
        results['s_arrival_true'] = int(s_true)
        results['s_error_samples'] = int(s_arrival_pred - s_true)
        results['s_error_seconds'] = float((s_arrival_pred - s_true) / sampling_rate)

    # Print results
    print("\n" + "=" * 60)
    print("PREDICTION RESULTS")
    print("=" * 60)
    print(f"\n📍 P-wave Arrival:")
    print(f"   Predicted: {p_time_pred:.2f}s (sample {p_arrival_pred})")
    print(f"   Confidence: {results['p_confidence']:.2%}")
    if p_true is not None:
        print(f"   True: {p_true/sampling_rate:.2f}s (sample {p_true})")
        print(f"   Error: {results['p_error_seconds']:.2f}s ({results['p_error_samples']} samples)")

    print(f"\n📍 S-wave Arrival:")
    print(f"   Predicted: {s_time_pred:.2f}s (sample {s_arrival_pred})")
    print(f"   Confidence: {results['s_confidence']:.2%}")
    if s_true is not None:
        print(f"   True: {s_true/sampling_rate:.2f}s (sample {s_true})")
        print(f"   Error: {results['s_error_seconds']:.2f}s ({results['s_error_samples']} samples)")

    print(f"\n⏱️  S-P Time: {sp_time_pred:.2f}s")
    print("=" * 60)

    # Visualization
    if visualize:
        print("\n📊 Creating visualization...")
        os.makedirs(output_dir, exist_ok=True)

        plotter = SeismicPlotter(sampling_rate=sampling_rate)

        # Create comprehensive plot
        fig = plotter.plot_sta_lta_detection(
            waveform_processed,
            p_pick=p_arrival_pred,
            s_pick=s_arrival_pred,
            title=f"Seismic Phase Detection | S-P: {sp_time_pred:.2f}s"
        )

        # Save plot
        output_path = os.path.join(output_dir, 'prediction_result.png')
        fig.savefig(output_path, dpi=150, bbox_inches='tight')
        print(f"✅ Visualization saved to {output_path}")

        # Also create comparison plot if true arrivals available
        if p_true is not None and s_true is not None:
            fig2 = plotter.plot_predictions_comparison(
                waveform_processed,
                p_true=p_true,
                s_true=s_true,
                p_pred=p_arrival_pred,
                s_pred=s_arrival_pred
            )
            comparison_path = os.path.join(output_dir, 'prediction_comparison.png')
            fig2.savefig(comparison_path, dpi=150, bbox_inches='tight')
            print(f"✅ Comparison plot saved to {comparison_path}")

    return results


def main():
    """
    Command-line interface for inference
    """
    parser = argparse.ArgumentParser(description='Seismic Phase Picking Inference')
    parser.add_argument('waveform_csv', type=str, help='Path to waveform CSV file')
    parser.add_argument('--model', type=str, default='best_model.h5',
                       help='Path to trained model (default: best_model.h5)')
    parser.add_argument('--sampling-rate', type=int, default=100,
                       help='Sampling rate in Hz (default: 100)')
    parser.add_argument('--no-viz', action='store_true',
                       help='Disable visualization')
    parser.add_argument('--output-dir', type=str, default='outputs',
                       help='Output directory for results (default: outputs)')

    args = parser.parse_args()

    # Run prediction
    results = predict_seismic_phases(
        waveform_csv_path=args.waveform_csv,
        model_path=args.model,
        sampling_rate=args.sampling_rate,
        visualize=not args.no_viz,
        output_dir=args.output_dir
    )

    # Save results to JSON
    import json
    results_path = os.path.join(args.output_dir, 'prediction_results.json')
    with open(results_path, 'w') as f:
        json.dump(results, f, indent=2)

    print(f"\n✅ Results saved to {results_path}")
    print("\n" + "=" * 60)
    print("INFERENCE COMPLETE")
    print("=" * 60)


if __name__ == '__main__':
    main()
