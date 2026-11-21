// input.js — pointer and keyboard controls for "Momo's Market Day".
// Clicking either panel hunts for a difference at that spot; H asks for a
// hint, R restarts the level, M toggles sound, 1/2/3 jump to a level from
// the menu, and Esc goes back to the menu.

import { panelPoint } from './render.js';

export function attachInput(state, callbacks) {
  const onPanelClick = (canvas) => (event) => {
    if (state.screen !== 'playing') return;
    const p = panelPoint(canvas, event);
    callbacks.onHunt(p.x, p.y);
  };
  state.canvasLeft.addEventListener('click', onPanelClick(state.canvasLeft));
  state.canvasRight.addEventListener('click', onPanelClick(state.canvasRight));

  document.getElementById('hint-btn').addEventListener('click', () => {
    if (state.screen === 'playing') callbacks.onHint();
  });
  document.getElementById('restart-btn').addEventListener('click', () => {
    if (state.screen === 'playing') callbacks.onRestart();
  });
  document.getElementById('menu-btn').addEventListener('click', () => {
    callbacks.onMenu();
  });
  document.getElementById('sound-btn').addEventListener('click', () => {
    callbacks.onToggleSound();
  });

  document.querySelectorAll('[data-level]').forEach((btn) => {
    btn.addEventListener('click', () => {
      callbacks.onSelectLevel(Number(btn.dataset.level));
    });
  });
  document.getElementById('next-btn').addEventListener('click', () => {
    callbacks.onNextLevel();
  });
  document.getElementById('retry-btn').addEventListener('click', () => {
    callbacks.onRestart();
  });
  document.getElementById('again-btn').addEventListener('click', () => {
    callbacks.onPlayAgain();
  });
  document.getElementById('win-menu-btn').addEventListener('click', () => {
    callbacks.onMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'h' || event.key === 'H') {
      if (state.screen === 'playing') callbacks.onHint();
    } else if (event.key === 'r' || event.key === 'R') {
      if (state.screen === 'playing' || state.screen === 'over') callbacks.onRestart();
    } else if (event.key === 'm' || event.key === 'M') {
      callbacks.onToggleSound();
    } else if (event.key === 'Escape') {
      callbacks.onMenu();
    } else if (state.screen === 'menu' && ['1', '2', '3'].includes(event.key)) {
      callbacks.onSelectLevel(Number(event.key) - 1);
    }
  });
}
