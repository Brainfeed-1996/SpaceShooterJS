const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
let playerX = (window.innerWidth - 50) / 2;
let bullets = [];
let enemies = [];
let gameInterval;
let enemyInterval;

document.addEventListener("keydown", movePlayer);
document.addEventListener("keydown", shoot);

function movePlayer(event) {
  const speed = 10;
  if (event.key === "ArrowLeft" && playerX > 0) {
    playerX -= speed;
  }
  if (event.key === "ArrowRight" && playerX < window.innerWidth - 50) {
    playerX += speed;
  }
  player.style.left = playerX + "px";
}

function shoot(event) {
  if (event.key === " ") {
    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullet.style.left = playerX + 22.5 + "px";
    bullet.style.bottom = "60px";
    gameArea.appendChild(bullet);
    bullets.push(bullet);
  }
}

function moveBullets() {
  bullets.forEach((bullet, index) => {
    const bottom = parseInt(bullet.style.bottom);
    if (bottom > window.innerHeight) {
      bullet.remove();
      bullets.splice(index, 1);
    } else {
      bullet.style.bottom = bottom + 10 + "px";
    }
  });
}

function createEnemy() {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.left = Math.random() * (window.innerWidth - 40) + "px";
  gameArea.appendChild(enemy);
  enemies.push(enemy);
}

function moveEnemies() {
  enemies.forEach((enemy, index) => {
    const top = parseInt(enemy.style.top);
    if (top > window.innerHeight) {
      enemy.remove();
      enemies.splice(index, 1);
    } else {
      enemy.style.top = top + 5 + "px";
    }
  });
}

function checkCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    const bulletRect = bullet.getBoundingClientRect();
    enemies.forEach((enemy, enemyIndex) => {
      const enemyRect = enemy.getBoundingClientRect();
      if (
        bulletRect.top <= enemyRect.bottom &&
        bulletRect.bottom >= enemyRect.top &&
        bulletRect.left <= enemyRect.right &&
        bulletRect.right >= enemyRect.left
      ) {
        bullet.remove();
        enemy.remove();
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
      }
    });
  });
}

function gameLoop() {
  moveBullets();
  moveEnemies();
  checkCollisions();
}

function startGame() {
  gameInterval = setInterval(gameLoop, 30);
  enemyInterval = setInterval(createEnemy, 1000);
}

startGame();
