// Written and designed by Srijan Sehdev

// Array to store all game state data during the session
let trainingData = [];

// Bot definition using your exact playing logic, with additional data fields.
function TrexRunnerBot() {
  const makeKeyArgs = (keyCode) => {
    const preventDefault = () => void 0;
    return { keyCode, preventDefault };
  };
  const upKeyArgs = makeKeyArgs(38);
  const downKeyArgs = makeKeyArgs(40);
  const startArgs = makeKeyArgs(32);

  // Start the game if it's not already playing.
  if (!Runner().playing) {
    Runner().onKeyDown(startArgs);
    // Record a "start" action when initiating the game.
    trainingData.push({
      obstacle_x: null,
      obstacle_y: null,
      obstacle_width: null,
      obstacle_type: "start",
      next_obstacle_x: null,
      next_obstacle_y: null,
      speed: Runner().currentSpeed,
      action: "start"
    });
    setTimeout(() => {
      Runner().onKeyUp(startArgs);
    }, 500);
  }

  // Main loop: checks for obstacles and records game state.
  function conquerTheGame() {
    if (!Runner || !Runner().horizon.obstacles[0]) return;
    const obstacle = Runner().horizon.obstacles[0];

    // Always include the primary obstacle's type if available.
    const obstacleType = obstacle.typeConfig && obstacle.typeConfig.type 
                           ? obstacle.typeConfig.type 
                           : "normal";

    // Ignore obstacles of type 'SNACK'
    if (obstacleType === 'SNACK') return;

    // Get data for the next obstacle, if it exists.
    let nextObstacle = Runner().horizon.obstacles[1] || null;
    let nextObstacleX = nextObstacle ? nextObstacle.xPos : null;
    let nextObstacleY = nextObstacle ? nextObstacle.yPos : null;

    // Build the game state record.
    let gameState = {
      obstacle_x: obstacle.xPos,
      obstacle_y: obstacle.yPos,
      obstacle_width: obstacle.width,
      obstacle_type: obstacleType,
      next_obstacle_x: nextObstacleX,
      next_obstacle_y: nextObstacleY,
      speed: Runner().currentSpeed,
      action: "none"  // Default action
    };

    // If conditions are met, perform an action and record it.
    if (needsToTackle(obstacle) && closeEnoughToTackle(obstacle)) {
      gameState.action = tackle(obstacle);
    }

    // Save this game state in our training data array.
    trainingData.push(gameState);
  }

  function needsToTackle(obstacle) {
    return obstacle.yPos !== 50;
  }

  function closeEnoughToTackle(obstacle) {
    return obstacle.xPos <= Runner().currentSpeed * 18;
  }

  function tackle(obstacle) {
    if (isDuckable(obstacle)) {
      duck();
      return "duck";
    } else {
      return jumpOver(obstacle);
    }
  }

  function isDuckable(obstacle) {
    return obstacle.yPos === 50;
  }

  function duck() {
    Runner().onKeyDown(downKeyArgs);
    setTimeout(() => {
      Runner().onKeyUp(downKeyArgs);
    }, 500);
  }

  function jumpOver(obstacle) {
    if (isNextObstacleCloseTo(obstacle)) {
      jumpFast();
      return "jump_fast";
    } else {
      Runner().onKeyDown(upKeyArgs);
      setTimeout(() => Runner().onKeyUp(upKeyArgs), 100);
      return "jump";
    }
  }

  function isNextObstacleCloseTo(currentObstacle) {
    const nextObstacle = Runner().horizon.obstacles[1];
    return nextObstacle && nextObstacle.xPos - currentObstacle.xPos <= Runner().currentSpeed * 42;
  }

  function jumpFast() {
    Runner().onKeyDown(upKeyArgs);
    setTimeout(() => Runner().onKeyUp(upKeyArgs), 50);
  }

  return { conquerTheGame };
}

let bot = TrexRunnerBot();
// Continuously run the bot at a very short interval.
let botInterval = setInterval(bot.conquerTheGame, 2);

// After 10 minutes (600,000 milliseconds), stop collecting data and send it all at once.
setTimeout(() => {
  clearInterval(botInterval);
  console.log("10 minutes elapsed. Sending collected training data...");

  fetch("http://localhost:5000/collect_data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trainingData)
  })
    .then(response => response.json())
    .then(result => {
      console.log("Training data sent successfully:", result);
      // Optionally, clear the trainingData array after sending.
      trainingData = [];
    })
    .catch(error => console.error("Error sending training data:", error));
}, 600000);
