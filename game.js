let hero = document.getElementById("hero");
let game = document.getElementById("game");
let scoreEl = document.getElementById("score");
let livesEl = document.getElementById("lives");
let gameOver = document.getElementById("game-over");

let score = 0;
let lives = 3;
let heroX = 155;
let gameRunning = true; // وضعیت بازی

// حرکت لمسی گربه
game.addEventListener("touchmove", e => {
    e.preventDefault();
    if (!gameRunning) return; // اگر بازی تمام شده، حرکت غیرفعال
    let x = e.touches[0].clientX - game.getBoundingClientRect().left;
    heroX = x - hero.offsetWidth / 2;
    if (heroX < 0) heroX = 0;
    if (heroX > game.offsetWidth - hero.offsetWidth) heroX = game.offsetWidth - hero.offsetWidth;
    hero.style.left = heroX + "px";
}, {passive: false});

// ایجاد آیتم (غذا یا تله)
function spawnItem(img, type) {
    if (!gameRunning) return; // اگر بازی تمام شده، آیتم جدید ساخته نشود

    let item = document.createElement("img");
    item.src = img;
    item.classList.add("item");
    item.dataset.type = type;
    item.style.left = Math.random() * (game.offsetWidth - 60) + "px";
    item.style.top = "-60px";
    game.appendChild(item);

    let y = -60;
    let fall = setInterval(() => {
        if (!gameRunning) { 
            item.remove(); 
            clearInterval(fall); 
            return; 
        }

        y += 5;
        item.style.top = y + "px";

        if (y > game.offsetHeight) {
            item.remove();
            clearInterval(fall);
        }

        let hRect = hero.getBoundingClientRect();
        let iRect = item.getBoundingClientRect();

        if (
            hRect.left < iRect.right &&
            hRect.right > iRect.left &&
            hRect.top < iRect.bottom &&
            hRect.bottom > iRect.top
        ) {
            if (item.dataset.type === "food") {
                score++;
                scoreEl.textContent = "امتیاز: " + score;
            } else {
                lives--;
                livesEl.textContent = "جان: " + lives;
                if (lives <= 0) {
                    gameOver.style.display = "block";
                    gameRunning = false; // توقف کامل بازی
                    clearInterval(foodInterval);
                    clearInterval(trapInterval);
                }
            }
            item.remove();
            clearInterval(fall);
        }
    }, 20);
}

// اسپاون آیتم‌ها با interval
let foodInterval = setInterval(() => { spawnItem("food.png", "food"); }, 1200);
let trapInterval = setInterval(() => { spawnItem("trap.png", "trap"); }, 1800);
