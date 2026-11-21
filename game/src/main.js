// main.js — the state machine of "Momo's Market Day", a spot-the-difference
// game. Screens: menu → playing → level complete → victory, plus a time-up
// screen. Scoring: 100 points per find, times a combo multiplier that
// grows with consecutive finds; a level bonus of 5 points per second left;
// a hint costs 50 points; a miss costs 10 points and 3 seconds.

import { SCENES, PANEL_WIDTH, PANEL_HEIGHT } from './scenes.js';
import { drawPanels, updateHud } from './render.js';
import { attachInput } from './input.js';
import { sfx } from './audio.js';
import { applyShotParams } from './shots.js';

const BEST_KEY = 'momos-market-day-best';

export const state = {
  screen: 'menu', // menu | playing | complete | over | win
  levelIndex: 0,
  scene: SCENES[0],
  found: new Set(),
  misses: [],
  hintIndex: null,
  hintAt: 0,
  score: 0,
  totalScore: 0,
  streak: 0,
  bestStreak: 0,
  hintsLeft: 3,
  timeLeft: SCENES[0].timeLimit,
  levelScores: [],
  frozen: false, // Screenshot mode freezes the timer.
  canvasLeft: null,
  canvasRight: null,
  ctxLeft: null,
  ctxRight: null,
  lastTick: 0,
};

function showOverlay(id) {
  for (const el of document.querySelectorAll('.overlay')) el.classList.add('hidden');
  if (id) document.getElementById(id).classList.remove('hidden');
}

function loadBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY) || 0);
  } catch {
    return 0;
  }
}

function saveBest(score) {
  try {
    if (score > loadBest()) localStorage.setItem(BEST_KEY, String(score));
  } catch {
    // Private mode: best score just does not persist.
  }
}

export function startLevel(index, keepTotal = false) {
  state.levelIndex = index;
  state.scene = SCENES[index];
  state.found = new Set();
  state.misses = [];
  state.hintIndex = null;
  state.streak = 0;
  state.hintsLeft = 3;
  state.timeLeft = state.scene.timeLimit;
  if (!keepTotal) state.totalScore = 0;
  state.score = 0;
  state.screen = 'playing';
  showOverlay(null);
  updateHud(state);
}

function levelComplete() {
  state.screen = 'complete';
  const timeBonus = Math.ceil(state.timeLeft) * 5;
  const levelTotal = state.score + timeBonus;
  state.totalScore += levelTotal;
  state.levelScores[state.levelIndex] = levelTotal;
  const stars = state.timeLeft > state.scene.timeLimit * 0.5 ? 3 : state.timeLeft > state.scene.timeLimit * 0.25 ? 2 : 1;
  document.getElementById('complete-title').textContent = `${state.scene.name} cleared!`;
  document.getElementById('complete-detail').textContent =
    `You found all ${state.scene.diffs.length} differences · best streak ${state.bestStreak}`;
  document.getElementById('complete-score').textContent =
    `Level score ${state.score} + time bonus ${timeBonus} = ${levelTotal} · total ${state.totalScore}`;
  document.getElementById('complete-stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
  const nextBtn = document.getElementById('next-btn');
  if (state.levelIndex + 1 < SCENES.length) {
    nextBtn.textContent = `Next: ${SCENES[state.levelIndex + 1].name} →`;
    nextBtn.classList.remove('hidden');
  } else {
    nextBtn.classList.add('hidden');
  }
  showOverlay('overlay-complete');
  sfx.win();
}

function gameWin() {
  state.screen = 'win';
  const best = Math.max(loadBest(), state.totalScore);
  saveBest(state.totalScore);
  document.getElementById('win-score').textContent =
    `Total score ${state.totalScore} · best ${best}`;
  document.getElementById('win-detail').textContent =
    `${SCENES.length} scenes · ${SCENES.reduce((n, s) => n + s.diffs.length, 0)} differences found · best streak ${state.bestStreak}`;
  showOverlay('overlay-win');
  sfx.win();
}

function timeUp() {
  state.screen = 'over';
  document.getElementById('over-detail').textContent =
    `You found ${state.found.size} of ${state.scene.diffs.length} differences in ${state.scene.name}. One more look — you were close!`;
  showOverlay('overlay-over');
  sfx.wrong();
}

function showMenu() {
  state.screen = 'menu';
  state.scene = SCENES[0];
  state.found = new Set();
  state.misses = [];
  state.hintIndex = null;
  state.timeLeft = SCENES[0].timeLimit;
  state.score = 0;
  const best = loadBest();
  document.getElementById('best-score').textContent =
    best > 0 ? `Best total: ${best}` : 'No best score yet — be the first!';
  showOverlay('overlay-menu');
  updateHud(state);
}

function hunt(x, y) {
  const diffs = state.scene.diffs;
  for (let i = 0; i < diffs.length; i++) {
    if (state.found.has(i)) continue;
    const d = diffs[i];
    const dist = Math.hypot(x - d.x, y - d.y);
    if (dist <= d.r + 12) {
      state.found.add(i);
      state.hintIndex = null;
      state.streak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      const mult = 1 + 0.1 * (state.streak - 1);
      state.score += Math.round(100 * mult);
      document.getElementById('found-note').textContent = d.label;
      sfx.found();
      updateHud(state);
      if (state.found.size === diffs.length) levelComplete();
      return;
    }
  }
  // A miss: small penalty, red X where the player clicked.
  state.misses.push({ x, y, at: performance.now() });
  state.streak = 0;
  state.score = Math.max(0, state.score - 10);
  state.timeLeft = Math.max(0, state.timeLeft - 3);
  document.getElementById('found-note').textContent = 'No difference there — look closer!';
  sfx.wrong();
  updateHud(state);
}

function useHint() {
  if (state.hintsLeft <= 0 || state.screen !== 'playing') return;
  const remaining = state.scene.diffs.map((_, i) => i).filter((i) => !state.found.has(i));
  if (remaining.length === 0) return;
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - 50);
  state.hintIndex = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintAt = performance.now();
  document.getElementById('found-note').textContent = 'Hint: look inside the glowing ring… (−50)';
  sfx.hint();
  updateHud(state);
}

function tick(now) {
  const dt = state.lastTick ? (now - state.lastTick) / 1000 : 0;
  state.lastTick = now;
  if (state.screen === 'playing' && !state.frozen) {
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      updateHud(state);
      timeUp();
    } else {
      updateHud(state);
    }
  }
  const t = state.frozen ? state.frozenTime : now;
  drawPanels(state, t);
  requestAnimationFrame(tick);
}

function boot() {
  state.canvasLeft = document.getElementById('panel-left');
  state.canvasRight = document.getElementById('panel-right');
  state.canvasLeft.width = PANEL_WIDTH;
  state.canvasLeft.height = PANEL_HEIGHT;
  state.canvasRight.width = PANEL_WIDTH;
  state.canvasRight.height = PANEL_HEIGHT;
  state.ctxLeft = state.canvasLeft.getContext('2d');
  state.ctxRight = state.canvasRight.getContext('2d');

  document.getElementById('sound-btn').textContent = 'Sound: on';

  attachInput(state, {
    onHunt: hunt,
    onHint: useHint,
    onRestart: () => startLevel(state.levelIndex, true),
    onMenu: showMenu,
    onToggleSound: () => {
      const on = sfx.toggle();
      document.getElementById('sound-btn').textContent = on ? 'Sound: on' : 'Sound: off';
    },
    onSelectLevel: (i) => {
      sfx.click();
      startLevel(i);
    },
    onNextLevel: () => {
      if (state.levelIndex + 1 < SCENES.length) startLevel(state.levelIndex + 1, true);
      else gameWin();
    },
    onPlayAgain: () => {
      state.totalScore = 0;
      state.levelScores = [];
      state.bestStreak = 0;
      startLevel(0);
    },
  });

  // Screenshot mode (?shot=…) sets a fixed scene state; otherwise menu.
  const shot = applyShotParams(state, { showMenu, startLevel, gameWin, levelComplete });
  if (!shot) showMenu();
  updateHud(state);
  requestAnimationFrame(tick);
}

document.addEventListener('DOMContentLoaded', boot);
