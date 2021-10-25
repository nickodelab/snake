// variables
const canvasWidth = 400;
const canvasHeight = 400;

// colors
const canvasBackgroundColor = "white";
const snakeColor = "lightblue";

const fruit = {
  color: "#de4f54",
  fruitX: undefined,
  fruitY: undefined,
};

// context
const snakeCanvas = document.getElementById("snakeboard");
const snakeBoardCtx = snakeCanvas.getContext("2d");

const frameSpeedRate = 120;

// initial snake speed
let dx = 20;
let dy = 0;
let lastTimestampFrame;

// KEYS
const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;

// snake coordinates
const snake = [
  { x: 200, y: 200 },
  { x: 220, y: 200 },
  { x: 240, y: 200 },
  { x: 260, y: 200 },
];

let stop = false;

const render = () => {
  renderBoard();
  if (checkCollisions()) stop = true;
  renderSnake();
  if (!fruit.fruitX && !fruit.fruitY) createRandomFruit();
  renderFruit();
};

const renderFruit = () => {
  snakeBoardCtx.fillStyle = fruit.color;
  snakeBoardCtx.fillRect(fruit.fruitX, fruit.fruitY, 20, 20);
};

const checkCollisions = () => {
  console.log(`head[x] = ${snake[0].x}`);
  console.log(`head[y] = ${snake[0].y}`);
  if (
    (snake[0].x === canvasWidth - 20 && dx === 20) ||
    snake[0].x <= 0 ||
    snake[0].y <= 0 ||
    (snake[0].y >= canvasHeight - 20 && dy === 20)
  ) {
    return true;
  }
  // check collisions - snake body
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
};

const renderBoard = () => {
  snakeBoardCtx.fillStyle = canvasBackgroundColor;
  snakeBoardCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
  snakeBoardCtx.strokeRect(0, 0, snakeCanvas.width, snakeCanvas.height);
};

const renderSnake = () => {
  if (!stop) {
    const { fruitX, fruitY } = fruit;
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    const hasEaten = snake[0].x === fruitX && snake[0].y === fruitY;
    if (hasEaten) {
      fruit.fruitX = undefined;
      fruit.fruitY = undefined;
    } else snake.pop();
  }

  snake.forEach(({ x, y }) => {
    snakeBoardCtx.fillStyle = snakeColor;
    snakeBoardCtx.fillRect(x, y, 20, 20);
  });
};

const moveKeyboardListener = ({ keyCode }) => {
  let goingUp = dy === -20;
  let goingDown = dy === 20;
  let goingRight = dx === 20;
  let goingLeft = dx === -20;

  switch (keyCode) {
    case LEFT_KEY:
      if (!goingRight) {
        dx = -20;
        dy = 0;
      }
      break;

    case UP_KEY:
      if (!goingDown) {
        dx = 0;
        dy = -20;
      }
      break;

    case RIGHT_KEY:
      if (!goingLeft) {
        dx = 20;
        dy = 0;
      }
      break;

    case DOWN_KEY:
      if (!goingUp) {
        dx = 0;
        dy = 20;
      }
      break;
  }
};

const createRandomFruit = () => {
  let stopSearching = false;
  do {
    fruit.fruitX = Math.round((Math.random() * canvasWidth) / 20) * 20;
    fruit.fruitY = Math.round((Math.random() * canvasHeight) / 20) * 20;

    stopSearching = snake.some(
      ({ x, y }) => x === fruit.fruitX || y === fruit.fruitY
    );
  } while (!stopSearching);
};
document.addEventListener("keydown", moveKeyboardListener);

const renderCanvas = () => {
  snakeBoardCtx.canvas.width = canvasWidth;
  snakeBoardCtx.canvas.height = canvasHeight;

  snakeBoardCtx.beginPath();
  snakeBoardCtx.lineWidth = 1;
  snakeBoardCtx.lineStyle = "black";

  for (let x = 0; x <= canvasWidth; x += 20) {
    snakeBoardCtx.moveTo(x, 0);
    snakeBoardCtx.lineTo(x, canvasHeight);
  }

  for (let y = 0; y <= canvasHeight; y += 20) {
    snakeBoardCtx.moveTo(0, y);
    snakeBoardCtx.lineTo(canvasWidth, y);
  }

  snakeBoardCtx.stroke();
};

const gameFrame = (timestamp) => {
  let step = Math.trunc(timestamp / frameSpeedRate);
  if (lastTimestampFrame !== step) {
    renderCanvas();
    lastTimestampFrame = step;
    render();
  }
  let frameId = window.requestAnimationFrame(gameFrame);
  if (stop) window.cancelAnimationFrame(frameId);
};
window.requestAnimationFrame(gameFrame);
