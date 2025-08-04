const rows = 21;
const cols = 21;
let maze = [];
let player = { x: 1, y: 1 };
let start = { x: 1, y: 1 };
let end = { x: cols - 2, y: rows - 2 };
let timer = 0, level = 1, interval;
const timeLimit = 60;

const container = document.getElementById("maze-container");
const timeDisplay = document.getElementById("time");
const levelDisplay = document.getElementById("level");

function createMaze() {
  maze = Array.from({ length: rows }, () => Array(cols).fill(1));
  function carve(x, y) {
    const dirs = [[2, 0], [-2, 0], [0, 2], [0, -2]].sort(() => Math.random() - 0.5);
    maze[y][x] = 0;
    for (let [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx > 0 && ny > 0 && nx < cols - 1 && ny < rows - 1 && maze[ny][nx] === 1) {
        maze[y + dy / 2][x + dx / 2] = 0;
        carve(nx, ny);
      }
    }
  }
  carve(1, 1);
  maze[start.y][start.x] = 0;
  maze[end.y][end.x] = 0;
}

function drawMaze() {
  container.innerHTML = '';
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const div = document.createElement('div');
      div.classList.add('cell');
      if (x === player.x && y === player.y) div.textContent = '🟢';
      else if (x === start.x && y === start.y) div.textContent = '🔵';
      else if (x === end.x && y === end.y) div.textContent = '🚪';
      else div.textContent = maze[y][x] === 1 ? '🟥' : '⬛';
      container.appendChild(div);
    }
  }
}

function movePlayer(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;
  if (maze[ny][nx] === 0) {
    player.x = nx;
    player.y = ny;
    drawMaze();
    if (nx === end.x && ny === end.y) levelComplete();
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' || e.key === 'w') movePlayer(0, -1);
  if (e.key === 'ArrowDown' || e.key === 's') movePlayer(0, 1);
  if (e.key === 'ArrowLeft' || e.key === 'a') movePlayer(-1, 0);
  if (e.key === 'ArrowRight' || e.key === 'd') movePlayer(1, 0);
});

function startTimer() {
  clearInterval(interval);
  timer = 0;
  interval = setInterval(() => {
    timer++;
    const m = String(Math.floor(timer / 60)).padStart(2, '0');
    const s = String(timer % 60).padStart(2, '0');
    timeDisplay.textContent = `${m}:${s}`;
    if (timer >= timeLimit) levelFailed();
  }, 1000);
}

function levelComplete() {
  clearInterval(interval);
  document.getElementById("level-complete").classList.remove("hidden");
}

function levelFailed() {
  clearInterval(interval);
  document.getElementById("level-failed").classList.remove("hidden");
}

window.nextLevel = () => {
  level++;
  levelDisplay.textContent = level;
  document.getElementById("level-complete").classList.add("hidden");
  startGame();
};

window.retryLevel = () => {
  document.getElementById("level-failed").classList.add("hidden");
  startGame();
};

function startGame() {
  player = { x: 1, y: 1 };
  createMaze();
  drawMaze();
  startTimer();
}

startGame();
