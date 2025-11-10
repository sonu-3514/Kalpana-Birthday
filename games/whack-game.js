// Whack-a-Flower Game

let whackGameState = {
    score: 0,
    timeLeft: 30,
    isRunning: false,
    gameInterval: null,
    timerInterval: null,
    currentFlower: null
};

function initWhackGame() {
    resetWhackGame();
    startWhackGame();
}

function resetWhackGame() {
    stopWhackGame();
    
    whackGameState = {
        score: 0,
        timeLeft: 30,
        isRunning: false,
        gameInterval: null,
        timerInterval: null,
        currentFlower: null
    };
    
    // Reset all holes
    document.querySelectorAll('.hole').forEach(hole => {
        hole.classList.remove('active', 'whacked');
    });
    
    updateWhackScore();
}

function startWhackGame() {
    if (whackGameState.isRunning) return;
    
    whackGameState.isRunning = true;
    
    // Setup hole click handlers
    document.querySelectorAll('.hole').forEach(hole => {
        hole.onclick = () => whackFlower(hole);
    });
    
    // Start spawning flowers
    whackGameState.gameInterval = setInterval(() => {
        spawnFlower();
    }, 800);
    
    // Start timer
    whackGameState.timerInterval = setInterval(() => {
        whackGameState.timeLeft--;
        updateWhackScore();
        
        if (whackGameState.timeLeft <= 0) {
            endWhackGame();
        }
    }, 1000);
    
    // Spawn first flower immediately
    spawnFlower();
}

function stopWhackGame() {
    whackGameState.isRunning = false;
    
    if (whackGameState.gameInterval) {
        clearInterval(whackGameState.gameInterval);
        whackGameState.gameInterval = null;
    }
    
    if (whackGameState.timerInterval) {
        clearInterval(whackGameState.timerInterval);
        whackGameState.timerInterval = null;
    }
}

function spawnFlower() {
    // Remove previous flower
    if (whackGameState.currentFlower) {
        whackGameState.currentFlower.classList.remove('active');
    }
    
    // Get all holes
    const holes = document.querySelectorAll('.hole');
    
    // Random hole
    const randomHole = holes[Math.floor(Math.random() * holes.length)];
    
    // Make sure it's not the same as the last one
    if (randomHole === whackGameState.currentFlower && holes.length > 1) {
        spawnFlower();
        return;
    }
    
    whackGameState.currentFlower = randomHole;
    randomHole.classList.add('active');
    
    // Random time for flower to stay up (600-1200ms)
    const stayTime = 600 + Math.random() * 600;
    
    setTimeout(() => {
        if (randomHole.classList.contains('active') && !randomHole.classList.contains('whacked')) {
            randomHole.classList.remove('active');
        }
    }, stayTime);
}

function whackFlower(hole) {
    if (!whackGameState.isRunning) return;
    if (!hole.classList.contains('active')) return;
    if (hole.classList.contains('whacked')) return;
    
    // Mark as whacked
    hole.classList.add('whacked');
    hole.classList.remove('active');
    
    // Increase score
    whackGameState.score += 10;
    updateWhackScore();
    
    // Show score popup
    showScorePopup(hole);
    
    // Reset whacked state
    setTimeout(() => {
        hole.classList.remove('whacked');
    }, 300);
}

function showScorePopup(hole) {
    const popup = document.createElement('div');
    popup.textContent = '+10';
    popup.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #f1c40f;
        font-size: 2rem;
        font-weight: bold;
        pointer-events: none;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        z-index: 10;
    `;
    
    hole.appendChild(popup);
    
    // Animate popup
    popup.animate([
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: 'translate(-50%, -100px) scale(1.5)', opacity: 0 }
    ], {
        duration: 600,
        easing: 'ease-out'
    });
    
    setTimeout(() => popup.remove(), 600);
}

function updateWhackScore() {
    const scoreElement = document.querySelector('#whackScore span:first-child');
    const timeElement = document.querySelector('#whackScore span:last-child');
    
    if (scoreElement) scoreElement.textContent = whackGameState.score;
    if (timeElement) {
        timeElement.textContent = whackGameState.timeLeft;
        
        // Warning color when time is low
        if (whackGameState.timeLeft <= 10) {
            timeElement.style.color = '#e74c3c';
            timeElement.style.animation = 'pulse 0.5s infinite';
        } else {
            timeElement.style.color = '';
            timeElement.style.animation = '';
        }
    }
}

function endWhackGame() {
    stopWhackGame();
    
    // Remove all active flowers
    document.querySelectorAll('.hole').forEach(hole => {
        hole.classList.remove('active', 'whacked');
    });
    
    // Determine performance level
    let message = '';
    let emoji = '';
    
    if (whackGameState.score >= 200) {
        message = 'Amazing! You\'re a Flower Master! 🏆';
        emoji = '🏆';
    } else if (whackGameState.score >= 150) {
        message = 'Great job! Super fast reflexes! ⭐';
        emoji = '⭐';
    } else if (whackGameState.score >= 100) {
        message = 'Good work! Keep practicing! 👏';
        emoji = '👏';
    } else {
        message = 'Nice try! Give it another shot! 🌸';
        emoji = '🌸';
    }
    
    setTimeout(() => {
        const resultHTML = `
            <div style="text-align: center; padding: 20px; background: white; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                <div style="font-size: 4rem; margin-bottom: 15px;">${emoji}</div>
                <h3 style="font-size: 2rem; color: var(--dark-text); margin-bottom: 10px;">Game Over!</h3>
                <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary-green); margin: 15px 0;">
                    Score: ${whackGameState.score}
                </div>
                <p style="font-size: 1.2rem; color: var(--dark-text); margin-bottom: 20px;">${message}</p>
            </div>
        `;
        
        // Show result in a temporary overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        overlay.innerHTML = resultHTML;
        
        document.body.appendChild(overlay);
        
        // Confetti
        createWhackConfetti();
        
        // Remove overlay and restart on click
        overlay.onclick = () => {
            document.body.removeChild(overlay);
            resetWhackGame();
            startWhackGame();
        };
        
        setTimeout(() => {
            if (overlay.parentElement) {
                overlay.innerHTML += '<p style="color: white; margin-top: 20px; font-size: 1.2rem;">Click anywhere to play again!</p>';
            }
        }, 1000);
    }, 500);
}

function createWhackConfetti() {
    const flowers = ['🌸', '🌺', '🌻', '🌼', '🌷', '🌹'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.textContent = flowers[Math.floor(Math.random() * flowers.length)];
            confetti.style.cssText = `
                position: fixed;
                left: ${Math.random() * window.innerWidth}px;
                top: -50px;
                font-size: 2rem;
                z-index: 10001;
                pointer-events: none;
            `;
            
            document.body.appendChild(confetti);
            
            const fallDuration = 2000 + Math.random() * 1000;
            confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 100}px) rotate(${360 + Math.random() * 360}deg)`, opacity: 0.8 }
            ], {
                duration: fallDuration,
                easing: 'linear'
            });
            
            setTimeout(() => confetti.remove(), fallDuration);
        }, i * 100);
    }
}
