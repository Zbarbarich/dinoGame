const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let trexImage = new Image();
let rockImage = new Image();
let cactusImage = new Image();
let imagesLoaded = 0;
const requiredImages = 3;

function startGame() {
    requestAnimationFrame(gameLoop);
}

// Add load handlers for both images
trexImage.onload = function() {
    imagesLoaded++;
    if (imagesLoaded === requiredImages) startGame();
};

rockImage.onload = function() {
    imagesLoaded++;
    if (imagesLoaded === requiredImages) startGame();
};

cactusImage.onload = function() {
    imagesLoaded++;
    if (imagesLoaded === requiredImages) startGame();
};

// Set image sources after defining onload handlers
trexImage.src = 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Chromium_T-Rex-error-offline.svg';
rockImage.src = 'images/rock.jpg';
cactusImage.src = 'images/cactus.jpg';

// Optional: Add error handlers for the images
rockImage.onerror = function() {
    console.error('Error loading rock image');
};

trexImage.onerror = function() {
    console.error('Error loading T-Rex image');
};

cactusImage.onerror = function() {
    console.error('Error loading cactus image');
};

let trex = {
    x: 50,
    y: 240,
    width: 60,
    height: 60,
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
    trex.velocityY = -18.75;
}

function update() {
    if (isGameOver) return;

    // Apply gravity
    trex.velocityY += trex.gravity;
    trex.y += trex.velocityY;

    // Floor collision detection
    if (trex.y >= 240) {
        trex.y = 240;
        trex.isJumping = false;
        trex.velocityY = 0;
    }

    // Spawn obstacles - modified section
    const minDistanceBetweenObstacles = 200;
    let canSpawnObstacle = true;

    // Check if any existing obstacle is too close
    obstacles.forEach(obstacle => {
        if (obstacle.x > canvas.width - minDistanceBetweenObstacles) {
            canSpawnObstacle = false;
        }
    });

    // Spawn rocks
    if (canSpawnObstacle && frameCount % (Math.floor(Math.random() * 100) + 100) === 0) {
        let obstacle = {
            x: canvas.width,
            y: 260,
            width: 40,
            height: 40,
            type: 'rock'
        };
        obstacles.push(obstacle);
    }

    // Spawn cacti at different intervals
    if (canSpawnObstacle && frameCount % (Math.floor(Math.random() * 150) + 150) === 0) {
        let obstacle = {
            x: canvas.width,
            y: 245,  // Slightly higher placement
            width: 40,
            height: 55,  // Taller than rocks
            type: 'cactus'
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
    obstacles.forEach(obstacle => {
        const image = obstacle.type === 'rock' ? rockImage : cactusImage;
        ctx.drawImage(image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
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

startGame();