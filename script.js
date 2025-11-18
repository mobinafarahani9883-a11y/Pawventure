const player = document.getElementById('player');
const food = document.getElementById('food');
const powerup = document.getElementById('powerup');
const obstacle = document.getElementById('obstacle');
const scoreDisplay = document.getElementById('score');

const lanes = [50, 175, 300]; // سه مسیر
let laneIndex = 1; // مسیر شروع
let score = 0;
let gameSpeed = 2;
let shieldActive = false;
let doubleScoreActive = false;

// موقعیت آیتم‌ها
let foodPos = { lane: Math.floor(Math.random()*3), y: -50 };
let powerupPos = { lane: Math.floor(Math.random()*3), y: -200 };
let obstaclePos = { lane: Math.floor(Math.random()*3), y: -150 };

// حرکت گربه با کلید
document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowLeft' && laneIndex>0) laneIndex--;
    if(e.key === 'ArrowRight' && laneIndex<2) laneIndex++;
    player.style.left = lanes[laneIndex] + 'px';
});

// تابع بررسی برخورد
function checkCollision(itemPos){
    return (itemPos.y + 40 >= 580 && itemPos.y <= 630 && laneIndex === itemPos.lane);
}

// تابع بازی
function updateGame(){
    // حرکت آیتم‌ها
    foodPos.y += gameSpeed;
    obstaclePos.y += gameSpeed;
    powerupPos.y += gameSpeed;

    food.style.top = foodPos.y + 'px';
    food.style.left = lanes[foodPos.lane] + 'px';

    obstacle.style.top = obstaclePos.y + 'px';
    obstacle.style.left = lanes[obstaclePos.lane] + 'px';

    powerup.style.top = powerupPos.y + 'px';
    powerup.style.left = lanes[powerupPos.lane] + 'px';

    // جمع کردن غذا
    if(checkCollision(foodPos)){
        score += doubleScoreActive ? 20 : 10;
        foodPos = { lane: Math.floor(Math.random()*3), y: -50 };
    }

    // جمع کردن Power-up
    if(checkCollision(powerupPos)){
        shieldActive = true;
        doubleScoreActive = true;
        setTimeout(()=>{ shieldActive=false; doubleScoreActive=false; }, 5000);
        powerupPos = { lane: Math.floor(Math.random()*3), y: -200 };
    }

    // برخورد با تله
    if(checkCollision(obstaclePos)){
        if(shieldActive){
            obstaclePos = { lane: Math.floor(Math.random()*3), y: -150 };
        }else{
            alert('باختی! امتیاز: '+score);
            score = 0;
            gameSpeed = 2;
        }
    }

    // بازنشانی آیتم‌ها
    if(foodPos.y>600) foodPos = { lane: Math.floor(Math.random()*3), y: -50 };
    if(obstaclePos.y>600) obstaclePos = { lane: Math.floor(Math.random()*3), y: -50 };
    if(powerupPos.y>600) powerupPos = { lane: Math.floor(Math.random()*3), y: -200 };

    scoreDisplay.textContent = 'امتیاز: '+score;

    gameSpeed += 0.001; // افزایش تدریجی سرعت

    requestAnimationFrame(updateGame);
}

updateGame();
