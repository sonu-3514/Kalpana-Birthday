// Game Music Manager
// Manages background music for different games

const gameMusicManager = {
    currentAudio: null,
    currentGame: null,
    
    // Different music for each game (using working URLs)
    songs: {
        memory: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
        balloon: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
        flower: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
        spin: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
        quiz: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
        whack: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
        butterfly: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
        plant: 'https://assets.mixkit.co/active_storage/sfx/2015/2015-preview.mp3',
        'nature-quiz': 'https://assets.mixkit.co/active_storage/sfx/2022/2022-preview.mp3'
    },
    
    // Play music for a specific game
    play: function(gameType) {
        console.log('🎵 Attempting to play music for:', gameType);
        
        // If same game, don't restart music
        if (this.currentGame === gameType && this.currentAudio && !this.currentAudio.paused) {
            console.log('✅ Same game, music already playing');
            return;
        }
        
        // Stop any currently playing music first
        this.stop();
        
        const songUrl = this.songs[gameType];
        if (!songUrl) {
            console.log('⚠️ No song found for game:', gameType);
            return;
        }
        
        console.log('🎶 Loading song URL:', songUrl);
        
        try {
            // Create new audio element
            this.currentAudio = new Audio();
            this.currentAudio.src = songUrl;
            this.currentAudio.volume = 0.4;
            this.currentAudio.loop = true;
            this.currentGame = gameType;
            
            // Add error handler
            this.currentAudio.onerror = (e) => {
                console.error('❌ Error loading music:', e);
                console.error('Failed URL:', songUrl);
            };
            
            // Add loaded handler
            this.currentAudio.onloadeddata = () => {
                console.log('✅ Music file loaded for:', gameType);
            };
            
            // Add play handler
            this.currentAudio.onplay = () => {
                console.log('▶️ Music started playing for:', gameType);
            };
            
            // Try to play
            const playPromise = this.currentAudio.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('✅ Music playing successfully for:', gameType);
                    })
                    .catch(error => {
                        console.log('⚠️ Autoplay prevented by browser');
                        console.log('💡 Click anywhere to enable music');
                        
                        // Add one-time click listener to start music
                        const startMusic = () => {
                            if (this.currentAudio && this.currentAudio.paused) {
                                this.currentAudio.play()
                                    .then(() => console.log('✅ Music started after user interaction'))
                                    .catch(e => console.log('❌ Still blocked:', e));
                            }
                            document.removeEventListener('click', startMusic);
                        };
                        document.addEventListener('click', startMusic);
                    });
            }
        } catch (error) {
            console.error('❌ Error creating audio:', error);
        }
    },
    
    // Stop currently playing music
    stop: function() {
        if (this.currentAudio) {
            console.log('⏹️ Stopping music for:', this.currentGame);
            
            try {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
                this.currentAudio.src = '';
                this.currentAudio = null;
                this.currentGame = null;
            } catch (error) {
                console.error('Error stopping music:', error);
            }
        }
    },
    
    // Pause music
    pause: function() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            console.log('⏸️ Music paused');
        }
    },
    
    // Resume music
    resume: function() {
        if (this.currentAudio && this.currentAudio.paused) {
            this.currentAudio.play()
                .then(() => console.log('▶️ Music resumed'))
                .catch(error => console.log('Cannot resume:', error));
        }
    },
    
    // Set volume (0.0 to 1.0)
    setVolume: function(volume) {
        if (this.currentAudio) {
            this.currentAudio.volume = Math.max(0, Math.min(1, volume));
            console.log('🔊 Volume set to:', Math.round(volume * 100) + '%');
        }
    }
};

// Export for use in other scripts
window.gameMusicManager = gameMusicManager;

// Log that music manager is ready
console.log('🎵 Game Music Manager loaded and ready!');
console.log('🎮 Available songs for:', Object.keys(gameMusicManager.songs).join(', '));
