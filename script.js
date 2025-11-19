// متغیرهای بازی
let lives = 3;
let score = 0;

// دسترسی به container بازی و score
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');

// اندازه‌ها
const catWidth = 120;
const catHeight = 120;

// گرفتن گربه
const cat = document.getElementById('cat');
cat.style.width = catWidth + 'px';
cat.style.height = catHeight + 'px';
cat.style.left = '50px';
cat.style.bottom = '20px';

// حرکت لمسی گربه
let touchStartX = 0;
cat.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
});

cat.addEventListener('touchmove', function(e) {
    let touchX = e.touches[0].clientX;
    let deltaX = touchX - touchStartX;
    let currentLeft = parseInt(cat.style.left);
    let newLeft = currentLeft + deltaX;
    if(newLeft < 0) newLeft = 0;
    if(newLeft > window.innerWidth - catWidth) newLeft = window.innerWidth - catWidth;
    cat.style.left = newLeft + 'px';
    touchStartX = touchX;
});

// تابع ایجاد غذا
function spawnFood() {
    let food = document.createElement('div');
    food.classList.add('item');
    food.style.width = '60px';
    food.style.height = '60px';
    food.style.position = 'absolute';
    food.style.left = Math.random() * (window.innerWidth - 60) + 'px';
    food.style.top = Math.random() * (window.innerHeight - 200) + 'px';
    food.style.backgroundImage = "url('food.png')";
    food.style.backgroundSize = 'cover';
    gameContainer.appendChild(food);

    // برخورد گربه با غذا
    food.interval = setInterval(function() {
        if(checkCollision(cat, food)) {
            score += 10;
            updateScore();
            clearInterval(food.interval);
            food.remove();
            spawnFood(); // یک غذای جدید ظاهر شود
        }
    }, 50);
}

// تابع ایجاد تله
function spawnTrap() {
    let trap = document.createElement('div');
    trap.classList.add('item');
    trap.style.width = '60px';
    trap.style.height = '60px';
    trap.style.position = 'absolute';
    trap.style.left = Math.random() * (window.innerWidth - 60) + 'px';
    trap.style.top = Math.random() * (window.innerHeight - 200) + 'px';
    trap.style.backgroundImage = "url('trap.png')";
    trap.style.backgroundSize = 'cover';
    gameContainer.appendChild(trap);

    // برخورد گربه با تله
    trap.interval = setInterval(function() {
        if(checkCollision(cat, trap)) {
            lives -= 1;
            clearInterval(trap.interval);
            trap.remove();
            spawnTrap(); // یک تله جدید ظاهر شود
            if(lives <= 0) {
                alert("Game Over! Your score: " + score);
                location.reload(); // بازی دوباره راه‌اندازی شود
            }
        }
    }, 50);
}

// تابع بررسی برخورد دو عنصر
function checkCollision(a, b) {
    const rect1 = a.getBoundingClientRect();
    const rect2 = b.getBoundingClientRect();

    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
    );
}

// بروزرسانی امتیاز
function updateScore() {
    scoreDisplay.textContent = "Score: " + score + " | Lives: " + lives;
}

// شروع بازی
function startGame() {
    updateScore();
    spawnFood();
    spawnTrap();
}

window.onload = startGame;
