class RetroSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.4;
  private danceLoopInterval: number | null = null;
  private danceStep: number = 0;

  constructor() {
    const savedMute = localStorage.getItem('dino_sound_muted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('dino_sound_muted', String(this.isMuted));
    if (this.isMuted) {
      this.stopVictoryDanceMusic();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  public playJump() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';

    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

    gain.gain.setValueAtTime(this.volume * 0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playFireBreath() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // White noise for roaring fire
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(300, now + 0.25);
    filter.Q.value = 3;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(this.volume * 0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    // Sawtooth roar oscillator
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(this.volume * 0.25, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.25);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playExplosion() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(40, now + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 0.35);
  }

  public playHit() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(40, now + 0.2);

    gain.gain.setValueAtTime(this.volume * 0.4, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playVolcanoErupt() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.linearRampToValueAtTime(260, now + 0.15);
    osc.frequency.linearRampToValueAtTime(80, now + 0.3);

    gain.gain.setValueAtTime(this.volume * 0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  public playScorePing() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1320, now + 0.06);

    gain.gain.setValueAtTime(this.volume * 0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  public playPortalWarp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.6);

    gain.gain.setValueAtTime(this.volume * 0.35, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  // Sad extinct loss jingle + crying sound
  public playExtinctLossTune() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [392, 370, 349, 311, 293, 220, 146]; // Descending melancholy minor notes
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.18);

      gain.gain.setValueAtTime(this.volume * 0.3, now + idx * 0.18);
      gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.18 + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.18);
      osc.stop(now + idx * 0.18 + 0.24);
    });

    // Subdued sad sobbing whine
    setTimeout(() => {
      if (this.isMuted || !this.ctx) return;
      const sobNow = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, sobNow);
      osc.frequency.linearRampToValueAtTime(320, sobNow + 0.4);
      osc.frequency.linearRampToValueAtTime(420, sobNow + 0.6);
      osc.frequency.linearRampToValueAtTime(260, sobNow + 1.0);

      gain.gain.setValueAtTime(this.volume * 0.2, sobNow);
      gain.gain.linearRampToValueAtTime(0.01, sobNow + 1.0);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(sobNow);
      osc.stop(sobNow + 1.0);
    }, 1200);
  }

  // Funky 8-bit disco victory dance tune!
  public startVictoryDanceMusic() {
    this.stopVictoryDanceMusic();
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.danceStep = 0;
    const tempo = 140; // BPM
    const stepDuration = (60 / tempo) / 2; // eighth notes

    // Funky, upbeat progression (C - G - Am - F style victory arpeggios)
    const melody = [
      523.25, 659.25, 783.99, 1046.50, 783.99, 880.00, 1046.50, 1174.66,
      1318.51, 1046.50, 880.00, 783.99, 880.00, 1046.50, 1318.51, 1567.98,
      1046.50, 880.00, 783.99, 659.25, 783.99, 880.00, 1046.50, 1318.51,
      1046.50, 1318.51, 1567.98, 2093.00, 1567.98, 1318.51, 1046.50, 1174.66
    ];

    const bass = [
      130.81, 130.81, 196.00, 196.00, 220.00, 220.00, 174.61, 174.61,
      130.81, 130.81, 196.00, 196.00, 220.00, 220.00, 174.61, 174.61
    ];

    const playNext = () => {
      if (this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;

      // Melody note
      const mNote = melody[this.danceStep % melody.length];
      const mOsc = this.ctx.createOscillator();
      const mGain = this.ctx.createGain();
      mOsc.type = 'square';
      mOsc.frequency.setValueAtTime(mNote, now);
      mGain.gain.setValueAtTime(this.volume * 0.22, now);
      mGain.gain.linearRampToValueAtTime(0.01, now + stepDuration * 0.85);

      mOsc.connect(mGain);
      mGain.connect(this.ctx.destination);
      mOsc.start(now);
      mOsc.stop(now + stepDuration * 0.9);

      // Bass note (every 2 steps)
      if (this.danceStep % 2 === 0) {
        const bNote = bass[Math.floor((this.danceStep / 2)) % bass.length];
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(bNote, now);
        bGain.gain.setValueAtTime(this.volume * 0.35, now);
        bGain.gain.linearRampToValueAtTime(0.01, now + stepDuration * 1.8);

        bOsc.connect(bGain);
        bGain.connect(this.ctx.destination);
        bOsc.start(now);
        bOsc.stop(now + stepDuration * 1.9);
      }

      this.danceStep++;
    };

    playNext();
    this.danceLoopInterval = window.setInterval(playNext, stepDuration * 1000);
  }

  public stopVictoryDanceMusic() {
    if (this.danceLoopInterval !== null) {
      clearInterval(this.danceLoopInterval);
      this.danceLoopInterval = null;
    }
  }
}

export const sound = new RetroSoundEngine();
