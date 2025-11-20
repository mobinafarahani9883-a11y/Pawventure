const hero = document.getElementById("hero"); 
const game = document.getElementById("game");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const gameOverEl = document.getElementById("game-over");

let score = 0;
let lives = 3;
let heroX = hero.offsetLeft;
const heroWidth = hero.offsetWidth;
const heroHeight = hero.offsetHeight;

const items = [];
let itemSpeed = 3;
let speedIncrease = 0;

// حرکت پس‌زمینه با دو لایه
let bgX = 0;
let bgSpeed = 2;

function moveBackground() {
    bgX -= bgSpeed;
    if (bgX <= -window.innerWidth) bgX = 0;
    game.style.backgroundPosition = `${bgX}px 0, ${bgX + window.innerWidth}px 0`;
}

// ایجاد آیتم
function createItem() {
    const item = document.createElement("div");
    const type = Math.random() < 0.5 ? "food" : "trap";
    item.classList.add("item", type);
    game.appendChild(item);

    const size = type === "food" ? 90 : 100;
    item.style.width = size + "px";
    item.style.height = size + "px";
    item.style.left = Math.random() * (window.innerWidth - size) + "px";
    item.style.top = "-100px"; 
    items.push({el: item, type: type, size: size, originalLeft: parseInt(item.style.left)});
}

// حرکت آیتم‌ها
function moveItems() {
    for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        let top = parseFloat(it.el.style.top);
        top += itemSpeed + speedIncrease;
        it.el.style.top = top + "px";

        // حرکت جانبی طبیعی
        const sideShift = Math.sin(top / 50 + i) * 5;
        it.el.style.left = it.originalLeft + sideShift + "px";

        const heroTop = hero.offsetTop;
        const heroBottom = heroTop + heroHeight;
        const heroLeft = heroX;
        const heroRight = heroX + heroWidth;

        const itemTop = it.el.offsetTop;
        const itemBottom = itemTop + it.size;
        const itemLeft = parseInt(it.el.style.left);
        const itemRight = itemLeft + it.size;

        if (!(heroRight < itemLeft || heroLeft > itemRight || heroBottom < itemTop || heroTop > itemBottom)) {
            if (it.type === "food") {
                score++;
                showScoreEffect(heroX + heroWidth/2, hero.offsetTop, "+1");
            } else if (it.type === "trap") lives--;
            updateScoreLives();
            it.el.remove();
            items.splice(i, 1);
            continue;
        }

        if (top > window.innerHeight) {
            it.el.remove();
            items.splice(i, 1);
        }
    }
}

// آپدیت امتیاز و جان
function updateScoreLives() {
    scoreEl.textContent = "Score: " + score;
    livesEl.textContent = "Lives: " + lives;
    if (lives <= 0) {
        gameOverEl.style.display = "block";
        clearInterval(gameLoop);
        clearInterval(itemSpawner);
    }
}

// افکت امتیاز
function showScoreEffect(x, y, text) {
    const effect = document.createElement("div");
    effect.textContent = text;
    effect.style.position = "absolute";
    effect.style.left = x + "px";
    effect.style.top = y + "px";
    effect.style.color = "yellow";
    effect.style.fontWeight = "bold";
    effect.style.fontSize = "24px";
    effect.style.transition = "all 0.5s ease-out";
    game.appendChild(effect);

    setTimeout(() => {
        effect.style.top = (y - 50) + "px";
        effect.style.opacity = 0;
        effect.style.transform = "scale(1.2)";
    }, 20);

    setTimeout(() => effect.remove(), 520);
}

// کنترل لمسی
let touchStartX = 0;
document.addEventListener("touchstart", e => touchStartX = e.touches[0].clientX);
document.addEventListener("touchmove", e => {
    const touchX = e.touches[0].clientX;
    const delta = touchX - touchStartX;
    heroX += delta;
    if (heroX < 0) heroX = 0;
    if (heroX > window.innerWidth - heroWidth) heroX = window.innerWidth - heroWidth;
    hero.style.left = heroX + "px";
    touchStartX = touchX;
});

// حلقه اصلی
function gameTick() {
    moveBackground();
    moveItems();
    speedIncrease += 0.0005;
}

const itemSpawner = setInterval(createItem, 1000);
const gameLoop = setInterval(gameTick, 20);
