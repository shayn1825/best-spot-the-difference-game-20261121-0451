// render.js — draws both panels of "Momo's Market Day" and the markers
// that make a find feel good: a green ring + tick on each found difference
// (on both panels), a pulsing hint ring, a red X on a miss, and the HUD
// (counter, timer bar, score, hints, streak).

import { PANEL_WIDTH, PANEL_HEIGHT } from './scenes.js';

export function drawPanels(state, t) {
  const scene = state.scene;
  const left = state.ctxLeft;
  const right = state.ctxRight;
  scene.draw(left, false, t);
  scene.draw(right, true, t);
  drawFoundMarkers(left, state);
  drawFoundMarkers(right, state);
  drawHintRing(left, state, t);
  drawHintRing(right, state, t);
  drawMissMarks(left, state, t);
  drawMissMarks(right, state, t);
}

function drawFoundMarkers(ctx, state) {
  state.found.forEach((idx) => {
    const d = state.scene.diffs[idx];
    ctx.save();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r + 6, 0, Math.PI * 2);
    ctx.stroke();
    // Tick inside the ring.
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(d.x - 8, d.y);
    ctx.lineTo(d.x - 2, d.y + 7);
    ctx.lineTo(d.x + 9, d.y - 7);
    ctx.stroke();
    ctx.restore();
  });
}

function drawHintRing(ctx, state, t) {
  if (state.hintIndex === null || state.hintIndex === undefined) return;
  if (state.found.has(state.hintIndex)) return;
  const d = state.scene.diffs[state.hintIndex];
  const pulse = 1 + 0.12 * Math.sin(t / 180);
  const age = t - state.hintAt;
  if (age > 4000) return; // The hint ring fades after four seconds.
  ctx.save();
  ctx.globalAlpha = Math.max(0, 1 - age / 4000);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.arc(d.x, d.y, (d.r + 10) * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawMissMarks(ctx, state, t) {
  state.misses = state.misses.filter((m) => t - m.at < 700);
  for (const m of state.misses) {
    const fade = 1 - (t - m.at) / 700;
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    const s = 10;
    ctx.beginPath();
    ctx.moveTo(m.x - s, m.y - s);
    ctx.lineTo(m.x + s, m.y + s);
    ctx.moveTo(m.x + s, m.y - s);
    ctx.lineTo(m.x - s, m.y + s);
    ctx.stroke();
    ctx.restore();
  }
}

export function updateHud(state) {
  const scene = state.scene;
  const total = scene.diffs.length;
  const found = state.found.size;
  const remaining = total - found;
  document.getElementById('level-name').textContent =
    `Level ${state.levelIndex + 1} · ${scene.name}`;
  document.getElementById('level-tag').textContent = scene.tagline;
  document.getElementById('found-count').textContent =
    `Found ${found} of ${total} · ${remaining} to go`;
  document.getElementById('score').textContent = `Score ${state.score}`;
  document.getElementById('streak').textContent =
    state.streak > 1 ? `Combo ×${(1 + 0.1 * state.streak).toFixed(1)}` : '';
  document.getElementById('hints-left').textContent = `Hints ${state.hintsLeft}`;
  const secs = Math.max(0, Math.ceil(state.timeLeft));
  document.getElementById('timer-text').textContent =
    `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  const bar = document.getElementById('timer-bar');
  bar.style.width = `${Math.max(0, (state.timeLeft / scene.timeLimit) * 100)}%`;
  bar.classList.toggle('low', state.timeLeft < 20);
  document.getElementById('hint-btn').disabled = state.hintsLeft <= 0;
}

export function panelPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * PANEL_WIDTH;
  const y = ((event.clientY - rect.top) / rect.height) * PANEL_HEIGHT;
  return { x, y };
}
