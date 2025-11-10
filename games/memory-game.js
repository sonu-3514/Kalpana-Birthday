// Memory Match Game with Nature Theme

let memoryGameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    isProcessing: false
};

const natureEmojis = ['🌸', '🌺', '🌻', '🌼', '🌷', '🦋', '🌿', '🍀'];

function initMemoryGame() {
    resetMemoryGame();
    createMemoryBoard();
}

function resetMemoryGame() {
    memoryGameState = {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        moves: 0,
        isProcessing: false
    };
    
    updateMemoryScore();
}

function createMemoryBoard() {
    const gameContainer = document.getElementById('memoryGame');
    gameContainer.innerHTML = '';
    
    // Create pairs of cards
    const cardSymbols = [...natureEmojis, ...natureEmojis];
    shuffleArray(cardSymbols);
    
    cardSymbols.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.innerHTML = '?';
        
        card.addEventListener('click', () => handleMemoryCardClick(card));
        
        gameContainer.appendChild(card);
        memoryGameState.cards.push(card);
    });
    
    // Reset game button
    const resetBtn = document.querySelector('#memoryGameModal .reset-game');
    resetBtn.onclick = () => {
        resetMemoryGame();
        createMemoryBoard();
    };
}

function handleMemoryCardClick(card) {
    if (memoryGameState.isProcessing) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (memoryGameState.flippedCards.length >= 2) return;
    
    // Flip the card
    card.classList.add('flipped');
    card.innerHTML = card.dataset.symbol;
    memoryGameState.flippedCards.push(card);
    
    if (memoryGameState.flippedCards.length === 2) {
        memoryGameState.moves++;
        updateMemoryScore();
        checkMemoryMatch();
    }
}

function checkMemoryMatch() {
    memoryGameState.isProcessing = true;
    const [card1, card2] = memoryGameState.flippedCards;
    
    if (card1.dataset.symbol === card2.dataset.symbol) {
        // Match found!
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            memoryGameState.matchedPairs++;
            memoryGameState.flippedCards = [];
            memoryGameState.isProcessing = false;
            
            updateMemoryScore();
            
            // Check if game is won
            if (memoryGameState.matchedPairs === natureEmojis.length) {
                setTimeout(() => {
                    alert(`🎉 Congratulations! You won in ${memoryGameState.moves} moves!`);
                }, 500);
            }
        }, 500);
    } else {
        // No match
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.innerHTML = '?';
            card2.innerHTML = '?';
            memoryGameState.flippedCards = [];
            memoryGameState.isProcessing = false;
        }, 1000);
    }
}

function updateMemoryScore() {
    const scoreElement = document.querySelector('#memoryScore span:first-child');
    const movesElement = document.querySelector('#memoryScore span:last-child');
    
    if (scoreElement) scoreElement.textContent = memoryGameState.matchedPairs;
    if (movesElement) movesElement.textContent = memoryGameState.moves;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
