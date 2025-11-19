const hero = document.getElementById("hero");
const game = document.getElementById("game");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const gameOver = document.getElementById("game-over");

let score = 0;
let lives = 3;
let gameRunning = true;

// سه مسیر افقی
const lanes = [50, 155, 260];
let currentLane = 1; // شروع در مسیر وسط

hero.style.left = lanes[currentLane] + "px";

// لمس چپ/راست برای حرکت بین مسیرها
game.addEventListener("touchstart", e => {
    if (!gameRunning) return;

    const x = e.touches[0].clientX;
    const middle = window.innerWidth / 2;

    if (x < middle && currentLane > 0) {
        currentLane--;
    } else if (x >= middle && currentLane < lanes.length - 1) {
        currentLane++;
    }

    hero.style.left = lanes[currentLane] + "px";
}, {passive: false});

// کلاس آیتم
class Item {
    constructor(img, type) {
        this.img = document.createElement("img");
        this.img.src = img;
        this.img.classList.add("item");
        this.type = type;
        this.y = -60;
        this.lane = lanes[Math.floor(Math.random() * lanes.length)];
        this.img.style.left = this.lane + "px";
        this.img.style.top = this.y + "px";
        game.appendChild(this.img);
    }

    update() {
        if (!gameRunning) return;
        this.y += 5; // سرعت آیتم
        this.img.style.top = this.y + "px";

        if (this.y > game.offsetHeight) {
            this.destroy();
        }

        // بررسی برخورد با گربه
        const hRect = hero.getBoundingClientRect();
        const iRect = this.img.getBoundingClientRect();

        if (
            hRect.left < iRect.right &&
            hRect.right > iRect.left &&
            hRect.top < iRect.bottom &&
            hRect.bottom > iRect.top
        ) {
            if (this.type === "food") {
                score++;
                scoreEl.textContent = "امتیاز: " + score;
            } else {
                lives--;
                livesEl.textContent = "جان: " + lives;
                if (lives <= 0) {
                    gameOver.style.display = "block";
                    gameRunning = false;
                    document.querySelectorAll(".item").forEach(i => i.remove());
                }
            }
            this.destroy();
        }
    }

    destroy() {
        if (this.img.parentNode) this.img.parentNode.removeChild(this.img);
    }
}

let items = [];
let spawnCounter = 0;

// اسپاون و حرکت آیتم‌ها
function gameLoop() {
    if (!gameRunning) return;

    spawnCounter++;
    if (spawnCounter % 60 === 0) items.push(new Item("food.png", "food"));
    if (spawnCounter % 90 === 0) items.push(new Item("trap.png", "trap"));

    items.forEach(item => item.update());
    requestAnimationFrame(gameLoop);
}

// شروع بازی
gameLoop();
