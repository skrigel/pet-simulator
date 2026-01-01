// Retro Pet Simulator - Game Logic

// Pet Stats
let petStats = {
    hunger: 80,
    happiness: 70,
    energy: 60,
    state: 'happy' // happy, sad, sleeping
};

// Game Configuration
const config = {
    maxStat: 100,
    minStat: 0,
    decayRate: 1, // Stats decrease by this amount every interval
    decayInterval: 3000, // Decay every 3 seconds
    feedAmount: 20,
    playAmount: 15,
    sleepAmount: 25
};

// Initialize game
function initGame() {
    console.log('🎮 Retro Pet Simulator Started!');
    updateDisplay();
    startDecay();
}

// Update all display elements
function updateDisplay() {
    // Update stat bars
    updateStatBar('hunger', petStats.hunger);
    updateStatBar('happiness', petStats.happiness);
    updateStatBar('energy', petStats.energy);
    
    // Update pet state
    updatePetState();
    
    // Update status message
    updateStatusMessage();
}

// Update individual stat bar
function updateStatBar(stat, value) {
    const bar = document.getElementById(`${stat}-bar`);
    const valueDisplay = document.getElementById(`${stat}-value`);
    
    if (bar && valueDisplay) {
        bar.style.width = `${value}%`;
        valueDisplay.textContent = value;
        
        // Color coding based on value
        if (value <= 20) {
            bar.style.background = '#8b0a3d';
        } else if (value <= 50) {
            bar.style.background = '#c9184a';
        } else {
            bar.style.background = '#0f380f';
        }
    }
}

// Update pet sprite based on stats
function updatePetState() {
    const petSprite = document.getElementById('pet-sprite');
    
    // Determine pet state based on stats
    const avgStats = (petStats.hunger + petStats.happiness + petStats.energy) / 3;
    
    if (petStats.state === 'sleeping') {
        petSprite.className = 'pet sleeping';
    } else if (avgStats < 30) {
        petSprite.className = 'pet sad';
        petStats.state = 'sad';
    } else {
        petSprite.className = 'pet happy';
        petStats.state = 'happy';
    }
}

// Update status message
function updateStatusMessage() {
    const messageElement = document.getElementById('status-message');
    let message = '';
    
    // Priority messages based on lowest stat
    if (petStats.hunger < 20) {
        message = '🍖 Your pet is STARVING!';
    } else if (petStats.energy < 20) {
        message = '💤 Your pet is EXHAUSTED!';
    } else if (petStats.happiness < 20) {
        message = '😢 Your pet is very SAD!';
    } else if (petStats.hunger < 40 || petStats.energy < 40 || petStats.happiness < 40) {
        message = '⚠️ Some stats are getting low...';
    } else if (petStats.hunger > 80 && petStats.happiness > 80 && petStats.energy > 80) {
        message = '✨ Your pet is thriving!';
    } else {
        message = 'Your pet is doing well! 😊';
    }
    
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.animation = 'none';
        setTimeout(() => {
            messageElement.style.animation = 'fadeIn 0.5s';
        }, 10);
    }
}

// Feed the pet
function feedPet() {
    console.log('🍖 Feeding pet...');
    
    if (petStats.hunger >= config.maxStat) {
        showMessage('Your pet is already full!');
        return;
    }
    
    petStats.hunger = Math.min(config.maxStat, petStats.hunger + config.feedAmount);
    showMessage('Yum! +' + config.feedAmount + ' Hunger! 🍖');
    
    // Feeding makes pet slightly happier
    petStats.happiness = Math.min(config.maxStat, petStats.happiness + 5);
    
    updateDisplay();
}

// Play with the pet
function playWithPet() {
    console.log('🎮 Playing with pet...');
    
    if (petStats.energy < 10) {
        showMessage('Your pet is too tired to play!');
        return;
    }
    
    petStats.happiness = Math.min(config.maxStat, petStats.happiness + config.playAmount);
    petStats.energy = Math.max(config.minStat, petStats.energy - 10); // Playing costs energy
    
    showMessage('Whee! +' + config.playAmount + ' Happiness! 🎮');
    updateDisplay();
}

// Let the pet sleep
function petSleep() {
    console.log('💤 Pet is sleeping...');
    
    if (petStats.energy >= config.maxStat) {
        showMessage('Your pet is not tired!');
        return;
    }
    
    // Set sleeping state
    const petSprite = document.getElementById('pet-sprite');
    petSprite.className = 'pet sleeping';
    petStats.state = 'sleeping';
    
    showMessage('Zzz... Restoring energy... 💤');
    
    // Restore energy over time
    let sleepTicks = 0;
    const maxSleepTicks = 3;
    
    const sleepInterval = setInterval(() => {
        sleepTicks++;
        petStats.energy = Math.min(config.maxStat, petStats.energy + 10);
        updateDisplay();
        
        if (sleepTicks >= maxSleepTicks || petStats.energy >= config.maxStat) {
            clearInterval(sleepInterval);
            petStats.state = 'happy';
            showMessage('Your pet woke up refreshed! ✨');
            updateDisplay();
        }
    }, 1000);
}

// Show temporary message
function showMessage(message) {
    const messageElement = document.getElementById('status-message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.animation = 'none';
        setTimeout(() => {
            messageElement.style.animation = 'fadeIn 0.5s';
        }, 10);
    }
}

// Decay stats over time
function startDecay() {
    setInterval(() => {
        // Only decay if not sleeping
        if (petStats.state !== 'sleeping') {
            petStats.hunger = Math.max(config.minStat, petStats.hunger - config.decayRate);
            petStats.happiness = Math.max(config.minStat, petStats.happiness - config.decayRate);
            petStats.energy = Math.max(config.minStat, petStats.energy - config.decayRate);
            
            updateDisplay();
            
            // Check for critical state
            if (petStats.hunger <= 0 || petStats.energy <= 0) {
                showMessage('⚠️ CRITICAL! Care for your pet NOW!');
            }
        }
    }, config.decayInterval);
}

// Start the game when page loads
window.addEventListener('load', initGame);

// Console easter egg
console.log('%c🎮 RETRO PET SIMULATOR v1.0', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cTip: You can modify petStats in the console!', 'color: #764ba2; font-size: 12px;');
console.log('%cExample: petStats.happiness = 100', 'color: #999; font-size: 11px;');
