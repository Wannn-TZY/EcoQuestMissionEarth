const trashItems = [
    { type: 'organic', image: '../../Asset/Sampah1.jpg' },
    { type: 'inorganic', image: '../../Asset/Sampah2.jpg' },
    { type: 'organic', image: '../../Asset/Sampah3.jpg' },
    { type: 'organic', image: '../../Asset/Sampah4.jpg' },
    { type: 'dangerous', image: '../../Asset/Sampah5.jpg' },
    { type: 'dangerous', image: '../../Asset/Sampah6.jpg' },
];

let score = 0;
let lives = 3;
let timeLeft = 20;
let gameInterval;
let isGameOver = false;

let playerName = localStorage.getItem('namaPemain') || null;

/* ====================== GAME CORE ====================== */
function initGame() {
    updateUI();
    generateTrash(10);
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
    const areaWidth = gameArea.offsetWidth - 60;
    const areaHeight = gameArea.offsetHeight;

    const safeZoneTop = 100;
    const safeZoneBottom = areaHeight - 70;
    const usableHeight = safeZoneBottom - safeZoneTop;

    const gridCols = 5;
    const gridRows = 4;
    const cellWidth = areaWidth / gridCols;
    const cellHeight = usableHeight / gridRows;

    for (let i = 0; i < 20; i++) {
        const trash = trashItems[Math.floor(Math.random() * trashItems.length)];
        const trashElement = document.createElement('img');
        trashElement.src = trash.image;
        trashElement.className = 'trash-item';
        trashElement.dataset.type = trash.type;

        const gridCol = Math.floor(Math.random() * gridCols);
        const gridRow = Math.floor(Math.random() * gridRows);

        const offsetX = Math.random() * (cellWidth - 40);
        const offsetY = Math.random() * (cellHeight - 40);

        const posX = (gridCol * cellWidth) + offsetX + 30;
        const posY = (gridRow * cellHeight) + offsetY + safeZoneTop;

        trashElement.style.left = posX + 'px';
        trashElement.style.top = posY + 'px';

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
        saveToLeaderboard(playerName, score, 'Pilah Sampah');
    } else {
        document.getElementById('final-score-lose').textContent = score;
        document.getElementById('gameover-popup').classList.remove('hidden');
        saveToLeaderboard(playerName, score, 'Pilah Sampah');
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

    const trashItems = document.querySelectorAll('.trash-item');
    trashItems.forEach(item => item.remove());

    updateUI();
    document.getElementById('victory-popup').classList.add('hidden');
    document.getElementById('gameover-popup').classList.add('hidden');

    initGame();
}

/* ====================== POPUP NAMA ====================== */
function showNamePopup() {
    if (document.querySelector('.popup-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.innerHTML = `
        <div class="name-popup">
            <h2>Selamat Datang di EcoQuest!</h2>
            <input type="text" id="player-name" placeholder="Masukkan nama kamu..." maxlength="15">
            <button id="start-btn" disabled>Mulai Petualangan</button>
        </div>
    `;
    document.body.appendChild(overlay);

    const popupContent = overlay.querySelector('.name-popup');
    const nameInput = overlay.querySelector('#player-name');
    const startBtn = overlay.querySelector('#start-btn');

    popupContent.addEventListener('click', e => e.stopPropagation());

    nameInput.addEventListener('input', () => {
        startBtn.disabled = nameInput.value.trim().length < 3;
    });

    startBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (name.length >= 3) {
            localStorage.setItem('namaPemain', name);
            playerName = name;

            try {
                backgroundMusic.play().catch(err => {
                    console.warn('Audio play failed:', err);
                });
            } catch (err) {
                console.warn('Audio play error:', err);
            }

            overlay.remove();
            initGame();
        }
    });

    setTimeout(() => nameInput.focus(), 50);
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
    if (playerName) {
        initGame();
    } else {
        showNamePopup();
    }
});
