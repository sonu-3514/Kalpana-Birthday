// Main JavaScript File for Birthday Website

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initConfetti();
    initMusicToggle();
    initWishesCarousel();
    initNatureSlideshow();
    initGameModals();
    initSmoothScroll();
    initCountdown();
    initMysteryBoxes();
    initGiftBoxes();
    initCursorFollower();
});

// Confetti Animation
function initConfetti() {
    const confettiContainer = document.querySelector('.confetti-container');
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e91e63'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.opacity = Math.random();
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.animation = `confettiFall ${3 + Math.random() * 3}s linear infinite`;
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confettiContainer.appendChild(confetti);
    }
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confettiFall {
            to {
                top: 100%;
                transform: translateY(100vh) rotate(720deg);
            }
        }
    `;
    document.head.appendChild(style);
}

// Music Toggle
function initMusicToggle() {
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;
    
    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            isPlaying = false;
        } else {
            bgMusic.play().catch(e => console.log('Audio play failed:', e));
            musicToggle.classList.add('playing');
            isPlaying = true;
        }
    });
    
    // Auto-play attempt (may be blocked by browser)
    setTimeout(() => {
        bgMusic.play().then(() => {
            musicToggle.classList.add('playing');
            isPlaying = true;
        }).catch(e => console.log('Auto-play blocked:', e));
    }, 1000);
}

// Wishes Carousel
function initWishesCarousel() {
    const wishCards = document.querySelectorAll('.wish-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentWish = 0;
    
    // Create dots
    wishCards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showWish(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.carousel-dot');
    
    function showWish(index) {
        wishCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        wishCards[index].classList.add('active');
        dots[index].classList.add('active');
        currentWish = index;
    }
    
    prevBtn.addEventListener('click', () => {
        currentWish = (currentWish - 1 + wishCards.length) % wishCards.length;
        showWish(currentWish);
    });
    
    nextBtn.addEventListener('click', () => {
        currentWish = (currentWish + 1) % wishCards.length;
        showWish(currentWish);
    });
    
    // Auto-rotate wishes
    setInterval(() => {
        currentWish = (currentWish + 1) % wishCards.length;
        showWish(currentWish);
    }, 5000);
}

// Nature Slideshow
function initNatureSlideshow() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }
    
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 4000);
}

// Game Modals
function initGameModals() {
    const gameCards = document.querySelectorAll('.game-card');
    const modals = {
        memory: document.getElementById('memoryGameModal'),
        balloon: document.getElementById('balloonGameModal'),
        flower: document.getElementById('flowerGameModal'),
        spin: document.getElementById('spinGameModal'),
        quiz: document.getElementById('quizGameModal'),
        whack: document.getElementById('whackGameModal'),
        butterfly: document.getElementById('butterflyGameModal'),
        plant: document.getElementById('plantGameModal'),
        'nature-quiz': document.getElementById('natureQuizModal')
    };
    
    gameCards.forEach(card => {
        const gameBtn = card.querySelector('.game-btn');
        const gameType = card.getAttribute('data-game');
        
        gameBtn.addEventListener('click', () => {
            const modal = modals[gameType];
            if (modal) {
                modal.classList.add('active');
                
                // Initialize game based on type
                if (gameType === 'memory' && typeof initMemoryGame === 'function') {
                    initMemoryGame();
                } else if (gameType === 'balloon' && typeof initBalloonGame === 'function') {
                    initBalloonGame();
                } else if (gameType === 'flower' && typeof initFlowerGame === 'function') {
                    initFlowerGame();
                } else if (gameType === 'spin' && typeof initSpinGame === 'function') {
                    initSpinGame();
                } else if (gameType === 'quiz' && typeof initQuizGame === 'function') {
                    initQuizGame();
                } else if (gameType === 'whack' && typeof initWhackGame === 'function') {
                    initWhackGame();
                } else if (gameType === 'butterfly' && typeof initButterflyGame === 'function') {
                    initButterflyGame();
                } else if (gameType === 'plant' && typeof initPlantGame === 'function') {
                    initPlantGame();
                } else if (gameType === 'nature-quiz' && typeof initNatureQuiz === 'function') {
                    initNatureQuiz();
                }
            }
        });
    });
    
    // Close modals
    document.querySelectorAll('.close-game').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.game-modal').classList.remove('active');
            
            // Stop games when closing
            if (typeof stopBalloonGame === 'function') stopBalloonGame();
            if (typeof stopFlowerGame === 'function') stopFlowerGame();
            if (typeof stopWhackGame === 'function') stopWhackGame();
            if (typeof stopButterflyGame === 'function') stopButterflyGame();
        });
    });
    
    // Close modal when clicking outside
    Object.values(modals).forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    if (typeof stopBalloonGame === 'function') stopBalloonGame();
                    if (typeof stopFlowerGame === 'function') stopFlowerGame();
                    if (typeof stopWhackGame === 'function') stopWhackGame();
                    if (typeof stopButterflyGame === 'function') stopButterflyGame();
                }
            });
        }
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Gallery lightbox effect (simple)
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        `;
        
        const lightboxImg = document.createElement('img');
        lightboxImg.src = img.src;
        lightboxImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 10px;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
        `;
        
        overlay.appendChild(lightboxImg);
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
    });
});

// Countdown Timer
function initCountdown() {
    const birthday = new Date('2025-11-11T00:00:00');
    
    function updateCountdown() {
        const now = new Date();
        const diff = birthday - now;
        
        if (diff <= 0) {
            // Birthday has arrived!
            document.querySelector('.countdown-container h3').textContent = "🎉 IT'S YOUR BIRTHDAY! 🎉";
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            
            // Trigger celebration effect
            triggerBirthdayCelebration();
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function triggerBirthdayCelebration() {
    // Extra confetti and celebration effects
    const confettiContainer = document.querySelector('.confetti-container');
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e91e63'];
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '15px';
            confetti.style.height = '15px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.animation = `confettiFall ${2 + Math.random() * 2}s linear`;
            confettiContainer.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 50);
    }
}

// Mystery Boxes
function initMysteryBoxes() {
    const mysteryBoxes = document.querySelectorAll('.mystery-box');
    
    mysteryBoxes.forEach((box, index) => {
        box.addEventListener('click', function() {
            if (!this.classList.contains('flipped')) {
                // Add suspenseful delay before flipping
                this.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                    this.classList.add('flipped');
                    
                    // Add sparkle effect
                    createSparkles(this);
                }, 200);
            }
        });
        
        // Double click to flip back
        box.addEventListener('dblclick', function() {
            this.classList.remove('flipped');
        });
    });
}

function createSparkles(element) {
    const sparkles = ['✨', '⭐', '💫', '🌟'];
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            font-size: 2rem;
            pointer-events: none;
            z-index: 9999;
            animation: sparkleAnimation 1s ease-out forwards;
        `;
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 100;
        sparkle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        sparkle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }
    
    // Add sparkle animation if not exists
    if (!document.getElementById('sparkleStyle')) {
        const style = document.createElement('style');
        style.id = 'sparkleStyle';
        style.textContent = `
            @keyframes sparkleAnimation {
                0% {
                    transform: translate(0, 0) scale(0);
                    opacity: 1;
                }
                100% {
                    transform: translate(var(--tx), var(--ty)) scale(1);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Gift Boxes
function initGiftBoxes() {
    const giftBoxes = document.querySelectorAll('.gift-box');
    
    giftBoxes.forEach((box, index) => {
        box.addEventListener('click', function() {
            if (!this.classList.contains('opened')) {
                // Add a suspenseful shake effect
                this.style.animation = 'shake 0.5s ease';
                
                setTimeout(() => {
                    this.style.animation = '';
                    this.classList.add('opened');
                    
                    // Create heart particles
                    createHeartParticles(this);
                    
                    // Special effect for the phone number gift
                    const giftNumber = this.getAttribute('data-gift');
                    if (giftNumber === '5') {
                        createPhoneRing();
                    }
                }, 500);
            }
        });
        
        // Double click to close
        box.addEventListener('dblclick', function(e) {
            e.stopPropagation();
            this.classList.remove('opened');
        });
    });
    
    // Add shake animation
    if (!document.getElementById('shakeStyle')) {
        const style = document.createElement('style');
        style.id = 'shakeStyle';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
}

function createHeartParticles(element) {
    const hearts = ['💕', '💖', '💗', '💓', '💝', '💘'];
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 12; i++) {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            font-size: 2rem;
            pointer-events: none;
            z-index: 9999;
        `;
        
        const angle = (i / 12) * Math.PI * 2;
        const distance = 150;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        document.body.appendChild(heart);
        
        heart.animate([
            { transform: 'translate(0, 0) scale(0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(1.5) rotate(${360}deg)`, opacity: 0 }
        ], {
            duration: 1500,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        setTimeout(() => heart.remove(), 1500);
    }
}

function createPhoneRing() {
    // Create a special phone ringing effect
    const phoneEmojis = ['📱', '📞', '☎️'];
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const phone = document.createElement('div');
            phone.textContent = phoneEmojis[Math.floor(Math.random() * phoneEmojis.length)];
            phone.style.cssText = `
                position: fixed;
                left: 50%;
                top: 50%;
                font-size: 4rem;
                pointer-events: none;
                z-index: 10000;
                animation: phoneRing 1s ease-out forwards;
            `;
            document.body.appendChild(phone);
            setTimeout(() => phone.remove(), 1000);
        }, i * 200);
    }
    
    if (!document.getElementById('phoneRingStyle')) {
        const style = document.createElement('style');
        style.id = 'phoneRingStyle';
        style.textContent = `
            @keyframes phoneRing {
                0% { transform: translate(-50%, -50%) scale(0.5) rotate(0deg); opacity: 1; }
                50% { transform: translate(-50%, -50%) scale(1.2) rotate(15deg); }
                100% { transform: translate(-50%, -50%) scale(2) rotate(0deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Cursor Follower
function initCursorFollower() {
    const followerEmojis = ['🦋', '🌸', '💖', '✨', '🌺'];
    let currentEmoji = 0;
    
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';
    follower.textContent = followerEmojis[0];
    document.body.appendChild(follower);
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth following animation
    function animateFollower() {
        const speed = 0.15;
        followerX += (mouseX - followerX) * speed;
        followerY += (mouseY - followerY) * speed;
        
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
    
    // Change emoji on click
    document.addEventListener('click', () => {
        currentEmoji = (currentEmoji + 1) % followerEmojis.length;
        follower.textContent = followerEmojis[currentEmoji];
        
        // Create a burst effect
        createFollowerBurst(followerX, followerY);
    });
    
    // Special effect on hovering over gift boxes
    const giftBoxes = document.querySelectorAll('.gift-box');
    giftBoxes.forEach(box => {
        box.addEventListener('mouseenter', () => {
            follower.style.transform = 'scale(1.5)';
            follower.textContent = '🎁';
        });
        
        box.addEventListener('mouseleave', () => {
            follower.style.transform = 'scale(1)';
            follower.textContent = followerEmojis[currentEmoji];
        });
    });
}

function createFollowerBurst(x, y) {
    const burstEmojis = ['✨', '💫', '⭐', '🌟'];
    for (let i = 0; i < 6; i++) {
        const burst = document.createElement('div');
        burst.textContent = burstEmojis[Math.floor(Math.random() * burstEmojis.length)];
        burst.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 9998;
        `;
        
        const angle = (i / 6) * Math.PI * 2;
        const distance = 60;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        document.body.appendChild(burst);
        
        burst.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        });
        
        setTimeout(() => burst.remove(), 600);
    }
}
