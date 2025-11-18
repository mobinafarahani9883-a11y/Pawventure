// -----------------------------
// Cat Collector - script.js
// -----------------------------

let cat = document.getElementById("cat");
let food = document.getElementById("food");
let trap = document.getElementById("trap");
let item = document.getElementById("item");
let scoreDisplay = document.getElementById("score");

let catX = 150;
let catY = 500;

let foodX = Math.floor(Math.random() * 300);
let foodY = -50;

let trapX = Math.floor(Math.random() * 300);
let trapY = -150;

let itemX = Math.floor(Math.random() * 300);
let itemY = -300;

let score = 0;

// -----------------------------
// حرکت گربه
// -----------------------------
function moveCat(dx, dy){
    catX += dx;
    catY += dy;

    if(catX < 0) catX = 0;
    if(catX > 300) catX = 300;
    if(catY < 0) catY = 0;
    if(catY > 550) catY = 550;

    cat.style.left = catX + "px";
    cat.style.top = catY + "px";
}

// -----------------------------
// کیبورد کنترل
// -----------------------------
document.addEventListener("keydown", function(e){
    if(e.key === "ArrowLeft") moveCat(-20,0);
    if(e.key === "ArrowRight") moveCat(20,0);
    if(e.key === "ArrowUp") moveCat(0,-20);
    if(e.key === "ArrowDown") moveCat(0,20);
});

// -----------------------------
// لمس موبایل
// -----------------------------
document.addEventListener("touchstart", function(e){
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    const w = window.innerWidth;
    const h = window.innerHeight;

    if(x < w/2) moveCat(-20,0);
    else moveCat(20,0);

    if(y < h/2) moveCat(0,-20);
    else moveCat(0,20);
});

// -----------------------------
// بروزرسانی اشیا
// -----------------------------
function updateObject(obj, posX, posY, speed){
    posY += speed;
    if(posY > 600){
        posY = -50;
        posX = Math.floor(Math.random() * 300);
    }
    obj.style.top = posY + "px";
    obj.style.left = posX + "px";
    return [posX,posY];
}

// -----------------------------
// بررسی برخورد
// -----------------------------
function checkCollision(objX, objY){
    return Math.abs(catX - objX) < 40 && Math.abs(catY - objY) < 40;
}

// -----------------------------
// Game Over و ری‌استارت
// -----------------------------
function gameOver(){
    alert("Game Over! Restarting...");
    catX = 150; catY = 500;
    foodX = Math.floor(Math.random() * 300); foodY = -50;
    trapX = Math.floor(Math.random() * 300); trapY = -150;
    itemX = Math.floor(Math.random() * 300); itemY = -300;
    score = 0;

    cat.style.left = catX + "px";
    cat.style.top = catY + "px";
    food.style.left = foodX + "px";
    food.style.top = foodY + "px";
    trap.style.left = trapX + "px";
    trap.style.top = trapY + "px";
    item.style.left = itemX + "px";
    item.style.top = itemY + "px";
    scoreDisplay.innerText = "Score: " + score;
}

// -----------------------------
// حلقه اصلی بازی
// -----------------------------
function gameLoop(){
    [foodX, foodY] = updateObject(food, foodX, foodY, 5);
    [trapX, trapY] = updateObject(trap, trapX, trapY, 7);
    [itemX, itemY] = updateObject(item, itemX, itemY, 4);

    // برخورد با غذا
    if(checkCollision(foodX, foodY)){
        score += 1;
        foodY = -50;
        foodX = Math.floor(Math.random() * 300);
        scoreDisplay.innerText = "Score: " + score;
    }

    // برخورد با آیتم ویژه
    if(checkCollision(itemX, itemY)){
        score += 5; // آیتم ویژه امتیاز بیشتر
        itemY = -300;
        itemX = Math.floor(Math.random() * 300);
        scoreDisplay.innerText = "Score: " + score;
    }

    // برخورد با تله
    if(checkCollision(trapX, trapY)){
        gameOver();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
