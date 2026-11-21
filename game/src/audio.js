// audio.js — tiny synthesised sound effects for "Momo's Market Day".
// Everything is generated with the Web Audio API at run time: no audio
// files, no network, no copied music. A short blip on each find, a low
// buzz on a miss, a soft ping for a hint, and a little arpeggio on a win.

export const sfx = {
  enabled: true,
  _ctx: null,

  _context() {
    if (!this._ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this._ctx = new AC();
    }
    if (this._ctx.state === 'suspended') void this._ctx.resume();
    return this._ctx;
  },

  _tone(freq, startAt, dur, type, vol) {
    if (!this.enabled) return;
    const ctx = this._context();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t0 = ctx.currentTime + startAt;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  },

  // A happy two-note chime when a difference is found.
  found() {
    this._tone(660, 0, 0.16, 'sine', 0.22);
    this._tone(990, 0.09, 0.24, 'sine', 0.2);
  },

  // A low buzz when the player clicks somewhere with no difference.
  wrong() {
    this._tone(160, 0, 0.18, 'sawtooth', 0.1);
    this._tone(110, 0.05, 0.2, 'sawtooth', 0.08);
  },

  // A soft ping when a hint is used.
  hint() {
    this._tone(880, 0, 0.2, 'triangle', 0.16);
  },

  // A rising arpeggio when a level (or the whole game) is cleared.
  win() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => this._tone(n, i * 0.11, 0.28, 'triangle', 0.18));
  },

  // A quiet click for buttons.
  click() {
    this._tone(440, 0, 0.07, 'square', 0.06);
  },

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  },
};
