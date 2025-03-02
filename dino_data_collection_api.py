# Written and designed by Srijan Sehdev

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = "dino_training_data.json"
data_store = []

# Load existing data if available.
if os.path.exists(DATA_FILE):
    try:
        with open(DATA_FILE, "r") as file:
            data_store = json.load(file)
    except json.JSONDecodeError:
        data_store = []

@app.route('/collect_data', methods=['POST'])
def collect_data():
    global data_store
    try:
        new_data = request.json  # This will be a list of game state objects
        if isinstance(new_data, list):
            data_store.extend(new_data)
            entries = len(new_data)
        else:
            data_store.append(new_data)
            entries = 1

        # Write the updated data to the JSON file.
        with open(DATA_FILE, "w") as file:
            json.dump(data_store, file, indent=2)

        print(f"Received and stored {entries} entries.")
        return jsonify({"status": "success", "entries_received": entries}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_data', methods=['GET'])
def get_data():
    return jsonify(data_store)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
