/**
 * WFH SURGEON — Audio Engine (procedural audio via Web Audio API)
 */

const AudioEngine = {
    ctx: null, enabled: true, lastEkgTime: 0,
    bgmPlaying: false, bgmNodes: [], bgmNextBeat: 0, bgmBPM: 150,
    bgmChordIndex: 0,
    bgmMode: 'menu', // 'menu' | 'gameplay' | 'gameover'

    // BGM parameters per mode
    bgmParams: {
        menu: {
            bpm: 80,
            oscType: 'triangle',
            chords: [
                [220.0, 277.2, 329.6],   // Am
                [349.2, 440.0, 523.3],   // F
                [261.6, 329.6, 392.0],   // C
                [392.0, 493.9, 587.3],   // G
            ],
            chordGain: 0.015, bassGain: 0.02, bassDecay: 0.015,
            tickGain: 0, kickGain: 0, hhGain: 0, // no percussion
            filterFreq: 600
        },
        gameplay: {
            bpm: 150,
            oscType: 'sawtooth',
            chords: [
                [261.6, 329.6, 392.0],   // C major
                [293.7, 370.0, 440.0],   // D major
                [329.6, 415.3, 493.9],   // E major
                [220.0, 277.2, 329.6],   // A minor
                [246.9, 311.1, 370.0],   // B minor
                [349.2, 440.0, 523.3],   // F major
                [293.7, 370.0, 440.0],   // D major
                [392.0, 493.9, 587.3],   // G major
            ],
            chordGain: 0.02, bassGain: 0.03, bassDecay: 0.02,
            tickGain: 0.015, kickGain: 0.03, hhGain: 0.012,
            filterFreq: 800
        },
        gameover: {
            bpm: 60,
            oscType: 'sine',
            chords: [
                [293.7, 349.2, 440.0],   // Dm
                [233.1, 293.7, 349.2],   // Bb
                [196.0, 233.1, 293.7],   // Gm
                [220.0, 277.2, 329.6],   // A
            ],
            chordGain: 0.012, bassGain: 0.015, bassDecay: 0.01,
            tickGain: 0, kickGain: 0, hhGain: 0, // no percussion
            filterFreq: 500
        }
    },

    init() {
        try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { this.enabled = false; }
    },

    _osc(freq, type, duration, gain = 0.15, delay = 0) {
        if (!this.ctx || !this.enabled) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = type;
        o.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
        g.gain.setValueAtTime(0, this.ctx.currentTime + delay);
        g.gain.linearRampToValueAtTime(gain, this.ctx.currentTime + delay + 0.015);
        g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + delay + duration);
        o.connect(g).connect(this.ctx.destination);
        o.start(this.ctx.currentTime + delay);
        o.stop(this.ctx.currentTime + delay + duration + 0.05);
    },

    _noise(duration, gain = 0.1, filterFreq = 2000) {
        if (!this.ctx || !this.enabled) return;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const src = this.ctx.createBufferSource();
        src.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass'; filter.frequency.value = filterFreq;
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(gain, this.ctx.currentTime);
        g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);
        src.connect(filter).connect(g).connect(this.ctx.destination);
        src.start(); src.stop(this.ctx.currentTime + duration + 0.05);
    },

    // SFX — boosted gains
    playEKG()          { this._osc(880, 'sine', 0.08, 0.10); },
    playCorrectKey()   { this._osc(523, 'sine', 0.08, 0.20); this._osc(659, 'sine', 0.06, 0.14, 0.04); },
    playWrongKey()     { this._osc(150, 'sawtooth', 0.2, 0.25); this._osc(120, 'sawtooth', 0.15, 0.18, 0.05); },
    playPhaseComplete(){ this._osc(523, 'sine', 0.12, 0.25); this._osc(659, 'sine', 0.12, 0.25, 0.1); },
    playLevelComplete(){ this._osc(262, 'sine', 0.4, 0.25); this._osc(330, 'sine', 0.4, 0.20, 0.05); this._osc(392, 'sine', 0.5, 0.20, 0.1); },
    playLevelFail()    { this._osc(392, 'sine', 0.15, 0.25); this._osc(311, 'sine', 0.15, 0.20, 0.15); this._osc(262, 'sine', 0.3, 0.18, 0.3); },
    playCoffeeSplash() { this._noise(0.3, 0.20, 1500); },
    playWifiStatic()   { this._noise(0.4, 0.15, 3000); },
    playBatteryWarning(){ this._osc(200, 'square', 0.1, 0.15); this._osc(200, 'square', 0.1, 0.15, 0.2); },
    playClick()        { this._osc(800, 'sine', 0.03, 0.15); },
    playBuy()          { this._osc(600, 'sine', 0.08, 0.18); this._osc(800, 'sine', 0.08, 0.18, 0.08); this._osc(1000, 'sine', 0.1, 0.15, 0.16); },
    playNotification() { this._osc(660, 'sine', 0.05, 0.10); this._osc(880, 'sine', 0.05, 0.10, 0.06); },
    playScrewdriver()  { this._noise(0.15, 0.12, 4000); },
    playVirusZap()     { this._osc(1200, 'square', 0.05, 0.15); this._osc(600, 'square', 0.05, 0.12, 0.05); },
    playKBBreak()      { this._noise(0.2, 0.18, 800); this._osc(100, 'square', 0.15, 0.15); },
    playMalwareAlert() { this._osc(440, 'square', 0.1, 0.18); this._osc(440, 'square', 0.1, 0.18, 0.15); this._osc(440, 'square', 0.1, 0.18, 0.3); },

    // New SFX
    playHeartLoss()    { this._osc(80, 'sine', 0.3, 0.25); this._osc(60, 'sine', 0.2, 0.20, 0.1); },
    playTimerWarning() { this._osc(1000, 'square', 0.06, 0.18); this._osc(1200, 'square', 0.06, 0.15, 0.08); },
    playAnesthesiaWarning() { this._osc(400, 'square', 0.08, 0.15); this._osc(350, 'square', 0.08, 0.12, 0.1); },

    playHazardClear()   { this._osc(523, 'sine', 0.08, 0.20); this._osc(659, 'sine', 0.08, 0.18, 0.06); this._osc(784, 'sine', 0.1, 0.15, 0.12); },
    playHazardSpawn()   { this._osc(220, 'square', 0.1, 0.20); this._osc(180, 'square', 0.15, 0.18, 0.08); this._noise(0.2, 0.10, 1200); },
    playScreenTransition() { this._noise(0.15, 0.08, 3000); this._osc(400, 'sine', 0.06, 0.10); },
    playHeartbeat()     { this._osc(60, 'sine', 0.15, 0.25); this._osc(55, 'sine', 0.1, 0.18, 0.18); },

    playCatMeow() {
        if (!this.ctx || !this.enabled) return;
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(700, this.ctx.currentTime);
        o.frequency.linearRampToValueAtTime(400, this.ctx.currentTime + 0.3);
        o.frequency.linearRampToValueAtTime(500, this.ctx.currentTime + 0.5);
        g.gain.setValueAtTime(0, this.ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.20, this.ctx.currentTime + 0.02);
        g.gain.setValueAtTime(0.14, this.ctx.currentTime + 0.3);
        g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
        o.connect(g).connect(this.ctx.destination);
        o.start(); o.stop(this.ctx.currentTime + 0.55);
    },

    updateEKG(timestamp, anesPct, hearts, maxHearts) {
        if (!this.enabled || !this.ctx) return;
        const heartFactor = Math.max(0.3, hearts / maxHearts);
        const interval = (400 + anesPct * 600) * heartFactor;
        if (timestamp - this.lastEkgTime > interval) {
            this.lastEkgTime = timestamp;
            this.playEKG();
        }
    },

    setBGMMode(mode) {
        if (this.bgmMode === mode && this.bgmPlaying) return;
        this.bgmMode = mode;
        if (this.bgmPlaying) {
            this.stopBGM();
            this.startBGM();
        }
    },

    startBGM() {
        if (!this.ctx || this.bgmPlaying) return;
        this.bgmPlaying = true;
        const p = this.bgmParams[this.bgmMode] || this.bgmParams.gameplay;
        this.bgmBPM = p.bpm;
        this.bgmNextBeat = this.ctx.currentTime;
        this.bgmChordIndex = 0;
        this._scheduleBGM();
    },

    stopBGM() {
        this.bgmPlaying = false;
        this.bgmNodes.forEach(n => { try { n.stop(); } catch(e){} });
        this.bgmNodes = [];
    },

    _scheduleBGM() {
        if (!this.bgmPlaying || !this.ctx || !this.enabled) return;
        const p = this.bgmParams[this.bgmMode] || this.bgmParams.gameplay;
        const now = this.ctx.currentTime;
        while (this.bgmNextBeat < now + 2) {
            const t = this.bgmNextBeat;
            const beatLen = 60 / p.bpm;
            const chord = p.chords[this.bgmChordIndex % p.chords.length];

            // Chords
            chord.forEach(freq => {
                const o = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                const f = this.ctx.createBiquadFilter();
                o.type = p.oscType;
                o.frequency.setValueAtTime(freq * 0.5, t);
                f.type = 'lowpass'; f.frequency.value = p.filterFreq;
                g.gain.setValueAtTime(0, t);
                g.gain.linearRampToValueAtTime(p.chordGain, t + 0.05);
                g.gain.setValueAtTime(p.chordGain, t + beatLen * 2 - 0.05);
                g.gain.linearRampToValueAtTime(0, t + beatLen * 2);
                o.connect(f).connect(g).connect(this.ctx.destination);
                o.start(t); o.stop(t + beatLen * 2 + 0.1);
                this.bgmNodes.push(o);
            });

            // Bass
            const bass = this.ctx.createOscillator();
            const bg2 = this.ctx.createGain();
            bass.type = p.oscType === 'sawtooth' ? 'square' : p.oscType;
            bass.frequency.setValueAtTime(chord[0] * 0.25, t);
            bg2.gain.setValueAtTime(0, t);
            bg2.gain.linearRampToValueAtTime(p.bassGain, t + 0.05);
            bg2.gain.linearRampToValueAtTime(p.bassDecay, t + beatLen - 0.05);
            bg2.gain.linearRampToValueAtTime(0, t + beatLen);
            bass.connect(bg2).connect(this.ctx.destination);
            bass.start(t); bass.stop(t + beatLen + 0.1);
            this.bgmNodes.push(bass);

            // Hi-hat tick (only if gain > 0)
            if (p.tickGain > 0) {
                const tickLen = 0.04;
                const tickBuf = this.ctx.createBuffer(1, this.ctx.sampleRate * tickLen, this.ctx.sampleRate);
                const tickData = tickBuf.getChannelData(0);
                for (let j = 0; j < tickData.length; j++) tickData[j] = (Math.random()*2-1) * Math.max(0, 1 - j/tickData.length);
                const tickSrc = this.ctx.createBufferSource();
                tickSrc.buffer = tickBuf;
                const tickG = this.ctx.createGain();
                const tickF = this.ctx.createBiquadFilter();
                tickF.type = 'highpass'; tickF.frequency.value = 6000;
                tickG.gain.setValueAtTime(p.tickGain, t);
                tickSrc.connect(tickF).connect(tickG).connect(this.ctx.destination);
                tickSrc.start(t); tickSrc.stop(t + tickLen + 0.01);
                this.bgmNodes.push(tickSrc);
            }

            // Sub kick (only if gain > 0)
            if (p.kickGain > 0) {
                const kick = this.ctx.createOscillator();
                const kickG = this.ctx.createGain();
                kick.type = 'sine';
                kick.frequency.setValueAtTime(150, t);
                kick.frequency.exponentialRampToValueAtTime(40, t + 0.1);
                kickG.gain.setValueAtTime(p.kickGain, t);
                kickG.gain.linearRampToValueAtTime(0, t + 0.15);
                kick.connect(kickG).connect(this.ctx.destination);
                kick.start(t); kick.stop(t + 0.2);
                this.bgmNodes.push(kick);
            }

            // Offbeat hi-hat (only if gain > 0)
            if (p.hhGain > 0) {
                const hhTime = t + beatLen / 2;
                const hhLen = 0.03;
                const hhBuf = this.ctx.createBuffer(1, this.ctx.sampleRate * hhLen, this.ctx.sampleRate);
                const hhData = hhBuf.getChannelData(0);
                for (let j = 0; j < hhData.length; j++) hhData[j] = (Math.random()*2-1) * Math.max(0, 1 - j/hhData.length);
                const hhSrc = this.ctx.createBufferSource();
                hhSrc.buffer = hhBuf;
                const hhG = this.ctx.createGain();
                const hhF = this.ctx.createBiquadFilter();
                hhF.type = 'highpass'; hhF.frequency.value = 8000;
                hhG.gain.setValueAtTime(p.hhGain, hhTime);
                hhSrc.connect(hhF).connect(hhG).connect(this.ctx.destination);
                hhSrc.start(hhTime); hhSrc.stop(hhTime + hhLen + 0.01);
                this.bgmNodes.push(hhSrc);
            }

            this.bgmNextBeat += beatLen;
            if (Math.round((this.bgmNextBeat - now) / beatLen) % 2 === 0) this.bgmChordIndex++;
        }

        if (this.bgmNodes.length > 100) this.bgmNodes = this.bgmNodes.slice(-60);
        if (this.bgmPlaying) setTimeout(() => this._scheduleBGM(), 300);
    }
};
