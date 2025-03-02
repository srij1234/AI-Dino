# Written and designed by Srijan Sehdev

import json
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib

# Load the collected data from JSON.
with open("dino_training_data.json", "r") as file:
    data = json.load(file)

df = pd.DataFrame(data)

# Print missing values for debugging.
print("Missing values before processing:\n", df.isnull().sum())

# Fill missing values in next obstacle data with 0 (if not available).
df['next_obstacle_x'] = df['next_obstacle_x'].fillna(0)
df['next_obstacle_y'] = df['next_obstacle_y'].fillna(0)

# Drop any remaining rows with missing values.
df = df.dropna()

# Encode categorical variables: 
# For obstacle_type (e.g., "normal", "start", etc.)
le_type = LabelEncoder()
df['obstacle_type'] = le_type.fit_transform(df['obstacle_type'])

# For action (e.g., "jump_fast", "jump", "duck", "none", "start")
le_action = LabelEncoder()
df['action'] = le_action.fit_transform(df['action'])

print("Unique encoded actions:", df['action'].unique())
print("Unique encoded obstacle types:", df['obstacle_type'].unique())

# Separate features and target.
X = df.drop(columns=["action"])
y = df["action"]

# Normalize numerical features.
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Create a DataFrame for the scaled features.
df_scaled = pd.DataFrame(X_scaled, columns=X.columns)
df_scaled["action"] = y.values

# Save preprocessed data to CSV.
df_scaled.to_csv("dino_training_data.csv", index=False)
print("Preprocessed data saved to dino_training_data.csv")

# Save the scaler to disk for later use in real-time inference.
joblib.dump(scaler, 'scaler.pkl')
print("Scaler saved to scaler.pkl")

# Optionally, save the label encoders as well.
joblib.dump(le_type, 'le_type.pkl')
joblib.dump(le_action, 'le_action.pkl')
print("Label encoders saved to le_type.pkl and le_action.pkl")
