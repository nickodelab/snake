const board_border = "black";
const board_background = "white";
const snake_col = "lightblue";
const snake_border = "darkblue";

const snakeboard = document.getElementById("snakeboard");
const snakeboard_ctx = snakeboard.getContext("2d");

const snake = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 },
];

const gameSpeed = 125;

let dx = 10;
let dy = 0;

let lastTimestampFrame;
const gameFrame = (timestamp) => {
  let step = Math.trunc(timestamp / gameSpeed);
  if (lastTimestampFrame !== step) {
    lastTimestampFrame = step;
    game();
  }
  window.requestAnimationFrame(gameFrame);
};
window.requestAnimationFrame(gameFrame);

const drawSnake = () => {
  snake.forEach(drawSnakePart);
};

const clear_board = () => {
  snakeboard_ctx.fillStyle = board_background;
  snakeboard_ctx.strokestyle = board_border;
  snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
  snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
};

const drawSnakePart = (snakePart) => {
  snakeboard_ctx.fillStyle = snake_col;
  snakeboard_ctx.strokestyle = snake_border;
  snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
};

const move_snake = () => {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  snake.unshift(head);
  snake.pop();
};

const change_direction = (event) => {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }

  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }

  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }

  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
};

const game = () => {
  clear_board();
  move_snake();
  drawSnake();
};
game();

document.addEventListener("keydown", change_direction);
