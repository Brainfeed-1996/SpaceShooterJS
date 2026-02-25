const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
const scoreEl = document.getElementById('score');
let score = 0;
let playerX = window.innerWidth / 2;

// Movement
document.addEventListener('mousemove', (e) => {
    playerX = e.clientX;
    player.style.left = playerX + 'px';
});

// Shooting
document.addEventListener('click', () => {
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.left = (playerX - 2) + 'px';
    bullet.style.bottom = '70px';
    gameArea.appendChild(bullet);

    let bulletPos = 70;
    const bulletInterval = setInterval(() => {
        bulletPos += 10;
        bullet.style.bottom = bulletPos + 'px';

        // Collision Check
        const enemies = document.getElementsByClassName('enemy');
        for (let enemy of enemies) {
            if (isColliding(bullet, enemy)) {
                enemy.remove();
                bullet.remove();
                clearInterval(bulletInterval);
                score += 100;
                scoreEl.textContent = score;
                createExplosion(enemy.offsetLeft, enemy.offsetTop);
            }
        }

        if (bulletPos > window.innerHeight) {
            bullet.remove();
            clearInterval(bulletInterval);
        }
    }, 20);
});

// Enemy Spawn
setInterval(() => {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.style.left = Math.random() * (window.innerWidth - 40) + 'px';
    enemy.style.top = '-50px';
    gameArea.appendChild(enemy);

    let enemyPos = -50;
    const enemyInterval = setInterval(() => {
        enemyPos += 3;
        enemy.style.top = enemyPos + 'px';

        if (enemyPos > window.innerHeight) {
            enemy.remove();
            clearInterval(enemyInterval);
        }
    }, 20);
}, 1000);

function isColliding(a, b) {
    const rect1 = a.getBoundingClientRect();
    const rect2 = b.getBoundingClientRect();
    return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}

function createExplosion(x, y) {
    const exp = document.createElement('div');
    exp.style.position = 'absolute';
    exp.style.left = x + 'px';
    exp.style.top = y + 'px';
    exp.style.width = '10px';
    exp.style.height = '10px';
    exp.style.background = '#ff0055';
    exp.style.borderRadius = '50%';
    exp.style.boxShadow = '0 0 20px #ff0055';
    exp.style.transition = 'all 0.5s';
    gameArea.appendChild(exp);
    setTimeout(() => {
        exp.style.transform = 'scale(5)';
        exp.style.opacity = '0';
        setTimeout(() => exp.remove(), 500);
    }, 10);
}
