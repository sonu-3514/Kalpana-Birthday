// Butterfly Hunt Game

let butterflyGameState = {
    canvas: null,
    ctx: null,
    butterflies: [],
    score: 0,
    timeLeft: 45,
    isRunning: false,
    gameInterval: null,
    timerInterval: null,
    spawnInterval: null
};

const butterflyTypes = ['🦋', '🦋', '🦋'];
const butterflyColors = ['hsl(200, 70%, 60%)', 'hsl(300, 70%, 60%)', 'hsl(30, 70%, 60%)'];

function initButterflyGame() {
    butterflyGameState.canvas = document.getElementById('butterflyCanvas');
    if (!butterflyGameState.canvas) return;
    
    butterflyGameState.ctx = butterflyGameState.canvas.getContext('2d');
    
    resetButterflyGame();
    setupButterflyControls();
    startButterflyGame();
}

function resetButterflyGame() {
    butterflyGameState.score = 0;
    butterflyGameState.timeLeft = 45;
    butterflyGameState.butterflies = [];
    updateButterflyScore();
}

function setupButterflyControls() {
    butterflyGameState.canvas.addEventListener('click', (e) => {
        const rect = butterflyGameState.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        checkButterflyClick(x, y);
    });
}

function startButterflyGame() {
    if (butterflyGameState.isRunning) return;
    
    butterflyGameState.isRunning = true;
    
    // Spawn butterflies
    butterflyGameState.spawnInterval = setInterval(() => {
        spawnButterfly();
    }, 1200);
    
    // Timer
    butterflyGameState.timerInterval = setInterval(() => {
        butterflyGameState.timeLeft--;
        updateButterflyScore();
        
        if (butterflyGameState.timeLeft <= 0) {
            endButterflyGame();
        }
    }, 1000);
    
    // Game loop
    butterflyGameState.gameInterval = setInterval(() => {
        updateButterflies();
        drawButterflyGame();
    }, 1000 / 60);
    
    // Spawn initial butterflies
    for (let i = 0; i < 3; i++) {
        setTimeout(() => spawnButterfly(), i * 400);
    }
}

function stopButterflyGame() {
    butterflyGameState.isRunning = false;
    
    if (butterflyGameState.gameInterval) {
        clearInterval(butterflyGameState.gameInterval);
        butterflyGameState.gameInterval = null;
    }
    
    if (butterflyGameState.timerInterval) {
        clearInterval(butterflyGameState.timerInterval);
        butterflyGameState.timerInterval = null;
    }
    
    if (butterflyGameState.spawnInterval) {
        clearInterval(butterflyGameState.spawnInterval);
        butterflyGameState.spawnInterval = null;
    }
}

function spawnButterfly() {
    const canvas = butterflyGameState.canvas;
    const butterfly = {
        x: Math.random() * (canvas.width - 60) + 30,
        y: Math.random() * (canvas.height - 60) + 30,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        size: 40,
        emoji: butterflyTypes[Math.floor(Math.random() * butterflyTypes.length)],
        angle: 0,
        angleSpeed: 0.1,
        wingFlap: 0
    };
    
    butterflyGameState.butterflies.push(butterfly);
}

function updateButterflies() {
    const canvas = butterflyGameState.canvas;
    
    butterflyGameState.butterflies.forEach(butterfly => {
        // Update position
        butterfly.x += butterfly.vx;
        butterfly.y += butterfly.vy;
        
        // Bounce off walls
        if (butterfly.x < 30 || butterfly.x > canvas.width - 30) {
            butterfly.vx *= -1;
        }
        if (butterfly.y < 30 || butterfly.y > canvas.height - 30) {
            butterfly.vy *= -1;
        }
        
        // Update angle for rotation
        butterfly.angle += butterfly.angleSpeed;
        
        // Wing flapping animation
        butterfly.wingFlap = Math.sin(Date.now() / 100) * 10;
    });
}

function drawButterflyGame() {
    const ctx = butterflyGameState.ctx;
    const canvas = butterflyGameState.canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw butterflies
    ctx.font = '40px Arial';
    butterflyGameState.butterflies.forEach(butterfly => {
        ctx.save();
        ctx.translate(butterfly.x, butterfly.y);
        ctx.rotate(Math.atan2(butterfly.vy, butterfly.vx));
        
        // Add shadow for depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        
        ctx.fillText(butterfly.emoji, -20, 10);
        ctx.restore();
    });
}

function checkButterflyClick(x, y) {
    for (let i = butterflyGameState.butterflies.length - 1; i >= 0; i--) {
        const butterfly = butterflyGameState.butterflies[i];
        const dx = x - butterfly.x;
        const dy = y - butterfly.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 30) {
            // Hit!
            butterflyGameState.score += 15;
            updateButterflyScore();
            
            // Remove butterfly
            butterflyGameState.butterflies.splice(i, 1);
            
            // Show score popup
            showButterflyScore(x, y);
            
            // Create sparkle effect
            createButterflySparkle(x, y);
            
            return;
        }
    }
}

function showButterflyScore(x, y) {
    const canvas = butterflyGameState.canvas;
    const rect = canvas.getBoundingClientRect();
    
    const popup = document.createElement('div');
    popup.textContent = '+15';
    popup.style.cssText = `
        position: fixed;
        left: ${rect.left + x}px;
        top: ${rect.top + y}px;
        color: #f39c12;
        font-size: 2rem;
        font-weight: bold;
        pointer-events: none;
        z-index: 10000;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    `;
    
    document.body.appendChild(popup);
    
    popup.animate([
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: 'translate(-50%, -100px) scale(1.5)', opacity: 0 }
    ], {
        duration: 800,
        easing: 'ease-out'
    });
    
    setTimeout(() => popup.remove(), 800);
}

function createButterflySparkle(x, y) {
    const canvas = butterflyGameState.canvas;
    const rect = canvas.getBoundingClientRect();
    const sparkles = ['✨', '⭐', '💫'];
    
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.cssText = `
            position: fixed;
            left: ${rect.left + x}px;
            top: ${rect.top + y}px;
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 10000;
        `;
        
        const angle = (i / 5) * Math.PI * 2;
        const distance = 50;
        
        document.body.appendChild(sparkle);
        
        sparkle.animate([
            { 
                transform: 'translate(-50%, -50%) scale(0)',
                opacity: 1
            },
            { 
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1)`,
                opacity: 0
            }
        ], {
            duration: 600,
            easing: 'ease-out'
        });
        
        setTimeout(() => sparkle.remove(), 600);
    }
}

function updateButterflyScore() {
    const scoreElement = document.querySelector('#butterflyScore span:first-child');
    const timeElement = document.querySelector('#butterflyScore span:last-child');
    
    if (scoreElement) scoreElement.textContent = butterflyGameState.score;
    if (timeElement) {
        timeElement.textContent = butterflyGameState.timeLeft;
        
        if (butterflyGameState.timeLeft <= 10) {
            timeElement.style.color = '#e74c3c';
            timeElement.style.animation = 'pulse 0.5s infinite';
        }
    }
}

function endButterflyGame() {
    stopButterflyGame();
    
    let message = '';
    let emoji = '';
    
    if (butterflyGameState.score >= 300) {
        message = 'Amazing! Butterfly Master! 🏆';
        emoji = '🏆';
    } else if (butterflyGameState.score >= 200) {
        message = 'Great job! Quick reflexes! ⭐';
        emoji = '⭐';
    } else if (butterflyGameState.score >= 100) {
        message = 'Good work! Keep catching! 👏';
        emoji = '👏';
    } else {
        message = 'Nice try! Practice makes perfect! 🦋';
        emoji = '🦋';
    }
    
    setTimeout(() => {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        overlay.innerHTML = `
            <div style="text-align: center; padding: 40px; background: white; border-radius: 20px; box-shadow: 0 10px 50px rgba(0,0,0,0.5);">
                <div style="font-size: 5rem; margin-bottom: 20px;">${emoji}</div>
                <h3 style="font-size: 2.5rem; color: var(--dark-text); margin-bottom: 15px;">Game Over!</h3>
                <div style="font-size: 3rem; font-weight: bold; color: var(--primary-blue); margin: 20px 0;">
                    Score: ${butterflyGameState.score}
                </div>
                <p style="font-size: 1.3rem; color: var(--dark-text); margin-bottom: 20px;">${message}</p>
                <p style="color: #7f8c8d; margin-top: 30px;">Click anywhere to play again!</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        overlay.onclick = () => {
            document.body.removeChild(overlay);
            resetButterflyGame();
            startButterflyGame();
        };
    }, 500);
}
