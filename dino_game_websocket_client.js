// Written and designed by Srijan Sehdev

// Establish a WebSocket connection to the Python server.
let socket = new WebSocket("ws://localhost:8765");

// Track the most recent action from the server (optional, for debugging).
let lastAction = "none";
let lastSpeed =0;
socket.onopen = () => {
  console.log("Connected to Python server");
};

// Handle incoming messages (predicted actions) from Python.
socket.onmessage = (event) => {
  let response = JSON.parse(event.data);
  let action = response.action;
  

  // Execute the predicted action.
  if (action === "duck") {
    Runner().onKeyDown({ keyCode: 40, preventDefault: () => {} });
    setTimeout(() => {
      Runner().onKeyUp({ keyCode: 40, preventDefault: () => {} });
    }, 500);
  } else if (action === "jump") {
    Runner().onKeyUp({ keyCode: 40, preventDefault: () => {} });

    Runner().onKeyDown({ keyCode: 38, preventDefault: () => {} });
    setTimeout(() => {
      Runner().onKeyUp({ keyCode: 38, preventDefault: () => {} });
    }, 100);
    // console.log(lastSpeed);

  } else if (action === "jump_fast") {
    Runner().onKeyUp({ keyCode: 40, preventDefault: () => {} });

    Runner().onKeyDown({ keyCode: 38, preventDefault: () => {} });
    Runner().onKeyUp({ keyCode: 38, preventDefault: () => {} });

  }
  // For "none" or "start", do nothing here (unless you want to handle "start" differently).

  lastAction = action;
};

socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};

socket.onclose = () => {
  console.warn("WebSocket connection closed");
};

// ──────────────────────────────────────────────────────────────────────────────
// Function: Collect and send the current game state to the Python server
// ──────────────────────────────────────────────────────────────────────────────
function sendGameState() {
  // Build the game state from the current game data.
  // If there's no obstacle, skip sending.
  let gameState = getGameState();
  if (gameState !== null && socket.readyState === WebSocket.OPEN) {
    let msg = JSON.stringify(gameState);
    socket.send(msg);
    // console.log("Sent game state:", msg);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Function: Build the game state array for the model
// Order: [obstacle_x, obstacle_y, obstacle_width, obstacle_type, next_obstacle_x, next_obstacle_y, speed]
// Note: We subtract (12 * currentSpeed) from obstacle.xPos and nextObs.xPos
// ──────────────────────────────────────────────────────────────────────────────
function getGameState() {
  if (!Runner || !Runner().horizon.obstacles[0]) {
    return null;
  }

  const obstacle = Runner().horizon.obstacles[0];
  const currentSpeed = Runner().currentSpeed;

  let obstacleType = (obstacle.typeConfig && obstacle.typeConfig.type) ? obstacle.typeConfig.type : "normal";
  let obstacleTypeEncoded = (obstacleType === "normal") ? 0 : 1;

  const calibrater=9;
  // You must adjust the calibrater value in dino_game_websocket_client.js for each PC to achieve the best results.
  let obstacleX = obstacle.xPos - calibrater * currentSpeed;
  // let obstacleX = obstacle.xPos - currentSpeed * currentSpeed;
  // Next obstacle data (if exists).
  let nextObs = Runner().horizon.obstacles[1] || {};
  let nextObstacleX = (nextObs.xPos || 0) - calibrater * currentSpeed;
  let nextObstacleY = nextObs.yPos || 0;
  lastSpeed=currentSpeed;
  // Construct the feature array.
  let gameState = [
    obstacleX,                 // obstacle_x (calibrated)
    obstacle.yPos,             // obstacle_y
    obstacle.width,            // obstacle_width
    obstacleTypeEncoded,       // obstacle_type
    nextObstacleX,             // next_obstacle_x (calibrated)
    nextObstacleY,             // next_obstacle_y
    currentSpeed               // speed
  ];

  return gameState;
}

// ──────────────────────────────────────────────────────────────────────────────
// Optional: Start the game if it's not already playing.
// ──────────────────────────────────────────────────────────────────────────────
function maybeStartGame() {
  if (!Runner().playing) {
    const startKey = { keyCode: 32, preventDefault: () => {} }; // Space bar
    Runner().onKeyDown(startKey);
    setTimeout(() => {
      Runner().onKeyUp(startKey);
    }, 500);
    console.log("Game started");
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// MAIN BOT LOOP: Send the game state every 200 ms
// ──────────────────────────────────────────────────────────────────────────────
maybeStartGame();

// Send game state periodically (200ms).
setInterval(() => {
  sendGameState();
}, 150);
