// variables
const canvasWidth = 400;
const canvasHeight = 400;

// colors
const canvasBorderColor = "black";
const canvasBackgroundColor = "white";
const snakeColor = "lightblue";
const snakeBorderColor = "darkblue";

const fruit = {
  color: "#de4f54",
  fruitX: undefined,
  fruitY: undefined,
};

// context
const snakeCanvas = document.getElementById("snakeboard");
const snakeBoardCtx = snakeCanvas.getContext("2d");

const frameSpeedRate = 125;

// initial snake speed
let dx = 10;
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
  { x: 210, y: 200 },
  { x: 220, y: 200 },
  { x: 230, y: 200 },
];

snakeBoardCtx.canvas.width = canvasWidth;
snakeBoardCtx.canvas.height = canvasHeight;

let stop = false;

const render = () => {
  renderBoard();
  if (checkCollisions()) stop = true;
  renderSnake();
  if (!fruit.fruitX && !fruit.fruitY) createRandomFruit();
  renderFruit();
  // checkEat();
};

const checkEat = () => {
  const { fruitX, fruitY } = fruit;
  console.log("fruitX", fruitX);
  console.log("fruitY", fruitY);
  if (snake[0].x === fruitX && snake[0].y === fruitY) {
    fruit.fruitX = undefined;
    fruit.fruitY = undefined;
    snake[snake.length] = {
      x: snake[snake.length - 1].x + 10,
      y: snake[snake.length - 1].y + 10,
    };
    console.log("Eat!");
  }
};

const renderFruit = () => {
  snakeBoardCtx.fillStyle = fruit.color;
  snakeBoardCtx.fillRect(fruit.fruitX, fruit.fruitY, 10, 10);
};

const checkCollisions = () => {
  console.log(`head[x] = ${snake[0].x}`);
  console.log(`head[y] = ${snake[0].y}`);
  if (
    (snake[0].x === canvasWidth - 10 && dx === 10) ||
    snake[0].x <= 0 ||
    snake[0].y <= 0 ||
    (snake[0].y >= canvasHeight - 10 && dy === 10)
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
  snakeBoardCtx.strokestyle = canvasBorderColor;
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
    snakeBoardCtx.strokestyle = snakeBorderColor;
    snakeBoardCtx.fillRect(x, y, 10, 10);
    snakeBoardCtx.strokeRect(x, y, 10, 10);
  });
};

const moveKeyboardListener = ({ keyCode }) => {
  let goingUp = dy === -10;
  let goingDown = dy === 10;
  let goingRight = dx === 10;
  let goingLeft = dx === -10;

  switch (keyCode) {
    case LEFT_KEY:
      if (!goingRight) {
        dx = -10;
        dy = 0;
      }
      break;

    case UP_KEY:
      if (!goingDown) {
        dx = 0;
        dy = -10;
      }
      break;

    case RIGHT_KEY:
      if (!goingLeft) {
        dx = 10;
        dy = 0;
      }
      break;

    case DOWN_KEY:
      if (!goingUp) {
        dx = 0;
        dy = 10;
      }
      break;
  }
};

const createRandomFruit = () => {
  let stopSearching = false;
  do {
    fruit.fruitX = Math.round((Math.random() * canvasWidth) / 10) * 10;
    fruit.fruitY = Math.round((Math.random() * canvasHeight) / 10) * 10;

    stopSearching = snake.some(
      ({ x, y }) => x === fruit.fruitX || y === fruit.fruitY
    );
  } while (!stopSearching);
};

document.addEventListener("keydown", moveKeyboardListener);

const gameFrame = (timestamp) => {
  let step = Math.trunc(timestamp / frameSpeedRate);
  if (lastTimestampFrame !== step) {
    lastTimestampFrame = step;
    render();
  }
  let frameId = window.requestAnimationFrame(gameFrame);
  if (stop) window.cancelAnimationFrame(frameId);
};
window.requestAnimationFrame(gameFrame);
