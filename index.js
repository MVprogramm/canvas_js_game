const canvas = document.getElementById("breakout");
canvas.width = (canvas.height / window.innerHeight) * window.innerWidth;
const ctx = canvas.getContext("2d");

const ballRadius = canvas.width * 0.03;
let x = canvas.width / 2;
let y = canvas.height * 0.9;
const paddleHeight = canvas.height * 0.05;
const paddleWidth = canvas.width * 0.25;
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = canvas.width * 0.15;
const brickHeight = canvas.height * 0.07;
const brickPadding = canvas.width * canvas.height * 0.0001;
const brickOffsetTop = brickPadding;
const brickOffsetLeft =
  (canvas.width -
    (brickWidth * brickColumnCount + brickPadding * (brickColumnCount - 1))) /
  2;
let score = 0;
let gameStart = false;
let gameOver = false;
let isMouseDown = false;
let rightPressed = false;
let leftPressed = false;
let canvasScaleX = canvas.width / window.innerWidth;
let canvasScaleY = canvas.height / window.innerHeight;
let paddleX = (canvas.width - paddleWidth) / 2;
let dx = 2;
let dy = -2;
let randomColor = "ff0000"; // Math.floor(Math.random() * 16777215).toString(16);

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = `#${randomColor}`;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  const size = canvas.width * 0.1;
  ctx.font = `${size}px Arial`;
  ctx.fillStyle = "#f0f0f0";
  ctx.fillText(`Score: ${score}`, canvas.width / 3, (canvas.height * 3) / 5);
}

function draw() {
  ctx.beginPath();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (gameStart) {
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
      // randomColor = Math.floor(Math.random() * 16777215).toString(16);
    }
    if (y + dy < ballRadius) {
      dy = -dy;
      // randomColor = Math.floor(Math.random() * 16777215).toString(16);
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth && !gameOver) {
        dy = -dy;
      } else {
        gameOver = true;
        if (y + dy > canvas.height + ballRadius * 1.5) {
          alert("GAME OVER");
          document.location.reload();
        }
      }
    }

    x += dx;
    y += dy;

    if (rightPressed) {
      paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
    } else if (leftPressed) {
      paddleX = Math.max(paddleX - 7, 0);
    }

    drawBall();
    drawBricks();
    drawScore();
  }
  drawPaddle();
  collisionDetection();

  ctx.closePath();
  requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", onMouseMove);
document.addEventListener("mousedown", onMouseDown);
document.addEventListener("mouseup", onMouseUp);

function onMouseMove(e) {
  let mouseX = Math.round(e.pageX * canvasScaleX);
  let mouseY = Math.round(e.pageY * canvasScaleY);
  if (
    mouseX > paddleX &&
    mouseX < paddleX + paddleWidth &&
    mouseY > canvas.height - paddleHeight
  ) {
    document.getElementById("breakout").style.cursor = "pointer";
  } else {
    document.getElementById("breakout").style.cursor = "Default";
  }

  if (isMouseDown) paddleX = e.pageX * canvasScaleX;
}

function onMouseDown(e) {
  let mouseX = Math.round(e.pageX * canvasScaleX);
  let mouseY = Math.round(e.pageY * canvasScaleY);
  if (
    mouseX > paddleX &&
    mouseX < paddleX + paddleWidth &&
    mouseY > canvas.height - paddleHeight
  ) {
    gameStart = true;
    isMouseDown = true;
  }
}

function onMouseUp(e) {
  isMouseDown = false;
}

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
        }
      }
    }
  }
}

draw();
