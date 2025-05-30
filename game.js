
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('playButton');
const scoreDisplay = document.getElementById('score');

let gameActive = false;
let ball = null;
let batX = 100;
let score = 0;
let strikes = 0;
let pitchInfo = '';

const pitchTypes = {
  white: { speed: 4, description: "Straight ball (Easy)" },
  blue: { speed: 3, description: "Curveball (Medium)" },
  green: { speed: 2.5, description: "Swirling ball (Hard)" },
  yellow: { speed: 5, description: "Zig-zag ball (Fast)" },
  purple: { speed: 4, description: "Invisible mid-way (Tricky)" },
  red: { speed: 7, description: "Super fast (Very hard)" },
  orange: { speed: 3.5, description: "Bounce ball (Unpredictable)" },
  black: { speed: 6, description: "Teleport ball (Random shift)" }
};

function resetBall() {
  const colors = Object.keys(pitchTypes);
  const color = colors[Math.floor(Math.random() * colors.length)];
  pitchInfo = pitchTypes[color].description;
  const vx = -pitchTypes[color].speed;
  return { x: 800, y: 200, vx, vy: 0, color };
}

function drawField() {
  ctx.fillStyle = '#d6f0ff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.fillRect(batX, 170, 10, 60); // bat

  ctx.fillStyle = '#000';
  ctx.font = '18px Arial';
  ctx.fillText(`Pitch: ${pitchInfo}`, 10, 30);
  ctx.fillText(`Strikes: ${strikes}`, 10, 50);
}

function drawBall(ball) {
  if (ball.color === 'purple' && ball.x < 500) return; // invisible ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

function updateBall(ball) {
  if (ball.color === 'orange') {
    ball.vy = Math.sin(ball.x / 40) * 2;
  } else if (ball.color === 'black') {
    if (Math.random() < 0.01) ball.y += (Math.random() - 0.5) * 100;
  }
  ball.x += ball.vx;
  ball.y += ball.vy || 0;
}

function updateGame() {
  if (!gameActive || !ball) return;

  updateBall(ball);
  drawField();
  drawBall(ball);

  if (ball.x < batX + 10 && ball.x > batX) {
    if (hitAttempted) {
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      ball = resetBall();
    } else if (ball.x < 0) {
      strikes++;
      if (strikes >= 3) {
        gameActive = false;
        alert('Game Over! Final Score: ' + score);
      }
      ball = resetBall();
    }
  }

  hitAttempted = false;
  if (gameActive) requestAnimationFrame(updateGame);
}

let hitAttempted = false;
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    hitAttempted = true;
  }
});

playButton.onclick = () => {
  score = 0;
  strikes = 0;
  gameActive = true;
  scoreDisplay.textContent = `Score: ${score}`;
  ball = resetBall();
  updateGame();
};
