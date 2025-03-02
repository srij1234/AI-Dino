# 🦖 AI Dino

Dino AI Runner is an AI-powered automation system for the classic Chrome Dino game. The project collects game state data, preprocesses it, trains a neural network model, and then uses real-time predictions to control the game via WebSockets.

---

## 🚀 Overview

This project consists of several key components:

- **📡 Data Collection:** A JavaScript client captures game state data during gameplay and sends it to a Flask-based API for storage.
- **🧹 Data Preprocessing:** A Python script processes raw training data by handling missing values, encoding categorical variables, and normalizing numerical features for training.
- **🧠 Model Training:** A neural network model, built with TensorFlow/Keras, is trained on the preprocessed data to predict optimal actions (e.g., jump, duck) based on the game state.
- **⚡ Real-time Prediction:** A WebSocket server processes incoming game state data, makes predictions using the trained model, and sends the appropriate action back to control the game.

---

## 📁 Repository Structure

- **`dino_game_websocket_client.js`** – Connects to the prediction server via WebSockets to send/receive game state and action data.
- **`preprocess_dino_data.py`** – Processes training data by handling missing values, encoding categorical features, and normalizing numerical values.
- **`dino_data_collection_api.py`** – A Flask API that collects and stores game state data.
- **`dino_training_data_collector.js`** – Runs in the browser to collect game state data and send it to the API.
- **`train_dino_ai_model.py`** – Trains a neural network model on the preprocessed data and saves it.
- **`dino_ai_prediction_server.py`** – A WebSocket server that receives game state data, predicts an action, and sends the result back to the client.

---

## ⚙️ Setup and Installation

### 📌 Prerequisites

- **Python 3.7+**
- **Google Chrome** (to run the Dino game)

### 🛠 Python Environment Setup

1. **Create a virtual environment** (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install flask flask-cors joblib scikit-learn pandas numpy tensorflow websockets
   ```

---

## 🏃 Running the Project

### ⚠️ Important Note
Before running any JavaScript files, ensure that the corresponding Python scripts are running. The JavaScript clients rely on backend servers for data collection and prediction.

### ✅ Step 1: Collect Training Data

1. **Start the Data Collection API Server:**
   ```bash
   python dino_data_collection_api.py
   ```
   The server runs at `http://0.0.0.0:5000`.

2. **Launch the Chrome Dino Game:**
   Open Chrome and navigate to `chrome://dino`.

3. **Inject the Data Collector Script:**
   Paste the contents of **`dino_training_data_collector.js`** into the browser's developer console.

   ⚠️ **Note:** The data collection script is a hardcoded game player that autonomously plays the game and continuously sends game state data to the API.

1. **Start the Data Collection API Server:**
   ```bash
   python dino_data_collection_api.py
   ```
   The server runs at `http://0.0.0.0:5000`.

2. **Launch the Chrome Dino Game:**
   Open Chrome and navigate to `chrome://dino`.

3. **Inject the Data Collector Script:**
   Paste the contents of **`dino_training_data_collector.js`** into the browser's developer console.

### ✅ Step 2: Preprocess the Data

Run:
```bash
python preprocess_dino_data.py
```
This will:
- Create a preprocessed CSV file: `dino_training_data.csv`
- Save the scaler and label encoders.

### ✅ Step 3: Train the Neural Network Model

Train the AI model:
```bash
python train_dino_ai_model.py
```
This saves the trained model as `dino_ai_model.h5`.

### ✅ Step 4: Start the Prediction Server

Run:
```bash
python dino_ai_prediction_server.py
```
This WebSocket server listens on `ws://localhost:8765`.

### ✅ Step 5: Run the Game Client

Inject **`dino_game_websocket_client.js`** into the browser console. The script will connect to the prediction server and automate the game.

⚠️ **Note:** You must adjust the `calibrater` value in `dino_game_websocket_client.js` for each PC to achieve the best results.

Inject **`dino_game_websocket_client.js`** into the browser console. The script will connect to the prediction server and automate the game.

---

## 🔄 Execution Flowchart

Below is the order in which files should be executed:

1️⃣ **Run the Data Collection API Server**  
   - `python dino_data_collection_api.py`  
   *(Required before running `dino_training_data_collector.js`)*

2️⃣ **Run the JavaScript Client for Data Collection**  
   - Inject `dino_training_data_collector.js` in the browser console  
   *(Collects game state data and sends it to the API)*

3️⃣ **Preprocess the Data**  
   - `python preprocess_dino_data.py`  
   *(Converts raw data into a structured format for training)*

4️⃣ **Train the AI Model**  
   - `python train_dino_ai_model.py`  
   *(Trains the model and saves it as `dino_ai_model.h5`)*

5️⃣ **Start the WebSocket Prediction Server**  
   - `python dino_ai_prediction_server.py`  
   *(Required before running `dino_game_websocket_client.js`)*

6️⃣ **Run the JavaScript WebSocket Client**  
   - Inject `dino_game_websocket_client.js` in the browser console  
   *(Connects to the WebSocket server to automate the game)*

---

## 🎯 How It Works

1. **📝 Data Collection:** The game client captures the game state and sends it to the API.
2. **📊 Data Preprocessing:** The raw data is cleaned, normalized, and encoded.
3. **🧠 Model Training:** A neural network is trained to predict actions based on the game state.
4. **⚡ Real-Time Prediction:** The trained model is deployed on a WebSocket server, which predicts and sends actions back to the game client.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this project, feel free to fork the repository, open issues, or submit pull requests.

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

🦖🎮 **Enjoy automating your Dino game with AI!** 🚀

