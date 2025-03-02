# Written and designed by Srijan Sehdev

import asyncio
import websockets
import json
import numpy as np
import joblib
from tensorflow import keras
import os
import warnings

# Suppress TensorFlow logs (only errors will be shown)
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# Suppress sklearn warnings regarding feature names
warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")
import tensorflow as tf
tf.get_logger().setLevel('ERROR')



# Load the saved scaler.
scaler = joblib.load("scaler.pkl")

# Load the trained Keras model.
model = keras.models.load_model("dino_ai_model.h5")

# Mapping from predicted index to action.
action_map = {
    0: "duck",
    1: "jump",
    2: "jump_fast",
    3: "none",
    4: "start"
}

async def handler(websocket, path):
    while True:
        try:
            # Wait for a game state message from the JS client.
            msg = await websocket.recv()
            # print("Received game state:", msg)
            
            # Expecting a JSON list of features:
            # [obstacle_x, obstacle_y, obstacle_width, obstacle_type, next_obstacle_x, next_obstacle_y, speed]
            game_state = json.loads(msg)
            
            # Convert the list to a NumPy array and reshape to (1, n)
            features = np.array(game_state, dtype=float).reshape(1, -1)
            
            # Apply the same normalization used during training.
            features = scaler.transform(features)
            
            # Make a prediction using the model.
            prediction = model.predict(features, verbose=0)
            predicted_index = int(np.argmax(prediction, axis=1)[0])
            predicted_action = action_map.get(predicted_index, "none")
            
            # Prepare and send the response.
            response = json.dumps({"action": predicted_action})
            await websocket.send(response)
            # print("Sent predicted action:", response)
        except websockets.exceptions.ConnectionClosed:
            print("Client disconnected")
            break
        except Exception as e:
            print("Error:", e)
            break

start_server = websockets.serve(handler, "localhost", 8765)
print("WebSocket Server running on ws://localhost:8765")
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
