const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let trexImage = new Image();
trexImage.src = 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Chromium_T-Rex-error-offline.svg';

let trex = {
    x: 50,
    y: 260,
    width: 40,
    height: 40,
    velocityY: 0,
    gravity: 0.9,
    isJumping: false
};

let obstacles = [];
let frameCount = 0;
let isGameOver = false;
let score = 0;
let gameSpeed = 5; // Initial speed

document.addEventListener('keydown', function (event) {
    if ((event.key === ' ' || event.key === 'ArrowUp') && !trex.isJumping && !isGameOver) {
        jump();
    }
});

document.addEventListener('touchstart', function () {
    if (!trex.isJumping && !isGameOver) {
        jump();
    }
});

function jump() {
    trex.isJumping = true;
    trex.velocityY = -15;
}

function update() {
    if (isGameOver) return;

    // Apply gravity
    trex.velocityY += trex.gravity;
    trex.y += trex.velocityY;

    if (trex.y >= 260) {
        trex.y = 260;
        trex.isJumping = false;
        trex.velocityY = 0;
    }

    // Spawn obstacles
    if (frameCount % 150 === 0) {
        let obstacle = {
            x: canvas.width,
            y: 270,
            width: 30,
            height: 30
        };
        obstacles.push(obstacle);
    }

    // Update obstacles
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= gameSpeed;
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
            
            // Increase speed every 15 points
            if (score % 15 === 0) {
                gameSpeed *= 1.5;
            }
        }

        // Check for collision
        if (
            trex.x < obstacle.x + obstacle.width &&
            trex.x + trex.width > obstacle.x &&
            trex.y < obstacle.y + obstacle.height &&
            trex.y + trex.height > obstacle.y
        ) {
            isGameOver = true;
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Trex
    ctx.drawImage(trexImage, trex.x, trex.y, trex.width, trex.height);

    // Draw obstacles
    ctx.fillStyle = '#555';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 20, 30);

    // Draw game over text
    if (isGameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2);
    }
}

function gameLoop() {
    frameCount++;
    update();
    draw();
    if (!isGameOver) {
        requestAnimationFrame(gameLoop);
    }
}

requestAnimationFrame(gameLoop);