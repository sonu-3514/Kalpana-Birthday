// Plant Growing Game

let plantGameState = {
    plantsGrown: 0,
    level: 1,
    selectedSlot: null,
    plants: {},
    growthStages: ['🌱', '🌿', '🌾']
};

const flowerTypes = {
    '🌱': ['🌱', '🌿', '🌸'],
    '🌻': ['🌱', '🌿', '🌻'],
    '🌷': ['🌱', '🌿', '🌷'],
    '🌹': ['🌱', '🌿', '🌹']
};

function initPlantGame() {
    plantGameState = {
        plantsGrown: 0,
        level: 1,
        selectedSlot: null,
        plants: {}
    };
    
    updatePlantScore();
    setupPlantGame();
}

function setupPlantGame() {
    // Setup slot click handlers
    document.querySelectorAll('.plant-slot').forEach(slot => {
        slot.addEventListener('click', function() {
            selectPlantSlot(this);
        });
    });
    
    // Setup seed button handlers
    document.querySelectorAll('.plant-seed-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const plantType = this.getAttribute('data-plant');
            plantSeed(plantType);
        });
    });
}

function selectPlantSlot(slot) {
    // Remove previous selection
    document.querySelectorAll('.plant-slot').forEach(s => {
        s.classList.remove('selected');
    });
    
    // Select this slot
    const slotId = slot.getAttribute('data-slot');
    
    // Only allow selection if slot is empty
    if (!plantGameState.plants[slotId] || plantGameState.plants[slotId].stage === 3) {
        slot.classList.add('selected');
        plantGameState.selectedSlot = slotId;
    }
}

function plantSeed(plantType) {
    if (plantGameState.selectedSlot === null) {
        showPlantMessage('Please select an empty plot first!');
        return;
    }
    
    const slotId = plantGameState.selectedSlot;
    const slot = document.querySelector(`.plant-slot[data-slot="${slotId}"]`);
    
    // Check if slot is occupied
    if (plantGameState.plants[slotId] && plantGameState.plants[slotId].stage < 3) {
        showPlantMessage('This plot already has a growing plant!');
        return;
    }
    
    // Plant the seed
    plantGameState.plants[slotId] = {
        type: plantType,
        stage: 0,
        growthStages: flowerTypes[plantType]
    };
    
    slot.classList.add('growing');
    slot.textContent = flowerTypes[plantType][0];
    slot.classList.remove('selected');
    plantGameState.selectedSlot = null;
    
    // Start growing
    growPlant(slotId);
}

function growPlant(slotId) {
    const plant = plantGameState.plants[slotId];
    const slot = document.querySelector(`.plant-slot[data-slot="${slotId}"]`);
    
    const growthInterval = setInterval(() => {
        plant.stage++;
        
        if (plant.stage < plant.growthStages.length) {
            slot.classList.add('growing');
            slot.textContent = plant.growthStages[plant.stage];
            
            // Trigger grow animation
            setTimeout(() => slot.classList.remove('growing'), 500);
        } else {
            clearInterval(growthInterval);
            plantGameState.plantsGrown++;
            updatePlantScore();
            
            // Show completion effect
            showPlantCompletion(slot);
            
            // Check for level up
            checkLevelUp();
        }
    }, 2000); // Grow every 2 seconds
}

function showPlantCompletion(slot) {
    const sparkles = ['✨', '⭐', '💫', '🌟'];
    const rect = slot.getBoundingClientRect();
    
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                font-size: 2rem;
                pointer-events: none;
                z-index: 10000;
            `;
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 80;
            
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
                duration: 800,
                easing: 'ease-out'
            });
            
            setTimeout(() => sparkle.remove(), 800);
        }, i * 50);
    }
}

function showPlantMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, var(--primary-green), var(--secondary-green));
        color: white;
        padding: 20px 40px;
        border-radius: 15px;
        font-size: 1.3rem;
        font-weight: bold;
        z-index: 10001;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: bounceIn 0.5s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 2000);
}

function checkLevelUp() {
    const plantsNeeded = plantGameState.level * 3;
    
    if (plantGameState.plantsGrown >= plantsNeeded) {
        plantGameState.level++;
        updatePlantScore();
        
        showLevelUp();
    }
}

function showLevelUp() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(46, 204, 113, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    overlay.innerHTML = `
        <div style="text-align: center; padding: 60px; background: white; border-radius: 30px; box-shadow: 0 15px 60px rgba(0,0,0,0.4);">
            <div style="font-size: 6rem; margin-bottom: 20px;">🎉</div>
            <h2 style="font-size: 3rem; color: var(--primary-green); margin-bottom: 20px;">Level Up!</h2>
            <div style="font-size: 4rem; font-weight: bold; color: var(--dark-text); margin: 20px 0;">
                Level ${plantGameState.level}
            </div>
            <p style="font-size: 1.5rem; color: var(--dark-text);">Your garden is growing beautifully! 🌺</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Create celebration confetti
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.textContent = ['🌸', '🌺', '🌻', '🌼', '🌷', '🌹'][Math.floor(Math.random() * 6)];
            confetti.style.cssText = `
                position: fixed;
                left: ${Math.random() * window.innerWidth}px;
                top: -50px;
                font-size: 2.5rem;
                z-index: 10001;
                pointer-events: none;
            `;
            
            document.body.appendChild(confetti);
            
            confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 100}px) rotate(${360 + Math.random() * 360}deg)`, opacity: 0.8 }
            ], {
                duration: 3000,
                easing: 'linear'
            });
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 50);
    }
    
    setTimeout(() => {
        overlay.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => overlay.remove(), 500);
    }, 2500);
}

function updatePlantScore() {
    const plantsElement = document.querySelector('#plantScore span:first-child');
    const levelElement = document.querySelector('#plantScore span:last-child');
    
    if (plantsElement) plantsElement.textContent = plantGameState.plantsGrown;
    if (levelElement) levelElement.textContent = plantGameState.level;
}
