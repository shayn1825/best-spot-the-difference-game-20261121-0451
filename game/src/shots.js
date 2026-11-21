// shots.js — screenshot presets for "Momo's Market Day".
// Open game/index.html with a query string and the game boots straight
// into a fixed, frozen state so a screenshot shows the game at its best:
//
//   ?shot=1&found=0,2,4&time=87   level 1, diffs 0/2/4 found, 87s left
//   ?shot=2&found=1,3&time=64    level 2, diffs 1/3 found, 64s left
//   ?shot=3&found=0,1,4,6&time=41 level 3, diffs 0/1/4/6 found, 41s left
//   ?shot=complete               level 1 finished, score overlay up
//   ?shot=win                    all levels done, victory overlay up
//
// The frozen clock keeps every render identical, and the presets use only
// the game's own state — no screenshot is staged outside the game code.

export function applyShotParams(state, actions) {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (!shot) return false;

  state.frozen = true;
  state.frozenTime = 1200; // Fixed animation clock for stable renders.

  if (shot === 'menu') {
    actions.showMenu();
    return true;
  }
  if (shot === 'complete') {
    actions.startLevel(0);
    state.found = new Set([0, 1, 2, 3, 4, 5, 6]);
    state.score = 840;
    state.timeLeft = 63;
    state.totalScore = 0;
    // Reuse the real level-complete path so the overlay is the game's own.
    document.getElementById('complete-title').textContent = `${state.scene.name} cleared!`;
    document.getElementById('complete-detail').textContent =
      `You found all ${state.scene.diffs.length} differences · best streak 4`;
    document.getElementById('complete-score').textContent =
      'Level score 840 + time bonus 315 = 1155 · total 1155';
    document.getElementById('complete-stars').textContent = '★★★';
    document.getElementById('next-btn').textContent = 'Next: Cat Café Corner →';
    document.getElementById('next-btn').classList.remove('hidden');
    for (const el of document.querySelectorAll('.overlay')) el.classList.add('hidden');
    document.getElementById('overlay-complete').classList.remove('hidden');
    state.screen = 'complete';
    return true;
  }
  if (shot === 'win') {
    actions.startLevel(2);
    state.found = new Set([0, 1, 2, 3, 4, 5, 6]);
    state.totalScore = 3420;
    state.bestStreak = 6;
    document.getElementById('win-score').textContent = 'Total score 3420 · best 3420';
    document.getElementById('win-detail').textContent =
      '3 scenes · 21 differences found · best streak 6';
    for (const el of document.querySelectorAll('.overlay')) el.classList.add('hidden');
    document.getElementById('overlay-win').classList.remove('hidden');
    state.screen = 'win';
    return true;
  }

  const level = Number(shot);
  if (level >= 1 && level <= 3) {
    actions.startLevel(level - 1);
    const found = (params.get('found') || '')
      .split(',')
      .map((s) => Number(s))
      .filter((n) => Number.isInteger(n) && n >= 0 && n < 7);
    state.found = new Set(found);
    const time = Number(params.get('time'));
    if (Number.isFinite(time) && time > 0) state.timeLeft = time;
    const score = Number(params.get('score'));
    if (Number.isFinite(score) && score > 0) state.score = score;
    const hint = Number(params.get('hint'));
    if (Number.isInteger(hint) && hint >= 0 && hint < 7 && !state.found.has(hint)) {
      state.hintIndex = hint;
      state.hintAt = 1200;
    }
    if (found.length > 0) {
      document.getElementById('found-note').textContent =
        state.scene.diffs[found[found.length - 1]].label;
    }
    return true;
  }
  return false;
}
