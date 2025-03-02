# Written and designed by Srijan Sehdev

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow import keras
from keras.src.callbacks import EarlyStopping
# Load the preprocessed CSV data.
df = pd.read_csv("dino_training_data.csv")

# Split the data into features and target labels.
X = df.drop(columns=["action"]).values
y = df["action"].values

# Split into training and testing sets (80% train, 20% test).
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define the neural network model.
model = keras.Sequential([
    keras.layers.Dense(128, activation="relu", input_shape=(X_train.shape[1],)),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(64, activation="relu"),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(32, activation="relu"),
    keras.layers.Dense(len(np.unique(y)), activation="softmax")  # Number of actions
])

# Compile the model.
model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])

# Set up early stopping to monitor the validation loss.
early_stop = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)

# Train the model with a maximum of 500 epochs.
history = model.fit(
    X_train, y_train,
    epochs=500,
    batch_size=16,
    validation_data=(X_test, y_test),
    callbacks=[early_stop]
)

# Save the trained model.
model.save("dino_ai_model.h5", save_format="h5")
model.summary()

print("Model training complete and saved as dino_ai_model.h5")
