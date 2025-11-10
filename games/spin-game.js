// Lucky Spin Wheel Game

let spinGameState = {
    canvas: null,
    ctx: null,
    spinning: false,
    rotation: 0,
    targetRotation: 0,
    prizes: [
        '🌸 Beautiful Flower',
        '🎂 Sweet Cake',
        '🎁 Mystery Gift',
        '💝 Love & Wishes',
        '🌟 Lucky Star',
        '🦋 Butterfly Charm',
        '🌈 Rainbow Joy',
        '💎 Precious Gem'
    ],
    colors: ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e91e63', '#f39c12', '#1abc9c']
};

function initSpinGame() {
    spinGameState.canvas = document.getElementById('spinWheel');
    spinGameState.ctx = spinGameState.canvas.getContext('2d');
    spinGameState.spinning = false;
    spinGameState.rotation = 0;
    
    drawSpinWheel();
    setupSpinButton();
}

function drawSpinWheel() {
    const ctx = spinGameState.ctx;
    const canvas = spinGameState.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;
    const numSegments = spinGameState.prizes.length;
    const anglePerSegment = (Math.PI * 2) / numSegments;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(spinGameState.rotation);
    
    // Draw segments
    for (let i = 0; i < numSegments; i++) {
        const startAngle = i * anglePerSegment;
        const endAngle = (i + 1) * anglePerSegment;
        
        // Draw segment
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = spinGameState.colors[i];
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw text
        ctx.save();
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 3;
        ctx.fillText(spinGameState.prizes[i], radius * 0.65, 5);
        ctx.restore();
    }
    
    ctx.restore();
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw pointer at top (smaller arrow)
    ctx.beginPath();
    ctx.moveTo(centerX, 30);
    ctx.lineTo(centerX - 8, 50);
    ctx.lineTo(centerX + 8, 50);
    ctx.closePath();
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function setupSpinButton() {
    const spinBtn = document.getElementById('spinButton');
    
    spinBtn.onclick = () => {
        if (spinGameState.spinning) return;
        
        spinWheel();
    };
}

function spinWheel() {
    spinGameState.spinning = true;
    const spinBtn = document.getElementById('spinButton');
    spinBtn.disabled = true;
    spinBtn.textContent = 'SPINNING...';
    
    // Random number of rotations (5-10 full spins)
    const spins = 5 + Math.random() * 5;
    const extraRotation = Math.random() * Math.PI * 2;
    spinGameState.targetRotation = spinGameState.rotation + (Math.PI * 2 * spins) + extraRotation;
    
    const startTime = Date.now();
    const duration = 3000; // 3 seconds
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        spinGameState.rotation = spinGameState.rotation + 
            (spinGameState.targetRotation - spinGameState.rotation) * easeOut * 0.1;
        
        drawSpinWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            spinGameState.rotation = spinGameState.targetRotation % (Math.PI * 2);
            spinGameState.spinning = false;
            spinBtn.disabled = false;
            spinBtn.textContent = 'SPIN AGAIN!';
            
            // Determine winning segment
            showWinningPrize();
        }
    }
    
    animate();
}

function showWinningPrize() {
    const numSegments = spinGameState.prizes.length;
    const anglePerSegment = (Math.PI * 2) / numSegments;
    
    // Calculate which segment the pointer is pointing at
    // The pointer is at the top (0 degrees), so we need to adjust
    const normalizedRotation = (2 * Math.PI - (spinGameState.rotation % (2 * Math.PI))) % (2 * Math.PI);
    const segmentIndex = Math.floor(normalizedRotation / anglePerSegment);
    const prize = spinGameState.prizes[segmentIndex];
    
    // Show result with suspenseful animation
    const resultDiv = document.getElementById('spinResult');
    resultDiv.textContent = '';
    
    setTimeout(() => {
        resultDiv.classList.add('result-animation');
        resultDiv.innerHTML = `
            <div style="background: linear-gradient(135deg, ${spinGameState.colors[segmentIndex]}, ${spinGameState.colors[(segmentIndex + 1) % numSegments]}); 
                        color: white; 
                        padding: 20px; 
                        border-radius: 15px; 
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                <h3 style="margin: 0; font-size: 1.8rem;">🎉 You Won! 🎉</h3>
                <p style="margin: 10px 0 0 0; font-size: 1.5rem; font-weight: bold;">${prize}</p>
            </div>
        `;
        
        // Confetti effect
        createPrizeConfetti();
    }, 500);
}

function createPrizeConfetti() {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e91e63'];
    const modal = document.getElementById('spinGameModal');
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * window.innerWidth}px;
                top: -20px;
                z-index: 10000;
                border-radius: 50%;
            `;
            
            document.body.appendChild(confetti);
            
            const fallDuration = 2000 + Math.random() * 1000;
            confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight}px) rotate(720deg)`, opacity: 0 }
            ], {
                duration: fallDuration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            setTimeout(() => confetti.remove(), fallDuration);
        }, i * 50);
    }
}
