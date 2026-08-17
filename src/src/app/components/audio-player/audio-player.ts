import { Component, signal, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export type PresetId = 'melodic' | 'tech' | 'acid';

interface AudioPreset {
  id: PresetId;
  name: string;
  bpm: number;
  desc: string;
}

@Component({
  selector: 'app-audio-player',
  imports: [CommonModule],
  templateUrl: './audio-player.html',
  styleUrl: './audio-player.scss'
})
export class AudioPlayerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('visualizerCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  isPlaying = signal(false);
  currentPreset = signal<PresetId>('melodic');
  bpm = signal(126);
  filterCutoff = signal(2400);

  // Stems Mute State
  kickEnabled = signal(true);
  bassEnabled = signal(true);
  synthEnabled = signal(true);
  hihatEnabled = signal(true);

  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;
  private timerId: number | null = null;
  private step = 0;
  private animationFrameId: number | null = null;

  presets: AudioPreset[] = [
    { id: 'melodic', name: 'Melodic Techno 126 BPM', bpm: 126, desc: 'Afterlife style atmospheric chords & rolling bass' },
    { id: 'tech', name: 'Tech House Groove 128 BPM', bpm: 128, desc: 'Punchy low-end, swinging hi-hats & vocal chops' },
    { id: 'acid', name: 'Cyber 303 Acid 132 BPM', bpm: 132, desc: 'Resonant silver box baseline with hypnotic drive' }
  ];

  ngAfterViewInit() {
    this.initCanvasPlaceholder();
  }

  ngOnDestroy() {
    this.stopPlayback();
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close();
    }
  }

  private initAudio() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;

      this.filterNode = this.audioCtx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(this.filterCutoff(), this.audioCtx.currentTime);

      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.audioCtx.currentTime);

      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  togglePlay() {
    if (this.isPlaying()) {
      this.stopPlayback();
    } else {
      this.startPlayback();
    }
  }

  setPreset(presetId: 'melodic' | 'tech' | 'acid') {
    this.currentPreset.set(presetId);
    const p = this.presets.find(item => item.id === presetId);
    if (p) {
      this.bpm.set(p.bpm);
    }
  }

  toggleStem(stem: 'kick' | 'bass' | 'synth' | 'hihat') {
    if (stem === 'kick') this.kickEnabled.update(v => !v);
    if (stem === 'bass') this.bassEnabled.update(v => !v);
    if (stem === 'synth') this.synthEnabled.update(v => !v);
    if (stem === 'hihat') this.hihatEnabled.update(v => !v);
  }

  onBpmChange(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    this.bpm.set(val);
    if (this.isPlaying()) {
      this.restartTimer();
    }
  }

  onFilterChange(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    this.filterCutoff.set(val);
    if (this.filterNode && this.audioCtx) {
      this.filterNode.frequency.setTargetAtTime(val, this.audioCtx.currentTime, 0.05);
    }
  }

  private startPlayback() {
    this.initAudio();
    this.isPlaying.set(true);
    this.step = 0;
    this.scheduleNextStep();
    this.renderVisualizer();
  }

  private stopPlayback() {
    this.isPlaying.set(false);
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.initCanvasPlaceholder();
  }

  private restartTimer() {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.scheduleNextStep();
    }
  }

  private scheduleNextStep() {
    const secondsPerBeat = 60.0 / this.bpm();
    const stepDurationMs = (secondsPerBeat / 4) * 1000; // 16th notes

    this.playStep(this.step % 16);
    this.step++;

    this.timerId = window.setTimeout(() => {
      if (this.isPlaying()) {
        this.scheduleNextStep();
      }
    }, stepDurationMs);
  }

  private playStep(s: number) {
    if (!this.audioCtx || !this.filterNode) return;
    const now = this.audioCtx.currentTime;

    // 1. Kick on beats 0, 4, 8, 12 (Four-on-the-floor)
    if (this.kickEnabled() && s % 4 === 0) {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
      gain.gain.setValueAtTime(1.0, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now);
      osc.stop(now + 0.25);
    }

    // 2. Offbeat Hi-Hat on 2, 6, 10, 14
    if (this.hihatEnabled() && (s % 4 === 2 || s % 8 === 6)) {
      this.playHiHat(now, s % 4 === 2 ? 0.25 : 0.15);
    }

    // 3. Bassline
    if (this.bassEnabled()) {
      const bassNotes = this.currentPreset() === 'acid' 
        ? [55, 55, 65, 55, 58, 55, 65, 70, 55, 55, 65, 55, 58, 70, 65, 55] 
        : [55, 0, 55, 55, 0, 55, 58, 0, 55, 0, 55, 55, 0, 65, 58, 0];
      const freq = bassNotes[s];
      if (freq > 0) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = this.currentPreset() === 'acid' ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(this.filterNode);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    }

    // 4. Synth Arp / Pluck Melody
    if (this.synthEnabled()) {
      const synthScale = this.currentPreset() === 'melodic'
        ? [220, 261.63, 329.63, 392.00, 440, 523.25, 659.25, 783.99]
        : [164.81, 196.00, 220.00, 246.94, 293.66, 329.63, 392.00, 440.00];
      if (s % 2 === 0 || s % 3 === 0) {
        const noteIdx = (s * 3) % synthScale.length;
        const noteFreq = synthScale[noteIdx];
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(noteFreq, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.filterNode);
        osc.start(now);
        osc.stop(now + 0.26);
      }
    }
  }

  private playHiHat(now: number, volume: number) {
    if (!this.audioCtx) return;
    const bufferSize = this.audioCtx.sampleRate * 0.05;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, now);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    noise.start(now);
    noise.stop(now + 0.05);
  }

  private renderVisualizer() {
    if (!this.canvasRef || !this.analyser) return;
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      this.animationFrameId = requestAnimationFrame(draw);
      this.analyser!.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;

        // Gold to Neon Purple Gradient for the bars
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, 'rgba(234, 179, 8, 0.3)');
        grad.addColorStop(0.5, '#ffd152');
        grad.addColorStop(1, '#c084fc');

        ctx.fillStyle = grad;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(234, 179, 8, 0.5)';
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 3, barHeight);

        x += barWidth;
      }
    };

    draw();
  }

  private initCanvasPlaceholder() {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    for (let x = 0; x < canvas.width; x += 10) {
      const y = canvas.height / 2 + Math.sin(x * 0.05) * 12;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}
