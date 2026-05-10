"use strict";

const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");
const modeLabel = document.querySelector("#modeLabel");
const statA = document.querySelector("#statA");
const statB = document.querySelector("#statB");
const statC = document.querySelector("#statC");
const statALabel = document.querySelector("#statALabel");
const statBLabel = document.querySelector("#statBLabel");
const statCLabel = document.querySelector("#statCLabel");
const pauseButton = document.querySelector("#pauseButton");
const restartButton = document.querySelector("#restartButton");
const overlay = document.querySelector("#overlay");
const overlayTitle = document.querySelector("#overlayTitle");
const overlayText = document.querySelector("#overlayText");
const overlayButton = document.querySelector("#overlayButton");
const modeButtons = [...document.querySelectorAll(".mode-button")];
const controlButtons = [...document.querySelectorAll("[data-action]")];

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const random = (min, max) => min + Math.random() * (max - min);
const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);
const easeOutBack = (value) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(value - 1, 3) + c1 * Math.pow(value - 1, 2);
};

const palette = {
  ink: "#f5f4eb",
  muted: "#a6a391",
  panel: "rgba(245, 244, 235, 0.08)",
  grid: "rgba(245, 244, 235, 0.08)",
  cyan: "#42d7ff",
  coral: "#ff4e63",
  gold: "#f2c14e",
  green: "#57e389",
  violet: "#9e7bff",
  blue: "#4f8cff",
  orange: "#ff9f43",
  red: "#ff3959",
  dark: "#09090d"
};

const gameMeta = {
  tetris: {
    title: "俄罗斯方块",
    controls: {
      left: ["向左", "←"],
      right: ["向右", "→"],
      rotate: ["旋转", "↻"],
      down: ["向下", "↓"],
      drop: ["快速下落", "⇣"]
    }
  },
  shooter: {
    title: "飞机大战",
    controls: {
      left: ["向左", "←"],
      right: ["向右", "→"],
      rotate: ["向上", "↑"],
      down: ["向下", "↓"],
      drop: ["集中火力", "◆"]
    }
  },
  snake: {
    title: "贪吃蛇",
    controls: {
      left: ["向左", "←"],
      right: ["向右", "→"],
      rotate: ["向上", "↑"],
      down: ["向下", "↓"],
      drop: ["加速", "»"]
    }
  },
  breakout: {
    title: "打砖块",
    controls: {
      left: ["左移", "←"],
      right: ["右移", "→"],
      rotate: ["发球", "↑"],
      down: ["减速", "↓"],
      drop: ["发球", "●"]
    }
  },
  merge: {
    title: "数字合成",
    controls: {
      left: ["左滑", "←"],
      right: ["右滑", "→"],
      rotate: ["上滑", "↑"],
      down: ["下滑", "↓"],
      drop: ["下滑", "↓"]
    }
  },
  flappy: {
    title: "像素飞行",
    controls: {
      left: ["轻拍", "·"],
      right: ["轻拍", "·"],
      rotate: ["上升", "↑"],
      down: ["俯冲", "↓"],
      drop: ["上升", "▲"]
    }
  },
  memory: {
    title: "记忆翻牌",
    controls: {
      left: ["左选", "←"],
      right: ["右选", "→"],
      rotate: ["上选", "↑"],
      down: ["下选", "↓"],
      drop: ["翻牌", "●"]
    }
  },
  mines: {
    title: "方格探雷",
    controls: {
      left: ["左选", "←"],
      right: ["右选", "→"],
      rotate: ["标记", "⚑"],
      down: ["下选", "↓"],
      drop: ["翻开", "●"]
    }
  },
  jumper: {
    title: "弹跳上升",
    controls: {
      left: ["左移", "←"],
      right: ["右移", "→"],
      rotate: ["轻跳", "↑"],
      down: ["下落", "↓"],
      drop: ["冲刺", "»"]
    }
  },
  maze: {
    title: "迷宫逃脱",
    controls: {
      left: ["向左", "←"],
      right: ["向右", "→"],
      rotate: ["向上", "↑"],
      down: ["向下", "↓"],
      drop: ["向下", "↓"]
    }
  },
  pong: {
    title: "霓虹乒乓",
    controls: {
      left: ["左移", "←"],
      right: ["右移", "→"],
      rotate: ["发球", "↑"],
      down: ["减速", "↓"],
      drop: ["发球", "●"]
    }
  },
  invaders: {
    title: "太空入侵",
    controls: {
      left: ["左移", "←"],
      right: ["右移", "→"],
      rotate: ["射击", "↑"],
      down: ["防守", "↓"],
      drop: ["射击", "◆"]
    }
  },
  mole: {
    title: "快打地鼠",
    controls: {
      left: ["左选", "←"],
      right: ["右选", "→"],
      rotate: ["上选", "↑"],
      down: ["下选", "↓"],
      drop: ["击打", "●"]
    }
  },
  stack: {
    title: "堆叠高塔",
    controls: {
      left: ["左移", "←"],
      right: ["右移", "→"],
      rotate: ["落下", "↑"],
      down: ["减速", "↓"],
      drop: ["落下", "●"]
    }
  },
  flood: {
    title: "色块扩张",
    controls: {
      left: ["上一色", "←"],
      right: ["下一色", "→"],
      rotate: ["上一色", "↑"],
      down: ["下一色", "↓"],
      drop: ["扩张", "●"]
    }
  }
};

const backgroundThemes = {
  tetris: ["#101019", "#1a1115", "rgba(66,215,255,0.14)"],
  shooter: ["#080b14", "#111116", "rgba(255,78,99,0.12)"],
  snake: ["#0b1511", "#15180f", "rgba(87,227,137,0.14)"],
  breakout: ["#120e14", "#171215", "rgba(242,193,78,0.15)"],
  merge: ["#11100d", "#18140f", "rgba(255,159,67,0.15)"],
  flappy: ["#07131a", "#111116", "rgba(66,215,255,0.14)"],
  memory: ["#12101a", "#141118", "rgba(158,123,255,0.16)"],
  mines: ["#101411", "#151515", "rgba(245,244,235,0.11)"],
  jumper: ["#08131a", "#101419", "rgba(79,140,255,0.15)"],
  maze: ["#0d1015", "#15120f", "rgba(255,78,99,0.12)"],
  pong: ["#071015", "#151018", "rgba(66,215,255,0.15)"],
  invaders: ["#080b16", "#141018", "rgba(87,227,137,0.13)"],
  mole: ["#14100c", "#181313", "rgba(255,159,67,0.15)"],
  stack: ["#0d1218", "#161313", "rgba(242,193,78,0.15)"],
  flood: ["#0c1114", "#131413", "rgba(158,123,255,0.14)"]
};

const directionByAction = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  rotate: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  drop: { x: 0, y: 1 }
};

function toggleStandardPause(game) {
  if (game.over) return;
  game.paused = !game.paused;
  if (game.paused) {
    showOverlay("暂停", "当前进度已保留", "继续");
  } else {
    hideOverlay();
  }
}

function finishGame(game, title, text, buttonText = "再来") {
  game.over = true;
  showOverlay(title, text, buttonText);
}

class TetrisGame {
  constructor() {
    this.cols = 10;
    this.rows = 20;
    this.bag = [];
    this.repeatTimer = null;
    this.reset();
  }

  reset() {
    this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.dropCounter = 0;
    this.dropInterval = 0.68;
    this.paused = false;
    this.over = false;
    this.next = this.createPiece();
    this.spawn();
  }

  createPiece() {
    if (this.bag.length === 0) {
      this.bag = ["I", "O", "T", "S", "Z", "J", "L"].sort(() => Math.random() - 0.5);
    }
    const type = this.bag.pop();
    const pieces = {
      I: { color: palette.cyan, matrix: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]] },
      O: { color: palette.gold, matrix: [[1, 1], [1, 1]] },
      T: { color: palette.violet, matrix: [[0, 1, 0], [1, 1, 1], [0, 0, 0]] },
      S: { color: palette.green, matrix: [[0, 1, 1], [1, 1, 0], [0, 0, 0]] },
      Z: { color: palette.coral, matrix: [[1, 1, 0], [0, 1, 1], [0, 0, 0]] },
      J: { color: "#4f8cff", matrix: [[1, 0, 0], [1, 1, 1], [0, 0, 0]] },
      L: { color: "#ff9f43", matrix: [[0, 0, 1], [1, 1, 1], [0, 0, 0]] }
    };
    return { type, color: pieces[type].color, matrix: pieces[type].matrix.map((row) => [...row]) };
  }

  spawn() {
    this.piece = this.next;
    this.next = this.createPiece();
    this.pos = {
      x: Math.floor((this.cols - this.piece.matrix[0].length) / 2),
      y: -1
    };
    if (this.collides(this.piece.matrix, this.pos.x, this.pos.y)) {
      this.over = true;
      showOverlay("游戏结束", `分数 ${this.score}`, "再来");
    }
  }

  togglePause() {
    if (this.over) return;
    this.paused = !this.paused;
    if (this.paused) {
      showOverlay("暂停", "当前进度已保留", "继续");
    } else {
      hideOverlay();
    }
  }

  update(dt) {
    if (this.paused || this.over) return;
    this.dropCounter += dt;
    if (this.dropCounter >= this.dropInterval) {
      this.dropCounter = 0;
      this.softDrop();
    }
  }

  action(action, isPressed) {
    if (!isPressed) return;
    if (this.over) {
      this.reset();
      hideOverlay();
      return;
    }
    if (this.paused && action !== "pause") return;
    if (action === "left") this.move(-1);
    if (action === "right") this.move(1);
    if (action === "rotate") this.rotate();
    if (action === "down") this.softDrop(true);
    if (action === "drop") this.hardDrop();
  }

  key(key) {
    const map = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "rotate",
      ArrowDown: "down",
      Space: "drop"
    };
    if (map[key]) this.action(map[key], true);
  }

  move(dir) {
    const x = this.pos.x + dir;
    if (!this.collides(this.piece.matrix, x, this.pos.y)) {
      this.pos.x = x;
    }
  }

  softDrop(manual = false) {
    const y = this.pos.y + 1;
    if (!this.collides(this.piece.matrix, this.pos.x, y)) {
      this.pos.y = y;
      if (manual) this.score += 1;
      return;
    }
    this.lockPiece();
  }

  hardDrop() {
    let distance = 0;
    while (!this.collides(this.piece.matrix, this.pos.x, this.pos.y + 1)) {
      this.pos.y += 1;
      distance += 1;
    }
    this.score += distance * 2;
    this.lockPiece();
  }

  rotate() {
    const rotated = this.piece.matrix[0].map((_, index) => this.piece.matrix.map((row) => row[index]).reverse());
    const kicks = [0, -1, 1, -2, 2];
    for (const kick of kicks) {
      if (!this.collides(rotated, this.pos.x + kick, this.pos.y)) {
        this.piece.matrix = rotated;
        this.pos.x += kick;
        return;
      }
    }
  }

  collides(matrix, offsetX, offsetY) {
    for (let y = 0; y < matrix.length; y += 1) {
      for (let x = 0; x < matrix[y].length; x += 1) {
        if (!matrix[y][x]) continue;
        const boardX = offsetX + x;
        const boardY = offsetY + y;
        if (boardX < 0 || boardX >= this.cols || boardY >= this.rows) return true;
        if (boardY >= 0 && this.board[boardY][boardX]) return true;
      }
    }
    return false;
  }

  lockPiece() {
    for (let y = 0; y < this.piece.matrix.length; y += 1) {
      for (let x = 0; x < this.piece.matrix[y].length; x += 1) {
        if (!this.piece.matrix[y][x]) continue;
        const boardY = this.pos.y + y;
        const boardX = this.pos.x + x;
        if (boardY >= 0) this.board[boardY][boardX] = this.piece.color;
      }
    }
    this.clearLines();
    this.spawn();
  }

  clearLines() {
    let cleared = 0;
    for (let y = this.rows - 1; y >= 0; y -= 1) {
      if (this.board[y].every(Boolean)) {
        this.board.splice(y, 1);
        this.board.unshift(Array(this.cols).fill(null));
        cleared += 1;
        y += 1;
      }
    }
    if (cleared === 0) return;
    this.lines += cleared;
    this.level = Math.floor(this.lines / 10) + 1;
    this.dropInterval = Math.max(0.12, 0.68 - (this.level - 1) * 0.045);
    this.score += [0, 100, 300, 500, 800][cleared] * this.level;
  }

  getGhostY() {
    let y = this.pos.y;
    while (!this.collides(this.piece.matrix, this.pos.x, y + 1)) y += 1;
    return y;
  }

  stats() {
    return [
      ["分数", this.score],
      ["等级", this.level],
      ["行数", this.lines]
    ];
  }

  drawCell(renderCtx, x, y, size, color, alpha = 1) {
    renderCtx.save();
    renderCtx.globalAlpha = alpha;
    renderCtx.fillStyle = color;
    renderCtx.fillRect(x + 1, y + 1, size - 2, size - 2);
    renderCtx.fillStyle = "rgba(255,255,255,0.22)";
    renderCtx.fillRect(x + 3, y + 3, size - 6, Math.max(2, size * 0.18));
    renderCtx.strokeStyle = "rgba(0,0,0,0.34)";
    renderCtx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
    renderCtx.restore();
  }

  draw(renderCtx, width, height) {
    drawCabinetBackground(renderCtx, width, height, "tetris");
    const cell = Math.floor(Math.min((width - 72) / this.cols, (height - 42) / this.rows));
    const boardWidth = cell * this.cols;
    const boardHeight = cell * this.rows;
    const offsetX = Math.floor((width - boardWidth) / 2);
    const offsetY = Math.floor((height - boardHeight) / 2);

    renderCtx.fillStyle = "rgba(0,0,0,0.34)";
    renderCtx.fillRect(offsetX - 8, offsetY - 8, boardWidth + 16, boardHeight + 16);
    renderCtx.strokeStyle = "rgba(245,244,235,0.28)";
    renderCtx.strokeRect(offsetX - 8.5, offsetY - 8.5, boardWidth + 17, boardHeight + 17);

    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.cols; x += 1) {
        renderCtx.fillStyle = (x + y) % 2 === 0 ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.018)";
        renderCtx.fillRect(offsetX + x * cell, offsetY + y * cell, cell, cell);
        if (this.board[y][x]) {
          this.drawCell(renderCtx, offsetX + x * cell, offsetY + y * cell, cell, this.board[y][x]);
        }
      }
    }

    const ghostY = this.getGhostY();
    this.drawMatrix(renderCtx, this.piece.matrix, this.pos.x, ghostY, offsetX, offsetY, cell, this.piece.color, 0.24);
    this.drawMatrix(renderCtx, this.piece.matrix, this.pos.x, this.pos.y, offsetX, offsetY, cell, this.piece.color, 1);

    renderCtx.fillStyle = palette.muted;
    renderCtx.font = "12px 'DIN Alternate', monospace";
    renderCtx.fillText("NEXT", width - 62, 26);
    this.next.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) this.drawCell(renderCtx, width - 62 + x * 11, 34 + y * 11, 11, this.next.color, 0.95);
      });
    });
  }

  drawMatrix(renderCtx, matrix, pieceX, pieceY, offsetX, offsetY, cell, color, alpha) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (!value) return;
        const boardY = pieceY + y;
        if (boardY < 0) return;
        this.drawCell(renderCtx, offsetX + (pieceX + x) * cell, offsetY + boardY * cell, cell, color, alpha);
      });
    });
  }
}

class ShooterGame {
  constructor() {
    this.pressed = new Set();
    this.stars = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: random(0.6, 2.2),
      speed: random(26, 84)
    }));
    this.reset();
  }

  reset() {
    this.score = 0;
    this.lives = 3;
    this.wave = 1;
    this.time = 0;
    this.spawnTimer = 0;
    this.fireTimer = 0;
    this.paused = false;
    this.over = false;
    this.pointerActive = false;
    this.player = { x: 180, y: 460, radius: 14, speed: 245, invulnerable: 1.2 };
    this.bullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.particles = [];
  }

  resize(width, height) {
    this.player.x = clamp(this.player.x, 28, width - 28);
    this.player.y = clamp(this.player.y, height * 0.42, height - 38);
  }

  togglePause() {
    if (this.over) return;
    this.paused = !this.paused;
    if (this.paused) {
      showOverlay("暂停", "当前进度已保留", "继续");
    } else {
      hideOverlay();
    }
  }

  action(action, isPressed) {
    if (this.over && isPressed) {
      this.reset();
      hideOverlay();
      return;
    }
    if (isPressed) {
      this.pressed.add(action);
    } else {
      this.pressed.delete(action);
    }
  }

  key(key, isPressed) {
    const map = {
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
      ArrowUp: "rotate",
      KeyW: "rotate",
      ArrowDown: "down",
      KeyS: "down",
      Space: "drop"
    };
    if (map[key]) this.action(map[key], isPressed);
  }

  pointer(type, point) {
    if (this.paused || this.over) return;
    if (type === "start") this.pointerActive = true;
    if (type === "end") this.pointerActive = false;
    if (point && this.pointerActive) {
      this.player.x = clamp(point.x, 24, point.width - 24);
      this.player.y = clamp(point.y, point.height * 0.38, point.height - 34);
    }
  }

  update(dt, width, height) {
    if (this.paused || this.over) return;
    this.resize(width, height);
    this.time += dt;
    this.wave = Math.max(1, Math.floor(this.score / 700) + 1);
    this.player.invulnerable = Math.max(0, this.player.invulnerable - dt);
    this.updatePlayer(dt, width, height);
    this.updateStars(dt);
    this.updateBullets(dt, width, height);
    this.updateEnemies(dt, width, height);
    this.updateParticles(dt);
    this.spawnEnemies(dt, width);
    this.checkCollisions(width, height);
  }

  updatePlayer(dt, width, height) {
    const speed = this.player.speed * dt;
    if (this.pressed.has("left")) this.player.x -= speed;
    if (this.pressed.has("right")) this.player.x += speed;
    if (this.pressed.has("rotate")) this.player.y -= speed;
    if (this.pressed.has("down")) this.player.y += speed;
    this.player.x = clamp(this.player.x, 24, width - 24);
    this.player.y = clamp(this.player.y, height * 0.38, height - 34);

    this.fireTimer -= dt;
    if (this.fireTimer <= 0) {
      const focusFire = this.pressed.has("drop");
      this.bullets.push({ x: this.player.x - 7, y: this.player.y - 18, vx: 0, vy: -430, radius: 3, color: palette.cyan });
      this.bullets.push({ x: this.player.x + 7, y: this.player.y - 18, vx: 0, vy: -430, radius: 3, color: palette.green });
      if (focusFire) {
        this.bullets.push({ x: this.player.x, y: this.player.y - 24, vx: 0, vy: -500, radius: 4, color: palette.gold });
      }
      this.fireTimer = focusFire ? 0.09 : 0.16;
    }
  }

  updateStars(dt) {
    for (const star of this.stars) {
      star.y += (star.speed * dt) / 540;
      if (star.y > 1.04) {
        star.y = -0.04;
        star.x = Math.random();
      }
    }
  }

  updateBullets(dt, width, height) {
    for (const bullet of this.bullets) {
      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;
    }
    for (const bullet of this.enemyBullets) {
      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;
    }
    this.bullets = this.bullets.filter((bullet) => bullet.y > -20 && bullet.y < height + 20 && bullet.x > -20 && bullet.x < width + 20);
    this.enemyBullets = this.enemyBullets.filter((bullet) => bullet.y > -20 && bullet.y < height + 30 && bullet.x > -20 && bullet.x < width + 20);
  }

  updateEnemies(dt, width, height) {
    for (const enemy of this.enemies) {
      enemy.y += enemy.speed * dt;
      enemy.x += Math.sin(this.time * enemy.swayRate + enemy.seed) * enemy.sway * dt;
      enemy.fire -= dt;
      if (enemy.fire <= 0 && enemy.y > 20 && enemy.y < height * 0.66) {
        const angle = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
        const speed = enemy.type === "tank" ? 120 : 150;
        this.enemyBullets.push({
          x: enemy.x,
          y: enemy.y + enemy.radius,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 4,
          color: enemy.type === "tank" ? palette.gold : palette.coral
        });
        enemy.fire = random(1.6, 2.5) / Math.min(2, 0.8 + this.wave * 0.08);
      }
    }
    this.enemies = this.enemies.filter((enemy) => {
      if (enemy.y < height + 44 && enemy.hp > 0) return true;
      if (enemy.hp > 0 && enemy.y >= height + 44) this.damagePlayer();
      return false;
    });
    for (const enemy of this.enemies) {
      enemy.x = clamp(enemy.x, enemy.radius, width - enemy.radius);
    }
  }

  updateParticles(dt) {
    for (const particle of this.particles) {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.life -= dt;
      particle.size *= 0.985;
    }
    this.particles = this.particles.filter((particle) => particle.life > 0 && particle.size > 0.7);
  }

  spawnEnemies(dt, width) {
    this.spawnTimer -= dt;
    if (this.spawnTimer > 0) return;
    const roll = Math.random();
    let type = "scout";
    if (this.wave >= 3 && roll > 0.72) type = "tank";
    else if (this.wave >= 2 && roll > 0.48) type = "hunter";
    const specs = {
      scout: { hp: 1, radius: 14, speed: random(74, 105), score: 80, color: palette.coral },
      hunter: { hp: 2, radius: 16, speed: random(92, 128), score: 140, color: palette.violet },
      tank: { hp: 4, radius: 21, speed: random(45, 72), score: 260, color: palette.gold }
    };
    const spec = specs[type];
    this.enemies.push({
      ...spec,
      type,
      x: random(spec.radius + 12, width - spec.radius - 12),
      y: -spec.radius - 10,
      maxHp: spec.hp,
      seed: Math.random() * 8,
      sway: type === "tank" ? 18 : 42,
      swayRate: random(1.2, 2.8),
      fire: random(1.2, 2.8)
    });
    this.spawnTimer = Math.max(0.28, 0.9 - this.wave * 0.055);
  }

  checkCollisions() {
    for (const bullet of this.bullets) {
      for (const enemy of this.enemies) {
        if (enemy.hp <= 0) continue;
        if (distance(bullet, enemy) <= bullet.radius + enemy.radius) {
          bullet.y = -999;
          enemy.hp -= 1;
          this.particles.push(...burst(enemy.x, enemy.y, enemy.color, 5));
          if (enemy.hp <= 0) {
            this.score += enemy.score;
            this.particles.push(...burst(enemy.x, enemy.y, enemy.color, 18));
          }
          break;
        }
      }
    }
    this.bullets = this.bullets.filter((bullet) => bullet.y > -100);

    if (this.player.invulnerable <= 0) {
      for (const bullet of this.enemyBullets) {
        if (distance(bullet, this.player) <= bullet.radius + this.player.radius) {
          bullet.y = 9999;
          this.damagePlayer();
          break;
        }
      }
      for (const enemy of this.enemies) {
        if (enemy.hp > 0 && distance(enemy, this.player) <= enemy.radius + this.player.radius) {
          enemy.hp = 0;
          this.damagePlayer();
          this.particles.push(...burst(enemy.x, enemy.y, enemy.color, 16));
          break;
        }
      }
    }
  }

  damagePlayer() {
    if (this.player.invulnerable > 0 || this.over) return;
    this.lives -= 1;
    this.player.invulnerable = 1.4;
    this.particles.push(...burst(this.player.x, this.player.y, palette.cyan, 22));
    if (this.lives <= 0) {
      this.over = true;
      showOverlay("游戏结束", `分数 ${this.score}`, "再来");
    }
  }

  stats() {
    return [
      ["分数", this.score],
      ["生命", this.lives],
      ["波次", this.wave]
    ];
  }

  draw(renderCtx, width, height) {
    drawCabinetBackground(renderCtx, width, height, "shooter");
    this.drawStars(renderCtx, width, height);
    this.drawPlayer(renderCtx);
    for (const bullet of this.bullets) drawBullet(renderCtx, bullet);
    for (const bullet of this.enemyBullets) drawBullet(renderCtx, bullet);
    for (const enemy of this.enemies) this.drawEnemy(renderCtx, enemy);
    for (const particle of this.particles) {
      renderCtx.globalAlpha = clamp(particle.life, 0, 1);
      renderCtx.fillStyle = particle.color;
      renderCtx.fillRect(particle.x, particle.y, particle.size, particle.size);
      renderCtx.globalAlpha = 1;
    }
  }

  drawStars(renderCtx, width, height) {
    for (const star of this.stars) {
      renderCtx.fillStyle = star.size > 1.6 ? "rgba(245,244,235,0.8)" : "rgba(245,244,235,0.36)";
      renderCtx.fillRect(star.x * width, star.y * height, star.size, star.size * 2.5);
    }
  }

  drawPlayer(renderCtx) {
    renderCtx.save();
    renderCtx.translate(this.player.x, this.player.y);
    if (this.player.invulnerable > 0 && Math.floor(this.time * 16) % 2 === 0) {
      renderCtx.globalAlpha = 0.42;
    }
    renderCtx.fillStyle = palette.cyan;
    renderCtx.beginPath();
    renderCtx.moveTo(0, -22);
    renderCtx.lineTo(15, 18);
    renderCtx.lineTo(0, 10);
    renderCtx.lineTo(-15, 18);
    renderCtx.closePath();
    renderCtx.fill();
    renderCtx.fillStyle = palette.ink;
    renderCtx.fillRect(-4, -9, 8, 17);
    renderCtx.fillStyle = palette.coral;
    renderCtx.beginPath();
    renderCtx.moveTo(-6, 18);
    renderCtx.lineTo(0, 30 + Math.sin(this.time * 30) * 5);
    renderCtx.lineTo(6, 18);
    renderCtx.fill();
    renderCtx.restore();
  }

  drawEnemy(renderCtx, enemy) {
    renderCtx.save();
    renderCtx.translate(enemy.x, enemy.y);
    renderCtx.fillStyle = enemy.color;
    renderCtx.beginPath();
    if (enemy.type === "tank") {
      renderCtx.rect(-enemy.radius, -enemy.radius * 0.72, enemy.radius * 2, enemy.radius * 1.45);
    } else {
      renderCtx.moveTo(0, enemy.radius);
      renderCtx.lineTo(enemy.radius, -2);
      renderCtx.lineTo(0, -enemy.radius);
      renderCtx.lineTo(-enemy.radius, -2);
    }
    renderCtx.closePath();
    renderCtx.fill();
    renderCtx.fillStyle = "rgba(0,0,0,0.28)";
    renderCtx.fillRect(-enemy.radius * 0.55, -3, enemy.radius * 1.1, 6);
    renderCtx.fillStyle = palette.ink;
    renderCtx.fillRect(-enemy.radius, enemy.radius + 7, enemy.radius * 2, 3);
    renderCtx.fillStyle = palette.green;
    renderCtx.fillRect(-enemy.radius, enemy.radius + 7, enemy.radius * 2 * (enemy.hp / enemy.maxHp), 3);
    renderCtx.restore();
  }
}

class SnakeGame {
  constructor() {
    this.cols = 18;
    this.rows = 24;
    this.reset();
  }

  reset() {
    const startX = Math.floor(this.cols / 2);
    const startY = Math.floor(this.rows / 2);
    this.snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY }
    ];
    this.direction = { x: 1, y: 0 };
    this.pendingDirection = { x: 1, y: 0 };
    this.score = 0;
    this.level = 1;
    this.moveTimer = 0;
    this.moveInterval = 0.16;
    this.boost = false;
    this.paused = false;
    this.over = false;
    this.placeFood();
  }

  togglePause() {
    toggleStandardPause(this);
  }

  placeFood() {
    const occupied = new Set(this.snake.map((part) => `${part.x},${part.y}`));
    const open = [];
    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.cols; x += 1) {
        if (!occupied.has(`${x},${y}`)) open.push({ x, y });
      }
    }
    if (open.length === 0) {
      finishGame(this, "通关", `分数 ${this.score}`, "再来");
      return;
    }
    this.food = open[Math.floor(Math.random() * open.length)];
  }

  setDirection(direction) {
    if (direction.x === -this.direction.x && direction.y === -this.direction.y) return;
    this.pendingDirection = direction;
  }

  action(action, isPressed) {
    if (this.over && isPressed) {
      this.reset();
      hideOverlay();
      return;
    }
    if (action === "drop") {
      this.boost = isPressed;
      return;
    }
    if (!isPressed || this.paused) return;
    const direction = directionByAction[action];
    if (direction) this.setDirection(direction);
  }

  key(key, isPressed = true) {
    const map = {
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
      ArrowUp: "rotate",
      KeyW: "rotate",
      ArrowDown: "down",
      KeyS: "down",
      Space: "drop"
    };
    if (map[key]) this.action(map[key], isPressed);
  }

  update(dt) {
    if (this.paused || this.over) return;
    this.moveTimer += dt * (this.boost ? 2.2 : 1);
    while (this.moveTimer >= this.moveInterval) {
      this.moveTimer -= this.moveInterval;
      this.step();
      if (this.over) break;
    }
  }

  step() {
    this.direction = this.pendingDirection;
    const head = this.snake[0];
    const next = { x: head.x + this.direction.x, y: head.y + this.direction.y };
    const hitsWall = next.x < 0 || next.x >= this.cols || next.y < 0 || next.y >= this.rows;
    const hitsSelf = this.snake.some((part) => part.x === next.x && part.y === next.y);
    if (hitsWall || hitsSelf) {
      finishGame(this, "游戏结束", `分数 ${this.score}`, "再来");
      return;
    }

    this.snake.unshift(next);
    if (next.x === this.food.x && next.y === this.food.y) {
      this.score += 10 * this.level;
      this.level = Math.floor((this.snake.length - 2) / 5) + 1;
      this.moveInterval = Math.max(0.07, 0.16 - (this.level - 1) * 0.012);
      this.placeFood();
    } else {
      this.snake.pop();
    }
  }

  stats() {
    return [
      ["分数", this.score],
      ["长度", this.snake.length],
      ["等级", this.level]
    ];
  }

  draw(renderCtx, width, height) {
    drawCabinetBackground(renderCtx, width, height, "snake");
    const cell = Math.floor(Math.min((width - 36) / this.cols, (height - 52) / this.rows));
    const boardWidth = cell * this.cols;
    const boardHeight = cell * this.rows;
    const offsetX = Math.floor((width - boardWidth) / 2);
    const offsetY = Math.floor((height - boardHeight) / 2);

    renderCtx.fillStyle = "rgba(0,0,0,0.28)";
    renderCtx.fillRect(offsetX - 8, offsetY - 8, boardWidth + 16, boardHeight + 16);

    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.cols; x += 1) {
        renderCtx.fillStyle = (x + y) % 2 === 0 ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.018)";
        renderCtx.fillRect(offsetX + x * cell, offsetY + y * cell, cell, cell);
      }
    }

    renderCtx.fillStyle = palette.coral;
    renderCtx.fillRect(offsetX + this.food.x * cell + 3, offsetY + this.food.y * cell + 3, cell - 6, cell - 6);

    this.snake.forEach((part, index) => {
      renderCtx.fillStyle = index === 0 ? palette.gold : palette.green;
      renderCtx.fillRect(offsetX + part.x * cell + 2, offsetY + part.y * cell + 2, cell - 4, cell - 4);
      if (index === 0) {
        renderCtx.fillStyle = "rgba(0,0,0,0.45)";
        renderCtx.fillRect(offsetX + part.x * cell + cell * 0.35, offsetY + part.y * cell + cell * 0.35, cell * 0.3, cell * 0.3);
      }
    });
  }
}

class BreakoutGame {
  constructor() {
    this.pressed = new Set();
    this.reset();
  }

  reset() {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.paused = false;
    this.over = false;
    this.slow = false;
    this.paddle = { x: 180, y: 500, width: 86, height: 12, speed: 280 };
    this.ball = { x: 180, y: 470, vx: 0, vy: -250, radius: 7, stuck: true };
    this.particles = [];
    this.makeBricks();
  }

  makeBricks() {
    const rows = Math.min(7, 4 + this.level);
    const colors = [palette.coral, palette.gold, palette.green, palette.cyan, palette.violet, palette.orange, palette.blue];
    this.bricks = [];
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        this.bricks.push({
          col: x,
          row: y,
          hp: y >= 4 ? 2 : 1,
          maxHp: y >= 4 ? 2 : 1,
          color: colors[y % colors.length],
          alive: true
        });
      }
    }
  }

  togglePause() {
    toggleStandardPause(this);
  }

  resize(width, height) {
    this.paddle.y = height - 38;
    this.paddle.x = clamp(this.paddle.x, this.paddle.width / 2 + 8, width - this.paddle.width / 2 - 8);
    if (this.ball.stuck) {
      this.ball.x = this.paddle.x;
      this.ball.y = this.paddle.y - 18;
    }
  }

  launch() {
    if (!this.ball.stuck) return;
    this.ball.stuck = false;
    this.ball.vx = random(-105, 105);
    this.ball.vy = -270 - this.level * 16;
  }

  action(action, isPressed) {
    if (this.over && isPressed) {
      this.reset();
      hideOverlay();
      return;
    }
    if (action === "rotate" || action === "drop") {
      if (isPressed && !this.paused) this.launch();
      return;
    }
    if (action === "down") {
      this.slow = isPressed;
      return;
    }
    if (isPressed) this.pressed.add(action);
    else this.pressed.delete(action);
  }

  key(key, isPressed = true) {
    const map = {
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
      ArrowDown: "down",
      KeyS: "down",
      ArrowUp: "rotate",
      Space: "drop"
    };
    if (map[key]) this.action(map[key], isPressed);
  }

  pointer(type, point) {
    if (this.paused || this.over || !point) return;
    if (type === "start") this.launch();
    this.paddle.x = clamp(point.x, this.paddle.width / 2 + 8, point.width - this.paddle.width / 2 - 8);
  }

  update(dt, width, height) {
    if (this.paused || this.over) return;
    this.resize(width, height);
    const paddleSpeed = this.paddle.speed * dt * (this.slow ? 0.48 : 1);
    if (this.pressed.has("left")) this.paddle.x -= paddleSpeed;
    if (this.pressed.has("right")) this.paddle.x += paddleSpeed;
    this.paddle.x = clamp(this.paddle.x, this.paddle.width / 2 + 8, width - this.paddle.width / 2 - 8);

    if (this.ball.stuck) {
      this.ball.x = this.paddle.x;
      this.ball.y = this.paddle.y - 18;
    } else {
      this.ball.x += this.ball.vx * dt;
      this.ball.y += this.ball.vy * dt;
      this.collideWorld(width, height);
      this.collideBricks(width);
    }

    this.particles.forEach((particle) => {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.life -= dt;
      particle.size *= 0.985;
    });
    this.particles = this.particles.filter((particle) => particle.life > 0 && particle.size > 0.7);

    if (this.bricks.every((brick) => !brick.alive)) {
      this.level += 1;
      this.makeBricks();
      this.ball.stuck = true;
      this.ball.vx = 0;
      this.ball.vy = -280 - this.level * 18;
    }
  }

  brickMetrics(width) {
    const gap = 5;
    const cols = 7;
    const brickWidth = (width - 36 - gap * (cols - 1)) / cols;
    return { gap, brickWidth, brickHeight: 18, offsetX: 18, offsetY: 54 };
  }

  collideWorld(width, height) {
    const ball = this.ball;
    if (ball.x - ball.radius <= 8 || ball.x + ball.radius >= width - 8) {
      ball.vx *= -1;
      ball.x = clamp(ball.x, ball.radius + 8, width - ball.radius - 8);
    }
    if (ball.y - ball.radius <= 8) {
      ball.vy = Math.abs(ball.vy);
      ball.y = ball.radius + 8;
    }
    const paddleTop = this.paddle.y - this.paddle.height / 2;
    const withinPaddle = ball.x >= this.paddle.x - this.paddle.width / 2 && ball.x <= this.paddle.x + this.paddle.width / 2;
    if (ball.vy > 0 && ball.y + ball.radius >= paddleTop && ball.y - ball.radius <= this.paddle.y + this.paddle.height && withinPaddle) {
      const impact = (ball.x - this.paddle.x) / (this.paddle.width / 2);
      ball.vx = impact * 245;
      ball.vy = -Math.abs(ball.vy) - 8;
      ball.y = paddleTop - ball.radius - 1;
    }
    if (ball.y > height + 24) {
      this.lives -= 1;
      if (this.lives <= 0) {
        finishGame(this, "游戏结束", `分数 ${this.score}`, "再来");
      } else {
        ball.stuck = true;
        ball.vx = 0;
        ball.vy = -270 - this.level * 16;
      }
    }
  }

  collideBricks(width) {
    const ball = this.ball;
    const metrics = this.brickMetrics(width);
    for (const brick of this.bricks) {
      if (!brick.alive) continue;
      const x = metrics.offsetX + brick.col * (metrics.brickWidth + metrics.gap);
      const y = metrics.offsetY + brick.row * (metrics.brickHeight + metrics.gap);
      const overlaps = ball.x + ball.radius > x &&
        ball.x - ball.radius < x + metrics.brickWidth &&
        ball.y + ball.radius > y &&
        ball.y - ball.radius < y + metrics.brickHeight;
      if (!overlaps) continue;
      brick.hp -= 1;
      ball.vy *= -1;
      this.particles.push(...burst(ball.x, ball.y, brick.color, 6));
      if (brick.hp <= 0) {
        brick.alive = false;
        this.score += 50 * this.level;
        this.particles.push(...burst(x + metrics.brickWidth / 2, y + metrics.brickHeight / 2, brick.color, 8));
      }
      break;
    }
  }

  stats() {
    return [
      ["分数", this.score],
      ["生命", this.lives],
      ["关卡", this.level]
    ];
  }

  draw(renderCtx, width, height) {
    drawCabinetBackground(renderCtx, width, height, "breakout");
    const metrics = this.brickMetrics(width);
    for (const brick of this.bricks) {
      if (!brick.alive) continue;
      const x = metrics.offsetX + brick.col * (metrics.brickWidth + metrics.gap);
      const y = metrics.offsetY + brick.row * (metrics.brickHeight + metrics.gap);
      renderCtx.fillStyle = brick.color;
      renderCtx.globalAlpha = brick.hp / brick.maxHp * 0.55 + 0.45;
      renderCtx.fillRect(x, y, metrics.brickWidth, metrics.brickHeight);
      renderCtx.globalAlpha = 1;
      renderCtx.fillStyle = "rgba(255,255,255,0.24)";
      renderCtx.fillRect(x + 3, y + 3, metrics.brickWidth - 6, 3);
    }

    renderCtx.fillStyle = palette.ink;
    renderCtx.fillRect(this.paddle.x - this.paddle.width / 2, this.paddle.y - this.paddle.height / 2, this.paddle.width, this.paddle.height);
    renderCtx.fillStyle = palette.cyan;
    renderCtx.fillRect(this.paddle.x - this.paddle.width / 4, this.paddle.y - this.paddle.height / 2, this.paddle.width / 2, this.paddle.height);

    renderCtx.fillStyle = palette.gold;
    renderCtx.beginPath();
    renderCtx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    renderCtx.fill();

    for (const particle of this.particles) {
      renderCtx.globalAlpha = clamp(particle.life, 0, 1);
      renderCtx.fillStyle = particle.color;
      renderCtx.fillRect(particle.x, particle.y, particle.size, particle.size);
      renderCtx.globalAlpha = 1;
    }
  }
}

class MergeGame {
  constructor() {
    this.size = 4;
    this.animationDuration = 0.16;
    this.reset();
  }

  reset() {
    this.grid = Array(this.size * this.size).fill(0);
    this.score = 0;
    this.moves = 0;
    this.paused = false;
    this.over = false;
    this.animations = [];
    this.animationTime = 0;
    this.newTileIndex = null;
    this.newTilePulse = 0;
    this.dragStart = null;
    this.addTile(false);
    this.addTile(false);
  }

  togglePause() {
    toggleStandardPause(this);
  }

  addTile(markAsNew = true) {
    const empty = this.grid.map((value, index) => value === 0 ? index : -1).filter((index) => index >= 0);
    if (empty.length === 0) return -1;
    const index = empty[Math.floor(Math.random() * empty.length)];
    this.grid[index] = Math.random() < 0.9 ? 2 : 4;
    this.newTileIndex = markAsNew ? index : null;
    this.newTilePulse = 0;
    return index;
  }

  action(action, isPressed) {
    if (this.over && isPressed) {
      this.reset();
      hideOverlay();
      return;
    }
    if (!isPressed || this.paused || this.animations.length) return;
    const direction = directionByAction[action];
    if (direction) this.move(direction.x, direction.y);
  }

  key(key, isPressed = true) {
    const map = {
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
      ArrowUp: "rotate",
      KeyW: "rotate",
      ArrowDown: "down",
      KeyS: "down",
      Space: "drop"
    };
    if (map[key]) this.action(map[key], isPressed);
  }

  pointer(type, point) {
    if (this.paused || this.over || !point || this.animations.length) return;
    if (type === "start") {
      this.dragStart = { x: point.x, y: point.y };
      return;
    }
    if (type !== "end" || !this.dragStart) return;
    const dx = point.x - this.dragStart.x;
    const dy = point.y - this.dragStart.y;
    this.dragStart = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      this.move(dx > 0 ? 1 : -1, 0);
    } else {
      this.move(0, dy > 0 ? 1 : -1);
    }
  }

  move(dx, dy) {
    if (this.animations.length) return;
    const before = this.grid.join(",");
    const next = Array(this.size * this.size).fill(0);
    const animations = [];
    let scoreDelta = 0;
    for (let line = 0; line < this.size; line += 1) {
      const cells = [];
      for (let step = 0; step < this.size; step += 1) {
        const x = dx > 0 ? this.size - 1 - step : dx < 0 ? step : line;
        const y = dy > 0 ? this.size - 1 - step : dy < 0 ? step : line;
        const index = y * this.size + x;
        cells.push({ x, y, index, value: this.grid[index] });
      }
      const resolved = this.resolveLine(cells);
      scoreDelta += resolved.scoreDelta;
      for (const tile of resolved.tiles) {
        next[tile.to.index] = tile.value;
        if (tile.merged) {
          for (const source of tile.sources) {
            animations.push({
              from: source.index,
              to: tile.to.index,
              value: source.value,
              merged: true
            });
          }
        } else {
          const [source] = tile.sources;
          if (source.index !== tile.to.index) {
            animations.push({
              from: source.index,
              to: tile.to.index,
              value: source.value,
              merged: false
            });
          }
        }
      }
    }
    this.grid = next;
    if (this.grid.join(",") !== before) {
      this.moves += 1;
      this.score += scoreDelta;
      this.addTile(true);
      this.animations = animations;
      this.animationTime = 0;
      if (!this.canMove()) finishGame(this, "游戏结束", `分数 ${this.score}`, "再来");
    }
  }

  resolveLine(cells) {
    const compact = cells.filter((cell) => cell.value);
    const tiles = [];
    let scoreDelta = 0;
    for (let i = 0; i < compact.length; i += 1) {
      const target = cells[tiles.length];
      if (compact[i + 1] && compact[i].value === compact[i + 1].value) {
        const value = compact[i].value * 2;
        tiles.push({
          value,
          to: target,
          sources: [compact[i], compact[i + 1]],
          merged: true
        });
        scoreDelta += value;
        i += 1;
      } else {
        tiles.push({
          value: compact[i].value,
          to: target,
          sources: [compact[i]],
          merged: false
        });
      }
    }
    return { tiles, scoreDelta };
  }

  update(dt) {
    if (this.paused || this.over) return;
    if (this.animations.length) {
      this.animationTime += dt;
      if (this.animationTime >= this.animationDuration) {
        this.animations = [];
        this.animationTime = 0;
        this.newTilePulse = this.newTileIndex === null ? 0 : 0.14;
      }
    } else if (this.newTilePulse > 0) {
      this.newTilePulse = Math.max(0, this.newTilePulse - dt);
    }
  }

  canMove() {
    if (this.grid.some((value) => value === 0)) return true;
    for (let y = 0; y < this.size; y += 1) {
      for (let x = 0; x < this.size; x += 1) {
        const value = this.grid[y * this.size + x];
        if (x < this.size - 1 && this.grid[y * this.size + x + 1] === value) return true;
        if (y < this.size - 1 && this.grid[(y + 1) * this.size + x] === value) return true;
      }
    }
    return false;
  }

  stats() {
    return [
      ["分数", this.score],
      ["最大", Math.max(...this.grid)],
      ["步数", this.moves]
    ];
  }

  tileColor(value) {
    const colors = {
      0: "rgba(245,244,235,0.06)",
      2: "#3b4b45",
      4: "#4f5f4d",
      8: palette.green,
      16: palette.cyan,
      32: palette.gold,
      64: palette.orange,
      128: palette.coral,
      256: palette.violet,
      512: palette.blue,
      1024: "#d8ff5f",
      2048: "#fff1a8"
    };
    return colors[value] || "#ffffff";
  }

  tileMetrics(width, height) {
    const gap = 8;
    const board = Math.floor(Math.min(width - 38, height - 96));
    const cell = (board - gap * (this.size + 1)) / this.size;
    return {
      gap,
      board,
      cell,
      offsetX: Math.floor((width - board) / 2),
      offsetY: Math.floor((height - board) / 2)
    };
  }

  tileRect(index, metrics) {
    const x = index % this.size;
    const y = Math.floor(index / this.size);
    return {
      x: metrics.offsetX + metrics.gap + x * (metrics.cell + metrics.gap),
      y: metrics.offsetY + metrics.gap + y * (metrics.cell + metrics.gap)
    };
  }

  drawTile(renderCtx, value, x, y, cell, scale = 1, alpha = 1) {
    const centerX = x + cell / 2;
    const centerY = y + cell / 2;
    const scaled = cell * scale;
    renderCtx.save();
    renderCtx.globalAlpha = alpha;
    renderCtx.translate(centerX, centerY);
    renderCtx.fillStyle = this.tileColor(value);
    renderCtx.fillRect(-scaled / 2, -scaled / 2, scaled, scaled);
    renderCtx.fillStyle = value <= 4 ? palette.ink : palette.dark;
    renderCtx.font = `${value >= 1024 ? 23 : 30}px 'DIN Alternate', monospace`;
    renderCtx.textAlign = "center";
    renderCtx.textBaseline = "middle";
    renderCtx.fillText(String(value), 0, 1);
    renderCtx.restore();
  }

  draw(renderCtx, width, height) {
    drawCabinetBackground(renderCtx, width, height, "merge");
    const metrics = this.tileMetrics(width, height);
    const progress = this.animations.length
      ? clamp(this.animationTime / this.animationDuration, 0, 1)
      : 1;
    const eased = easeOutCubic(progress);
    const animatedTargets = new Set(this.animations.map((animation) => animation.to));

    renderCtx.fillStyle = "rgba(0,0,0,0.28)";
    renderCtx.fillRect(metrics.offsetX, metrics.offsetY, metrics.board, metrics.board);

    for (let y = 0; y < this.size; y += 1) {
      for (let x = 0; x < this.size; x += 1) {
        const value = this.grid[y * this.size + x];
        const index = y * this.size + x;
        const tile = this.tileRect(index, metrics);
        renderCtx.fillStyle = "rgba(245,244,235,0.06)";
        renderCtx.fillRect(tile.x, tile.y, metrics.cell, metrics.cell);
        if (!value || animatedTargets.has(index)) continue;
        let scale = 1;
        if (index === this.newTileIndex) {
          if (this.animations.length) {
            scale = 0;
          } else if (this.newTilePulse > 0) {
            const pulseProgress = 1 - this.newTilePulse / 0.14;
            scale = 0.74 + clamp(easeOutBack(pulseProgress), 0, 1.18) * 0.26;
          }
        }
        this.drawTile(renderCtx, value, tile.x, tile.y, metrics.cell, scale);
      }
    }
    for (const animation of this.animations) {
      const from = this.tileRect(animation.from, metrics);
      const to = this.tileRect(animation.to, metrics);
      const x = from.x + (to.x - from.x) * eased;
      const y = from.y + (to.y - from.y) * eased;
      this.drawTile(renderCtx, animation.value, x, y, metrics.cell, animation.merged ? 0.98 : 1, 0.96);
    }
    renderCtx.textAlign = "start";
    renderCtx.textBaseline = "alphabetic";
  }
}

class FlappyGame {
  constructor() {
    this.reset();
  }

  reset() {
    this.score = 0;
    this.speed = 122;
    this.spawnTimer = 0;
    this.time = 0;
    this.started = false;
    this.paused = false;
    this.over = false;
    this.player = { x: 95, y: 260, vy: 0, radius: 13 };
    this.pipes = [];
    this.particles = [];
  }

  togglePause() {
    toggleStandardPause(this);
  }

  flap(force = -310) {
    if (this.over) {
      this.reset();
      hideOverlay();
      return;
    }
    if (this.paused) return;
    this.started = true;
    this.player.vy = force;
    this.particles.push(...burst(this.player.x - 12, this.player.y + 8, palette.cyan, 4));
  }

  action(action, isPressed) {
    if (!isPressed) return;
    if (action === "down") {
      if (!this.started) this.flap(-240);
      else this.player.vy += 125;
      return;
    }
    this.flap(action === "drop" ? -330 : -300);
  }

  key(key, isPressed = true) {
    if (!isPressed) return;
    const map = {
      ArrowUp: "rotate",
      KeyW: "rotate",
      ArrowDown: "down",
      KeyS: "down",
      Space: "drop",
      ArrowLeft: "left",
      ArrowRight: "right"
    };
    if (map[key]) this.action(map[key], true);
  }

  pointer(type) {
    if (type === "start") this.flap(-315);
  }

  update(dt, width, height) {
    if (this.paused || this.over) return;
    this.time += dt;
    this.player.x = Math.max(82, width * 0.28);
    if (!this.started) {
      this.player.y = height * 0.48 + Math.sin(this.time * 4) * 8;
      return;
    }
    this.speed = 122 + Math.min(62, this.score * 2.5);
    this.player.vy += 760 * dt;
    this.player.y += this.player.vy * dt;

    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      const gap = Math.max(108, 144 - this.score * 1.2);
      this.pipes.push({
        x: width + 34,
        width: 54,
        gapY: random(96, height - 138),
        gap,
        passed: false
      });
      this.spawnTimer = 1.45;
    }

    for (const pipe of this.pipes) {
      pipe.x -= this.speed * dt;
      if (!pipe.passed && pipe.x + pipe.width < this.player.x) {
        pipe.passed = true;
        this.score += 1;
      }
    }
    this.pipes = this.pipes.filter((pipe) => pipe.x + pipe.width > -24);

    this.particles.forEach((particle) => {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.life -= dt;
      particle.size *= 0.98;
    });
    this.particles = this.particles.filter((particle) => particle.life > 0);

    if (this.player.y - this.player.radius < 0 || this.player.y + this.player.radius > height) {
      finishGame(this, "游戏结束", `分数 ${this.score}`, "再来");
      return;
    }

    for (const pipe of this.pipes) {
      const inX = this.player.x + this.player.radius > pipe.x && this.player.x - this.player.radius < pipe.x + pipe.width;
      const topBottom = pipe.gapY - pipe.gap / 2;
      const bottomTop = pipe.gapY + pipe.gap / 2;
      if (inX && (this.player.y - this.player.radius < topBottom || this.player.y + this.player.radius > bottomTop)) {
        finishGame(this, "游戏结束", `分数 ${this.score}`, "再来");
        return;
      }
    }
  }

  stats() {
    return [
      ["分数", this.score],
      ["速度", Math.round(this.speed)],
      ["状态", this.started ? "飞行" : "待机"]
    ];
  }

  draw(renderCtx, width, height) {
    drawCabinetBackground(renderCtx, width, height, "flappy");
    renderCtx.fillStyle = "rgba(66,215,255,0.08)";
    for (let y = 40; y < height; y += 46) renderCtx.fillRect(0, y, width, 2);

    for (const pipe of this.pipes) {
      const topBottom = pipe.gapY - pipe.gap / 2;
      const bottomTop = pipe.gapY + pipe.gap / 2;
      renderCtx.fillStyle = palette.green;
      renderCtx.fillRect(pipe.x, 0, pipe.width, topBottom);
      renderCtx.fillRect(pipe.x, bottomTop, pipe.width, height - bottomTop);
      renderCtx.fillStyle = "rgba(0,0,0,0.28)";
      renderCtx.fillRect(pipe.x + 7, 0, 8, topBottom);
      renderCtx.fillRect(pipe.x + 7, bottomTop, 8, height - bottomTop);
      renderCtx.fillStyle = palette.gold;
      renderCtx.fillRect(pipe.x - 4, topBottom - 12, pipe.width + 8, 12);
      renderCtx.fillRect(pipe.x - 4, bottomTop, pipe.width + 8, 12);
    }

    renderCtx.save();
    renderCtx.translate(this.player.x, this.player.y);
    renderCtx.rotate(clamp(this.player.vy / 520, -0.65, 0.75));
    renderCtx.fillStyle = palette.gold;
    renderCtx.fillRect(-13, -9, 24, 18);
    renderCtx.fillStyle = palette.coral;
    renderCtx.fillRect(-18, -3, 11, 7);
    renderCtx.fillStyle = palette.ink;
    renderCtx.fillRect(4, -5, 4, 4);
    renderCtx.restore();

    for (const particle of this.particles) {
      renderCtx.globalAlpha = clamp(particle.life, 0, 1);
      renderCtx.fillStyle = particle.color;
      renderCtx.fillRect(particle.x, particle.y, particle.size, particle.size);
      renderCtx.globalAlpha = 1;
    }
  }
}

class MemoryGame {
  constructor() {
    this.cols = 4;
    this.rows = 4;
    this.reset();
  }

  reset() {
    const values = [...Array(8).keys(), ...Array(8).keys()].sort(() => Math.random() - 0.5);
    this.cards = values.map((value) => ({ value, flipped: false, matched: false }));
    this.selected = 0;
    this.first = null;
    this.second = null;
    this.lockTimer = 0;
    this.moves = 0;
    this.matches = 0;
    this.time = 0;
    this.paused = false;
    this.over = false;
  }

  togglePause() {
    toggleStandardPause(this);
  }

  action(action, isPressed) {
    if (this.over && isPressed) {
      this.reset();
      hideOverlay();
      return;
    }
    if (!isPressed || this.paused) return;
    if (action === "drop") {
      this.flip(this.selected);
      return;
    }
    const direction = directionByAction[action];
    if (direction) this.moveSelection(direction.x, direction.y);
  }

  key(key, isPressed = true) {
    const map = {
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
      ArrowUp: "rotate",
      KeyW: "rotate",
      ArrowDown: "down",
      KeyS: "down",
      Enter: "drop",
      Space: "drop"
    };
    if (map[key]) this.action(map[key], isPressed);
  }

  pointer(type, point) {
    if (type !== "start" || this.paused || this.over || !point) return;
    const index = this.indexFromPoint(point);
    if (index >= 0) {
      this.selected = index;
      this.flip(index);
    }
  }

  moveSelection(dx, dy) {
    const x = (this.selected % this.cols + dx + this.cols) % this.cols;
    const y = (Math.floor(this.selected / this.cols) + dy + this.rows) % this.rows;
    this.selected = y * this.cols + x;
  }

  flip(index) {
    if (this.lockTimer > 0) return;
    const card = this.cards[index];
    if (!card || card.flipped || card.matched) return;
    card.flipped = true;
    if (this.first === null) {
      this.first = index;
      return;
    }
    this.second = index;
    this.moves += 1;
    const firstCard = this.cards[this.first];
    if (firstCard.value === card.value) {
      firstCard.matched = true;
      card.matched = true;
      this.matches += 1;
      this.first = null;
      this.second = null;
      if (this.matches === 8) finishGame(this, "全部配对", `步数 ${this.moves}`, "再来");
    } else {
      this.lockTimer = 0.72;
    }
  }

  update(dt) {
    if (this.paused || this.over) return;
    this.time += dt;
    if (this.lockTimer > 0) {
      this.lockTimer -= dt;
      if (this.lockTimer <= 0 && this.first !== null && this.second !== null) {
        this.cards[this.first].flipped = false;
        this.cards[this.second].flipped = false;
        this.first = null;
        this.second = null;
      }
    }
  }

  cardMetrics(width, height) {
    const gap = 8;
    const board = Math.floor(Math.min(width - 38, height - 104));
    const cell = (board - gap * (this.cols + 1)) / this.cols;
    return {
      gap,
      board,
      cell,
      offsetX: Math.floor((width - board) / 2),
      offsetY: Math.floor((height - board) / 2)
    };
  }

  indexFromPoint(point) {
    const metrics = this.cardMetrics(point.width, point.height);
    const x = Math.floor((point.x - metrics.offsetX - metrics.gap) / (metrics.cell + metrics.gap));
    const y = Math.floor((point.y - metrics.offsetY - metrics.gap) / (metrics.cell + metrics.gap));
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return -1;
    const localX = point.x - metrics.offsetX - metrics.gap - x * (metrics.cell + metrics.gap);
    const localY = point.y - metrics.offsetY - metrics.gap - y * (metrics.cell + metrics.gap);
    if (localX > metrics.cell || localY > metrics.cell) return -1;
    return y * this.cols + x;
  }

  stats() {
    return [
      ["步数", this.moves],
      ["配对", `${this.matches}/8`],
      ["时间", Math.floor(this.time)]
    ];
  }

  draw(renderCtx, width, height) {
    drawCabinetBackground(renderCtx, width, height, "memory");
    const metrics = this.cardMetrics(width, height);
    const colors = [palette.cyan, palette.coral, palette.gold, palette.green, palette.violet, palette.orange, palette.blue, "#d8ff5f"];
    renderCtx.fillStyle = "rgba(0,0,0,0.25)";
    renderCtx.fillRect(metrics.offsetX, metrics.offsetY, metrics.board, metrics.board);
    for (let index = 0; index < this.cards.length; index += 1) {
      const x = index % this.cols;
      const y = Math.floor(index / this.cols);
      const card = this.cards[index];
      const cardX = metrics.offsetX + metrics.gap + x * (metrics.cell + metrics.gap);
      const cardY = metrics.offsetY + metrics.gap + y * (metrics.cell + metrics.gap);
      renderCtx.fillStyle = card.flipped || card.matched ? colors[card.value] : "rgba(245,244,235,0.1)";
      renderCtx.fillRect(cardX, cardY, metrics.cell, metrics.cell);
      renderCtx.strokeStyle = index === this.selected ? palette.ink : "rgba(255,255,255,0.12)";
      renderCtx.lineWidth = index === this.selected ? 3 : 1;
      renderCtx.strokeRect(cardX + 1.5, cardY + 1.5, metrics.cell - 3, metrics.cell - 3);
      if (card.flipped || card.matched) {
        renderCtx.fillStyle = palette.dark;
        renderCtx.font = "32px 'DIN Alternate', monospace";
        renderCtx.textAlign = "center";
        renderCtx.textBaseline = "middle";
        renderCtx.fillText(String(card.value + 1), cardX + metrics.cell / 2, cardY + metrics.cell / 2 + 2);
      }
    }
    renderCtx.textAlign = "start";
    renderCtx.textBaseline = "alphabetic";
    renderCtx.lineWidth = 1;
  }
}

class MinesGame {
  constructor() {
    this.cols = 8;
    this.rows = 10;
    this.mineCount = 12;
    this.reset();
  }

  reset() {
    this.grid = Array.from({ length: this.cols * this.rows }, () => ({
      mine: false,
      count: 0,
      revealed: false,
      flagged: false
    }));
    this.generated = false;
    this.selected = 0;
    this.revealed = 0;
    this.flags = 0;
    this.time = 0;
    this.paused = false;
    this.over = false;
  }

  togglePause() {
    toggleStandardPause(this);
  }

  action(action, isPressed) {
    if (this.over && isPressed) {
      this.reset();
      hideOverlay();
      return;
    }
    if (!isPressed || this.paused) return;
    if (action === "rotate") {
      this.toggleFlag(this.selected);
      return;
    }
    if (action === "drop") {
      this.reveal(this.selected);
      return;
    }
    const direction = directionByAction[action];
    if (direction) this.moveSelection(direction.x, direction.y);
  }

  key(key, isPressed = true) {
    const map = {
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
      ArrowUp: "rotate",
      KeyW: "rotate",
      ArrowDown: "down",
      KeyS: "down",
      Enter: "drop",
      Space: "drop"
    };
    if (map[key]) this.action(map[key], isPressed);
  }

  pointer(type, point) {
    if (type !== "start" || this.paused || this.over || !point) return;
    const index = this.indexFromPoint(point);
    if (index >= 0) {
      this.selected = index;
      this.reveal(index);
    }
  }

  moveSelection(dx, dy) {
    const x = (this.selected % this.cols + dx + this.cols) % this.cols;
    const y = (Math.floor(this.selected / this.cols) + dy + this.rows) % this.rows;
    this.selected = y * this.cols + x;
  }

  neighbors(index) {
    const x = index % this.cols;
    const y = Math.floor(index / this.cols);
    const result = [];
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) result.push(ny * this.cols + nx);
      }
    }
    return result;
  }

  generate(safeIndex) {
    const forbidden = new Set([safeIndex, ...this.neighbors(safeIndex)]);
    let placed = 0;
    while (placed < this.mineCount) {
      const index = Math.floor(Math.random() * this.grid.length);
      if (forbidden.has(index) || this.grid[index].mine) continue;
      this.grid[index].mine = true;
      placed += 1;
    }
    for (let index = 0; index < this.grid.length; index += 1) {
      if (this.grid[index].mine) continue;
      this.grid[index].count = this.neighbors(index).filter((neighbor) => this.grid[neighbor].mine).length;
    }
    this.generated = true;
  }

  toggleFlag(index) {
    const cell = this.grid[index];
    if (!cell || cell.revealed) return;
    cell.flagged = !cell.flagged;
    this.flags += cell.flagged ? 1 : -1;
  }

  reveal(index) {
    const cell = this.grid[index];
    if (!cell || cell.flagged || cell.revealed) return;
    if (!this.generated) this.generate(index);
    if (cell.mine) {
      this.grid.forEach((item) => {
        if (item.mine) item.revealed = true;
      });
      finishGame(this, "踩到地雷", `坚持 ${Math.floor(this.time)} 秒`, "再来");
      return;
    }
    const queue = [index];
    while (queue.length) {
      const current = queue.shift();
      const currentCell = this.grid[current];
      if (currentCell.revealed || currentCell.flagged) continue;
      currentCell.revealed = true;
      this.revealed += 1;
      if (currentCell.count === 0) {
        for (const neighbor of this.neighbors(current)) {
          if (!this.grid[neighbor].revealed && !this.grid[neighbor].mine) queue.push(neighbor);
        }
      }
    }
    if (this.revealed === this.grid.length - this.mineCount) {
      finishGame(this, "清除完成", `用时 ${Math.floor(this.time)} 秒`, "再来");
    }
  }

  update(dt) {
    if (!this.paused && !this.over) this.time += dt;
  }

  cellMetrics(width, height) {
    const gap = 4;
    const cell = Math.floor(Math.min((width - 34 - gap * (this.cols - 1)) / this.cols, (height - 80 - gap * (this.rows - 1)) / this.rows));
    const boardWidth = cell * this.cols + gap * (this.cols - 1);
    const boardHeight = cell * this.rows + gap * (this.rows - 1);
    return {
      gap,
      cell,
      offsetX: Math.floor((width - boardWidth) / 2),
      offsetY: Math.floor((height - boardHeight) / 2)
    };
  }

  indexFromPoint(point) {
    const metrics = this.cellMetrics(point.width, point.height);
    const x = Math.floor((point.x - metrics.offsetX) / (metrics.cell + metrics.gap));
    const y = Math.floor((point.y - metrics.offsetY) / (metrics.cell + metrics.gap));
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return -1;
    const localX = point.x - metrics.offsetX - x * (metrics.cell + metrics.gap);
    const localY = point.y - metrics.offsetY - y * (metrics.cell + metrics.gap);
    if (localX > metrics.cell || localY > metrics.cell) return -1;
    return y * this.cols + x;
  }

  stats() {
    return [
      ["地雷", this.mineCount],
      ["标记", this.flags],
      ["时间", Math.floor(this.time)]
    ];
  }

  draw(renderCtx, width, height) {
    drawCabinetBackground(renderCtx, width, height, "mines");
    const metrics = this.cellMetrics(width, height);
    const numberColors = [palette.ink, palette.cyan, palette.green, palette.gold, palette.coral, palette.violet, palette.orange, palette.blue, "#d8ff5f"];
    for (let index = 0; index < this.grid.length; index += 1) {
      const x = index % this.cols;
      const y = Math.floor(index / this.cols);
      const cell = this.grid[index];
      const cellX = metrics.offsetX + x * (metrics.cell + metrics.gap);
      const cellY = metrics.offsetY + y * (metrics.cell + metrics.gap);
      renderCtx.fillStyle = cell.revealed ? "rgba(245,244,235,0.16)" : "rgba(245,244,235,0.07)";
      renderCtx.fillRect(cellX, cellY, metrics.cell, metrics.cell);
      renderCtx.strokeStyle = index === this.selected ? palette.ink : "rgba(255,255,255,0.1)";
      renderCtx.lineWidth = index === this.selected ? 2 : 1;
      renderCtx.strokeRect(cellX + 0.5, cellY + 0.5, metrics.cell - 1, metrics.cell - 1);
      if (cell.flagged && !cell.revealed) {
        renderCtx.fillStyle = palette.gold;
        renderCtx.font = "20px 'DIN Alternate', monospace";
        renderCtx.textAlign = "center";
        renderCtx.textBaseline = "middle";
        renderCtx.fillText("⚑", cellX + metrics.cell / 2, cellY + metrics.cell / 2 + 1);
      } else if (cell.revealed && cell.mine) {
        renderCtx.fillStyle = palette.coral;
        renderCtx.beginPath();
        renderCtx.arc(cellX + metrics.cell / 2, cellY + metrics.cell / 2, metrics.cell * 0.25, 0, Math.PI * 2);
        renderCtx.fill();
      } else if (cell.revealed && cell.count > 0) {
        renderCtx.fillStyle = numberColors[cell.count];
        renderCtx.font = "20px 'DIN Alternate', monospace";
        renderCtx.textAlign = "center";
        renderCtx.textBaseline = "middle";
        renderCtx.fillText(String(cell.count), cellX + metrics.cell / 2, cellY + metrics.cell / 2 + 1);
      }
    }
    renderCtx.textAlign = "start";
    renderCtx.textBaseline = "alphabetic";
    renderCtx.lineWidth = 1;
  }
}

class JumperGame {
  constructor() {
    this.pressed = new Set();
    this.reset();
  }

  reset() {
    this.score = 0;
    this.jumps = 0;
    this.time = 0;
    this.paused = false;
    this.over = false;
    this.fastFall = false;
    this.dash = false;
    this.pointerActive = false;
    this.needsSetup = true;
    this.player = { x: 180, y: 430, vx: 0, vy: -470, width: 24, height: 28 };
    this.platforms = [];
  }

  setup(width, height) {
    this.player.x = width / 2;
    this.player.y = height - 98;
    this.player.vy = -470;
    this.platforms = [{ x: width / 2 - 45, y: height - 54, width: 90, height: 12, color: palette.gold }];
    let y = height - 112;
    while (y > -70) {
      this.platforms.push(this.makePlatform(width, y));
      y -= random(46, 72);
    }
    this.needsSetup = false;
  }

  makePlatform(width, y) {
    const platformWidth = clamp(82 - this.score / 180, 54, 86);
    return {
      x: random(12, width - platformWidth - 12),
      y,
      width: platformWidth,
      height: 10,
      color: Math.random() < 0.18 ? palette.cyan : palette.green
    };
  }

  togglePause() {
    toggleStandardPause(this);
  }

  action(action, isPressed) {
    if (this.over && isPressed) {
      this.reset();
      hideOverlay();
      return;
    }
    if (action === "down") {
      this.fastFall = isPressed;
      return;
    }
    if (action === "drop") {
      this.dash = isPressed;
      return;
    }
    if (action === "rotate" && isPressed && !this.paused && this.player.vy > -180) {
      this.player.vy = -360;
      return;
    }
    if (isPressed) this.pressed.add(action);
    else this.pressed.delete(action);
  }

  key(key, isPressed = true) {
    const map = {
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
      ArrowUp: "rotate",
      KeyW: "rotate",
      ArrowDown: "down",
      KeyS: "down",
      Space: "drop"
    };
    if (map[key]) this.action(map[key], isPressed);
  }

  pointer(type, point) {
    if (this.paused || this.over) return;
    if (type === "start") this.pointerActive = true;
    if (type === "end") this.pointerActive = false;
    if (point && this.pointerActive) this.player.x = clamp(point.x, 12, point.width - 12);
  }

  update(dt, width, height) {
    if (this.needsSetup) this.setup(width, height);
    if (this.paused || this.over) return;
    this.time += dt;
    const moveSpeed = (this.dash ? 290 : 205) * dt;
    if (this.pressed.has("left")) this.player.x -= moveSpeed;
    if (this.pressed.has("right")) this.player.x += moveSpeed;
    if (this.player.x < -this.player.width) this.player.x = width + this.player.width;
    if (this.player.x > width + this.player.width) this.player.x = -this.player.width;

    const previousBottom = this.player.y + this.player.height / 2;
    this.player.vy += (this.fastFall ? 1120 : 820) * dt;
    this.player.y += this.player.vy * dt;
    const currentBottom = this.player.y + this.player.height / 2;

    if (this.player.vy > 0) {
      for (const platform of this.platforms) {
        const withinX = this.player.x + this.player.width / 2 > platform.x && this.player.x - this.player.width / 2 < platform.x + platform.width;
        if (withinX && previousBottom <= platform.y && currentBottom >= platform.y) {
          this.player.y = platform.y - this.player.height / 2;
          this.player.vy = platform.color === palette.cyan ? -620 : -500;
          this.jumps += 1;
          break;
        }
      }
    }

    const threshold = height * 0.38;
    if (this.player.y < threshold) {
      const shift = threshold - this.player.y;
      this.player.y = threshold;
      this.score += Math.floor(shift);
      this.platforms.forEach((platform) => {
        platform.y += shift;
      });
    }

    this.platforms = this.platforms.filter((platform) => platform.y < height + 30);
    let topY = Math.min(...this.platforms.map((platform) => platform.y));
    while (topY > -60) {
      topY -= random(46, 78);
      this.platforms.push(this.makePlatform(width, topY));
    }

    if (this.player.y > height + 36) finishGame(this, "游戏结束", `高度 ${this.score}`, "再来");
  }

  stats() {
    return [
      ["高度", this.score],
      ["弹跳", this.jumps],
      ["时间", Math.floor(this.time)]
    ];
  }

  draw(renderCtx, width, height) {
    drawCabinetBackground(renderCtx, width, height, "jumper");
    if (this.needsSetup) this.setup(width, height);
    for (const platform of this.platforms) {
      renderCtx.fillStyle = platform.color;
      renderCtx.fillRect(platform.x, platform.y, platform.width, platform.height);
      renderCtx.fillStyle = "rgba(255,255,255,0.22)";
      renderCtx.fillRect(platform.x + 3, platform.y + 2, platform.width - 6, 2);
    }
    renderCtx.save();
    renderCtx.translate(this.player.x, this.player.y);
    renderCtx.fillStyle = palette.gold;
    renderCtx.fillRect(-this.player.width / 2, -this.player.height / 2, this.player.width, this.player.height);
    renderCtx.fillStyle = palette.dark;
    renderCtx.fillRect(-7, -5, 4, 4);
    renderCtx.fillRect(4, -5, 4, 4);
    renderCtx.fillStyle = palette.coral;
    renderCtx.fillRect(-9, this.player.height / 2 - 2, 18, 8);
    renderCtx.restore();
  }
}

class MazeGame {
  constructor() {
    this.cols = 15;
    this.rows = 21;
    this.reset();
  }

  reset() {
    this.level = 1;
    this.steps = 0;
    this.time = 0;
    this.paused = false;
    this.over = false;
    this.generateMaze();
  }

  togglePause() {
    toggleStandardPause(this);
  }

  action(action, isPressed) {
    if (!isPressed || this.paused || this.over) return;
    const direction = directionByAction[action];
    if (direction) this.move(direction.x, direction.y);
  }

  key(key, isPressed = true) {
    const map = {
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
      ArrowUp: "rotate",
      KeyW: "rotate",
      ArrowDown: "down",
      KeyS: "down",
      Space: "drop"
    };
    if (map[key]) this.action(map[key], isPressed);
  }

  generateMaze() {
    this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(1));
    const carve = [{ x: 1, y: 1 }];
    this.grid[1][1] = 0;
    while (carve.length) {
      const current = carve[carve.length - 1];
      const neighbors = [
        { x: current.x + 2, y: current.y },
        { x: current.x - 2, y: current.y },
        { x: current.x, y: current.y + 2 },
        { x: current.x, y: current.y - 2 }
      ].filter((point) => point.x > 0 && point.x < this.cols - 1 && point.y > 0 && point.y < this.rows - 1 && this.grid[point.y][point.x] === 1);
      if (neighbors.length === 0) {
        carve.pop();
        continue;
      }
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      this.grid[(current.y + next.y) / 2][(current.x + next.x) / 2] = 0;
      this.grid[next.y][next.x] = 0;
      carve.push(next);
    }
    this.player = { x: 1, y: 1 };
    this.exit = { x: this.cols - 2, y: this.rows - 2 };
    this.grid[this.exit.y][this.exit.x] = 0;
  }

  move(dx, dy) {
    const x = this.player.x + dx;
    const y = this.player.y + dy;
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows || this.grid[y][x] === 1) return;
    this.player.x = x;
    this.player.y = y;
    this.steps += 1;
    if (x === this.exit.x && y === this.exit.y) {
      const lastSteps = this.steps;
      this.level += 1;
      this.steps = 0;
      this.generateMaze();
      this.paused = true;
      showOverlay(`第 ${this.level} 关`, `上一关 ${lastSteps} 步`, "继续");
    }
  }

  update(dt) {
    if (!this.paused && !this.over) this.time += dt;
  }

  stats() {
    return [
      ["关卡", this.level],
      ["步数", this.steps],
      ["时间", Math.floor(this.time)]
    ];
  }

  draw(renderCtx, width, height) {
    drawCabinetBackground(renderCtx, width, height, "maze");
    const cell = Math.floor(Math.min((width - 34) / this.cols, (height - 54) / this.rows));
    const boardWidth = cell * this.cols;
    const boardHeight = cell * this.rows;
    const offsetX = Math.floor((width - boardWidth) / 2);
    const offsetY = Math.floor((height - boardHeight) / 2);
    renderCtx.fillStyle = "rgba(0,0,0,0.35)";
    renderCtx.fillRect(offsetX - 8, offsetY - 8, boardWidth + 16, boardHeight + 16);
    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.cols; x += 1) {
        renderCtx.fillStyle = this.grid[y][x] === 1 ? "rgba(245,244,235,0.12)" : "rgba(0,0,0,0.1)";
        renderCtx.fillRect(offsetX + x * cell, offsetY + y * cell, cell, cell);
      }
    }
    renderCtx.fillStyle = palette.green;
    renderCtx.fillRect(offsetX + this.exit.x * cell + 3, offsetY + this.exit.y * cell + 3, cell - 6, cell - 6);
    renderCtx.fillStyle = palette.gold;
    renderCtx.fillRect(offsetX + this.player.x * cell + 2, offsetY + this.player.y * cell + 2, cell - 4, cell - 4);
  }
}

class PongGame {
  constructor() {
    this.pressed = new Set();
    this.reset();
  }

  reset() {
    this.playerScore = 0;
    this.cpuScore = 0;
    this.rally = 0;
    this.paused = false;
    this.over = false;
    this.slow = false;
    this.player = { x: 180, y: 500, width: 86, height: 12, speed: 315 };
    this.cpu = { x: 180, y: 42, width: 76, height: 12, speed: 210 };
    this.ball = { x: 180, y: 270, vx: 0, vy: 0, radius: 7, stuck: true, serveTo: -1 };
    this.particles = [];
  }

  togglePause() {
    toggleStandardPause(this);
  }

  resize(width, height) {
    this.player.y = height - 36;
    this.cpu.y = 36;
    this.player.x = clamp(this.player.x, this.player.width / 2 + 10, width - this.player.width / 2 - 10);
    this.cpu.x = clamp(this.cpu.x, this.cpu.width / 2 + 10, width - this.cpu.width / 2 - 10);
    if (this.ball.stuck) {
      this.ball.x = this.player.x;
      this.ball.y = this.player.y - 22;
    }
  }

  serve() {
    if (!this.ball.stuck) return;
    this.ball.stuck = false;
    this.ball.vx = random(-120, 120);
    this.ball.vy = 260 * this.ball.serveTo;
  }

  action(action, isPressed) {
    if (this.over && isPressed) {
      this.reset();
      hideOverlay();
      return;
    }
    if (action === "rotate" || action === "drop") {
      if (isPressed && !this.paused) this.serve();
      return;
    }
    if (action === "down") {
      this.slow = isPressed;
      return;
    }
    if (isPressed) this.pressed.add(action);
    else this.pressed.delete(action);
  }

  key(key, isPressed = true) {
    const map = {
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
      ArrowDown: "down",
      KeyS: "down",
      ArrowUp: "rotate",
      Space: "drop"
    };
    if (map[key]) this.action(map[key], isPressed);
  }

  pointer(type, point) {
    if (this.paused || this.over || !point) return;
    if (type === "start") this.serve();
    this.player.x = clamp(point.x, this.player.width / 2 + 10, point.width - this.player.width / 2 - 10);
  }

  update(dt, width, height) {
    if (this.paused || this.over) return;
    this.resize(width, height);
    const speed = this.player.speed * dt * (this.slow ? 0.5 : 1);
    if (this.pressed.has("left")) this.player.x -= speed;
    if (this.pressed.has("right")) this.player.x += speed;
    this.player.x = clamp(this.player.x, this.player.width / 2 + 10, width - this.player.width / 2 - 10);

    const cpuTarget = this.ball.stuck ? width / 2 : this.ball.x;
    const cpuDelta = clamp(cpuTarget - this.cpu.x, -this.cpu.speed * dt, this.cpu.speed * dt);
    this.cpu.x = clamp(this.cpu.x + cpuDelta, this.cpu.width / 2 + 10, width - this.cpu.width / 2 - 10);

    if (this.ball.stuck) {
      this.ball.x = this.player.x;
      this.ball.y = this.player.y - 22;
    } else {
      this.ball.x += this.ball.vx * dt;
      this.ball.y += this.ball.vy * dt;
      this.collide(width, height);
    }

    this.particles.forEach((particle) => {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.life -= dt;
      particle.size *= 0.985;
    });
    this.particles = this.particles.filter((particle) => particle.life > 0);
  }

  paddleCollision(paddle, topSide) {
    const ball = this.ball;
    const withinX = ball.x + ball.radius >= paddle.x - paddle.width / 2 && ball.x - ball.radius <= paddle.x + paddle.width / 2;
    const withinY = topSide
      ? ball.y - ball.radius <= paddle.y + paddle.height / 2 && ball.y > paddle.y
      : ball.y + ball.radius >= paddle.y - paddle.height / 2 && ball.y < paddle.y;
    if (!withinX || !withinY) return false;
    const impact = (ball.x - paddle.x) / (paddle.width / 2);
    const speed = Math.min(430, Math.hypot(ball.vx, ball.vy) + 14);
    ball.vx = impact * 245;
    ball.vy = (topSide ? 1 : -1) * Math.sqrt(Math.max(9000, speed * speed - ball.vx * ball.vx));
    ball.y = topSide ? paddle.y + paddle.height / 2 + ball.radius + 1 : paddle.y - paddle.height / 2 - ball.radius - 1;
    this.rally += 1;
    this.particles.push(...burst(ball.x, ball.y, topSide ? palette.coral : palette.cyan, 5));
    return true;
  }

  collide(width, height) {
    const ball = this.ball;
    if (ball.x - ball.radius < 8 || ball.x + ball.radius > width - 8) {
      ball.vx *= -1;
      ball.x = clamp(ball.x, ball.radius + 8, width - ball.radius - 8);
    }
    this.paddleCollision(this.cpu, true);
    this.paddleCollision(this.player, false);
    if (ball.y < -24) this.scorePoint("player", width, height);
    if (ball.y > height + 24) this.scorePoint("cpu", width, height);
  }

  scorePoint(winner, width, height) {
    if (winner === "player") this.playerScore += 1;
    else this.cpuScore += 1;
    if (this.playerScore >= 7 || this.cpuScore >= 7) {
      const won = this.playerScore > this.cpuScore;
      finishGame(this, won ? "胜利" : "游戏结束", `${this.playerScore}:${this.cpuScore}`, "再来");
      return;
    }
    this.rally = 0;
    this.ball = { x: width / 2, y: height / 2, vx: 0, vy: 0, radius: 7, stuck: true, serveTo: winner === "player" ? -1 : 1 };
  }

  stats() {
    return [
      ["玩家", this.playerScore],
      ["对手", this.cpuScore],
      ["回合", this.rally]
    ];
  }

  draw(renderCtx, width, height) {
    drawCabinetBackground(renderCtx, width, height, "pong");
    renderCtx.strokeStyle = "rgba(245,244,235,0.24)";
    renderCtx.setLineDash([8, 10]);
    renderCtx.beginPath();
    renderCtx.moveTo(16, height / 2);
    renderCtx.lineTo(width - 16, height / 2);
    renderCtx.stroke();
    renderCtx.setLineDash([]);

    renderCtx.fillStyle = palette.coral;
    renderCtx.fillRect(this.cpu.x - this.cpu.width / 2, this.cpu.y - this.cpu.height / 2, this.cpu.width, this.cpu.height);
    renderCtx.fillStyle = palette.cyan;
    renderCtx.fillRect(this.player.x - this.player.width / 2, this.player.y - this.player.height / 2, this.player.width, this.player.height);

    renderCtx.fillStyle = palette.gold;
    renderCtx.beginPath();
    renderCtx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    renderCtx.fill();

    for (const particle of this.particles) {
      renderCtx.globalAlpha = clamp(particle.life, 0, 1);
      renderCtx.fillStyle = particle.color;
      renderCtx.fillRect(particle.x, particle.y, particle.size, particle.size);
      renderCtx.globalAlpha = 1;
    }
  }
}

class InvadersGame {
  constructor() {
    this.pressed = new Set();
    this.reset();
  }

  reset() {
    this.score = 0;
    this.lives = 3;
    this.wave = 1;
    this.time = 0;
    this.fireCooldown = 0;
    this.enemyFireTimer = 1;
    this.paused = false;
    this.over = false;
    this.player = { x: 180, y: 500, width: 30, height: 18, speed: 230, invulnerable: 1 };
    this.bullets = [];
    this.enemyBullets = [];
    this.particles = [];
    this.createFleet();
  }

  createFleet() {
    this.fleet = [];
    const rows = Math.min(5, 3 + this.wave);
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        this.fleet.push({
          x: 48 + x * 42,
          y: 68 + y * 32,
          width: 24,
          height: 18,
          hp: y >= 3 ? 2 : 1,
          color: [palette.green, palette.cyan, palette.gold, palette.violet, palette.coral][y % 5],
          alive: true
        });
      }
    }
    this.fleetDir = 1;
    this.fleetSpeed = 24 + this.wave * 8;
  }

  togglePause() {
    toggleStandardPause(this);
  }

  resize(width, height) {
    this.player.y = height - 42;
    this.player.x = clamp(this.player.x, this.player.width / 2 + 10, width - this.player.width / 2 - 10);
  }

  action(action, isPressed) {
    if (this.over && isPressed) {
      this.reset();
      hideOverlay();
      return;
    }
    if (action === "rotate" || action === "drop") {
      if (isPressed) this.fire();
      return;
    }
    if (isPressed) this.pressed.add(action);
    else this.pressed.delete(action);
  }

  key(key, isPressed = true) {
    const map = {
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
      ArrowUp: "rotate",
      KeyW: "rotate",
      Space: "drop",
      ArrowDown: "down",
      KeyS: "down"
    };
    if (map[key]) this.action(map[key], isPressed);
  }

  pointer(type, point) {
    if (this.paused || this.over || !point) return;
    if (type === "start") this.fire();
    this.player.x = clamp(point.x, this.player.width / 2 + 10, point.width - this.player.width / 2 - 10);
  }

  fire() {
    if (this.paused || this.fireCooldown > 0) return;
    this.bullets.push({ x: this.player.x, y: this.player.y - 18, vx: 0, vy: -430, radius: 3, color: palette.cyan });
    this.fireCooldown = 0.18;
  }

  update(dt, width, height) {
    if (this.paused || this.over) return;
    this.resize(width, height);
    this.time += dt;
    this.fireCooldown = Math.max(0, this.fireCooldown - dt);
    this.player.invulnerable = Math.max(0, this.player.invulnerable - dt);

    const speed = this.player.speed * dt * (this.pressed.has("down") ? 0.55 : 1);
    if (this.pressed.has("left")) this.player.x -= speed;
    if (this.pressed.has("right")) this.player.x += speed;
    this.player.x = clamp(this.player.x, this.player.width / 2 + 10, width - this.player.width / 2 - 10);

    this.updateFleet(dt, width, height);
    this.updateProjectiles(dt, width, height);
    this.checkHits(width, height);
    this.updateParticles(dt);
  }

  updateFleet(dt, width, height) {
    let edge = false;
    for (const enemy of this.fleet) {
      if (!enemy.alive) continue;
      enemy.x += this.fleetDir * this.fleetSpeed * dt;
      if (enemy.x - enemy.width / 2 < 14 || enemy.x + enemy.width / 2 > width - 14) edge = true;
    }
    if (edge) {
      this.fleetDir *= -1;
      for (const enemy of this.fleet) {
        enemy.y += 18;
        if (enemy.alive && enemy.y + enemy.height / 2 >= height - 78) {
          finishGame(this, "防线失守", `分数 ${this.score}`, "再来");
          return;
        }
      }
    }
    this.enemyFireTimer -= dt;
    if (this.enemyFireTimer <= 0) {
      const shooters = this.fleet.filter((enemy) => enemy.alive);
      if (shooters.length) {
        const enemy = shooters[Math.floor(Math.random() * shooters.length)];
        this.enemyBullets.push({ x: enemy.x, y: enemy.y + 14, vx: 0, vy: 175 + this.wave * 14, radius: 4, color: palette.coral });
      }
      this.enemyFireTimer = random(0.55, 1.25) / Math.min(2, 0.85 + this.wave * 0.08);
    }
  }

  updateProjectiles(dt, width, height) {
    for (const bullet of this.bullets) {
      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;
    }
    for (const bullet of this.enemyBullets) {
      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;
    }
    this.bullets = this.bullets.filter((bullet) => bullet.y > -20 && bullet.x > -20 && bullet.x < width + 20);
    this.enemyBullets = this.enemyBullets.filter((bullet) => bullet.y < height + 24 && bullet.x > -20 && bullet.x < width + 20);
  }

  checkHits(width, height) {
    for (const bullet of this.bullets) {
      for (const enemy of this.fleet) {
        if (!enemy.alive) continue;
        const hit = bullet.x > enemy.x - enemy.width / 2 &&
          bullet.x < enemy.x + enemy.width / 2 &&
          bullet.y > enemy.y - enemy.height / 2 &&
          bullet.y < enemy.y + enemy.height / 2;
        if (!hit) continue;
        bullet.y = -999;
        enemy.hp -= 1;
        this.particles.push(...burst(enemy.x, enemy.y, enemy.color, 6));
        if (enemy.hp <= 0) {
          enemy.alive = false;
          this.score += 90 * this.wave;
          this.particles.push(...burst(enemy.x, enemy.y, enemy.color, 14));
        }
        break;
      }
    }
    this.bullets = this.bullets.filter((bullet) => bullet.y > -100);

    if (this.player.invulnerable <= 0) {
      for (const bullet of this.enemyBullets) {
        const hit = bullet.x >= this.player.x - this.player.width / 2 &&
          bullet.x <= this.player.x + this.player.width / 2 &&
          bullet.y >= this.player.y - this.player.height / 2 &&
          bullet.y <= this.player.y + this.player.height / 2;
        if (!hit) continue;
        bullet.y = height + 999;
        this.damagePlayer();
        break;
      }
    }

    if (this.fleet.every((enemy) => !enemy.alive)) {
      this.wave += 1;
      this.createFleet();
      this.player.invulnerable = 0.8;
    }
  }

  damagePlayer() {
    this.lives -= 1;
    this.player.invulnerable = 1.2;
    this.particles.push(...burst(this.player.x, this.player.y, palette.cyan, 20));
    if (this.lives <= 0) finishGame(this, "游戏结束", `分数 ${this.score}`, "再来");
  }

  updateParticles(dt) {
    for (const particle of this.particles) {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.life -= dt;
      particle.size *= 0.985;
    }
    this.particles = this.particles.filter((particle) => particle.life > 0 && particle.size > 0.7);
  }

  stats() {
    return [
      ["分数", this.score],
      ["生命", this.lives],
      ["波次", this.wave]
    ];
  }

  draw(renderCtx, width, height) {
    drawCabinetBackground(renderCtx, width, height, "invaders");
    for (const enemy of this.fleet) {
      if (!enemy.alive) continue;
      renderCtx.fillStyle = enemy.color;
      renderCtx.fillRect(enemy.x - enemy.width / 2, enemy.y - enemy.height / 2, enemy.width, enemy.height);
      renderCtx.fillStyle = "rgba(0,0,0,0.34)";
      renderCtx.fillRect(enemy.x - 7, enemy.y - 4, 4, 4);
      renderCtx.fillRect(enemy.x + 3, enemy.y - 4, 4, 4);
      renderCtx.fillRect(enemy.x - enemy.width / 2 + 3, enemy.y + enemy.height / 2 - 3, enemy.width - 6, 3);
    }

    if (!(this.player.invulnerable > 0 && Math.floor(this.time * 14) % 2 === 0)) {
      renderCtx.fillStyle = palette.cyan;
      renderCtx.fillRect(this.player.x - this.player.width / 2, this.player.y - this.player.height / 2, this.player.width, this.player.height);
      renderCtx.fillStyle = palette.gold;
      renderCtx.fillRect(this.player.x - 5, this.player.y - this.player.height / 2 - 8, 10, 8);
    }

    for (const bullet of this.bullets) drawBullet(renderCtx, bullet);
    for (const bullet of this.enemyBullets) drawBullet(renderCtx, bullet);
    for (const particle of this.particles) {
      renderCtx.globalAlpha = clamp(particle.life, 0, 1);
      renderCtx.fillStyle = particle.color;
      renderCtx.fillRect(particle.x, particle.y, particle.size, particle.size);
      renderCtx.globalAlpha = 1;
    }
  }
}

class MoleGame {
  constructor() {
    this.cols = 3;
    this.rows = 4;
    this.reset();
  }

  reset() {
    this.score = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.timeLeft = 45;
    this.spawnTimer = 0.35;
    this.selected = 0;
    this.holes = Array.from({ length: this.cols * this.rows }, () => ({ state: "empty", timer: 0, hit: 0 }));
    this.paused = false;
    this.over = false;
  }

  togglePause() {
    toggleStandardPause(this);
  }

  action(action, isPressed) {
    if (this.over && isPressed) {
      this.reset();
      hideOverlay();
      return;
    }
    if (!isPressed || this.paused) return;
    if (action === "drop") {
      this.hit(this.selected);
      return;
    }
    const direction = directionByAction[action];
    if (direction) this.moveSelection(direction.x, direction.y);
  }

  key(key, isPressed = true) {
    const map = {
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
      ArrowUp: "rotate",
      KeyW: "rotate",
      ArrowDown: "down",
      KeyS: "down",
      Enter: "drop",
      Space: "drop"
    };
    if (map[key]) this.action(map[key], isPressed);
  }

  pointer(type, point) {
    if (type !== "start" || this.paused || this.over || !point) return;
    const index = this.indexFromPoint(point);
    if (index >= 0) {
      this.selected = index;
      this.hit(index);
    }
  }

  moveSelection(dx, dy) {
    const x = (this.selected % this.cols + dx + this.cols) % this.cols;
    const y = (Math.floor(this.selected / this.cols) + dy + this.rows) % this.rows;
    this.selected = y * this.cols + x;
  }

  hit(index) {
    const hole = this.holes[index];
    if (!hole) return;
    hole.hit = 0.12;
    if (hole.state === "mole") {
      this.combo += 1;
      this.bestCombo = Math.max(this.bestCombo, this.combo);
      this.score += 10 + this.combo * 2;
      hole.state = "empty";
      hole.timer = 0;
    } else if (hole.state === "bomb") {
      this.combo = 0;
      this.score = Math.max(0, this.score - 20);
      hole.state = "empty";
      hole.timer = 0;
    } else {
      this.combo = 0;
    }
  }

  update(dt) {
    if (this.paused || this.over) return;
    this.timeLeft -= dt;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      finishGame(this, "时间到", `分数 ${this.score}`, "再来");
      return;
    }
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      const empty = this.holes.map((hole, index) => hole.state === "empty" ? index : -1).filter((index) => index >= 0);
      if (empty.length) {
        const index = empty[Math.floor(Math.random() * empty.length)];
        this.holes[index].state = Math.random() < 0.16 ? "bomb" : "mole";
        this.holes[index].timer = random(0.72, 1.25);
      }
      this.spawnTimer = Math.max(0.18, 0.72 - this.score / 900);
    }
    for (const hole of this.holes) {
      hole.hit = Math.max(0, hole.hit - dt);
      if (hole.state !== "empty") {
        hole.timer -= dt;
        if (hole.timer <= 0) {
          if (hole.state === "mole") this.combo = 0;
          hole.state = "empty";
        }
      }
    }
  }

  holeMetrics(width, height) {
    const gap = 13;
    const cell = Math.floor(Math.min((width - 46 - gap * (this.cols - 1)) / this.cols, (height - 94 - gap * (this.rows - 1)) / this.rows));
    const boardWidth = cell * this.cols + gap * (this.cols - 1);
    const boardHeight = cell * this.rows + gap * (this.rows - 1);
    return {
      gap,
      cell,
      offsetX: Math.floor((width - boardWidth) / 2),
      offsetY: Math.floor((height - boardHeight) / 2)
    };
  }

  indexFromPoint(point) {
    const metrics = this.holeMetrics(point.width, point.height);
    const x = Math.floor((point.x - metrics.offsetX) / (metrics.cell + metrics.gap));
    const y = Math.floor((point.y - metrics.offsetY) / (metrics.cell + metrics.gap));
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return -1;
    return y * this.cols + x;
  }

  stats() {
    return [
      ["分数", this.score],
      ["连击", this.combo],
      ["时间", Math.ceil(this.timeLeft)]
    ];
  }

  draw(renderCtx, width, height) {
    drawCabinetBackground(renderCtx, width, height, "mole");
    const metrics = this.holeMetrics(width, height);
    for (let index = 0; index < this.holes.length; index += 1) {
      const x = index % this.cols;
      const y = Math.floor(index / this.cols);
      const hole = this.holes[index];
      const cx = metrics.offsetX + x * (metrics.cell + metrics.gap) + metrics.cell / 2;
      const cy = metrics.offsetY + y * (metrics.cell + metrics.gap) + metrics.cell / 2;
      renderCtx.fillStyle = "rgba(0,0,0,0.36)";
      renderCtx.beginPath();
      renderCtx.ellipse(cx, cy + metrics.cell * 0.18, metrics.cell * 0.4, metrics.cell * 0.22, 0, 0, Math.PI * 2);
      renderCtx.fill();
      renderCtx.strokeStyle = index === this.selected ? palette.ink : "rgba(255,255,255,0.12)";
      renderCtx.lineWidth = index === this.selected ? 3 : 1;
      renderCtx.strokeRect(cx - metrics.cell / 2, cy - metrics.cell / 2, metrics.cell, metrics.cell);
      if (hole.state !== "empty") {
        const rise = clamp(hole.timer, 0, 0.36) / 0.36;
        const top = cy + metrics.cell * 0.18 - metrics.cell * 0.32 * rise;
        renderCtx.fillStyle = hole.state === "bomb" ? palette.coral : palette.gold;
        renderCtx.fillRect(cx - metrics.cell * 0.22, top - metrics.cell * 0.18, metrics.cell * 0.44, metrics.cell * 0.36);
        renderCtx.fillStyle = palette.dark;
        if (hole.state === "bomb") {
          renderCtx.fillRect(cx - 4, top - 4, 8, 8);
        } else {
          renderCtx.fillRect(cx - 9, top - 4, 5, 5);
          renderCtx.fillRect(cx + 4, top - 4, 5, 5);
        }
      }
      if (hole.hit > 0) {
        renderCtx.fillStyle = "rgba(245,244,235,0.28)";
        renderCtx.fillRect(cx - metrics.cell * 0.34, cy - metrics.cell * 0.34, metrics.cell * 0.68, 5);
      }
    }
    renderCtx.lineWidth = 1;
  }
}

class StackGame {
  constructor() {
    this.reset();
  }

  reset() {
    this.level = 0;
    this.score = 0;
    this.speed = 110;
    this.paused = false;
    this.over = false;
    this.slow = false;
    this.blocks = [];
    this.current = null;
    this.needsSetup = true;
  }

  setup(width, height) {
    const baseWidth = Math.min(210, width * 0.62);
    const base = { x: width / 2 - baseWidth / 2, y: height - 44, width: baseWidth, height: 18, color: palette.cyan };
    this.blocks = [base];
    this.current = {
      x: 12,
      y: base.y - 26,
      width: baseWidth,
      height: 18,
      vx: this.speed,
      color: palette.gold
    };
    this.needsSetup = false;
  }

  togglePause() {
    toggleStandardPause(this);
  }

  action(action, isPressed) {
    if (this.over && isPressed) {
      this.reset();
      hideOverlay();
      return;
    }
    if (action === "down") {
      this.slow = isPressed;
      return;
    }
    if ((action === "drop" || action === "rotate") && isPressed && !this.paused) {
      this.place();
      return;
    }
    if (!isPressed || this.paused || !this.current) return;
    if (action === "left") this.current.x -= 8;
    if (action === "right") this.current.x += 8;
  }

  key(key, isPressed = true) {
    const map = {
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
      ArrowDown: "down",
      KeyS: "down",
      ArrowUp: "rotate",
      KeyW: "rotate",
      Space: "drop"
    };
    if (map[key]) this.action(map[key], isPressed);
  }

  pointer(type) {
    if (type === "start" && !this.paused) this.place();
  }

  place() {
    if (!this.current || this.over) return;
    const below = this.blocks[this.blocks.length - 1];
    const left = Math.max(this.current.x, below.x);
    const right = Math.min(this.current.x + this.current.width, below.x + below.width);
    const overlap = right - left;
    if (overlap <= 5) {
      finishGame(this, "高塔倒塌", `层数 ${this.level}`, "再来");
      return;
    }
    this.blocks.push({
      x: left,
      y: this.current.y,
      width: overlap,
      height: this.current.height,
      color: this.current.color
    });
    this.level += 1;
    this.score += Math.round(overlap);
    this.speed = Math.min(280, this.speed + 9);
    const nextY = this.current.y - 26;
    this.current = {
      x: Math.random() < 0.5 ? 10 : 360,
      y: nextY,
      width: overlap,
      height: 18,
      vx: (Math.random() < 0.5 ? -1 : 1) * this.speed,
      color: [palette.coral, palette.gold, palette.green, palette.cyan, palette.violet, palette.orange][this.level % 6]
    };
  }

  update(dt, width, height) {
    if (this.needsSetup) this.setup(width, height);
    if (this.paused || this.over || !this.current) return;
    this.current.x += this.current.vx * dt * (this.slow ? 0.45 : 1);
    if (this.current.x < 8 || this.current.x + this.current.width > width - 8) {
      this.current.x = clamp(this.current.x, 8, width - this.current.width - 8);
      this.current.vx *= -1;
    }
  }

  viewport(height) {
    const topY = Math.min(...this.blocks.map((block) => block.y), this.current ? this.current.y : height);
    return Math.max(0, height * 0.38 - topY);
  }

  stats() {
    return [
      ["层数", this.level],
      ["宽度", this.current ? Math.round(this.current.width) : 0],
      ["速度", Math.round(this.speed)]
    ];
  }

  draw(renderCtx, width, height) {
    drawCabinetBackground(renderCtx, width, height, "stack");
    if (this.needsSetup) this.setup(width, height);
    const camera = this.viewport(height);
    for (const block of this.blocks) {
      renderCtx.fillStyle = block.color;
      renderCtx.fillRect(block.x, block.y + camera, block.width, block.height);
      renderCtx.fillStyle = "rgba(255,255,255,0.22)";
      renderCtx.fillRect(block.x + 3, block.y + camera + 3, Math.max(0, block.width - 6), 3);
    }
    if (this.current) {
      renderCtx.fillStyle = this.current.color;
      renderCtx.fillRect(this.current.x, this.current.y + camera, this.current.width, this.current.height);
    }
  }
}

class FloodGame {
  constructor() {
    this.size = 12;
    this.colors = [palette.cyan, palette.coral, palette.gold, palette.green, palette.violet, palette.orange];
    this.reset();
  }

  reset() {
    this.grid = Array.from({ length: this.size * this.size }, () => Math.floor(Math.random() * this.colors.length));
    this.selectedColor = (this.grid[0] + 1) % this.colors.length;
    this.moves = 0;
    this.maxMoves = 28;
    this.filled = 1;
    this.paused = false;
    this.over = false;
    this.updateFilled();
  }

  togglePause() {
    toggleStandardPause(this);
  }

  action(action, isPressed) {
    if (this.over && isPressed) {
      this.reset();
      hideOverlay();
      return;
    }
    if (!isPressed || this.paused) return;
    if (action === "drop") {
      this.fill();
      return;
    }
    if (action === "left" || action === "rotate") this.selectedColor = (this.selectedColor + this.colors.length - 1) % this.colors.length;
    if (action === "right" || action === "down") this.selectedColor = (this.selectedColor + 1) % this.colors.length;
  }

  key(key, isPressed = true) {
    const map = {
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
      ArrowUp: "rotate",
      KeyW: "rotate",
      ArrowDown: "down",
      KeyS: "down",
      Enter: "drop",
      Space: "drop"
    };
    if (map[key]) this.action(map[key], isPressed);
  }

  pointer(type, point) {
    if (type !== "start" || this.paused || this.over || !point) return;
    const swatch = this.swatchFromPoint(point);
    if (swatch >= 0) {
      this.selectedColor = swatch;
      this.fill();
    }
  }

  floodSet() {
    const target = this.grid[0];
    const visited = new Set();
    const queue = [0];
    visited.add(0);
    while (queue.length) {
      const index = queue.shift();
      const x = index % this.size;
      const y = Math.floor(index / this.size);
      const neighbors = [];
      if (x > 0) neighbors.push(index - 1);
      if (x < this.size - 1) neighbors.push(index + 1);
      if (y > 0) neighbors.push(index - this.size);
      if (y < this.size - 1) neighbors.push(index + this.size);
      for (const next of neighbors) {
        if (!visited.has(next) && this.grid[next] === target) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
    return visited;
  }

  fill() {
    if (this.selectedColor === this.grid[0]) return;
    const area = this.floodSet();
    area.forEach((index) => {
      this.grid[index] = this.selectedColor;
    });
    this.moves += 1;
    this.updateFilled();
    if (this.filled === this.grid.length) {
      finishGame(this, "扩张完成", `步数 ${this.moves}`, "再来");
    } else if (this.moves >= this.maxMoves) {
      finishGame(this, "步数用尽", `覆盖 ${this.filled}`, "再来");
    }
  }

  updateFilled() {
    this.filled = this.floodSet().size;
  }

  boardMetrics(width, height) {
    const board = Math.floor(Math.min(width - 34, height - 118));
    const cell = board / this.size;
    return {
      board,
      cell,
      offsetX: Math.floor((width - board) / 2),
      offsetY: Math.floor((height - board - 54) / 2)
    };
  }

  swatchFromPoint(point) {
    const metrics = this.boardMetrics(point.width, point.height);
    const swatchSize = 32;
    const gap = 8;
    const total = this.colors.length * swatchSize + (this.colors.length - 1) * gap;
    const startX = (point.width - total) / 2;
    const y = metrics.offsetY + metrics.board + 18;
    for (let index = 0; index < this.colors.length; index += 1) {
      const x = startX + index * (swatchSize + gap);
      if (point.x >= x && point.x <= x + swatchSize && point.y >= y && point.y <= y + swatchSize) return index;
    }
    return -1;
  }

  stats() {
    return [
      ["步数", `${this.moves}/${this.maxMoves}`],
      ["覆盖", this.filled],
      ["颜色", this.selectedColor + 1]
    ];
  }

  draw(renderCtx, width, height) {
    drawCabinetBackground(renderCtx, width, height, "flood");
    const metrics = this.boardMetrics(width, height);
    for (let y = 0; y < this.size; y += 1) {
      for (let x = 0; x < this.size; x += 1) {
        renderCtx.fillStyle = this.colors[this.grid[y * this.size + x]];
        renderCtx.fillRect(metrics.offsetX + x * metrics.cell, metrics.offsetY + y * metrics.cell, metrics.cell + 0.5, metrics.cell + 0.5);
      }
    }
    renderCtx.strokeStyle = "rgba(245,244,235,0.24)";
    renderCtx.strokeRect(metrics.offsetX - 0.5, metrics.offsetY - 0.5, metrics.board + 1, metrics.board + 1);

    const swatchSize = 32;
    const gap = 8;
    const total = this.colors.length * swatchSize + (this.colors.length - 1) * gap;
    const startX = (width - total) / 2;
    const y = metrics.offsetY + metrics.board + 18;
    for (let index = 0; index < this.colors.length; index += 1) {
      const x = startX + index * (swatchSize + gap);
      renderCtx.fillStyle = this.colors[index];
      renderCtx.fillRect(x, y, swatchSize, swatchSize);
      renderCtx.strokeStyle = index === this.selectedColor ? palette.ink : "rgba(255,255,255,0.18)";
      renderCtx.lineWidth = index === this.selectedColor ? 3 : 1;
      renderCtx.strokeRect(x + 0.5, y + 0.5, swatchSize - 1, swatchSize - 1);
    }
    renderCtx.lineWidth = 1;
  }
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function burst(x, y, color, count) {
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = random(34, 190);
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: random(2, 5),
      life: random(0.22, 0.72),
      color
    };
  });
}

function drawBullet(renderCtx, bullet) {
  renderCtx.fillStyle = bullet.color;
  renderCtx.beginPath();
  renderCtx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
  renderCtx.fill();
  renderCtx.fillStyle = "rgba(255,255,255,0.5)";
  renderCtx.fillRect(bullet.x - 1, bullet.y - bullet.radius - 8, 2, 7);
}

function drawCabinetBackground(renderCtx, width, height, mode) {
  const theme = backgroundThemes[mode] || backgroundThemes.tetris;
  const time = performance.now() / 1000;
  const drift = (Math.sin(time * 0.32) + 1) / 2;
  const midStop = clamp(0.52 + Math.sin(time * 0.45) * 0.07, 0.42, 0.62);
  const gradient = renderCtx.createLinearGradient(width * drift, 0, width * (1 - drift), height);
  gradient.addColorStop(0, theme[0]);
  gradient.addColorStop(midStop, "#121119");
  gradient.addColorStop(1, theme[1]);
  renderCtx.fillStyle = gradient;
  renderCtx.fillRect(0, 0, width, height);

  renderCtx.strokeStyle = palette.grid;
  renderCtx.lineWidth = 1;
  for (let x = 0; x < width; x += 24) {
    renderCtx.beginPath();
    renderCtx.moveTo(x, 0);
    renderCtx.lineTo(x, height);
    renderCtx.stroke();
  }
  for (let y = 0; y < height; y += 24) {
    renderCtx.beginPath();
    renderCtx.moveTo(0, y);
    renderCtx.lineTo(width, y);
    renderCtx.stroke();
  }

  renderCtx.fillStyle = "rgba(245,244,235,0.04)";
  renderCtx.fillRect(0, 0, width, 34);
  renderCtx.save();
  renderCtx.globalAlpha = 0.68 + Math.sin(time * 1.7) * 0.18;
  renderCtx.fillStyle = theme[2];
  renderCtx.fillRect(0, 0, width, 4);
  const sweepX = ((time * 34) % (width + 140)) - 70;
  const sweep = renderCtx.createLinearGradient(sweepX, 0, sweepX + 90, 0);
  sweep.addColorStop(0, "rgba(255,255,255,0)");
  sweep.addColorStop(0.5, "rgba(255,255,255,0.09)");
  sweep.addColorStop(1, "rgba(255,255,255,0)");
  renderCtx.fillStyle = sweep;
  renderCtx.fillRect(0, 0, width, height);
  renderCtx.restore();
}

const games = {
  tetris: new TetrisGame(),
  shooter: new ShooterGame(),
  snake: new SnakeGame(),
  breakout: new BreakoutGame(),
  merge: new MergeGame(),
  flappy: new FlappyGame(),
  memory: new MemoryGame(),
  mines: new MinesGame(),
  jumper: new JumperGame(),
  maze: new MazeGame(),
  pong: new PongGame(),
  invaders: new InvadersGame(),
  mole: new MoleGame(),
  stack: new StackGame(),
  flood: new FloodGame()
};

let activeMode = "tetris";
let activeGame = games[activeMode];
let lastTime = performance.now();
let canvasSize = { width: 360, height: 540 };
let touchStart = null;
const controlRepeatIds = new Set();

function clearControlRepeats() {
  for (const repeatId of controlRepeatIds) {
    window.clearInterval(repeatId);
  }
  controlRepeatIds.clear();
}

function clearTransientInput(game = activeGame) {
  clearControlRepeats();
  touchStart = null;
  controlButtons.forEach((button) => button.classList.remove("is-pressed"));
  if (game.pressed instanceof Set) game.pressed.clear();
  if ("pointerActive" in game) game.pointerActive = false;
  if ("boost" in game) game.boost = false;
  if ("slow" in game) game.slow = false;
  if ("fastFall" in game) game.fastFall = false;
  if ("dash" in game) game.dash = false;
}

function setMode(mode) {
  if (!games[mode]) return;
  if (mode !== activeMode) {
    clearTransientInput(activeGame);
    activeGame.reset();
  }
  activeMode = mode;
  activeGame = games[mode];
  clearTransientInput(activeGame);
  activeGame.reset();
  modeLabel.textContent = gameMeta[mode].title;
  modeButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.mode === mode));
  hideOverlay();
  activeGame.paused = false;
  updateControlLabels();
  updateStats();
  if (location.protocol === "http:" || location.protocol === "https:") {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("game", mode);
      window.history.replaceState(null, "", url);
    } catch (error) {
      // URL updates are only a convenience for browser previews.
    }
  }
}

function updateControlLabels() {
  const labels = gameMeta[activeMode].controls;
  for (const button of controlButtons) {
    const [label, text] = labels[button.dataset.action];
    button.setAttribute("aria-label", label);
    button.textContent = text;
  }
}

function updateStats() {
  const [[labelA, valueA], [labelB, valueB], [labelC, valueC]] = activeGame.stats();
  statALabel.textContent = labelA;
  statBLabel.textContent = labelB;
  statCLabel.textContent = labelC;
  statA.textContent = valueA;
  statB.textContent = valueB;
  statC.textContent = valueC;
  pauseButton.textContent = activeGame.paused ? "▶" : "Ⅱ";
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(280, Math.round(rect.width));
  const height = Math.max(420, Math.round(rect.height));
  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  canvasSize = { width, height };
  if (activeGame.resize) activeGame.resize(width, height);
}

function showOverlay(title, text, buttonText) {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  overlayButton.textContent = buttonText;
  overlay.classList.remove("is-hidden");
}

function hideOverlay() {
  overlay.classList.add("is-hidden");
}

function primaryOverlayAction() {
  if (activeGame.over) {
    activeGame.reset();
    hideOverlay();
    return;
  }
  activeGame.paused = false;
  hideOverlay();
}

function loop(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;
  resizeCanvas();
  if (typeof activeGame.update === "function") {
    activeGame.update(dt, canvasSize.width, canvasSize.height);
  }
  activeGame.draw(ctx, canvasSize.width, canvasSize.height);
  updateStats();
  requestAnimationFrame(loop);
}

function canvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    width: rect.width,
    height: rect.height
  };
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

pauseButton.addEventListener("click", () => {
  activeGame.togglePause();
  updateStats();
});

restartButton.addEventListener("click", () => {
  activeGame.reset();
  hideOverlay();
});

overlayButton.addEventListener("click", primaryOverlayAction);

for (const button of controlButtons) {
  let repeatId = null;
  const action = button.dataset.action;
  const press = (event) => {
    event.preventDefault();
    button.classList.add("is-pressed");
    activeGame.action(action, true);
    if (activeMode === "tetris" && ["left", "right", "down"].includes(action)) {
      window.clearInterval(repeatId);
      if (repeatId !== null) controlRepeatIds.delete(repeatId);
      repeatId = window.setInterval(() => activeGame.action(action, true), action === "down" ? 60 : 115);
      controlRepeatIds.add(repeatId);
    }
  };
  const release = (event) => {
    event.preventDefault();
    button.classList.remove("is-pressed");
    window.clearInterval(repeatId);
    if (repeatId !== null) controlRepeatIds.delete(repeatId);
    repeatId = null;
    activeGame.action(action, false);
  };
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", release);
}

canvas.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  canvas.setPointerCapture(event.pointerId);
  const point = canvasPoint(event);
  touchStart = { ...point, time: performance.now() };
  if (typeof activeGame.pointer === "function") activeGame.pointer("start", point);
});

canvas.addEventListener("pointermove", (event) => {
  event.preventDefault();
  if (typeof activeGame.pointer === "function") activeGame.pointer("move", canvasPoint(event));
});

canvas.addEventListener("pointerup", (event) => {
  event.preventDefault();
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  const point = canvasPoint(event);
  if (typeof activeGame.pointer === "function") {
    activeGame.pointer("end", point);
    touchStart = null;
    return;
  }
  if (!touchStart) return;
  const dx = point.x - touchStart.x;
  const dy = point.y - touchStart.y;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  if (Math.max(absX, absY) < 18) {
    activeGame.action("rotate", true);
  } else if (absX > absY) {
    activeGame.action(dx > 0 ? "right" : "left", true);
  } else {
    activeGame.action(dy > 0 ? "down" : "rotate", true);
  }
  touchStart = null;
});

canvas.addEventListener("pointercancel", (event) => {
  event.preventDefault();
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  if (typeof activeGame.pointer === "function") activeGame.pointer("end", canvasPoint(event));
  clearTransientInput(activeGame);
});

window.addEventListener("keydown", (event) => {
  if (event.code === "KeyP" || event.code === "Escape") {
    activeGame.togglePause();
    return;
  }
  if (event.code === "KeyR") {
    activeGame.reset();
    hideOverlay();
    return;
  }
  if (activeMode === "tetris") {
    activeGame.key(event.code);
  } else {
    activeGame.key(event.code, true);
  }
});

window.addEventListener("keyup", (event) => {
  if (activeMode !== "tetris") activeGame.key(event.code, false);
});

window.addEventListener("blur", () => {
  clearTransientInput(activeGame);
  if (!activeGame.over && !activeGame.paused) activeGame.togglePause();
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) return;
  clearTransientInput(activeGame);
  if (!activeGame.over && !activeGame.paused) activeGame.togglePause();
});

if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

const requestedMode = new URLSearchParams(window.location.search).get("game");
setMode(games[requestedMode] ? requestedMode : "tetris");
requestAnimationFrame(loop);
