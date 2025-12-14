"""
Training Pipeline for Seismic CNN Picker
Complete training workflow with evaluation and visualization
"""

import os
import sys
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
import json

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.cnn_picker import SeismicCNNPicker, UNetPicker
from data.data_loader import SeismicDataLoader, SyntheticDataGenerator
from utils.augmentation import SeismicAugmentor, CustomDataGenerator
from utils.visualization import SeismicPlotter, STALTADetector


class TrainingPipeline:
    """
    Complete training pipeline for seismic phase picking
    """

    def __init__(self, config):
        """
        Args:
            config: Dictionary containing training configuration
        """
        self.config = config
        self.model = None
        self.history = None
        self.data_loader = None
        self.plotter = SeismicPlotter(config.get('sampling_rate', 100))

        # Create output directory
        self.output_dir = config.get('output_dir', 'outputs')
        os.makedirs(self.output_dir, exist_ok=True)

    def prepare_data(self):
        """
        Load and prepare training data
        """
        print("=" * 60)
        print("PREPARING DATA")
        print("=" * 60)

        data_dir = self.config['data_dir']
        sampling_rate = self.config.get('sampling_rate', 100)
        window_size = self.config.get('window_size', 30)

        # Check if data directory exists and has CSV files
        if not os.path.exists(data_dir) or len(os.listdir(data_dir)) == 0:
            print(f"Warning: Data directory '{data_dir}' is empty or doesn't exist.")
            print("Generating synthetic dataset for demonstration...")

            # Generate synthetic data
            generator = SyntheticDataGenerator(sampling_rate)
            generator.save_synthetic_csv(data_dir, n_samples=self.config.get('n_synthetic', 200))

        # Initialize data loader
        self.data_loader = SeismicDataLoader(data_dir, sampling_rate, window_size)

        # Load dataset
        max_files = self.config.get('max_files', None)
        X, y, metadata = self.data_loader.load_dataset(max_files)

        print(f"\nDataset loaded: {len(X)} samples")
        print(f"Class distribution:")
        unique, counts = np.unique(y, return_counts=True)
        for cls, count in zip(unique, counts):
            cls_name = ['Noise', 'P-wave', 'S-wave'][int(cls)]
            print(f"  {cls_name}: {count} ({count / len(y) * 100:.1f}%)")

        # Prepare for training
        X_train, X_val, X_test, y_train, y_val, y_test = self.data_loader.prepare_for_training(
            X, y,
            test_size=self.config.get('test_size', 0.2),
            val_size=self.config.get('val_size', 0.1)
        )

        # Save metadata
        self.metadata = {
            'n_samples': len(X),
            'n_train': len(X_train),
            'n_val': len(X_val),
            'n_test': len(X_test),
            'input_shape': X_train.shape[1:],
            'class_distribution': {
                cls_name: int(count)
                for cls_name, count in zip(['Noise', 'P-wave', 'S-wave'], counts)
            }
        }

        return X_train, X_val, X_test, y_train, y_val, y_test

    def build_model(self, input_shape):
        """
        Build CNN model
        """
        print("\n" + "=" * 60)
        print("BUILDING MODEL")
        print("=" * 60)

        model_type = self.config.get('model_type', 'cnn')
        learning_rate = self.config.get('learning_rate', 0.001)

        if model_type == 'cnn':
            picker = SeismicCNNPicker(input_shape=input_shape, num_classes=3)
            self.model = picker.build_model(learning_rate=learning_rate)
            print("Built CNN Picker model")
        elif model_type == 'unet':
            picker = UNetPicker(input_shape=input_shape)
            self.model = picker.build_model(learning_rate=learning_rate)
            print("Built U-Net Picker model")
        else:
            raise ValueError(f"Unknown model type: {model_type}")

        print(f"\nModel summary:")
        self.model.summary()

        return picker

    def train(self, X_train, y_train, X_val, y_val):
        """
        Train the model
        """
        print("\n" + "=" * 60)
        print("TRAINING MODEL")
        print("=" * 60)

        batch_size = self.config.get('batch_size', 32)
        epochs = self.config.get('epochs', 50)
        use_augmentation = self.config.get('use_augmentation', True)

        # Setup data generators
        if use_augmentation:
            print("Using data augmentation during training")
            augmentor = SeismicAugmentor(augmentation_prob=0.5)
            train_generator = CustomDataGenerator(
                X_train, y_train,
                batch_size=batch_size,
                augmentor=augmentor,
                shuffle=True
            )
            validation_data = (X_val, y_val)
        else:
            train_generator = (X_train, y_train)
            validation_data = (X_val, y_val)

        # Get callbacks
        from models.cnn_picker import SeismicCNNPicker
        picker = SeismicCNNPicker()
        checkpoint_path = os.path.join(self.output_dir, 'best_model.h5')
        callbacks = picker.get_callbacks(checkpoint_path)

        # Train model
        print(f"\nStarting training for {epochs} epochs...")
        self.history = self.model.fit(
            train_generator,
            validation_data=validation_data,
            epochs=epochs,
            callbacks=callbacks,
            verbose=1
        )

        print("\nTraining completed!")

        # Save training history
        history_path = os.path.join(self.output_dir, 'training_history.json')
        history_dict = {key: [float(val) for val in values]
                       for key, values in self.history.history.items()}
        with open(history_path, 'w') as f:
            json.dump(history_dict, f, indent=2)

        return self.history

    def evaluate(self, X_test, y_test):
        """
        Evaluate model on test set
        """
        print("\n" + "=" * 60)
        print("EVALUATING MODEL")
        print("=" * 60)

        # Evaluate
        results = self.model.evaluate(X_test, y_test, verbose=1)

        print("\nTest Results:")
        for metric_name, value in zip(self.model.metrics_names, results):
            print(f"  {metric_name}: {value:.4f}")

        # Get predictions
        y_pred = self.model.predict(X_test)

        # Save results
        results_dict = {
            metric_name: float(value)
            for metric_name, value in zip(self.model.metrics_names, results)
        }

        results_path = os.path.join(self.output_dir, 'test_results.json')
        with open(results_path, 'w') as f:
            json.dump(results_dict, f, indent=2)

        return results, y_pred

    def visualize_results(self, X_test, y_test, y_pred):
        """
        Create visualizations of results
        """
        print("\n" + "=" * 60)
        print("GENERATING VISUALIZATIONS")
        print("=" * 60)

        # Plot training history
        if self.history is not None:
            fig = self.plotter.plot_training_history(self.history)
            fig.savefig(os.path.join(self.output_dir, 'training_history.png'), dpi=150)
            plt.close(fig)
            print("✓ Saved training history plot")

        # Plot confusion matrix
        try:
            fig = self.plotter.plot_confusion_matrix(y_test, y_pred)
            fig.savefig(os.path.join(self.output_dir, 'confusion_matrix.png'), dpi=150)
            plt.close(fig)
            print("✓ Saved confusion matrix")
        except Exception as e:
            print(f"Warning: Could not create confusion matrix: {e}")

    def test_on_sample(self, sample_idx=0):
        """
        Test model on a sample and create visualization
        """
        print("\n" + "=" * 60)
        print("TESTING ON SAMPLE WAVEFORM")
        print("=" * 60)

        # Generate a test sample
        generator = SyntheticDataGenerator(self.config.get('sampling_rate', 100))
        time, waveform, p_idx, s_idx = generator.generate_synthetic_waveform()

        # Preprocess
        waveform_processed = self.data_loader.preprocess_waveform(waveform)

        # Create visualization with STA/LTA
        fig = self.plotter.plot_sta_lta_detection(
            waveform_processed,
            p_pick=p_idx,
            s_pick=s_idx,
            title="Synthetic Earthquake Test | S-P: 5.95s"
        )

        fig.savefig(os.path.join(self.output_dir, 'test_waveform_detection.png'), dpi=150)
        plt.close(fig)
        print("✓ Saved test waveform visualization")

        return fig

    def save_model(self):
        """
        Save the trained model
        """
        model_path = os.path.join(self.output_dir, 'final_model.h5')
        self.model.save(model_path)
        print(f"\n✓ Model saved to {model_path}")

        # Save metadata
        metadata_path = os.path.join(self.output_dir, 'metadata.json')
        full_metadata = {
            **self.metadata,
            'config': self.config,
            'training_date': datetime.now().isoformat()
        }

        with open(metadata_path, 'w') as f:
            json.dump(full_metadata, f, indent=2)

        print(f"✓ Metadata saved to {metadata_path}")

    def run_pipeline(self):
        """
        Run complete training pipeline
        """
        print("\n" + "=" * 60)
        print("SEISMIC CNN PICKER - TRAINING PIPELINE")
        print("=" * 60)
        print(f"Start time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Output directory: {self.output_dir}")
        print("=" * 60)

        # 1. Prepare data
        X_train, X_val, X_test, y_train, y_val, y_test = self.prepare_data()

        # 2. Build model
        self.build_model(input_shape=X_train.shape[1:])

        # 3. Train model
        self.train(X_train, y_train, X_val, y_val)

        # 4. Evaluate model
        results, y_pred = self.evaluate(X_test, y_test)

        # 5. Visualize results
        self.visualize_results(X_test, y_test, y_pred)

        # 6. Test on sample
        self.test_on_sample()

        # 7. Save model
        self.save_model()

        print("\n" + "=" * 60)
        print("PIPELINE COMPLETED SUCCESSFULLY")
        print("=" * 60)
        print(f"End time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"All outputs saved to: {self.output_dir}")
        print("=" * 60 + "\n")


def main():
    """
    Main training script
    """
    # Default configuration
    config = {
        'data_dir': 'seismic_picking/dataset',
        'output_dir': 'seismic_picking/outputs',
        'sampling_rate': 100,
        'window_size': 30,
        'max_files': None,
        'n_synthetic': 200,

        # Model configuration
        'model_type': 'cnn',  # 'cnn' or 'unet'
        'learning_rate': 0.001,

        # Training configuration
        'batch_size': 32,
        'epochs': 50,
        'use_augmentation': True,
        'test_size': 0.2,
        'val_size': 0.1,
    }

    # Initialize and run pipeline
    pipeline = TrainingPipeline(config)
    pipeline.run_pipeline()


if __name__ == '__main__':
    main()
