/**
 * WFH SURGEON — Audio Engine (procedural audio via Web Audio API)
 */

const AudioEngine = {
    ctx: null, enabled: true, lastEkgTime: 0,
    bgmPlaying: false, bgmNodes: [], bgmNextBeat: 0, bgmBPM: 72,
    bgmChordIndex: 0,
    bgmChords: [
        [261.6, 329.6, 392.0],
        [220.0, 277.2, 329.6],
        [246.9, 311.1, 370.0],
        [261.6, 311.1, 392.0],
    ],

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

    playEKG()          { this._osc(880, 'sine', 0.08, 0.10); },
    playCorrectKey()   { this._osc(523, 'sine', 0.08, 0.12); this._osc(659, 'sine', 0.06, 0.08, 0.04); },
    playWrongKey()     { this._osc(150, 'sawtooth', 0.2, 0.15); this._osc(120, 'sawtooth', 0.15, 0.1, 0.05); },
    playPhaseComplete(){ this._osc(523, 'sine', 0.12, 0.15); this._osc(659, 'sine', 0.12, 0.15, 0.1); },
    playLevelComplete(){ this._osc(262, 'sine', 0.4, 0.15); this._osc(330, 'sine', 0.4, 0.12, 0.05); this._osc(392, 'sine', 0.5, 0.12, 0.1); },
    playLevelFail()    { this._osc(392, 'sine', 0.15, 0.15); this._osc(311, 'sine', 0.15, 0.12, 0.15); this._osc(262, 'sine', 0.3, 0.1, 0.3); },
    playCoffeeSplash() { this._noise(0.3, 0.12, 1500); },
    playWifiStatic()   { this._noise(0.4, 0.08, 3000); },
    playBatteryWarning(){ this._osc(200, 'square', 0.1, 0.08); this._osc(200, 'square', 0.1, 0.08, 0.2); },
    playClick()        { this._osc(800, 'sine', 0.03, 0.08); },
    playBuy()          { this._osc(600, 'sine', 0.08, 0.1); this._osc(800, 'sine', 0.08, 0.1, 0.08); this._osc(1000, 'sine', 0.1, 0.08, 0.16); },
    playNotification() { this._osc(660, 'sine', 0.05, 0.06); this._osc(880, 'sine', 0.05, 0.06, 0.06); },
    playScrewdriver()  { this._noise(0.15, 0.06, 4000); },
    playVirusZap()     { this._osc(1200, 'square', 0.05, 0.08); this._osc(600, 'square', 0.05, 0.06, 0.05); },
    playKBBreak()      { this._noise(0.2, 0.1, 800); this._osc(100, 'square', 0.15, 0.08); },
    playMalwareAlert() { this._osc(440, 'square', 0.1, 0.1); this._osc(440, 'square', 0.1, 0.1, 0.15); this._osc(440, 'square', 0.1, 0.1, 0.3); },

    playCatMeow() {
        if (!this.ctx || !this.enabled) return;
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(700, this.ctx.currentTime);
        o.frequency.linearRampToValueAtTime(400, this.ctx.currentTime + 0.3);
        o.frequency.linearRampToValueAtTime(500, this.ctx.currentTime + 0.5);
        g.gain.setValueAtTime(0, this.ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.02);
        g.gain.setValueAtTime(0.08, this.ctx.currentTime + 0.3);
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

    startBGM() {
        if (!this.ctx || this.bgmPlaying) return;
        this.bgmPlaying = true;
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
        const now = this.ctx.currentTime;
        while (this.bgmNextBeat < now + 2) {
            const t = this.bgmNextBeat;
            const beatLen = 60 / this.bgmBPM;
            const chord = this.bgmChords[this.bgmChordIndex % this.bgmChords.length];

            chord.forEach(freq => {
                const o = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                const f = this.ctx.createBiquadFilter();
                o.type = 'triangle';
                o.frequency.setValueAtTime(freq * 0.5, t);
                f.type = 'lowpass'; f.frequency.value = 400;
                g.gain.setValueAtTime(0, t);
                g.gain.linearRampToValueAtTime(0.025, t + 0.3);
                g.gain.setValueAtTime(0.025, t + beatLen * 2 - 0.3);
                g.gain.linearRampToValueAtTime(0, t + beatLen * 2);
                o.connect(f).connect(g).connect(this.ctx.destination);
                o.start(t); o.stop(t + beatLen * 2 + 0.1);
                this.bgmNodes.push(o);
            });

            const bass = this.ctx.createOscillator();
            const bg2 = this.ctx.createGain();
            bass.type = 'sine';
            bass.frequency.setValueAtTime(chord[0] * 0.25, t);
            bg2.gain.setValueAtTime(0, t);
            bg2.gain.linearRampToValueAtTime(0.04, t + 0.1);
            bg2.gain.linearRampToValueAtTime(0.02, t + beatLen - 0.1);
            bg2.gain.linearRampToValueAtTime(0, t + beatLen);
            bass.connect(bg2).connect(this.ctx.destination);
            bass.start(t); bass.stop(t + beatLen + 0.1);
            this.bgmNodes.push(bass);

            const tickLen = 0.04;
            const tickBuf = this.ctx.createBuffer(1, this.ctx.sampleRate * tickLen, this.ctx.sampleRate);
            const tickData = tickBuf.getChannelData(0);
            for (let j = 0; j < tickData.length; j++) tickData[j] = (Math.random()*2-1) * Math.max(0, 1 - j/tickData.length);
            const tickSrc = this.ctx.createBufferSource();
            tickSrc.buffer = tickBuf;
            const tickG = this.ctx.createGain();
            const tickF = this.ctx.createBiquadFilter();
            tickF.type = 'highpass'; tickF.frequency.value = 6000;
            tickG.gain.setValueAtTime(0.015, t);
            tickSrc.connect(tickF).connect(tickG).connect(this.ctx.destination);
            tickSrc.start(t); tickSrc.stop(t + tickLen + 0.01);
            this.bgmNodes.push(tickSrc);

            this.bgmNextBeat += beatLen;
            if (Math.round((this.bgmNextBeat - now) / beatLen) % 2 === 0) this.bgmChordIndex++;
        }

        if (this.bgmNodes.length > 50) this.bgmNodes = this.bgmNodes.slice(-30);
        if (this.bgmPlaying) setTimeout(() => this._scheduleBGM(), 500);
    }
};
