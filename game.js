let hero = document.getElementById("hero");
let game = document.getElementById("game");
let scoreEl = document.getElementById("score");
let livesEl = document.getElementById("lives");
let gameOver = document.getElementById("game-over");

let score = 0;
let lives = 3;
let heroX = 155;

// حرکت لمسی گربه
game.addEventListener("touchmove", e => {
    let x = e.touches[0].clientX - game.getBoundingClientRect().left;
    heroX = x - 40;
    if (heroX < 0) heroX = 0;
    if (heroX > 310) heroX = 310;
    hero.style.left = heroX + "px";
});

// ایجاد غذا یا تله
function spawnItem(img, type) {
    let item = document.createElement("img");
    item.src = img;
    item.classList.add("item");
    item.dataset.type = type;
    item.style.left = Math.random() * 320 + "px"; // جایگاه افقی تصادفی
    item.style.top = "-60px"; // از بالا شروع
    game.appendChild(item);

    let y = -60;
    let fall = setInterval(() => {
        y += 5; // حرکت مستقیم به سمت پایین
        item.style.top = y + "px";

        // خارج شدن از صفحه
        if (y > 700) {
            item.remove();
            clearInterval(fall);
        }

        // برخورد با گربه
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
                }
            }
            item.remove();
            clearInterval(fall);
        }
    }, 20);
}

// تولید خودکار غذا و تله
setInterval(() => { spawnItem("food.png", "food"); }, 1200);
setInterval(() => { spawnItem("trap.png", "trap"); }, 1800);
