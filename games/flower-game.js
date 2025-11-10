// Catch the Flower Game

let flowerGameState = {
    canvas: null,
    ctx: null,
    basket: {
        x: 250,
        y: 350,
        width: 80,
        height: 30,
        speed: 15
    },
    flowers: [],
    score: 0,
    lives: 3,
    gameInterval: null,
    spawnInterval: null,
    isRunning: false,
    keys: {}
};

function initFlowerGame() {
    const canvas = document.getElementById('flowerCanvas');
    if (!canvas) {
        console.error('Flower canvas not found!');
        return;
    }
    
    flowerGameState.canvas = canvas;
    flowerGameState.ctx = canvas.getContext('2d');
    
    // Stop any existing game
    stopFlowerGame();
    
    resetFlowerGame();
    setupFlowerControls();
    startFlowerGame();
    
    console.log('Flower game initialized successfully!');
}

function resetFlowerGame() {
    flowerGameState.score = 0;
    flowerGameState.lives = 3;
    flowerGameState.flowers = [];
    
    if (flowerGameState.canvas) {
        flowerGameState.basket.x = (flowerGameState.canvas.width - flowerGameState.basket.width) / 2;
    }
    
    updateFlowerScore();
}

function setupFlowerControls() {
    // Remove old listeners to prevent duplicates
    const oldLeftBtn = document.getElementById('moveLeft');
    const oldRightBtn = document.getElementById('moveRight');
    
    if (oldLeftBtn) {
        const newLeftBtn = oldLeftBtn.cloneNode(true);
        oldLeftBtn.parentNode.replaceChild(newLeftBtn, oldLeftBtn);
        newLeftBtn.addEventListener('click', () => {
            moveBasket(-30);
        });
    }
    
    if (oldRightBtn) {
        const newRightBtn = oldRightBtn.cloneNode(true);
        oldRightBtn.parentNode.replaceChild(newRightBtn, oldRightBtn);
        newRightBtn.addEventListener('click', () => {
            moveBasket(30);
        });
    }
    
    // Keyboard controls
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

function handleKeyDown(e) {
    if (flowerGameState.isRunning) {
        flowerGameState.keys[e.key] = true;
    }
}

function handleKeyUp(e) {
    if (flowerGameState.isRunning) {
        flowerGameState.keys[e.key] = false;
    }
}

function startFlowerGame() {
    if (flowerGameState.isRunning) return;
    
    flowerGameState.isRunning = true;
    
    // Spawn flowers
    flowerGameState.spawnInterval = setInterval(() => {
        spawnFlower();
    }, 1500);
    
    // Game loop
    flowerGameState.gameInterval = setInterval(() => {
        updateFlowerGame();
        drawFlowerGame();
    }, 1000 / 60); // 60 FPS
}

function stopFlowerGame() {
    flowerGameState.isRunning = false;
    
    if (flowerGameState.gameInterval) {
        clearInterval(flowerGameState.gameInterval);
        flowerGameState.gameInterval = null;
    }
    
    if (flowerGameState.spawnInterval) {
        clearInterval(flowerGameState.spawnInterval);
        flowerGameState.spawnInterval = null;
    }
}

function spawnFlower() {
    const flowerTypes = ['🌸', '🌺', '🌻', '🌼', '🌷'];
    const flower = {
        x: Math.random() * (flowerGameState.canvas.width - 40),
        y: -40,
        width: 40,
        height: 40,
        speed: 2 + Math.random() * 2,
        emoji: flowerTypes[Math.floor(Math.random() * flowerTypes.length)]
    };
    
    flowerGameState.flowers.push(flower);
}

function updateFlowerGame() {
    // Move basket with keyboard
    if (flowerGameState.keys['ArrowLeft']) {
        moveBasket(-flowerGameState.basket.speed);
    }
    if (flowerGameState.keys['ArrowRight']) {
        moveBasket(flowerGameState.basket.speed);
    }
    
    // Update flowers
    for (let i = flowerGameState.flowers.length - 1; i >= 0; i--) {
        const flower = flowerGameState.flowers[i];
        flower.y += flower.speed;
        
        // Check collision with basket
        if (checkCollision(flower, flowerGameState.basket)) {
            flowerGameState.score += 5;
            updateFlowerScore();
            flowerGameState.flowers.splice(i, 1);
            continue;
        }
        
        // Check if flower passed the basket
        if (flower.y > flowerGameState.canvas.height) {
            flowerGameState.lives--;
            updateFlowerScore();
            flowerGameState.flowers.splice(i, 1);
            
            if (flowerGameState.lives <= 0) {
                endFlowerGame();
            }
        }
    }
}

function drawFlowerGame() {
    const ctx = flowerGameState.ctx;
    const canvas = flowerGameState.canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw basket
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(
        flowerGameState.basket.x,
        flowerGameState.basket.y,
        flowerGameState.basket.width,
        flowerGameState.basket.height
    );
    
    // Draw basket handle
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(
        flowerGameState.basket.x + flowerGameState.basket.width / 2,
        flowerGameState.basket.y - 10,
        20,
        0,
        Math.PI,
        true
    );
    ctx.stroke();
    
    // Draw flowers
    ctx.font = '40px Arial';
    flowerGameState.flowers.forEach(flower => {
        ctx.fillText(flower.emoji, flower.x, flower.y);
    });
}

function moveBasket(dx) {
    flowerGameState.basket.x += dx;
    
    // Keep basket within canvas
    if (flowerGameState.basket.x < 0) {
        flowerGameState.basket.x = 0;
    }
    if (flowerGameState.basket.x + flowerGameState.basket.width > flowerGameState.canvas.width) {
        flowerGameState.basket.x = flowerGameState.canvas.width - flowerGameState.basket.width;
    }
}

function checkCollision(flower, basket) {
    return flower.x < basket.x + basket.width &&
           flower.x + flower.width > basket.x &&
           flower.y < basket.y + basket.height &&
           flower.y + flower.height > basket.y;
}

function updateFlowerScore() {
    const scoreElement = document.querySelector('#flowerScore span:first-child');
    const livesElement = document.querySelector('#flowerScore span:last-child');
    
    if (scoreElement) scoreElement.textContent = flowerGameState.score;
    if (livesElement) livesElement.textContent = flowerGameState.lives;
}

function endFlowerGame() {
    stopFlowerGame();
    
    setTimeout(() => {
        alert(`🌸 Game Over! Your score: ${flowerGameState.score} points!\n\nClick OK to play again.`);
        resetFlowerGame();
        startFlowerGame();
    }, 500);
}
