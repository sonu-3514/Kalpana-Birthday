// Balloon Pop Game

let balloonGameState = {
    score: 0,
    timeLeft: 60,
    balloons: [],
    gameInterval: null,
    timerInterval: null,
    isRunning: false
};

const balloonColors = ['🎈', '🎈', '🎈', '🎈', '🎈', '🎈'];
const balloonColorStyles = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e91e63'];

function initBalloonGame() {
    resetBalloonGame();
    startBalloonGame();
}

function resetBalloonGame() {
    stopBalloonGame();
    
    balloonGameState = {
        score: 0,
        timeLeft: 60,
        balloons: [],
        gameInterval: null,
        timerInterval: null,
        isRunning: false
    };
    
    const gameContainer = document.getElementById('balloonGame');
    gameContainer.innerHTML = '';
    
    updateBalloonScore();
}

function startBalloonGame() {
    if (balloonGameState.isRunning) return;
    
    balloonGameState.isRunning = true;
    
    // Start spawning balloons
    balloonGameState.gameInterval = setInterval(() => {
        spawnBalloon();
    }, 1000);
    
    // Start timer
    balloonGameState.timerInterval = setInterval(() => {
        balloonGameState.timeLeft--;
        updateBalloonScore();
        
        if (balloonGameState.timeLeft <= 0) {
            endBalloonGame();
        }
    }, 1000);
}

function stopBalloonGame() {
    balloonGameState.isRunning = false;
    
    if (balloonGameState.gameInterval) {
        clearInterval(balloonGameState.gameInterval);
        balloonGameState.gameInterval = null;
    }
    
    if (balloonGameState.timerInterval) {
        clearInterval(balloonGameState.timerInterval);
        balloonGameState.timerInterval = null;
    }
}

function spawnBalloon() {
    const gameContainer = document.getElementById('balloonGame');
    if (!gameContainer) return;
    
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    balloon.innerHTML = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    
    const randomColor = balloonColorStyles[Math.floor(Math.random() * balloonColorStyles.length)];
    balloon.style.color = randomColor;
    balloon.style.left = Math.random() * (gameContainer.offsetWidth - 50) + 'px';
    balloon.style.bottom = '-50px';
    
    balloon.addEventListener('click', () => popBalloon(balloon));
    
    gameContainer.appendChild(balloon);
    balloonGameState.balloons.push(balloon);
    
    // Remove balloon after animation
    setTimeout(() => {
        if (balloon.parentElement) {
            gameContainer.removeChild(balloon);
            const index = balloonGameState.balloons.indexOf(balloon);
            if (index > -1) {
                balloonGameState.balloons.splice(index, 1);
            }
        }
    }, 4000);
}

function popBalloon(balloon) {
    if (!balloon.parentElement) return;
    
    balloonGameState.score += 10;
    updateBalloonScore();
    
    // Pop animation
    balloon.style.transform = 'scale(1.5)';
    balloon.style.opacity = '0';
    
    // Create pop effect
    const popEffect = document.createElement('div');
    popEffect.textContent = '💥 +10';
    popEffect.style.cssText = `
        position: absolute;
        left: ${balloon.style.left};
        bottom: ${balloon.offsetTop}px;
        color: #f39c12;
        font-size: 1.5rem;
        font-weight: bold;
        pointer-events: none;
        animation: popEffect 0.5s ease-out;
    `;
    
    const gameContainer = document.getElementById('balloonGame');
    gameContainer.appendChild(popEffect);
    
    setTimeout(() => {
        if (balloon.parentElement) {
            gameContainer.removeChild(balloon);
        }
        if (popEffect.parentElement) {
            gameContainer.removeChild(popEffect);
        }
    }, 500);
    
    // Add CSS for pop effect if not exists
    if (!document.getElementById('popEffectStyle')) {
        const style = document.createElement('style');
        style.id = 'popEffectStyle';
        style.textContent = `
            @keyframes popEffect {
                0% {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-50px) scale(1.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function updateBalloonScore() {
    const scoreElement = document.querySelector('#balloonScore span:first-child');
    const timeElement = document.querySelector('#balloonScore span:last-child');
    
    if (scoreElement) scoreElement.textContent = balloonGameState.score;
    if (timeElement) timeElement.textContent = balloonGameState.timeLeft;
}

function endBalloonGame() {
    stopBalloonGame();
    
    setTimeout(() => {
        alert(`🎉 Game Over! Your score: ${balloonGameState.score} points!\n\nClick OK to play again.`);
        resetBalloonGame();
        startBalloonGame();
    }, 500);
}
