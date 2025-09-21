const trashItems = [
    { type: 'it', image: '../../Asset/sampah/cpu.png' },
    { type: 'teknik', image: '../../Asset/sampah/mesin.png' },
    { type: 'it', image: '../../Asset/sampah/pc2.png' },
    { type: 'it', image: '../../Asset/sampah/processor.png' },
    { type: 'teknik', image: '../../Asset/sampah/sampahteknik.png' },
    { type: 'tkp', image: '../../Asset/sampah/cat.png' },
    { type: 'tkp', image: '../../Asset/sampah/batu.png' },
    { type: 'it', image: '../../Asset/sampah/tkj.png' },
    { type: 'tkp', image: '../../Asset/sampah/serpihan.png' },
    { type: 'it', image: '../../Asset/sampah/batre.png' },
    { type: 'it', image: '../../Asset/sampah/komputer.png' },
    { type: 'tkp', image: '../../Asset/sampah/cangkir.png' },
    { type: 'teknik', image: '../../Asset/sampah/baut.png' },
    { type: 'tkp', image: '../../Asset/sampah/batako.png' },
    { type: 'teknik', image: '../../Asset/sampah/ban.png' }
];

let score = 0;
let lives = 3;
let timeLeft = 20;
let gameInterval;
let isGameOver = false;
let playerName = null;

/* ====================== GAME CORE ====================== */
function initGame() {
    updateUI();
    generateTrash(10); // spawn 10 sampah
    startTimer();
    setupDragAndDrop();
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('time').textContent = timeLeft;
}

function generateTrash(count) {
    const gameArea = document.getElementById('game-area');
    
    // Calculate safe spawn area
    const padding = 100; // padding from edges
    const safeWidth = Math.min(gameArea.offsetWidth - 100, window.innerWidth - padding);
    const safeHeight = Math.min(gameArea.offsetHeight - 100, window.innerHeight * 0.4); // Use 40% of viewport height

    if (safeWidth <= 0 || safeHeight <= 0) {
        console.error("Game area dimensions invalid!");
        return;
    }

    // Clear existing trash
    const existingTrash = document.querySelectorAll('.trash-item');
    existingTrash.forEach(item => item.remove());

    for (let i = 0; i < count; i++) {
        const trash = trashItems[Math.floor(Math.random() * trashItems.length)];
        const trashElement = document.createElement('img');
        trashElement.src = trash.image;
        trashElement.className = 'trash-item';
        trashElement.dataset.type = trash.type;

        // Calculate position within safe area
        const posX = padding/2 + Math.random() * (safeWidth - padding);
        const posY = padding/2 + Math.random() * (safeHeight - padding);

        // Ensure trash doesn't overlap too much
        trashElement.style.left = `${posX}px`;
        trashElement.style.top = `${posY}px`;

        gameArea.appendChild(trashElement);
    }
}

function setupDragAndDrop() {
    const trashElements = document.querySelectorAll('.trash-item');
    const bins = document.querySelectorAll('.bin');

    trashElements.forEach(trash => {
        trash.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', e.target.dataset.type);
            e.target.setAttribute('dragging', 'true');
        });

        trash.addEventListener('dragend', e => {
            e.target.removeAttribute('dragging');
        });

        trash.setAttribute('draggable', true);
    });

    bins.forEach(bin => {
        bin.addEventListener('dragover', e => e.preventDefault());
        bin.addEventListener('drop', handleDrop);
    });
}

function handleDrop(e) {
    e.preventDefault();
    const trashType = e.dataTransfer.getData('text/plain');
    const binType = e.target.closest('.bin').id.split('-')[0];
    const draggedElement = document.querySelector('.trash-item[dragging="true"]');

    if (draggedElement) {
        draggedElement.remove();

        if (trashType === binType) {
            score += 10;
            e.target.closest('.bin').style.transform = 'scale(1.1)';
            setTimeout(() => e.target.closest('.bin').style.transform = 'scale(1)', 200);
        } else {
            lives--;
            if (lives <= 0) {
                lives = 0;
                updateUI();
                endGame('lose');
                return;
            }
        }

        updateUI();
        checkWinCondition();
    }
}

function startTimer() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame('lose');
        }
    }, 1000);
}

function checkWinCondition() {
    const remainingTrash = document.querySelectorAll('.trash-item').length;
    if (remainingTrash === 0) {
        endGame('win');
    }
}

function endGame(result) {
    clearInterval(gameInterval);
    isGameOver = true;

    if (result === 'win') {
        document.getElementById('final-score').textContent = score;
        document.getElementById('victory-popup').classList.remove('hidden');
        saveToLeaderboard(playerName || "Anonim", score, 'Pilah Sampah');
    } else {
        document.getElementById('final-score-lose').textContent = score;
        document.getElementById('gameover-popup').classList.remove('hidden');
        saveToLeaderboard(playerName || "Anonim", score, 'Pilah Sampah');
    }
}

function saveToLeaderboard(name, score, game) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name, score, game, date: new Date().toISOString() });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function resetGame() {
    score = 0;
    lives = 3;
    timeLeft = 20;
    isGameOver = false;

    if (gameInterval) clearInterval(gameInterval);

    const trashItemsEl = document.querySelectorAll('.trash-item');
    trashItemsEl.forEach(item => item.remove());

    updateUI();
    document.getElementById('victory-popup').classList.add('hidden');
    document.getElementById('gameover-popup').classList.add('hidden');

    initGame();
}

function setupButtons() {
    // Victory popup buttons
    document.getElementById('play-again').addEventListener('click', () => {
        resetGame();
    });

    document.getElementById('back-to-menu').addEventListener('click', () => {
        window.location.href = '../PilihPermainan/PilihPermainan.html';
    });

    document.getElementById('leaderboard').addEventListener('click', () => {
        window.location.href = '../LeaderboardPermainan/Leaderboard.html';
    });

    // Game over popup buttons
    document.getElementById('play-again-lose').addEventListener('click', () => {
        resetGame();
    });

    document.getElementById('back-to-menu-lose').addEventListener('click', () => {
        window.location.href = '../PilihPermainan/PilihPermainan.html';
    });

    document.getElementById('leader-board').addEventListener('click', () => {
        window.location.href = '../LeaderboardPermainan/Leaderboard.html';
    });
}

/* ====================== AUDIO + ENTRY ====================== */
const backgroundMusic = new Audio('../../backsound/backsound-game2.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

function tryPlayBackgroundOnce() {
    backgroundMusic.play().catch(err => {
        console.warn('Audio play failed (waiting for user gesture):', err);
    });
    document.removeEventListener('click', tryPlayBackgroundOnce);
}
document.addEventListener('click', tryPlayBackgroundOnce, { once: true });

/* ====================== MAIN ENTRY ====================== */
document.addEventListener('DOMContentLoaded', () => {
    // Set default player name
    playerName = localStorage.getItem('playerName') || "Guest";

    // Setup button handlers
    setupButtons();

    // Start game immediately
    initGame();
});
