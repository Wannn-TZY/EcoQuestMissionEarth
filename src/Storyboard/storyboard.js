document.addEventListener("DOMContentLoaded", function() {
    const storyText = document.getElementById("story-text");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const kembali = document.getElementById("btn-kembali");
    const volumeBtn = document.getElementById("volume-btn");
    const volumeSlider = document.getElementById("volume-slider");
    
    let volumeAktif = true;
    let audio = new Audio("../../backsound/bs.mp3");
    audio.loop = true;
    
    const stories = [
            "🌍 Selamat datang di EcoQuest: Mission Earth!",
            "🌪️ Dunia sedang terancam oleh sampah dan polusi yang makin parah.",
            "👣 Jejakmu di game ini bisa jadi langkah awal perubahan nyata.",
            "🧤 Tugas kamu? Bersihkan lingkungan, pilah sampah, dan pulihkan alam!",
            "🌿 Main sambil belajar, jadi pahlawan bumi yang dibutuhkan planet ini."


    ];

    let currentStory = 0;
    let isTyping = false;

    function typeWriter(text, index = 0) {
        if (index < text.length) {
            isTyping = true;
            storyText.textContent = text.substring(0, index + 1);
            setTimeout(() => typeWriter(text, index + 1), 50);
        } else {
            isTyping = false;
        }
    }

    function updateStory() {
        storyText.textContent = '';
        typeWriter(stories[currentStory]);
        
        // Add particle effects
        createParticles();
    }

    function createParticles() {
        const particles = document.createElement('div');
        particles.className = 'particles';
        document.querySelector('.message-box').appendChild(particles);
        
        setTimeout(() => particles.remove(), 1000);
    }

    nextBtn.addEventListener("click", function() {
        if (isTyping) {
            // Skip typing animation
            isTyping = false;
            storyText.textContent = stories[currentStory];
            return;
        }

        currentStory++;
        if (currentStory >= stories.length) {
            // Add transition effect
            document.querySelector('.game-container').style.opacity = 0;
            setTimeout(() => {
                window.location.href = "../Tampilanutama/Tampilanutama.html";
            }, );
        } else {
            updateStory();
        }
    });

    // Add previous button functionality
    prevBtn.addEventListener("click", function() {
        if (isTyping) {
            isTyping = false;
            storyText.textContent = stories[currentStory];
            return;
        }

        currentStory--;
        if (currentStory < 0) {
            // If at first story, stay there
            currentStory = 0;
        }
        updateStory();
    });

    kembali.addEventListener("click", function() {
        // Add fade out effect
        document.querySelector('.game-container').style.opacity = 0;
        
        // Stop the audio before navigating
        audio.pause();
        audio.currentTime = 0;
        
        // Navigate back with delay for transition
        setTimeout(() => {
            window.location.href = "../MenuUtama/MenuUtama.html";
        }, );
    });

    volumeBtn.addEventListener("click", function() {
        volumeAktif = !volumeAktif;
        if (volumeAktif) {
            audio.play();
            volumeBtn.src = "../../Asset/VolumeAktif.jpg";
        } else {
            audio.pause();
            volumeBtn.src = "../../Asset/VolumeNonAktif.jpg";
        }
    });

    volumeSlider.addEventListener("input", function() {
        audio.volume = this.value / 100;
    });

    // Initialize
    updateStory();
    audio.play();
});