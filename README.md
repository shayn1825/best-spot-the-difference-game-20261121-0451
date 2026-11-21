# best-spot-the-difference-game-20261121-0451

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/shayn1825/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/shayn1825/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Momo's Market Day** — a complete, original spot-the-difference game that plays offline in a desktop browser. Two near-identical pictures side by side, seven sneaky differences hiding in each scene, green rings on every find, a counter of how many remain, and a clock that keeps the hunt honest. Three hand-drawn scenes (Morning Market, Cat Café Corner, Lantern Night), 21 differences in all, with combo scoring, hints, synthesized sound effects, and a 3-star clear rating per level. All art, scenes, names and sounds were made for this game only — no images, no network, no accounts.

## Run it

```sh
python3 -m http.server 8080 --directory game
```

Then open http://localhost:8080 in a desktop browser and play. (Or open `game/index.html` directly — everything the game loads is a file under `game/`.)

## How to play

- Click a difference on **either** picture to mark it — a green ring appears on both panels.
- Find all 7 before the timer runs out. A wrong click costs 10 points and 3 seconds.
- Streaks multiply your points; a hint (−50 points) rings a difference for a few seconds.
- Keys: **H** hint · **R** restart level · **M** sound · **1–3** level · **Esc** menu.

## Layout

- `main.ts` — entrypoint: copies `game/` + `screenshots/` to the output directory and writes `dossier.json`.
- `game/index.html` + `game/style.css` — page shell and look.
- `game/src/scenes.js` — the three original scenes and their 7 differences each.
- `game/src/render.js` — both panels, found markers, hint ring, HUD.
- `game/src/input.js` — mouse and keyboard controls.
- `game/src/audio.js` — synthesised Web Audio sound effects.
- `game/src/main.js` — game state, scoring, timer, screens.
- `game/src/shots.js` — screenshot presets (`?shot=…`) that boot the game into a fixed state.
- `screenshots/` — 4 real renders of the game's own code.

---

<sub>Entered on [make.fun](https://make.fun/?ref=1c6jcmp6&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
