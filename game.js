/* ============================================
   DANCE RHYTHM - GAME ENGINE v2
   Guitar Hero / DDR style with breakdance theme
   ============================================ */

// ---- Particle System ----
class ParticleSystem {
    constructor(container) {
        this.container = container;
    }

    emit(x, y, color, count = 12) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 8 + 3;
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const distance = Math.random() * 70 + 30;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            particle.style.cssText = `
                left: ${x}px; top: ${y}px;
                width: ${size}px; height: ${size}px;
                background: ${color};
                box-shadow: 0 0 ${size * 2}px ${color};
                --tx: ${tx}px; --ty: ${ty}px;
            `;
            this.container.appendChild(particle);
            setTimeout(() => particle.remove(), 700);
        }
    }
}

// ---- Main Game ----
class DanceGame {
    constructor() {
        // DOM
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.gameoverScreen = document.getElementById('gameover-screen');
        this.arrowsContainer = document.getElementById('arrows-container');
        this.particlesContainer = document.getElementById('particles-container');
        this.judgmentEl = document.getElementById('judgment');
        this.scoreEl = document.getElementById('score');
        this.comboEl = document.getElementById('combo');
        this.maxComboEl = document.getElementById('max-combo');
        this.progressFill = document.getElementById('progress-fill');
        this.songTitleHud = document.getElementById('song-title-hud');
        this.dancerStickman = document.getElementById('dancer-stickman');
        this.comboFire = document.getElementById('combo-fire');
        this.fireText = document.getElementById('fire-text');

        // State
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.hits = { perfect: 0, great: 0, good: 0, miss: 0 };
        this.difficulty = 'easy';
        this.selectedSongIndex = 0;
        this.selectedChar = 'bboy';
        this.isRunning = false;
        this.arrows = [];
        this.gameNotes = [];
        this.currentNoteIndex = 0;
        this.gameStartTime = 0;
        this.lastComboMilestone = 0;

        // Timing windows (ms)
        this.windows = { perfect: 50, great: 100, good: 160 };

        // Speed (seconds for arrow to travel top to target)
        this.travelTime = 2.0;

        // Direction mappings
        this.dirSymbols = { left: '◄', down: '▼', up: '▲', right: '►' };
        this.dirColors = {
            left: '#ff2d95', down: '#00d4ff',
            up: '#00ff88', right: '#ffe100'
        };
        this.laneToDir = ['left', 'down', 'up', 'right'];

        this.keyMap = {
            'ArrowLeft': 'left', 'ArrowDown': 'down',
            'ArrowUp': 'up', 'ArrowRight': 'right',
            'd': 'left', 'D': 'left',
            'f': 'down', 'F': 'down',
            'j': 'up', 'J': 'up',
            'k': 'right', 'K': 'right',
        };

        // Engines
        this.audio = new AudioEngine();
        this.particles = new ParticleSystem(this.particlesContainer);

        // Dance animations
        this.danceAnims = ['dancer-hit', 'dancer-perfect', 'dancer-freeze', 'dancer-windmill'];
        this.currentAnimTimeout = null;

        this.init();
    }

    init() {
        this.populateSongList();
        this.bindEvents();
    }

    // ---- Song List UI ----
    populateSongList() {
        const list = document.getElementById('song-list');
        list.innerHTML = '';
        SONGS.forEach((song, i) => {
            const card = document.createElement('div');
            card.className = 'song-card' + (i === 0 ? ' active' : '');
            card.dataset.index = i;
            card.id = `song-${song.id}`;
            card.innerHTML = `
                <span class="song-icon">${song.icon}</span>
                <div class="song-info">
                    <div class="song-name">${song.name}</div>
                    <div class="song-desc">${song.description}</div>
                </div>
                <span class="song-bpm">${song.bpm} BPM</span>
            `;
            card.addEventListener('click', () => {
                document.querySelectorAll('.song-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.selectedSongIndex = i;
                this.audio.init();
                this.audio.playMenuClick();
            });
            list.appendChild(card);
        });
    }

    // ---- Events ----
    bindEvents() {
        // Character selection
        document.querySelectorAll('.char-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.char-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedChar = btn.dataset.char;
                this.audio.init();
                this.audio.playMenuClick();
            });
        });

        // Difficulty
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.dataset.difficulty;
                this.audio.init();
                this.audio.playMenuClick();
            });
        });

        // Start
        document.getElementById('start-btn').addEventListener('click', () => {
            this.audio.init();
            this.audio.playMenuClick();
            this.startGame();
        });

        // Restart
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.audio.playMenuClick();
            this.startGame();
        });

        // Menu
        document.getElementById('menu-btn').addEventListener('click', () => {
            this.audio.playMenuClick();
            this.showScreen('start');
        });

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (this.keyMap[e.key] && this.isRunning) {
                e.preventDefault();
                this.handleInput(this.keyMap[e.key]);
            }
            if (e.key === ' ' && this.startScreen.classList.contains('active')) {
                e.preventDefault();
                this.audio.init();
                this.startGame();
            }
        });

        // Touch targets
        document.querySelectorAll('.target-arrow').forEach(target => {
            target.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.isRunning) this.handleInput(target.dataset.key);
            });
        });
    }

    showScreen(name) {
        this.startScreen.classList.remove('active');
        this.gameScreen.classList.remove('active');
        this.gameoverScreen.classList.remove('active');
        ({ start: this.startScreen, game: this.gameScreen, gameover: this.gameoverScreen })[name].classList.add('active');
    }

    // ---- Start Game ----
    startGame() {
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.hits = { perfect: 0, great: 0, good: 0, miss: 0 };
        this.arrows = [];
        this.currentNoteIndex = 0;
        this.lastComboMilestone = 0;
        this.arrowsContainer.innerHTML = '';
        this.particlesContainer.innerHTML = '';
        this.comboFire.classList.add('hidden');

        this.scoreEl.textContent = '0';
        this.comboEl.textContent = '0';
        this.maxComboEl.textContent = '0';
        this.progressFill.style.width = '0%';
        this.judgmentEl.className = 'judgment-text';

        // Song & difficulty setup
        const song = SONGS[this.selectedSongIndex];
        this.audio.setBPM(song.bpm);
        this.gameNotes = getNotesForDifficulty(song, this.difficulty);
        this.currentSong = song;
        this.songTitleHud.textContent = song.name.toUpperCase();

        // Character setup
        this.setupCharacter();

        // Travel time based on difficulty
        this.travelTime = this.difficulty === 'easy' ? 2.2 :
                          this.difficulty === 'medium' ? 1.8 : 1.4;

        this.showScreen('game');
        this.isRunning = true;

        this.showJudgment('HAZIR OL!', 'info');
        setTimeout(() => {
            this.showJudgment('BATTLE!', 'perfect');
            this.gameStartTime = performance.now();
            this.audio.currentBeat = -1;
            this.gameLoop();
        }, 1500);
    }

    setupCharacter() {
        const dancer = this.dancerStickman;
        // Reset classes
        dancer.className = 'stickman stickman-idle';
        if (this.selectedChar === 'bgirl') {
            dancer.classList.add('stickman-girl');
            // Add hair element if not exists
            if (!dancer.querySelector('.stickman-hair')) {
                const hair = document.createElement('div');
                hair.className = 'stickman-hair';
                dancer.appendChild(hair);
            }
        } else {
            const hair = dancer.querySelector('.stickman-hair');
            if (hair) hair.remove();
        }
    }

    // ---- Game Loop ----
    gameLoop() {
        if (!this.isRunning) return;

        const now = performance.now();
        const elapsed = (now - this.gameStartTime) / 1000; // seconds
        const beatDuration = 60 / this.currentSong.bpm;

        // Spawn arrows
        while (this.currentNoteIndex < this.gameNotes.length) {
            const note = this.gameNotes[this.currentNoteIndex];
            const noteTimeSec = note.time * beatDuration;

            if (elapsed >= noteTimeSec - this.travelTime) {
                const dir = this.laneToDir[note.lane];
                this.spawnArrow(dir, noteTimeSec);
                this.currentNoteIndex++;
            } else {
                break;
            }
        }

        // Update arrows
        this.updateArrows(elapsed);

        // Progress
        const lastNoteTime = this.gameNotes.length > 0
            ? this.gameNotes[this.gameNotes.length - 1].time * beatDuration + 2
            : 1;
        this.progressFill.style.width = `${Math.min(elapsed / lastNoteTime * 100, 100)}%`;

        // Metronome / beat
        const currentBeatNum = Math.floor(elapsed / beatDuration);
        if (currentBeatNum > this.audio.currentBeat) {
            this.audio.currentBeat = currentBeatNum;
            this.audio.playBeatForSong(this.currentSong.id, currentBeatNum);
        }

        // Game end check
        if (this.currentNoteIndex >= this.gameNotes.length && this.arrows.length === 0) {
            setTimeout(() => this.endGame(), 800);
            return;
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    spawnArrow(direction, targetTimeSec) {
        const arrow = document.createElement('div');
        arrow.className = 'falling-arrow';
        arrow.dataset.direction = direction;
        arrow.textContent = this.dirSymbols[direction];
        arrow.style.top = '-80px';
        this.arrowsContainer.appendChild(arrow);

        this.arrows.push({
            element: arrow,
            direction: direction,
            targetTime: targetTimeSec,
            hit: false
        });
    }

    updateArrows(elapsed) {
        const targetY = window.innerHeight * 0.82;

        for (let i = this.arrows.length - 1; i >= 0; i--) {
            const arrow = this.arrows[i];
            if (arrow.hit) continue;

            const timeUntilTarget = arrow.targetTime - elapsed;
            const progress = 1 - (timeUntilTarget / this.travelTime);
            const y = -80 + (targetY + 80) * progress;

            arrow.element.style.top = `${y}px`;

            // Miss: passed target zone
            if (y > targetY + 90) {
                this.onMiss(arrow);
                arrow.element.classList.add('miss-effect');
                setTimeout(() => arrow.element.remove(), 350);
                this.arrows.splice(i, 1);
            }
        }
    }

    // ---- Input Handling ----
    handleInput(direction) {
        // Flash target
        const target = document.querySelector(`.target-arrow[data-key="${direction}"]`);
        target.classList.add('hit');
        setTimeout(() => target.classList.remove('hit'), 120);

        const elapsed = (performance.now() - this.gameStartTime) / 1000;
        let closestArrow = null;
        let closestDist = Infinity;

        for (const arrow of this.arrows) {
            if (arrow.direction !== direction || arrow.hit) continue;
            const timeDiff = Math.abs(arrow.targetTime - elapsed) * 1000;
            if (timeDiff < closestDist) {
                closestDist = timeDiff;
                closestArrow = arrow;
            }
        }

        if (!closestArrow) return;

        let quality;
        if (closestDist <= this.windows.perfect) quality = 'perfect';
        else if (closestDist <= this.windows.great) quality = 'great';
        else if (closestDist <= this.windows.good) quality = 'good';
        else return;

        closestArrow.hit = true;
        this.onHit(quality, closestArrow);

        // Visual effect
        closestArrow.element.classList.add('hit-effect');
        setTimeout(() => {
            closestArrow.element.remove();
            const idx = this.arrows.indexOf(closestArrow);
            if (idx > -1) this.arrows.splice(idx, 1);
        }, 250);

        // Particles
        const rect = closestArrow.element.getBoundingClientRect();
        this.particles.emit(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            this.dirColors[direction],
            quality === 'perfect' ? 18 : quality === 'great' ? 12 : 8
        );
    }

    onHit(quality, arrow) {
        const scores = { perfect: 300, great: 200, good: 100 };
        this.combo++;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;

        const multiplier = 1 + Math.floor(this.combo / 10) * 0.3;
        this.score += Math.floor(scores[quality] * multiplier);
        this.hits[quality]++;

        this.scoreEl.textContent = this.score.toLocaleString();
        this.comboEl.textContent = this.combo;
        this.maxComboEl.textContent = this.maxCombo;

        const texts = { perfect: 'PERFECT!', great: 'GREAT!', good: 'GOOD' };
        this.showJudgment(texts[quality], quality);

        this.audio.playHitSound(quality);

        // Dancer animation
        this.triggerDancerAnim(quality);

        // Combo milestones
        if (this.combo > 0 && this.combo % 10 === 0 && this.combo !== this.lastComboMilestone) {
            this.lastComboMilestone = this.combo;
            this.showComboFire(this.combo);
            this.audio.playComboSound(Math.floor(this.combo / 10));
        }
    }

    onMiss(arrow) {
        this.combo = 0;
        this.lastComboMilestone = 0;
        this.hits.miss++;
        this.comboEl.textContent = '0';
        this.showJudgment('MISS', 'miss');
        this.audio.playMissSound();
        this.triggerDancerAnim('miss');
    }

    // ---- Dancer Animations ----
    triggerDancerAnim(quality) {
        if (this.currentAnimTimeout) clearTimeout(this.currentAnimTimeout);

        const dancer = this.dancerStickman;
        // Remove all anim classes
        dancer.className = 'stickman' + (this.selectedChar === 'bgirl' ? ' stickman-girl' : '');

        // Calculate dynamic animation speed based on BPM
        // Base reference is 120 BPM. Higher BPM = faster animation (shorter duration).
        const speedMultiplier = 120 / this.currentSong.bpm;
        
        let animDuration = 600; // default in ms
        let animClass = '';

        if (quality === 'miss') {
            animClass = 'dancer-miss';
            animDuration = 500;
        } else if (quality === 'perfect') {
            // Power Moves (Akrobatik, zor hareketler)
            if (this.combo > 20) {
                animClass = 'dancer-power-flare'; // Flare animasyonu (yeni)
                animDuration = 1000 * speedMultiplier;
            } else if (this.combo > 10) {
                animClass = 'dancer-power-windmill';
                animDuration = 800 * speedMultiplier;
            } else {
                animClass = 'dancer-power-freeze';
                animDuration = 600 * speedMultiplier;
            }
        } else if (quality === 'great') {
            // Footwork / Downrock (Yerde seri hareketler)
            animClass = 'dancer-footwork-6step';
            animDuration = 500 * speedMultiplier;
        } else {
            // Good -> Toprock (Ayakta ritim)
            animClass = 'dancer-toprock';
            animDuration = 400 * speedMultiplier;
        }

        dancer.classList.add(animClass);
        // Apply dynamic duration via CSS variable
        dancer.style.setProperty('--anim-dur', `${animDuration}ms`);

        this.currentAnimTimeout = setTimeout(() => {
            dancer.className = 'stickman stickman-idle' + (this.selectedChar === 'bgirl' ? ' stickman-girl' : '');
            dancer.style.removeProperty('--anim-dur');
        }, animDuration);
    }

    // ---- Combo Fire ----
    showComboFire(combo) {
        this.comboFire.classList.remove('hidden');
        this.fireText.textContent = `🔥 ${combo} COMBO!`;
        // Force re-animation
        this.fireText.style.animation = 'none';
        void this.fireText.offsetWidth;
        this.fireText.style.animation = '';
        setTimeout(() => this.comboFire.classList.add('hidden'), 1200);
    }

    // ---- Judgment Display ----
    showJudgment(text, className) {
        this.judgmentEl.textContent = text;
        this.judgmentEl.className = 'judgment-text ' + className;
        void this.judgmentEl.offsetWidth;
        this.judgmentEl.classList.add('show');
    }

    // ---- Game Over ----
    endGame() {
        this.isRunning = false;
        this.showScreen('gameover');

        const totalNotes = this.hits.perfect + this.hits.great + this.hits.good + this.hits.miss;
        const accuracy = totalNotes > 0
            ? (this.hits.perfect * 100 + this.hits.great * 75 + this.hits.good * 50) / (totalNotes * 100) * 100
            : 0;

        let grade, gradeClass;
        if (accuracy >= 95) { grade = 'S'; gradeClass = 'grade-s'; }
        else if (accuracy >= 85) { grade = 'A'; gradeClass = 'grade-a'; }
        else if (accuracy >= 70) { grade = 'B'; gradeClass = 'grade-b'; }
        else if (accuracy >= 55) { grade = 'C'; gradeClass = 'grade-c'; }
        else if (accuracy >= 40) { grade = 'D'; gradeClass = 'grade-d'; }
        else { grade = 'F'; gradeClass = 'grade-f'; }

        document.getElementById('final-score').textContent = this.score.toLocaleString();
        document.getElementById('final-max-combo').textContent = this.maxCombo;
        document.getElementById('final-perfect').textContent = this.hits.perfect;
        document.getElementById('final-great').textContent = this.hits.great;
        document.getElementById('final-good').textContent = this.hits.good;
        document.getElementById('final-miss').textContent = this.hits.miss;

        const gradeEl = document.getElementById('grade');
        gradeEl.textContent = grade;
        gradeEl.className = 'grade ' + gradeClass;

        // Accuracy bar
        setTimeout(() => {
            document.getElementById('accuracy-fill').style.width = `${accuracy}%`;
            document.getElementById('accuracy-text').textContent = `${accuracy.toFixed(1)}%`;
        }, 300);

        // Title
        const titleEl = document.getElementById('gameover-title');
        if (accuracy >= 95) titleEl.textContent = '🌟 EFSANE DANS! 🌟';
        else if (accuracy >= 85) titleEl.textContent = '🔥 MUHTEŞEM BATTLE!';
        else if (accuracy >= 70) titleEl.textContent = '⭐ İYİ DANS!';
        else if (accuracy >= 55) titleEl.textContent = '👍 FENA DEĞİL';
        else titleEl.textContent = '💪 TEKRAR DENE!';
    }
}

// ---- Initialize ----
window.addEventListener('DOMContentLoaded', () => {
    new DanceGame();
});
