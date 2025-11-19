const hero = document.getElementById("hero");
const game = document.getElementById("game");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const gameOverEl = document.getElementById("game-over");

let score = 0;
let lives = 3;
let heroX = window.innerWidth / 2 - 65; // مطابق CSS
const heroWidth = 130;
const heroHeight = 130;

const items = [];
const itemSpeed = 3;

// ایجاد آیتم تصادفی
function createItem() {
    const item = document.createElement("div");
    const type = Math.random() < 0.5 ? "food" : "trap";
    item.classList.add(type);
    game.appendChild(item);

    const size = type === "food" ? 90 : 100;
    item.style.width = size + "px";
    item.style.height = size + "px";

    item.style.left = Math.random() * (window.innerWidth - size) + "px";
    item.style.top = "-100px";
    items.push({el: item, type: type, size: size});
}

// حرکت آیتم‌ها
function moveItems() {
    for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        const top = parseInt(it.el.style.top);
        it.el.style.top = top + itemSpeed + "px";

        // برخورد با گربه
        const heroTop = hero.offsetTop;
        const heroBottom = heroTop + heroHeight;
        const heroLeft = heroX;
        const heroRight = heroX + heroWidth;

        const itemTop = it.el.offsetTop;
        const itemBottom = itemTop + it.size;
        const itemLeft = parseInt(it.el.style.left);
        const itemRight = itemLeft + it.size;

        if (!(heroRight < itemLeft || heroLeft > itemRight || heroBottom < itemTop || heroTop > itemBottom)) {
            // برخورد
            if (it.type === "food") score++;
            else if (it.type === "trap") lives--;

            updateScoreLives();

            it.el.remove();
            items.splice(i, 1);
            continue;
        }

        // حذف آیتم اگر از پایین صفحه رد شد
        if (top > window.innerHeight) {
            it.el.remove();
            items.splice(i, 1);
        }
    }
}

// آپدیت نمایش امتیاز و جان
function updateScoreLives() {
    scoreEl.textContent = "Score: " + score;
    livesEl.textContent = "Lives: " + lives;
    if (lives <= 0) {
        gameOverEl.style.display = "block";
        clearInterval(gameLoop);
        clearInterval(itemSpawner);
    }
}

// کنترل لمسی
let touchStartX = 0;
document.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
});
document.addEventListener("touchmove", e => {
    const touchX = e.touches[0].clientX;
    const delta = touchX - touchStartX;
    heroX += delta;
    if (heroX < 0) heroX = 0;
    if (heroX > window.innerWidth - heroWidth) heroX = window.innerWidth - heroWidth;
    hero.style.left = heroX + "px";
    touchStartX = touchX;
});

// حلقه اصلی بازی
function gameTick() {
    moveItems();
}

// ایجاد آیتم هر 1 ثانیه
const itemSpawner = setInterval(createItem, 1000);
const gameLoop = setInterval(gameTick, 20);
