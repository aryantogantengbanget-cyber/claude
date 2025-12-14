"""
CNN Model for Automatic P-wave and S-wave Picking
Architecture optimized for Indonesian seismic dataset
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
import numpy as np


class SeismicCNNPicker:
    """
    2D CNN Architecture for seismic P/S wave detection
    """

    def __init__(self, input_shape=(3000, 3, 1), num_classes=3):
        """
        Args:
            input_shape: (time_steps, channels, 1) - default 3000 samples, 3 components (Z, N, E)
            num_classes: 3 classes (Noise, P-wave, S-wave)
        """
        self.input_shape = input_shape
        self.num_classes = num_classes
        self.model = None

    def build_model(self, learning_rate=0.001):
        """
        Build 2D CNN architecture with attention mechanism
        """
        inputs = keras.Input(shape=self.input_shape, name='seismic_input')

        # First Convolutional Block
        x = layers.Conv2D(32, (7, 3), padding='same', activation='relu', name='conv1')(inputs)
        x = layers.BatchNormalization()(x)
        x = layers.MaxPooling2D((2, 1), name='pool1')(x)
        x = layers.Dropout(0.2)(x)

        # Second Convolutional Block
        x = layers.Conv2D(64, (5, 3), padding='same', activation='relu', name='conv2')(x)
        x = layers.BatchNormalization()(x)
        x = layers.MaxPooling2D((2, 1), name='pool2')(x)
        x = layers.Dropout(0.2)(x)

        # Third Convolutional Block
        x = layers.Conv2D(128, (3, 3), padding='same', activation='relu', name='conv3')(x)
        x = layers.BatchNormalization()(x)
        x = layers.MaxPooling2D((2, 1), name='pool3')(x)
        x = layers.Dropout(0.3)(x)

        # Fourth Convolutional Block
        x = layers.Conv2D(256, (3, 3), padding='same', activation='relu', name='conv4')(x)
        x = layers.BatchNormalization()(x)
        x = layers.MaxPooling2D((2, 1), name='pool4')(x)
        x = layers.Dropout(0.3)(x)

        # Attention Mechanism
        attention = layers.Conv2D(1, (1, 1), activation='sigmoid', name='attention')(x)
        x = layers.Multiply()([x, attention])

        # Global pooling and dense layers
        x = layers.GlobalAveragePooling2D(name='global_pool')(x)
        x = layers.Dense(512, activation='relu', name='dense1')(x)
        x = layers.Dropout(0.5)(x)
        x = layers.Dense(256, activation='relu', name='dense2')(x)
        x = layers.Dropout(0.4)(x)

        # Output layer - classification for each time step
        outputs = layers.Dense(self.num_classes, activation='softmax', name='output')(x)

        # Create model
        self.model = keras.Model(inputs=inputs, outputs=outputs, name='SeismicCNN_Picker')

        # Compile model
        optimizer = keras.optimizers.Adam(learning_rate=learning_rate)
        self.model.compile(
            optimizer=optimizer,
            loss='categorical_crossentropy',
            metrics=['accuracy', keras.metrics.Precision(), keras.metrics.Recall()]
        )

        return self.model

    def build_regression_model(self, learning_rate=0.001):
        """
        Build regression model for precise arrival time prediction
        Returns: (P_arrival_time, S_arrival_time)
        """
        inputs = keras.Input(shape=self.input_shape, name='seismic_input')

        # Convolutional layers
        x = layers.Conv2D(32, (7, 3), padding='same', activation='relu')(inputs)
        x = layers.BatchNormalization()(x)
        x = layers.MaxPooling2D((2, 1))(x)
        x = layers.Dropout(0.2)(x)

        x = layers.Conv2D(64, (5, 3), padding='same', activation='relu')(x)
        x = layers.BatchNormalization()(x)
        x = layers.MaxPooling2D((2, 1))(x)
        x = layers.Dropout(0.2)(x)

        x = layers.Conv2D(128, (3, 3), padding='same', activation='relu')(x)
        x = layers.BatchNormalization()(x)
        x = layers.MaxPooling2D((2, 1))(x)
        x = layers.Dropout(0.3)(x)

        x = layers.Conv2D(256, (3, 3), padding='same', activation='relu')(x)
        x = layers.BatchNormalization()(x)
        x = layers.GlobalAveragePooling2D()(x)

        # Dense layers
        x = layers.Dense(512, activation='relu')(x)
        x = layers.Dropout(0.5)(x)
        x = layers.Dense(256, activation='relu')(x)
        x = layers.Dropout(0.4)(x)

        # Two outputs: P-wave time and S-wave time
        p_output = layers.Dense(1, activation='linear', name='p_arrival')(x)
        s_output = layers.Dense(1, activation='linear', name='s_arrival')(x)

        self.model = keras.Model(inputs=inputs, outputs=[p_output, s_output],
                                name='SeismicCNN_Regression')

        optimizer = keras.optimizers.Adam(learning_rate=learning_rate)
        self.model.compile(
            optimizer=optimizer,
            loss={'p_arrival': 'mse', 's_arrival': 'mse'},
            metrics={'p_arrival': 'mae', 's_arrival': 'mae'}
        )

        return self.model

    def get_callbacks(self, checkpoint_path='best_model.h5'):
        """
        Get training callbacks
        """
        callbacks = [
            EarlyStopping(
                monitor='val_loss',
                patience=15,
                restore_best_weights=True,
                verbose=1
            ),
            ModelCheckpoint(
                checkpoint_path,
                monitor='val_loss',
                save_best_only=True,
                verbose=1
            ),
            ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=5,
                min_lr=1e-7,
                verbose=1
            )
        ]
        return callbacks

    def summary(self):
        """Print model summary"""
        if self.model is None:
            raise ValueError("Model not built yet. Call build_model() first.")
        return self.model.summary()


class UNetPicker:
    """
    U-Net architecture for pixel-wise P/S wave detection
    Better for precise time localization
    """

    def __init__(self, input_shape=(3000, 3, 1)):
        self.input_shape = input_shape
        self.model = None

    def build_model(self, learning_rate=0.001):
        """
        Build U-Net architecture for seismic phase picking
        """
        inputs = keras.Input(shape=self.input_shape)

        # Encoder
        c1 = layers.Conv2D(32, (3, 3), activation='relu', padding='same')(inputs)
        c1 = layers.Conv2D(32, (3, 3), activation='relu', padding='same')(c1)
        p1 = layers.MaxPooling2D((2, 1))(c1)

        c2 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(p1)
        c2 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(c2)
        p2 = layers.MaxPooling2D((2, 1))(c2)

        c3 = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(p2)
        c3 = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(c3)
        p3 = layers.MaxPooling2D((2, 1))(c3)

        # Bottleneck
        c4 = layers.Conv2D(256, (3, 3), activation='relu', padding='same')(p3)
        c4 = layers.Conv2D(256, (3, 3), activation='relu', padding='same')(c4)

        # Decoder
        u5 = layers.UpSampling2D((2, 1))(c4)
        u5 = layers.concatenate([u5, c3])
        c5 = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(u5)
        c5 = layers.Conv2D(128, (3, 3), activation='relu', padding='same')(c5)

        u6 = layers.UpSampling2D((2, 1))(c5)
        u6 = layers.concatenate([u6, c2])
        c6 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(u6)
        c6 = layers.Conv2D(64, (3, 3), activation='relu', padding='same')(c6)

        u7 = layers.UpSampling2D((2, 1))(c6)
        u7 = layers.concatenate([u7, c1])
        c7 = layers.Conv2D(32, (3, 3), activation='relu', padding='same')(u7)
        c7 = layers.Conv2D(32, (3, 3), activation='relu', padding='same')(c7)

        # Output: 3 channels (Noise, P-wave, S-wave probabilities)
        outputs = layers.Conv2D(3, (1, 1), activation='softmax')(c7)

        self.model = keras.Model(inputs=inputs, outputs=outputs, name='UNet_Picker')

        optimizer = keras.optimizers.Adam(learning_rate=learning_rate)
        self.model.compile(
            optimizer=optimizer,
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )

        return self.model
