// scenes.js — the three original hand-drawn scenes of "Momo's Market Day".
// Every scene is drawn twice: once as the original (left panel) and once with
// its differences applied (right panel). All art is procedural canvas vector
// art — no images, no copied characters, no borrowed assets.
//
// A scene is { id, name, tagline, timeLimit, diffs, draw }.
// A diff is { x, y, r, label, apply } where (x, y) is the centre in panel
// coordinates, r the click/marker radius, and apply(ctx) paints the altered
// version over the base drawing (right panel only).

function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function star4(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

// ---------------------------------------------------------------- scene 1
// "Morning Market" — Momo's fruit stall on a sunny morning.

const MARKET_SKY_TOP = '#a8dcff';
const MARKET_SKY_BOTTOM = '#eaf8ff';
const MARKET_GROUND = '#7ec850';

function drawMarketBase(ctx, t) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, MARKET_SKY_TOP);
  sky.addColorStop(1, MARKET_SKY_BOTTOM);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 560, 300);
  // Sun with rays.
  ctx.save();
  ctx.translate(72, 62);
  ctx.strokeStyle = '#ffd93b';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 40, Math.sin(a) * 40);
    ctx.lineTo(Math.cos(a) * 50, Math.sin(a) * 50);
    ctx.stroke();
  }
  ctx.restore();
  circle(ctx, 72, 62, 32, '#ffd93b');
  // Drifting clouds.
  const drift = Math.sin(t / 1600) * 5;
  ellipse(ctx, 210 + drift, 58, 34, 16, '#ffffff');
  ellipse(ctx, 232 + drift, 50, 26, 14, '#ffffff');
  ellipse(ctx, 430 - drift, 46, 30, 14, '#ffffff');
  ellipse(ctx, 450 - drift, 54, 22, 11, '#ffffff');
  // Distant hills and ground.
  ellipse(ctx, 90, 310, 150, 34, '#8fd35f');
  ellipse(ctx, 470, 312, 170, 36, '#8fd35f');
  rect(ctx, 0, 300, 560, 120, MARKET_GROUND);
  // Garden path.
  ctx.fillStyle = '#e8c98a';
  ctx.beginPath();
  ctx.moveTo(248, 300);
  ctx.lineTo(312, 300);
  ctx.lineTo(340, 420);
  ctx.lineTo(222, 420);
  ctx.closePath();
  ctx.fill();
  // Stall: posts, striped awning, counter.
  rect(ctx, 130, 150, 10, 150, '#8a5a33');
  rect(ctx, 420, 150, 10, 150, '#8a5a33');
  for (let i = 0; i < 8; i++) {
    rect(ctx, 120 + i * 40, 128, 40, 40, i % 2 === 0 ? '#e74c3c' : '#fff6ea');
  }
  // Awning scallops.
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.arc(140 + i * 40, 168, 20, 0, Math.PI);
    ctx.fillStyle = i % 2 === 0 ? '#e74c3c' : '#fff6ea';
    ctx.fill();
  }
  rect(ctx, 115, 250, 330, 12, '#8a5a33');
  rect(ctx, 120, 262, 320, 42, '#a9744f');
  rect(ctx, 120, 262, 320, 6, '#c08a5e');
  // Price sign on the counter.
  rect(ctx, 128, 178, 52, 34, '#fff8e1');
  ctx.strokeStyle = '#8a5a33';
  ctx.lineWidth = 3;
  ctx.strokeRect(128, 178, 52, 34);
  ctx.fillStyle = '#33302a';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('5', 154, 195);
  // Crates of fruit on the counter.
  drawFruitCrate(ctx, 150, 215, '#b07a45');
  circle(ctx, 165, 232, 9, '#e23b3b');
  circle(ctx, 185, 228, 9, '#e23b3b');
  circle(ctx, 205, 234, 9, '#e23b3b');
  ellipse(ctx, 187, 219, 4, 2, '#5da24a');
  drawFruitCrate(ctx, 240, 215, '#b07a45');
  circle(ctx, 255, 232, 9, '#ff9f1c');
  circle(ctx, 275, 228, 9, '#ff9f1c');
  circle(ctx, 295, 234, 9, '#ff9f1c');
  drawFruitCrate(ctx, 330, 215, '#b07a45');
  ellipse(ctx, 345, 232, 10, 8, '#ffe14d');
  ellipse(ctx, 365, 228, 10, 8, '#ffe14d');
  ellipse(ctx, 385, 234, 10, 8, '#ffe14d');
  // Bread basket.
  ellipse(ctx, 428, 246, 26, 12, '#c89b6a');
  ellipse(ctx, 418, 238, 6, 12, '#e8b04b');
  ellipse(ctx, 430, 236, 6, 12, '#e8b04b');
  ellipse(ctx, 440, 240, 6, 11, '#e8b04b');
  // Bird perched on the awning.
  ellipse(ctx, 300, 120, 12, 8, '#3a3a3a');
  circle(ctx, 310, 112, 6, '#3a3a3a');
  ctx.beginPath();
  ctx.moveTo(316, 112);
  ctx.lineTo(322, 114);
  ctx.lineTo(316, 116);
  ctx.closePath();
  ctx.fillStyle = '#ffb703';
  ctx.fill();
  // Red balloon floating top-right.
  ctx.strokeStyle = '#8a5a33';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(505, 104);
  ctx.quadraticCurveTo(498, 130, 505, 152);
  ctx.stroke();
  ellipse(ctx, 505, 88, 16, 19, '#e23b3b');
  ctx.beginPath();
  ctx.moveTo(501, 106);
  ctx.lineTo(509, 106);
  ctx.lineTo(505, 112);
  ctx.closePath();
  ctx.fillStyle = '#e23b3b';
  ctx.fill();
  // Momo the cat, sitting by the stall, tail up.
  drawMarketCat(ctx, 468, 332, true);
  // Tulips along the bottom.
  drawTulip(ctx, 55, 370, '#ff6b9d');
  drawTulip(ctx, 500, 372, '#ff9f1c');
  drawTulip(ctx, 530, 368, '#b388ff');
}

function drawFruitCrate(ctx, x, y, color) {
  rect(ctx, x, y, 70, 38, color);
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y + 13);
  ctx.lineTo(x + 70, y + 13);
  ctx.moveTo(x, y + 26);
  ctx.lineTo(x + 70, y + 26);
  ctx.stroke();
}

function drawTulip(ctx, x, y, color) {
  ctx.strokeStyle = '#3f8f3f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 22);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - 8, y - 6);
  ctx.quadraticCurveTo(x - 8, y - 18, x, y - 12);
  ctx.quadraticCurveTo(x + 8, y - 18, x + 8, y - 6);
  ctx.quadraticCurveTo(x, y, x - 8, y - 6);
  ctx.fill();
}

function drawMarketCat(ctx, x, y, tailUp) {
  // Body and head, ginger cat.
  ellipse(ctx, x, y + 18, 24, 18, '#f2a541');
  circle(ctx, x - 2, y - 6, 16, '#f2a541');
  // Ears.
  ctx.beginPath();
  ctx.moveTo(x - 14, y - 16);
  ctx.lineTo(x - 10, y - 28);
  ctx.lineTo(x - 4, y - 18);
  ctx.closePath();
  ctx.fillStyle = '#f2a541';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 6, y - 18);
  ctx.lineTo(x + 12, y - 28);
  ctx.lineTo(x + 16, y - 16);
  ctx.closePath();
  ctx.fill();
  // Face.
  circle(ctx, x - 8, y - 8, 2, '#33302a');
  circle(ctx, x + 4, y - 8, 2, '#33302a');
  ctx.strokeStyle = '#33302a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - 6, y - 2);
  ctx.quadraticCurveTo(x - 2, y + 2, x + 2, y - 2);
  ctx.stroke();
  // Tail.
  ctx.strokeStyle = '#f2a541';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (tailUp) {
    ctx.moveTo(x + 22, y + 24);
    ctx.quadraticCurveTo(x + 38, y + 10, x + 34, y - 12);
  } else {
    ctx.moveTo(x + 22, y + 24);
    ctx.quadraticCurveTo(x + 34, y + 34, x + 30, y + 48);
  }
  ctx.stroke();
  ctx.lineCap = 'butt';
}

const MARKET_DIFFS = [
  {
    x: 72, y: 62, r: 34, label: 'The sun is wearing sunglasses',
    apply(ctx) {
      roundRectPath(ctx, 50, 54, 18, 10, 4);
      ctx.fillStyle = '#222222';
      ctx.fill();
      roundRectPath(ctx, 76, 54, 18, 10, 4);
      ctx.fill();
      ctx.strokeStyle = '#222222';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(68, 59);
      ctx.lineTo(76, 59);
      ctx.stroke();
    },
  },
  {
    x: 185, y: 228, r: 12, label: 'One apple turned green',
    apply(ctx) {
      circle(ctx, 185, 228, 9, '#7bc043');
      circle(ctx, 182, 225, 3, '#a8e063');
    },
  },
  {
    x: 300, y: 118, r: 14, label: 'The bird flew away',
    apply(ctx) {
      rect(ctx, 284, 104, 42, 22, '#b9e4fb');
    },
  },
  {
    x: 505, y: 88, r: 20, label: 'The balloon turned blue',
    apply(ctx) {
      ellipse(ctx, 505, 88, 16, 19, '#3b82f6');
      ctx.beginPath();
      ctx.moveTo(501, 106);
      ctx.lineTo(509, 106);
      ctx.lineTo(505, 112);
      ctx.closePath();
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
    },
  },
  {
    x: 154, y: 195, r: 18, label: 'The price went up from 5 to 8',
    apply(ctx) {
      rect(ctx, 128, 178, 52, 34, '#fff8e1');
      ctx.strokeStyle = '#8a5a33';
      ctx.lineWidth = 3;
      ctx.strokeRect(128, 178, 52, 34);
      ctx.fillStyle = '#33302a';
      ctx.font = 'bold 24px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('8', 154, 195);
    },
  },
  {
    x: 495, y: 325, r: 22, label: "Momo's tail drooped down",
    apply(ctx) {
      rect(ctx, 493, 300, 24, 44, MARKET_GROUND);
      ctx.strokeStyle = '#f2a541';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(492, 352);
      ctx.quadraticCurveTo(502, 366, 498, 380);
      ctx.stroke();
      ctx.lineCap = 'butt';
    },
  },
  {
    x: 150, y: 375, r: 14, label: 'An extra tulip bloomed',
    apply(ctx) { drawTulip(ctx, 150, 375, '#ff6b9d'); },
  },
];

// ---------------------------------------------------------------- scene 2
// "Cat Café Corner" — a cosy café table with tea, cake and a napping cat.

const CAFE_WALL = '#ffe6bf';

function drawCafeBase(ctx, t) {
  rect(ctx, 0, 0, 560, 320, CAFE_WALL);
  rect(ctx, 0, 320, 560, 100, '#c89b6a');
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = 2;
  for (let y = 340; y < 420; y += 26) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(560, y);
    ctx.stroke();
  }
  // Window with sky, sun and a cloud.
  rect(ctx, 55, 55, 150, 160, '#8a5a33');
  rect(ctx, 63, 63, 134, 144, '#bfe3ff');
  circle(ctx, 110, 95, 18, '#ffd93b');
  ellipse(ctx, 165, 92, 22, 10, '#ffffff');
  ctx.strokeStyle = '#8a5a33';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(130, 63);
  ctx.lineTo(130, 207);
  ctx.moveTo(63, 135);
  ctx.lineTo(197, 135);
  ctx.stroke();
  // Wall clock showing 3:00.
  circle(ctx, 305, 82, 30, '#ffffff');
  ctx.strokeStyle = '#6b4a2f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(305, 82, 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#33302a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(305, 82);
  ctx.lineTo(322, 82);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(305, 82);
  ctx.lineTo(305, 64);
  ctx.stroke();
  circle(ctx, 305, 82, 3, '#33302a');
  // Framed picture: a sunny hill.
  rect(ctx, 425, 60, 90, 65, '#6b4a2f');
  rect(ctx, 431, 66, 78, 53, '#bfe3ff');
  circle(ctx, 460, 86, 10, '#ffd93b');
  ellipse(ctx, 470, 112, 40, 12, '#7ec850');
  // Table.
  rect(ctx, 120, 265, 320, 16, '#a9744f');
  rect(ctx, 140, 281, 10, 50, '#8a5a33');
  rect(ctx, 410, 281, 10, 50, '#8a5a33');
  // Teapot (teal).
  drawTeapot(ctx, 255, 225, '#2a9d8f');
  // Two cups.
  drawCup(ctx, 195, 250, '#ffffff');
  drawCup(ctx, 330, 250, '#fff6ea');
  circle(ctx, 330, 247, 9, '#c98a4b');
  // Cake with a cherry.
  ellipse(ctx, 385, 258, 30, 7, '#ffffff');
  rect(ctx, 362, 238, 46, 18, '#ffb3c6');
  rect(ctx, 362, 238, 46, 6, '#fff0f3');
  circle(ctx, 385, 232, 6, '#e23b3b');
  // Potted plant.
  drawPlant(ctx, 70, 300, false);
  // Cat napping on a cushion, red bow at its neck.
  ellipse(ctx, 468, 372, 52, 14, '#ffb3c6');
  ellipse(ctx, 465, 350, 30, 20, '#f2a541');
  circle(ctx, 440, 334, 15, '#f2a541');
  ctx.beginPath();
  ctx.moveTo(428, 324);
  ctx.lineTo(432, 312);
  ctx.lineTo(438, 322);
  ctx.closePath();
  ctx.fillStyle = '#f2a541';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(448, 320);
  ctx.lineTo(452, 310);
  ctx.lineTo(456, 320);
  ctx.closePath();
  ctx.fill();
  // Closed eyes (sleeping).
  ctx.strokeStyle = '#33302a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(434, 334, 4, Math.PI, 0);
  ctx.stroke();
  drawBow(ctx, 458, 322, '#e23b3b');
  void t;
}

function drawTeapot(ctx, x, y, color) {
  ellipse(ctx, x, y, 30, 22, color);
  ctx.beginPath();
  ctx.moveTo(x - 28, y - 2);
  ctx.quadraticCurveTo(x - 44, y - 8, x - 40, y - 16);
  ctx.quadraticCurveTo(x - 32, y - 10, x - 28, y - 8);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(x + 30, y, 10, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ellipse(ctx, x, y - 22, 16, 6, color);
  circle(ctx, x, y - 28, 4, '#ffb703');
}

function drawCup(ctx, x, y, color) {
  ellipse(ctx, x, y + 8, 22, 5, '#e8e0d0');
  roundRectPath(ctx, x - 14, y - 10, 28, 18, 4);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = '#8a5a33';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x + 16, y, 7, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
}

function drawPlant(ctx, x, y, extraLeaf) {
  // Pot.
  ctx.fillStyle = '#d96c4f';
  ctx.beginPath();
  ctx.moveTo(x - 22, y);
  ctx.lineTo(x + 22, y);
  ctx.lineTo(x + 17, y + 30);
  ctx.lineTo(x - 17, y + 30);
  ctx.closePath();
  ctx.fill();
  // Leaves.
  ctx.fillStyle = '#3f8f3f';
  ctx.beginPath();
  ctx.ellipse(x - 12, y - 14, 7, 18, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 2, y - 20, 7, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 14, y - 12, 7, 16, 0.5, 0, Math.PI * 2);
  ctx.fill();
  if (extraLeaf) {
    ctx.beginPath();
    ctx.ellipse(x + 26, y - 22, 6, 14, 0.9, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBow(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 12, y - 7);
  ctx.lineTo(x - 12, y + 7);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 12, y - 7);
  ctx.lineTo(x + 12, y + 7);
  ctx.closePath();
  ctx.fill();
  circle(ctx, x, y, 4, color);
}

const CAFE_DIFFS = [
  {
    x: 305, y: 82, r: 32, label: 'The clock jumped from 3:00 to 5:00',
    apply(ctx) {
      circle(ctx, 305, 82, 30, '#ffffff');
      ctx.strokeStyle = '#6b4a2f';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(305, 82, 30, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#33302a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(305, 82);
      ctx.lineTo(317, 97);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(305, 82);
      ctx.lineTo(305, 104);
      ctx.stroke();
      circle(ctx, 305, 82, 3, '#33302a');
    },
  },
  {
    x: 255, y: 225, r: 26, label: 'The teapot turned purple',
    apply(ctx) { drawTeapot(ctx, 255, 225, '#7b5ea7'); },
  },
  {
    x: 385, y: 232, r: 10, label: 'The cherry vanished off the cake',
    apply(ctx) { circle(ctx, 385, 232, 6, '#fff0f3'); },
  },
  {
    x: 467, y: 92, r: 28, label: 'The picture changed from sun to moon',
    apply(ctx) {
      rect(ctx, 431, 66, 78, 53, '#2c3e6b');
      circle(ctx, 460, 86, 10, '#ffeeb0');
      circle(ctx, 465, 82, 9, '#2c3e6b');
      ellipse(ctx, 470, 112, 40, 12, '#3a5a3a');
      star4(ctx, 495, 78, 4, '#ffffff');
    },
  },
  {
    x: 458, y: 322, r: 12, label: "The cat's bow turned blue",
    apply(ctx) { drawBow(ctx, 458, 322, '#3b82f6'); },
  },
  {
    x: 96, y: 278, r: 16, label: 'The plant grew an extra leaf',
    apply(ctx) {
      ctx.fillStyle = '#3f8f3f';
      ctx.beginPath();
      ctx.ellipse(96, 278, 6, 14, 0.9, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    x: 150, y: 120, r: 22, label: 'A second cloud drifted into the window',
    apply(ctx) {
      ellipse(ctx, 150, 120, 24, 11, '#ffffff');
      ellipse(ctx, 162, 114, 16, 9, '#ffffff');
    },
  },
];

// ---------------------------------------------------------------- scene 3
// "Lantern Night" — a lantern festival street after dark.

const NIGHT_SKY = '#232a4d';
const STARS = [
  [40, 40], [120, 30], [200, 55], [300, 28], [360, 60], [40, 120], [90, 90],
  [180, 130], [330, 120], [520, 130], [500, 200], [60, 180], [250, 40],
  [440, 180], [150, 200], [540, 90], [20, 230], [290, 170],
];

function drawNightBase(ctx, t) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#141c3a');
  sky.addColorStop(1, '#3d2b63');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 560, 300);
  for (let i = 0; i < STARS.length; i++) {
    const [sx, sy] = STARS[i];
    ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t / 700 + i * 1.7);
    star4(ctx, sx, sy, 4, '#ffffff');
  }
  ctx.globalAlpha = 1;
  // Moon with craters.
  circle(ctx, 478, 58, 26, '#ffeeb0');
  circle(ctx, 470, 50, 5, '#e8d28a');
  circle(ctx, 488, 66, 4, '#e8d28a');
  circle(ctx, 482, 44, 3, '#e8d28a');
  // Lantern string.
  ctx.strokeStyle = '#0f1430';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 70);
  ctx.quadraticCurveTo(280, 110, 560, 62);
  ctx.stroke();
  const lanternXs = [80, 170, 260, 350, 440];
  for (let i = 0; i < lanternXs.length; i++) {
    const lx = lanternXs[i];
    const ly = 78 + Math.sin((lx / 560) * Math.PI) * 22;
    drawLantern(ctx, lx, ly, '#e23b3b', t + i * 500);
  }
  // Bunting flags.
  const flagColors = ['#ff6b9d', '#ffb703', '#3b82f6', '#7bc043', '#b388ff'];
  for (let i = 0; i < 7; i++) {
    const fx = 150 + i * 40;
    ctx.fillStyle = flagColors[i % flagColors.length];
    ctx.beginPath();
    ctx.moveTo(fx, 150);
    ctx.lineTo(fx + 36, 150);
    ctx.lineTo(fx + 18, 172);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = '#0f1430';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(140, 150);
  ctx.lineTo(430, 150);
  ctx.stroke();
  // Street.
  rect(ctx, 0, 300, 560, 120, '#2c2340');
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  for (let i = 0; i < 8; i++) {
    circle(ctx, 40 + i * 66, 340 + (i % 3) * 22, 5, 'rgba(255,255,255,0.07)');
  }
  // Left stall with a cat on its roof.
  rect(ctx, 60, 240, 140, 60, '#1c2440');
  rect(ctx, 50, 228, 160, 16, '#e23b3b');
  rect(ctx, 50, 228, 32, 16, '#fff6ea');
  rect(ctx, 114, 228, 32, 16, '#fff6ea');
  rect(ctx, 178, 228, 32, 16, '#fff6ea');
  drawNightCat(ctx, 120, 222, false);
  // Right stall with a lit window.
  rect(ctx, 360, 250, 140, 50, '#1c2440');
  rect(ctx, 360, 238, 140, 14, '#ffb703');
  rect(ctx, 388, 238, 28, 14, '#e23b3b');
  rect(ctx, 444, 238, 28, 14, '#e23b3b');
  rect(ctx, 400, 205, 34, 44, '#ffd76a');
  ctx.strokeStyle = '#1c2440';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(417, 205);
  ctx.lineTo(417, 249);
  ctx.moveTo(400, 227);
  ctx.lineTo(434, 227);
  ctx.stroke();
  // Fireflies.
  for (let i = 0; i < 6; i++) {
    const fx = 220 + i * 34 + Math.sin(t / 900 + i) * 6;
    const fy = 320 + (i % 2) * 26 + Math.cos(t / 800 + i * 2) * 5;
    ctx.globalAlpha = 0.4 + 0.4 * Math.sin(t / 500 + i * 2.3);
    circle(ctx, fx, fy, 3, '#cfe86a');
  }
  ctx.globalAlpha = 1;
}

function drawLantern(ctx, x, y, color, t) {
  const sway = Math.sin(t / 1100) * 2;
  ctx.strokeStyle = '#0f1430';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 22);
  ctx.lineTo(x + sway, y - 8);
  ctx.stroke();
  ctx.save();
  ctx.translate(sway, 0);
  ctx.globalAlpha = 0.18;
  circle(ctx, x, y, 22, color);
  ctx.globalAlpha = 1;
  ellipse(ctx, x, y, 15, 18, color);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - 13, y - 8);
  ctx.quadraticCurveTo(x, y - 4, x + 13, y - 8);
  ctx.moveTo(x - 14, y + 8);
  ctx.quadraticCurveTo(x, y + 12, x + 14, y + 8);
  ctx.stroke();
  rect(ctx, x - 7, y - 22, 14, 5, '#ffb703');
  rect(ctx, x - 7, y + 17, 14, 5, '#ffb703');
  ctx.restore();
}

function drawNightCat(ctx, x, y, tailCurled) {
  // Black silhouette cat sitting on the roof.
  ellipse(ctx, x, y + 10, 18, 12, '#0f1430');
  circle(ctx, x - 4, y - 6, 11, '#0f1430');
  ctx.beginPath();
  ctx.moveTo(x - 13, y - 12);
  ctx.lineTo(x - 10, y - 22);
  ctx.lineTo(x - 4, y - 13);
  ctx.closePath();
  ctx.fillStyle = '#0f1430';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 2, y - 14);
  ctx.lineTo(x + 6, y - 23);
  ctx.lineTo(x + 10, y - 12);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#0f1430';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (!tailCurled) {
    ctx.moveTo(x + 16, y + 14);
    ctx.quadraticCurveTo(x + 28, y + 4, x + 26, y - 12);
  } else {
    ctx.moveTo(x + 16, y + 14);
    ctx.quadraticCurveTo(x + 30, y + 18, x + 28, y + 6);
  }
  ctx.stroke();
  ctx.lineCap = 'butt';
}

const NIGHT_DIFFS = [
  {
    x: 478, y: 58, r: 28, label: 'The moon turned into a crescent',
    apply(ctx) {
      circle(ctx, 490, 50, 21, '#2b2a55');
    },
  },
  {
    x: 260, y: 100, r: 18, label: 'One lantern turned green',
    apply(ctx) {
      const ly = 78 + Math.sin((260 / 560) * Math.PI) * 22;
      drawLantern(ctx, 260, ly, '#3fae5a', 0);
    },
  },
  {
    x: 420, y: 48, r: 10, label: 'A new star appeared by the moon',
    apply(ctx) { star4(ctx, 420, 48, 6, '#ffffff'); },
  },
  {
    x: 417, y: 227, r: 22, label: 'The stall window went dark',
    apply(ctx) {
      rect(ctx, 400, 205, 34, 44, '#1c2440');
      ctx.strokeStyle = '#3a4a7a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(417, 205);
      ctx.lineTo(417, 249);
      ctx.moveTo(400, 227);
      ctx.lineTo(434, 227);
      ctx.stroke();
    },
  },
  {
    x: 138, y: 222, r: 20, label: "The rooftop cat's tail curled",
    apply(ctx) {
      // Paint over the raised tail with a slice of the night-sky gradient,
      // then redraw the cat with its tail curled down.
      const skyPatch = ctx.createLinearGradient(0, 196, 0, 238);
      skyPatch.addColorStop(0, '#1e2448');
      skyPatch.addColorStop(1, '#2c2a56');
      ctx.fillStyle = skyPatch;
      ctx.fillRect(130, 196, 30, 42);
      drawNightCat(ctx, 120, 222, true);
    },
  },
  {
    x: 230, y: 158, r: 12, label: 'A bunting flag went missing',
    apply(ctx) {
      ctx.fillStyle = '#33295c';
      ctx.beginPath();
      ctx.moveTo(222, 150);
      ctx.lineTo(258, 150);
      ctx.lineTo(240, 172);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#0f1430';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(222, 150);
      ctx.lineTo(258, 150);
      ctx.stroke();
    },
  },
  {
    x: 402, y: 245, r: 16, label: 'An awning stripe turned red',
    apply(ctx) {
      rect(ctx, 388, 238, 28, 14, '#e23b3b');
    },
  },
];

// ---------------------------------------------------------------- catalogue

export const SCENES = [
  {
    id: 'market',
    name: 'Morning Market',
    tagline: "Momo's fruit stall on a sunny morning",
    timeLimit: 120,
    diffs: MARKET_DIFFS,
    draw(ctx, altered, t) {
      drawMarketBase(ctx, t);
      if (altered) for (const d of MARKET_DIFFS) d.apply(ctx);
    },
  },
  {
    id: 'cafe',
    name: 'Cat Café Corner',
    tagline: 'Tea, cake and a napping cat',
    timeLimit: 100,
    diffs: CAFE_DIFFS,
    draw(ctx, altered, t) {
      drawCafeBase(ctx, t);
      if (altered) for (const d of CAFE_DIFFS) d.apply(ctx);
    },
  },
  {
    id: 'lanterns',
    name: 'Lantern Night',
    tagline: 'A lantern festival street after dark',
    timeLimit: 90,
    diffs: NIGHT_DIFFS,
    draw(ctx, altered, t) {
      drawNightBase(ctx, t);
      if (altered) for (const d of NIGHT_DIFFS) d.apply(ctx);
    },
  },
];

export const PANEL_WIDTH = 560;
export const PANEL_HEIGHT = 420;
