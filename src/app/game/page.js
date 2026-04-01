"use client";

import { useEffect, useRef } from "react";

export default function Page() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // === 1. CONSTANTS & CONFIG ===
    let cw = (canvas.width = window.innerWidth);
    let ch = (canvas.height = window.innerHeight);

    const handleResize = () => {
      cw = canvas.width = window.innerWidth;
      ch = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const TILE_SIZE = 32;
    const MAP_W = 80;
    const MAP_H = 60;
    const COLORS = {
      floor: "#1a1a2e",
      wall: "#16213e",
      wallBevel: "#0f3460",
      player: "#e94560",
      crosshair: "rgba(255,255,255,0.7)",
      hudBg: "#333",
      dodge: "#00d4ff",
      gunEcho: "#ffeb3b",
      text: "#ffffff",
      enemyOrb: "#7b2d8b",
      enemyEmail: "#2196f3",
    };

    // === 2. GAME STATE ===
    const STATES = { MENU: 0, PLAYING: 1, ROOM_CLEAR: 2, GAME_OVER: 3 };
    let gameState = STATES.MENU;
    let level = 1;
    let score = 0;
    let camera = { x: 0, y: 0 };
    let map = [];
    let keys = {};
    let mouse = { x: 0, y: 0, worldX: 0, worldY: 0, down: false };

    const handleKeyDown = (e) => (keys[e.code] = true);
    const handleKeyUp = (e) => (keys[e.code] = false);
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseDown = (e) => {
      if (e.button === 0) mouse.down = true;
      handleClicks();
    };
    const handleMouseUp = (e) => {
      if (e.button === 0) mouse.down = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // === 3. DUNGEON GENERATION ===
    function generateDungeon() {
      map = Array.from({ length: MAP_H }, () =>
        Array.from({ length: MAP_W }, () => (Math.random() < 0.45 ? 1 : 0)),
      );

      for (let step = 0; step < 5; step++) {
        let newMap = map.map((arr) => [...arr]);
        for (let y = 1; y < MAP_H - 1; y++) {
          for (let x = 1; x < MAP_W - 1; x++) {
            let neighbors = 0;
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                neighbors += map[y + dy][x + dx];
              }
            }
            newMap[y][x] = neighbors >= 5 ? 1 : 0;
          }
        }
        map = newMap;
      }

      const cx = Math.floor(MAP_W / 2),
        cy = Math.floor(MAP_H / 2);
      for (let y = -5; y <= 5; y++) {
        for (let x = -5; x <= 5; x++) {
          if (x * x + y * y <= 25) map[cy + y][cx + x] = 1;
        }
      }

      for (let y = 0; y < MAP_H; y++) {
        map[y][0] = 0;
        map[y][MAP_W - 1] = 0;
      }
      for (let x = 0; x < MAP_W; x++) {
        map[0][x] = 0;
        map[MAP_H - 1][x] = 0;
      }
    }

    function isWall(x, y) {
      let tx = Math.floor(x / TILE_SIZE),
        ty = Math.floor(y / TILE_SIZE);
      if (tx < 0 || tx >= MAP_W || ty < 0 || ty >= MAP_H) return true;
      return map[ty][tx] === 0;
    }

    // === 4. PLAYER ===
    const player = {
      x: (MAP_W * TILE_SIZE) / 2,
      y: (MAP_H * TILE_SIZE) / 2,
      radius: 10,
      hp: 100,
      maxHp: 100,
      speed: 180,
      dodgeTimer: 0,
      isDodging: false,
      weapon: "Animation Gun",
      lastFire: 0,
      stats: { damage: 3, attackSpeed: 1.0, moveSpeed: 1.0, critChance: 0.1 },
    };

    function updatePlayer(dt) {
      if (player.hp <= 0) {
        gameState = STATES.GAME_OVER;
        return;
      }

      if (player.dodgeTimer > 0) player.dodgeTimer -= dt;
      if (keys["Space"] && player.dodgeTimer <= 0) {
        player.isDodging = true;
        player.dodgeTimer = 5;
        setTimeout(() => (player.isDodging = false), 300);
      }

      let dx = 0,
        dy = 0;
      if (keys["KeyW"] || keys["ArrowUp"]) dy -= 1;
      if (keys["KeyS"] || keys["ArrowDown"]) dy += 1;
      if (keys["KeyA"] || keys["ArrowLeft"]) dx -= 1;
      if (keys["KeyD"] || keys["ArrowRight"]) dx += 1;

      let len = Math.hypot(dx, dy);
      if (len > 0) {
        dx /= len;
        dy /= len;
        let moveSpeed =
          (player.isDodging ? 500 : player.speed * player.stats.moveSpeed) * dt;
        let newX = player.x + dx * moveSpeed;
        let newY = player.y + dy * moveSpeed;

        if (!isWall(newX, player.y)) player.x = newX;
        if (!isWall(player.x, newY)) player.y = newY;

        if (player.isDodging && Math.random() < 0.5)
          spawnParticle(player.x, player.y, COLORS.dodge);
      }

      if (mouse.down && !player.isDodging) {
        let now = Date.now();
        let fireRate = 1000 / (8 * player.stats.attackSpeed);
        if (player.weapon === "Game Over Gun") fireRate = 400;

        if (now - player.lastFire > fireRate) {
          player.lastFire = now;
          let angle = Math.atan2(
            mouse.worldY - player.y,
            mouse.worldX - player.x,
          );

          if (player.weapon === "Animation Gun") {
            projectiles.push({
              x: player.x,
              y: player.y,
              angle: angle,
              speed: 420,
              damage: player.stats.damage,
              isPlayer: true,
              life: 2,
              history: [],
              color: COLORS.gunEcho,
              type: "basic",
            });
          } else if (player.weapon === "Game Over Gun") {
            for (let i = -1; i <= 1; i++) {
              projectiles.push({
                x: player.x,
                y: player.y,
                angle: angle + i * 0.07,
                speed: 500,
                damage: player.stats.damage,
                isPlayer: true,
                life: 2,
                history: [],
                color: "#ff00ff",
                type: "pierce",
              });
            }
          }
        }
      }
    }

    // === 5. ENEMIES ===
    let enemies = [];
    class Enemy {
      constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.hp = type === "Orb Master" ? 10 : 20;
        this.speed = type === "Orb Master" ? 45 : 70;
        this.timer = 0;
      }
      update(dt) {
        this.timer += dt;
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        let dist = Math.hypot(player.y - this.y, player.x - this.x);

        let nx = this.x + Math.cos(angle) * this.speed * dt;
        let ny = this.y + Math.sin(angle) * this.speed * dt;
        if (!isWall(nx, ny)) {
          this.x = nx;
          this.y = ny;
        }

        if (this.type === "Email" && this.timer > 5 && dist < 400) {
          this.timer = 0;
          for (let i = -1; i <= 1; i++) {
            projectiles.push({
              x: this.x,
              y: this.y,
              angle: angle + i * 0.2,
              speed: 160,
              damage: 6,
              isPlayer: false,
              life: 3,
              history: [],
              color: "#64b5f6",
            });
          }
        }

        if (dist < player.radius + 15 && !player.isDodging) {
          player.hp -= (this.type === "Orb Master" ? 8 : 5) * dt;
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.shadowBlur = 10;
        if (this.type === "Orb Master") {
          ctx.fillStyle = COLORS.enemyOrb;
          ctx.shadowColor = COLORS.enemyOrb;
          ctx.fillRect(-22, -22, 44, 44);
          let orbAngle = this.timer * 1.2;
          for (let i = 0; i < 4; i++) {
            let a = orbAngle + (Math.PI / 2) * i;
            ctx.beginPath();
            ctx.arc(Math.cos(a) * 38, Math.sin(a) * 38, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          ctx.fillStyle = COLORS.enemyEmail;
          ctx.shadowColor = COLORS.enemyEmail;
          ctx.fillRect(-18, -14, 36, 28);
          ctx.beginPath();
          ctx.moveTo(-18, -14);
          ctx.lineTo(0, 4);
          ctx.lineTo(18, -14);
          ctx.strokeStyle = "white";
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // === 6. WEAPONS & PROJECTILES ===
    let projectiles = [];
    function updateProjectiles(dt) {
      for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i];
        p.x += Math.cos(p.angle) * p.speed * dt;
        p.y += Math.sin(p.angle) * p.speed * dt;
        p.life -= dt;
        p.history.unshift({ x: p.x, y: p.y });
        if (p.history.length > 6) p.history.pop();

        let hitWall = isWall(p.x, p.y);
        let hitEnemy = false;

        if (p.isPlayer) {
          enemies.forEach((e) => {
            if (Math.hypot(e.x - p.x, e.y - p.y) < 20) {
              hitEnemy = true;
              let dmg = p.damage;
              let crit = Math.random() < player.stats.critChance;
              if (crit) dmg *= 2;
              e.hp -= dmg;
              floatingTexts.push({
                x: e.x,
                y: e.y,
                text: Math.floor(dmg),
                life: 0.8,
                color: crit ? "red" : "white",
              });
            }
          });
        } else if (
          !player.isDodging &&
          Math.hypot(player.x - p.x, player.y - p.y) < player.radius + 5
        ) {
          player.hp -= p.damage;
          hitEnemy = true;
        }

        if (p.life <= 0 || hitWall || (hitEnemy && p.type !== "pierce")) {
          if (hitWall)
            for (let j = 0; j < 3; j++) spawnParticle(p.x, p.y, p.color);
          projectiles.splice(i, 1);
        }
      }
    }

    // === 7. PICKUPS ===
    let pickups = [];
    let floatingTexts = [];
    function updatePickups() {
      pickups.forEach((p, i) => {
        if (Math.hypot(player.x - p.x, player.y - p.y) < 30) {
          player.weapon = p.name;
          floatingTexts.push({
            x: player.x,
            y: player.y - 20,
            text: p.name,
            life: 2,
            color: "gold",
          });
          pickups.splice(i, 1);
        }
      });
    }

    // === 8. PARTICLES ===
    let particles = [];
    function spawnParticle(x, y, color) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 100,
        vy: (Math.random() - 0.5) * 100,
        life: 0.2 + Math.random() * 0.3,
        maxLife: 0.5,
        color: color,
      });
    }
    function updateParticles(dt) {
      for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.life <= 0) particles.splice(i, 1);
      }
    }

    // === 10. RENDERING ===
    function drawGame() {
      camera.x += (player.x - cw / 2 - camera.x) * 0.1;
      camera.y += (player.y - ch / 2 - camera.y) * 0.1;
      mouse.worldX = mouse.x + camera.x;
      mouse.worldY = mouse.y + camera.y;

      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, cw, ch);
      ctx.save();
      ctx.translate(-camera.x, -camera.y);

      let startX = Math.max(0, Math.floor(camera.x / TILE_SIZE));
      let startY = Math.max(0, Math.floor(camera.y / TILE_SIZE));
      let endX = Math.min(MAP_W, Math.ceil((camera.x + cw) / TILE_SIZE));
      let endY = Math.min(MAP_H, Math.ceil((camera.y + ch) / TILE_SIZE));

      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          let px = x * TILE_SIZE,
            py = y * TILE_SIZE;
          if (map[y][x] === 1) {
            ctx.fillStyle = COLORS.floor;
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          } else {
            ctx.fillStyle = COLORS.wall;
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = COLORS.wallBevel;
            ctx.fillRect(px, py + TILE_SIZE - 4, TILE_SIZE, 4);
          }
        }
      }

      pickups.forEach((p) => {
        ctx.fillStyle = "#ff00ff";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ff00ff";
        ctx.fillRect(p.x - 10, p.y - 10, 20, 20);
        ctx.shadowBlur = 0;
      });

      enemies.forEach((e) => e.draw());

      ctx.fillStyle = COLORS.player;
      ctx.shadowBlur = 10;
      ctx.shadowColor = COLORS.player;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(player.x, player.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      projectiles.forEach((p) => {
        p.history.forEach((hist, i) => {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = 1 - i / 6;
          ctx.beginPath();
          ctx.arc(hist.x, hist.y, p.type === "pierce" ? 4 : 3, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.type === "pierce" ? 7 : 4, 0, Math.PI * 2);
        ctx.fill();
      });

      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillRect(p.x, p.y, 3, 3);
      });
      ctx.globalAlpha = 1;

      floatingTexts.forEach((ft) => {
        ctx.fillStyle = ft.color;
        ctx.font = ft.color === "red" ? "bold 16px Courier" : "12px Courier";
        ctx.fillText(ft.text, ft.x, ft.y);
      });

      ctx.strokeStyle = COLORS.crosshair;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mouse.worldX, mouse.worldY, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mouse.worldX - 12, mouse.worldY);
      ctx.lineTo(mouse.worldX - 4, mouse.worldY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mouse.worldX + 4, mouse.worldY);
      ctx.lineTo(mouse.worldX + 12, mouse.worldY);
      ctx.stroke();

      ctx.restore();
    }

    // === 11. UI & HUD ===
    function drawHUD() {
      ctx.fillStyle = COLORS.hudBg;
      ctx.fillRect(20, 20, 200, 16);
      ctx.fillStyle = COLORS.player;
      ctx.fillRect(20, 20, Math.max(0, 200 * (player.hp / player.maxHp)), 16);
      ctx.strokeStyle = "white";
      ctx.strokeRect(20, 20, 200, 16);

      ctx.fillStyle = "white";
      ctx.font = "12px Courier";
      ctx.fillText(`HP: ${Math.floor(player.hp)}/${player.maxHp}`, 25, 32);

      let dodgeFill = player.dodgeTimer > 0 ? (5 - player.dodgeTimer) / 5 : 1;
      ctx.fillStyle = COLORS.dodge;
      ctx.fillRect(20, 42, 200 * dodgeFill, 6);

      ctx.fillText(`WEAPON: ${player.weapon}`, 20, 65);

      ctx.textAlign = "right";
      ctx.font = "20px Courier";
      ctx.fillText(`SCORE: ${score}`, cw - 20, 35);
      ctx.fillText(`LEVEL: ${level}`, cw - 20, 60);
      ctx.textAlign = "left";

      if (gameState === STATES.MENU) {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(0, 0, cw, ch);
        ctx.fillStyle = COLORS.player;
        ctx.font = "bold 60px Courier";
        ctx.textAlign = "center";
        ctx.fillText(
          "DUNGEON.EXE",
          cw / 2 + (Math.random() - 0.5) * 2,
          ch / 2 - 40,
        );
        ctx.fillStyle = "white";
        ctx.font = "20px Courier";
        ctx.fillText("[CLICK TO START]", cw / 2, ch / 2 + 20);
        ctx.textAlign = "left";
      } else if (gameState === STATES.GAME_OVER) {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(0, 0, cw, ch);
        ctx.fillStyle = COLORS.player;
        ctx.font = "bold 60px Courier";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", cw / 2, ch / 2 - 20);
        ctx.fillStyle = "white";
        ctx.font = "20px Courier";
        ctx.fillText(`FINAL SCORE: ${score}`, cw / 2, ch / 2 + 20);
        ctx.fillText("[PRESS R TO RESTART]", cw / 2, ch / 2 + 60);
        ctx.textAlign = "left";
      }
    }

    function handleClicks() {
      if (gameState === STATES.MENU) {
        initLevel();
        gameState = STATES.PLAYING;
      }
    }

    // === 12. GAME LOOP ===
    let lastTime = 0;
    let animationFrameId;

    function initLevel() {
      generateDungeon();
      player.x = (MAP_W * TILE_SIZE) / 2;
      player.y = (MAP_H * TILE_SIZE) / 2;
      player.hp = player.maxHp;
      enemies = [];
      pickups = [{ x: player.x + 100, y: player.y, name: "Game Over Gun" }];
      for (let i = 0; i < 3 + level; i++) {
        let ex, ey;
        do {
          ex = Math.random() * MAP_W * TILE_SIZE;
          ey = Math.random() * MAP_H * TILE_SIZE;
        } while (isWall(ex, ey));
        enemies.push(
          new Enemy(ex, ey, Math.random() > 0.5 ? "Orb Master" : "Email"),
        );
      }
    }

    function loop(timestamp) {
      let dt = (timestamp - lastTime) / 1000;
      if (dt > 0.1) dt = 0.1;
      lastTime = timestamp;

      if (gameState === STATES.PLAYING) {
        updatePlayer(dt);
        enemies.forEach((e) => e.update(dt));
        for (let i = enemies.length - 1; i >= 0; i--) {
          if (enemies[i].hp <= 0) {
            for (let j = 0; j < 10; j++)
              spawnParticle(enemies[i].x, enemies[i].y, "red");
            enemies.splice(i, 1);
            score += 5;
          }
        }
        updateProjectiles(dt);
        updatePickups();
        updateParticles(dt);

        for (let i = floatingTexts.length - 1; i >= 0; i--) {
          floatingTexts[i].y -= 20 * dt;
          floatingTexts[i].life -= dt;
          if (floatingTexts[i].life <= 0) floatingTexts.splice(i, 1);
        }
      } else if (gameState === STATES.GAME_OVER) {
        if (keys["KeyR"]) {
          level = 1;
          score = 0;
          player.weapon = "Animation Gun";
          initLevel();
          gameState = STATES.PLAYING;
        }
      }

      if (gameState !== STATES.MENU) drawGame();
      drawHUD();

      animationFrameId = requestAnimationFrame(loop);
    }

    animationFrameId = requestAnimationFrame(loop);

    // === CLEANUP FOR REACT ===
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        backgroundColor: "#0a0a0f",
        color: "white",
        fontFamily: "'Courier New', Courier, monospace",
        userSelect: "none",
      }}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
}
