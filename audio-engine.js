/* ============================================
   AUDIO ENGINE
   Procedural music generation with Web Audio API
   Each song generates a unique beat pattern
   ============================================ */

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.bpm = 120;
        this.beatInterval = 60 / this.bpm;
        this.currentBeat = -1;
        this.masterGain = null;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.5;
            this.masterGain.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setBPM(bpm) {
        this.bpm = bpm;
        this.beatInterval = 60 / this.bpm;
    }

    // --- Kick Drum ---
    playKick(time) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(30, time + 0.12);
        osc.type = 'sine';

        gain.gain.setValueAtTime(0.6, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

        osc.start(time);
        osc.stop(time + 0.2);
    }

    // --- Snare ---
    playSnare(time) {
        if (!this.ctx) return;
        // Noise part
        const bufferSize = this.ctx.sampleRate * 0.1;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.5;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1000;

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.3, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        noise.start(time);
        noise.stop(time + 0.1);

        // Tone part
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.connect(oscGain);
        oscGain.connect(this.masterGain);
        osc.frequency.setValueAtTime(200, time);
        osc.frequency.exponentialRampToValueAtTime(50, time + 0.05);
        osc.type = 'triangle';
        oscGain.gain.setValueAtTime(0.25, time);
        oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.07);
        osc.start(time);
        osc.stop(time + 0.07);
    }

    // --- Hi-Hat ---
    playHiHat(time, open = false) {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * (open ? 0.15 : 0.05);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.3;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = open ? 5000 : 8000;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + (open ? 0.15 : 0.05));

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(time);
        noise.stop(time + (open ? 0.15 : 0.05));
    }

    // --- Bass ---
    playBass(time, freq = 55) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.frequency.value = freq;
        osc.type = 'sine';

        gain.gain.setValueAtTime(0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

        osc.start(time);
        osc.stop(time + 0.3);
    }

    // --- Play a beat pattern based on song style ---
    playBeatForSong(songId, beatNumber) {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;

        switch (songId) {
            case 'boom_bap':
                // Classic boom bap pattern
                if (beatNumber % 4 === 0) { this.playKick(t); this.playHiHat(t); }
                else if (beatNumber % 4 === 2) { this.playSnare(t); this.playHiHat(t); }
                else if (beatNumber % 2 === 1) { this.playHiHat(t); }
                if (beatNumber % 8 === 0) this.playBass(t, 55);
                break;

            case 'trap_beat':
                // Trap: 808 kick + fast hi-hats
                if (beatNumber % 4 === 0) { this.playKick(t); this.playBass(t, 40); }
                else if (beatNumber % 4 === 2) { this.playSnare(t); }
                this.playHiHat(t);
                if (beatNumber % 2 === 0) this.playHiHat(t + 0.05);
                break;

            case 'funk_breakbeat':
                // Funk: syncopated pattern
                if (beatNumber % 4 === 0) { this.playKick(t); this.playBass(t, 65); }
                else if (beatNumber % 4 === 2) { this.playSnare(t); }
                else if (beatNumber % 4 === 1) { this.playKick(t); }
                if (beatNumber % 2 === 0) this.playHiHat(t, true);
                else this.playHiHat(t);
                break;

            case 'lofi_rap':
                // Lo-fi: mellow, sparse
                if (beatNumber % 4 === 0) { this.playKick(t); }
                else if (beatNumber % 4 === 2) { this.playSnare(t); }
                if (beatNumber % 2 === 0) this.playHiHat(t);
                if (beatNumber % 8 === 0) this.playBass(t, 50);
                break;

            case 'underground_hardcore':
                // Hardcore: heavy everything
                if (beatNumber % 4 === 0) { this.playKick(t); this.playBass(t, 45); }
                else if (beatNumber % 4 === 2) { this.playSnare(t); this.playKick(t); }
                else if (beatNumber % 2 === 1) { this.playHiHat(t); }
                this.playHiHat(t);
                break;

            default:
                if (beatNumber % 4 === 0) this.playKick(t);
                else if (beatNumber % 4 === 2) this.playSnare(t);
                this.playHiHat(t);
        }
    }

    // --- Hit Sounds ---
    playHitSound(quality) {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);

        const settings = {
            perfect: { freq: 1200, type: 'sine', vol: 0.2, dur: 0.12 },
            great:   { freq: 900,  type: 'sine', vol: 0.15, dur: 0.1 },
            good:    { freq: 600,  type: 'triangle', vol: 0.12, dur: 0.08 },
        };
        const s = settings[quality] || settings.good;

        osc.frequency.value = s.freq;
        osc.type = s.type;
        gain.gain.setValueAtTime(s.vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + s.dur);
        osc.start(t);
        osc.stop(t + s.dur);

        // Second harmonic for perfect
        if (quality === 'perfect') {
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(this.masterGain);
            osc2.frequency.value = 1800;
            osc2.type = 'sine';
            gain2.gain.setValueAtTime(0.08, t);
            gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
            osc2.start(t);
            osc2.stop(t + 0.1);
        }
    }

    playMissSound() {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.15);
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
    }

    playComboSound(comboLevel) {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const baseFreq = 400 + comboLevel * 50;
        for (let i = 0; i < 3; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.frequency.value = baseFreq + i * 200;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.1, t + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.1);
            osc.start(t + i * 0.05);
            osc.stop(t + i * 0.05 + 0.1);
        }
    }

    playMenuClick() {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.frequency.value = 1000;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        osc.start(t);
        osc.stop(t + 0.06);
    }
}
