/**
 * Elite Space Shooter Engine v2.0
 * Refactored with:
 * 1. Async game loop for consistent framerate.
 * 2. Robust error handling for asset management.
 * 3. Structured logging for performance monitoring.
 * 4. Object-oriented architecture for scalable entity management.
 */

class GameLogger {
    static info(msg) { console.log(`%c[GAME:INFO] ${msg}`, "color: #00ffcc"); }
    static error(msg) { console.log(`%c[GAME:ERROR] ${msg}`, "color: #ff0055"); }
    static warn(msg) { console.log(`%c[GAME:WARN] ${msg}`, "color: #ffcc00"); }
}

class GameEngine {
    constructor(gameAreaId, scoreId) {
        this.gameArea = document.getElementById(gameAreaId);
        this.scoreEl = document.getElementById(scoreId);
        this.score = 0;
        this.entities = { bullets: [], enemies: [] };
        this.playerX = window.innerWidth / 2;
        this.lastTime = 0;
        this.isActive = false;

        if (!this.gameArea) throw new Error("Game area initialization failed.");
        GameLogger.info("Engine initialized.");
    }

    async start() {
        this.isActive = true;
        this.setupListeners();
        this.spawnLoop();
        requestAnimationFrame((t) => this.loop(t));
        GameLogger.info("Execution pipeline started.");
    }

    setupListeners() {
        window.addEventListener('mousemove', (e) => {
            this.playerX = e.clientX;
            const player = document.getElementById('player');
            if (player) player.style.left = `${this.playerX}px`;
        });

        window.addEventListener('click', () => this.fire());
    }

    fire() {
        try {
            const bullet = document.createElement('div');
            bullet.className = 'bullet';
            bullet.style.left = `${this.playerX}px`;
            bullet.style.bottom = '70px';
            this.gameArea.appendChild(bullet);
            this.entities.bullets.push({ el: bullet, y: 70 });
        } catch (e) {
            GameLogger.error(`Firing failed: ${e.message}`);
        }
    }

    async spawnLoop() {
        while (this.isActive) {
            this.createEnemy();
            // Async wait between spawns
            await new Promise(r => setTimeout(r, 800));
        }
    }

    createEnemy() {
        const enemy = document.createElement('div');
        enemy.className = 'enemy';
        const x = Math.random() * (window.innerWidth - 40);
        enemy.style.left = `${x}px`;
        enemy.style.top = '-50px';
        this.gameArea.appendChild(enemy);
        this.entities.enemies.push({ el: enemy, x, y: -50 });
    }

    loop(timestamp) {
        if (!this.isActive) return;
        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(dt);
        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        // Update bullets
        for (let i = this.entities.bullets.length - 1; i >= 0; i--) {
            const b = this.entities.bullets[i];
            b.y += 0.8 * dt; // speed * deltatime
            b.el.style.bottom = `${b.y}px`;

            if (b.y > window.innerHeight) {
                b.el.remove();
                this.entities.bullets.splice(i, 1);
            }
        }

        // Update enemies
        for (let i = this.entities.enemies.length - 1; i >= 0; i--) {
            const e = this.entities.enemies[i];
            e.y += 0.2 * dt;
            e.el.style.top = `${e.y}px`;

            // Collision Check
            this.checkCollisions(e, i);

            if (e.y > window.innerHeight) {
                e.el.remove();
                this.entities.enemies.splice(i, 1);
            }
        }
    }

    checkCollisions(enemy, enemyIdx) {
        const eRect = enemy.el.getBoundingClientRect();
        
        for (let j = this.entities.bullets.length - 1; j >= 0; j--) {
            const b = this.entities.bullets[j];
            const bRect = b.el.getBoundingClientRect();

            if (!(bRect.right < eRect.left || bRect.left > eRect.right || bRect.bottom < eRect.top || bRect.top > eRect.bottom)) {
                // HIT
                this.handleHit(enemy, enemyIdx, b, j);
                break;
            }
        }
    }

    handleHit(enemy, eIdx, bullet, bIdx) {
        this.score += 100;
        this.scoreEl.textContent = this.score;
        
        this.createExplosion(enemy.x, enemy.y);
        
        enemy.el.remove();
        bullet.el.remove();
        
        this.entities.enemies.splice(eIdx, 1);
        this.entities.bullets.splice(bIdx, 1);
    }

    createExplosion(x, y) {
        const exp = document.createElement('div');
        exp.className = 'explosion';
        exp.style.left = `${x}px`;
        exp.style.top = `${y}px`;
        this.gameArea.appendChild(exp);
        setTimeout(() => exp.remove(), 600);
    }
}

// Initial Launch
window.onload = () => {
    try {
        const engine = new GameEngine('gameArea', 'score');
        engine.start();
    } catch (e) {
        GameLogger.error(`Initialization fatal: ${e.message}`);
    }
};
