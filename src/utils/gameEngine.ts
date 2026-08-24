import {
  GameState,
  DinoPlayer,
  VolcanoObstacle,
  Meteor,
  EnemyDino,
  Portal,
  FireBreathProjectile,
  PixelParticle,
  GameStats,
  LevelConfig,
} from '../types';
import { getLevelConfig } from './levels';
import { sound } from './sound';
import {
  drawDinoRun,
  drawDinoJump,
  drawDinoFireBreath,
  drawDinoVictoryDance,
  drawDinoCrying,
  drawVolcano,
  drawMeteor,
  drawEnemyDino,
  drawPortal,
} from './pixelSprites';

export class DinoGameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  public state: GameState = 'MENU';
  public currentLevel: number = 1;
  public levelConfig: LevelConfig;
  public stats: GameStats;

  public player: DinoPlayer;
  public volcanoes: VolcanoObstacle[] = [];
  public meteors: Meteor[] = [];
  public enemies: EnemyDino[] = [];
  public fireProjectiles: FireBreathProjectile[] = [];
  public enemyFireProjectiles: FireBreathProjectile[] = [];
  public particles: PixelParticle[] = [];
  public portal: Portal | null = null;

  private lastTime: number = 0;
  private animationFrameId: number | null = null;
  private distanceRun: number = 0;

  // Ground level Y
  public groundY: number = 0;

  // Spawn timers
  private volcanoTimer: number = 0;
  private meteorTimer: number = 0;
  private enemyTimer: number = 0;

  // Victory sequence
  public victoryDanceTimer: number = 0;
  public victoryDanceMaxTime: number = 4.0; // seconds

  // Loss sequence
  public extinctionTimer: number = 0;

  // Parallax layers
  private bgOffsetFar: number = 0;
  private bgOffsetMid: number = 0;
  private bgOffsetNear: number = 0;

  // Listeners
  public onStateChange?: (state: GameState) => void;
  public onStatsUpdate?: (stats: GameStats, hp: number, fireEnergy: number) => void;
  public onLevelComplete?: (level: number, stats: GameStats) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Cannot get 2d context');
    this.ctx = context;
    this.ctx.imageSmoothingEnabled = false;

    const savedHighScore = parseInt(localStorage.getItem('dino_high_score') || '0', 10);

    this.stats = {
      score: 0,
      highScore: savedHighScore,
      distance: 0,
      level: 1,
      meteorsDestroyed: 0,
      volcanoesJumped: 0,
      enemiesDefeated: 0,
      fireBreathsUsed: 0,
    };

    this.levelConfig = getLevelConfig(1);
    this.player = this.createDefaultPlayer();
    this.resizeCanvas();
  }

  public resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (parent) {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.floor(rect.width * dpr);
      this.canvas.height = Math.floor(rect.height * dpr);
      this.ctx.imageSmoothingEnabled = false;
      this.groundY = this.canvas.height - 110 * (this.canvas.height / 700);
      if (this.player) {
        if (this.player.isGrounded) {
          this.player.y = this.groundY - this.player.height;
        }
      }
    }
  }

  private createDefaultPlayer(): DinoPlayer {
    const baseH = 64;
    const baseW = 60;
    return {
      x: 100,
      y: 350,
      width: baseW,
      height: baseH,
      vy: 0,
      isGrounded: true,
      isJumping: false,
      isDucking: false,
      isBreathingFire: false,
      fireBreathTimer: 0,
      fireEnergy: 100,
      maxFireEnergy: 100,
      hp: 3,
      maxHp: 3,
      invulnerableTimer: 0,
      animState: 'RUN',
      animFrame: 0,
      animTimer: 0,
      danceStep: 0,
      danceTimer: 0,
      cryTimer: 0,
    };
  }

  public startNewGame() {
    this.currentLevel = 1;
    this.levelConfig = getLevelConfig(1);
    this.stats.score = 0;
    this.stats.distance = 0;
    this.stats.level = 1;
    this.stats.meteorsDestroyed = 0;
    this.stats.volcanoesJumped = 0;
    this.stats.enemiesDefeated = 0;
    this.stats.fireBreathsUsed = 0;
    this.resetLevelState();
    this.changeState('PLAYING');
  }

  public advanceToNextLevel() {
    this.currentLevel += 1;
    this.levelConfig = getLevelConfig(this.currentLevel);
    this.stats.level = this.currentLevel;
    // Heal 1 HP for advancing
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + 1);
    this.resetLevelState();
    this.changeState('PLAYING');
  }

  public retryCurrentLevel() {
    this.player.hp = 3;
    this.resetLevelState();
    this.changeState('PLAYING');
  }

  private resetLevelState() {
    sound.stopVictoryDanceMusic();
    this.distanceRun = 0;
    this.volcanoes = [];
    this.meteors = [];
    this.enemies = [];
    this.fireProjectiles = [];
    this.enemyFireProjectiles = [];
    this.particles = [];
    this.portal = null;
    this.victoryDanceTimer = 0;
    this.extinctionTimer = 0;

    this.player.isGrounded = true;
    this.player.isJumping = false;
    this.player.isDucking = false;
    this.player.isBreathingFire = false;
    this.player.fireBreathTimer = 0;
    this.player.fireEnergy = 100;
    this.player.invulnerableTimer = 0;
    this.player.vy = 0;
    this.player.x = 100;
    this.player.y = this.groundY - this.player.height;
    this.player.animState = 'RUN';

    this.volcanoTimer = 2.0; // brief grace period at start
    this.meteorTimer = 1.5;
    this.enemyTimer = 3.0;
  }

  public changeState(newState: GameState) {
    this.state = newState;
    if (this.onStateChange) {
      this.onStateChange(newState);
    }
  }

  // --- CONTROLS ---

  public jump() {
    if (this.state !== 'PLAYING') return;

    if (this.player.isGrounded) {
      // First Jump
      this.player.vy = -720;
      this.player.isGrounded = false;
      this.player.isJumping = true;
      this.player.animState = 'JUMP';
      sound.playJump();
    } else if (this.player.vy > -200 && this.player.isJumping) {
      // Double flutter jump
      this.player.vy = -600;
      this.player.isJumping = false; // consume double jump
      sound.playJump();

      // Flutter smoke particles
      for (let i = 0; i < 6; i++) {
        this.particles.push({
          x: this.player.x + 20,
          y: this.player.y + this.player.height,
          vx: (Math.random() - 0.5) * 120 - 50,
          vy: Math.random() * 80 + 20,
          size: Math.random() * 6 + 4,
          color: '#ffd54f',
          alpha: 1,
          life: 0,
          maxLife: 0.35,
          gravity: 50,
        });
      }
    }
  }

  public startFireBreath() {
    if (this.state !== 'PLAYING') return;
    if (this.player.fireEnergy < 15) return; // Need minimum energy to roar

    this.player.isBreathingFire = true;
    this.player.fireBreathTimer = 0.45; // seconds duration
    this.player.fireEnergy = Math.max(0, this.player.fireEnergy - 20);
    this.player.animState = 'FIRE_BREATH';
    this.stats.fireBreathsUsed++;
    sound.playFireBreath();

    // Spawn massive fiery breath projectiles & particles
    const mouthX = this.player.x + this.player.width + 10;
    const mouthY = this.player.y + 18;

    for (let i = 0; i < 4; i++) {
      this.fireProjectiles.push({
        id: Math.random(),
        x: mouthX + i * 15,
        y: mouthY + (Math.random() - 0.5) * 16,
        vx: this.levelConfig.baseSpeed + 450 + Math.random() * 200,
        vy: (Math.random() - 0.5) * 120 - 40,
        radius: 20 + i * 6,
        life: 0,
        maxLife: 0.7,
      });
    }

    // Flame sparks
    for (let p = 0; p < 18; p++) {
      this.particles.push({
        x: mouthX,
        y: mouthY + (Math.random() - 0.5) * 10,
        vx: 400 + Math.random() * 400,
        vy: (Math.random() - 0.5) * 200 - 30,
        size: Math.random() * 8 + 4,
        color: Math.random() > 0.4 ? '#ff6d00' : '#ffd600',
        alpha: 1,
        life: 0,
        maxLife: 0.5,
      });
    }
  }

  public setDucking(duck: boolean) {
    if (this.state !== 'PLAYING') return;
    this.player.isDucking = duck;
  }

  public swingSword() {
    if (this.state !== 'PLAYING') return;
    if (this.player.isSwingingSword) return;

    this.player.isSwingingSword = true;
    this.player.swordTimer = 0.3; // Sword swing duration
    this.player.animState = 'SWORD_SWING';
    sound.playJump(); // Reuse jump sound as swoosh for now
  }

  public togglePause() {
    if (this.state === 'PLAYING') {
      this.changeState('PAUSED');
      this.stopLoop();
    } else if (this.state === 'PAUSED') {
      this.changeState('PLAYING');
      this.startLoop();
    }
  }

  // --- GAME LOOP ---

  public startLoop() {
    this.lastTime = performance.now();
    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - this.lastTime) / 1000, 0.05); // cap delta
      this.lastTime = currentTime;

      this.update(dt);
      this.render();

      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  public stopLoop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    sound.stopVictoryDanceMusic();
  }

  // --- UPDATE ---

  private update(dt: number) {
    const speed = this.levelConfig.baseSpeed;

    // Regulate Fire Energy
    if (this.player.fireEnergy < this.player.maxFireEnergy) {
      this.player.fireEnergy = Math.min(this.player.maxFireEnergy, this.player.fireEnergy + dt * 25);
    }

    // Invulnerability timer
    if (this.player.invulnerableTimer > 0) {
      this.player.invulnerableTimer -= dt;
    }

    // State specific updates
    if (this.state === 'PLAYING') {
      this.updatePlaying(dt, speed);
    } else if (this.state === 'VICTORY_DANCING') {
      this.updateVictoryDancing(dt);
    } else if (this.state === 'GAME_OVER') {
      this.updateGameOver(dt);
    }

    // Update global particles
    this.updateParticles(dt);

    // Notify UI
    if (this.onStatsUpdate && Math.floor(Date.now() / 100) % 2 === 0) {
      this.onStatsUpdate(this.stats, this.player.hp, this.player.fireEnergy);
    }
  }

  private updatePlaying(dt: number, speed: number) {
    // Parallax background scrolling
    this.bgOffsetFar = (this.bgOffsetFar + speed * 0.15 * dt) % this.canvas.width;
    this.bgOffsetMid = (this.bgOffsetMid + speed * 0.4 * dt) % this.canvas.width;
    this.bgOffsetNear = (this.bgOffsetNear + speed * 0.8 * dt) % this.canvas.width;

    // Distance progression
    this.distanceRun += (speed * dt) / 20; // 1 meter per ~20px
    this.stats.distance = Math.floor(this.distanceRun);
    this.stats.score += Math.floor(speed * dt * 0.1);

    // Update High Score
    if (this.stats.score > this.stats.highScore) {
      this.stats.highScore = this.stats.score;
      localStorage.setItem('dino_high_score', String(this.stats.highScore));
    }

    // Player Gravity & Physics
    const gravity = 1750;
    this.player.vy += gravity * dt;
    this.player.y += this.player.vy * dt;

    // Ground collision
    const targetGroundY = this.groundY - this.player.height;
    if (this.player.y >= targetGroundY) {
      this.player.y = targetGroundY;
      this.player.vy = 0;
      this.player.isGrounded = true;
      this.player.isJumping = false;
      if (!this.player.isBreathingFire) {
        this.player.animState = this.player.isDucking ? 'DUCK' : 'RUN';
      }
    } else {
      this.player.isGrounded = false;
      if (!this.player.isBreathingFire) {
        this.player.animState = this.player.vy < 0 ? 'JUMP' : 'FALL';
      }
    }

    // Fire breath timer
    if (this.player.isBreathingFire) {
      this.player.fireBreathTimer -= dt;
      if (this.player.fireBreathTimer <= 0) {
        this.player.isBreathingFire = false;
      }
    }

    // Sword swing timer and collision
    if (this.player.isSwingingSword) {
      this.player.swordTimer -= dt;
      if (this.player.swordTimer <= 0) {
        this.player.isSwingingSword = false;
        if (!this.player.isBreathingFire) {
          this.player.animState = this.player.isDucking ? 'DUCK' : (this.player.isGrounded ? 'RUN' : 'JUMP');
        }
      }

      // Check Sword Collision
      const swordHitBox = {
        x: this.player.x + this.player.width,
        y: this.player.y,
        width: 60,
        height: this.player.height
      };

      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const e = this.enemies[i];
        const eHitBox = { x: e.x, y: e.y, width: e.width, height: e.height };
        if (this.checkCollision(swordHitBox, eHitBox)) {
          e.hp -= 2; // Sword deals 2 damage
          this.createExplosionParticles(e.x + e.width / 2, e.y + e.height / 2, '#fff');
          sound.playHit();
          
          if (e.hp <= 0) {
            this.stats.enemiesDefeated++;
            this.stats.score += 400 * e.level;
            sound.playScorePing();
            this.enemies.splice(i, 1);
          } else {
            // Pushback on hit
            e.x += 20; 
          }
        }
      }
    }

    // Animation frame progression
    this.player.animTimer += dt;
    if (this.player.animTimer >= 0.09) {
      this.player.animTimer = 0;
      this.player.animFrame = (this.player.animFrame + 1) % 4;
    }

    // Check Portal Spawn (End of level target distance reached!)
    if (this.distanceRun >= this.levelConfig.targetDistance && !this.portal) {
      this.portal = {
        x: this.canvas.width + 120,
        y: this.groundY - 140,
        width: 90,
        height: 140,
        active: true,
        spinAngle: 0,
        particles: Array.from({ length: 16 }).map(() => ({
          x: 0,
          y: 0,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 2 + 1,
          dist: Math.random() * 40 + 10,
          color: Math.random() > 0.5 ? '#00e5ff' : '#d500f9',
        })),
      };
    }

    // Update Portal
    if (this.portal) {
      this.portal.x -= speed * dt;
      this.portal.spinAngle += dt * 3;
      for (const p of this.portal.particles) {
        p.angle += p.speed * dt;
      }

      // Check if Player reached the Portal -> Trigger Victory Dance!
      const playerCenterX = this.player.x + this.player.width / 2;
      const portalCenterX = this.portal.x + this.portal.width / 2;

      if (playerCenterX >= portalCenterX - 50) {
        this.triggerVictorySequence();
        return;
      }
    }

    // Spawn Obstacles (Only if portal not arrived yet)
    if (!this.portal) {
      this.updateSpawners(dt, speed);
    }

    // Update Volcanoes
    for (let i = this.volcanoes.length - 1; i >= 0; i--) {
      const v = this.volcanoes[i];
      v.x -= speed * dt;
      v.eruptionTimer += dt;

      // Eruption cycle
      if (v.eruptionTimer > 2.5) {
        v.isErupting = true;
        if (v.eruptionTimer > 3.5) {
          v.eruptionTimer = 0;
          v.isErupting = false;
        }
      }

      // Volcano collision check (bounding box)
      if (this.player.invulnerableTimer <= 0) {
        const vHitBox = {
          x: v.x + v.width * 0.2,
          y: v.y + 10,
          width: v.width * 0.6,
          height: v.height - 10,
        };

        const playerBox = {
          x: this.player.x + 10,
          y: this.player.y + 10,
          width: this.player.width - 20,
          height: this.player.height - 15,
        };

        if (this.checkCollision(playerBox, vHitBox)) {
          this.hurtPlayer(1, 'Hit active volcano crater!');
          // Bounce player back up
          this.player.vy = -450;
        }
      }

      // Check if successfully jumped over
      if (!v.cleared && v.x + v.width < this.player.x) {
        v.cleared = true;
        this.stats.volcanoesJumped++;
        this.stats.score += 150;
        sound.playScorePing();
      }

      // Remove offscreen
      if (v.x + v.width < -100) {
        this.volcanoes.splice(i, 1);
      }
    }

    // Update Meteors
    for (let i = this.meteors.length - 1; i >= 0; i--) {
      const m = this.meteors[i];
      m.x += m.vx * dt - speed * dt;
      m.y += m.vy * dt;
      m.rotation += dt * 4;

      // Trail
      m.trail.push({
        x: m.x,
        y: m.y,
        alpha: 1,
        size: m.radius * (Math.random() * 0.8 + 0.6),
      });

      for (let t = m.trail.length - 1; t >= 0; t--) {
        m.trail[t].alpha -= dt * 3.5;
        if (m.trail[t].alpha <= 0) {
          m.trail.splice(t, 1);
        }
      }

      // Check ground hit
      if (m.y >= this.groundY - 10) {
        this.createExplosionParticles(m.x, this.groundY - 10, '#ff5722');
        sound.playExplosion();
        this.meteors.splice(i, 1);
        continue;
      }

      // Check Fire Breath vs Meteor (Repel / Destroy Meteor!)
      let meteorDestroyed = false;
      for (const f of this.fireProjectiles) {
        const dist = Math.hypot(m.x - f.x, m.y - f.y);
        if (dist < m.radius + f.radius) {
          m.hp -= 1;
          if (m.hp <= 0) {
            meteorDestroyed = true;
            this.stats.meteorsDestroyed++;
            this.stats.score += 300;
            this.createExplosionParticles(m.x, m.y, '#ffd600');
            sound.playExplosion();
            break;
          }
        }
      }

      if (meteorDestroyed) {
        this.meteors.splice(i, 1);
        continue;
      }

      // Check Player vs Meteor collision
      if (this.player.invulnerableTimer <= 0) {
        const playerCenterX = this.player.x + this.player.width / 2;
        const playerCenterY = this.player.y + this.player.height / 2;
        const pDist = Math.hypot(m.x - playerCenterX, m.y - playerCenterY);
        if (pDist < m.radius + 20) {
          this.hurtPlayer(1, 'Struck by falling meteor!');
          this.createExplosionParticles(m.x, m.y, '#ff1744');
          sound.playExplosion();
          this.meteors.splice(i, 1);
          continue;
        }
      }

      // Remove offscreen
      if (m.x < -100 || m.y > this.canvas.height + 100) {
        this.meteors.splice(i, 1);
      }
    }

    // Update Enemies (Level 2+)
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.x += e.vx * dt - speed * dt;
      e.animTimer += dt;
      if (e.animTimer > 0.12) {
        e.animTimer = 0;
        e.animFrame = (e.animFrame + 1) % 4;
      }

      // Pterodactyl wave fly
      if (e.type === 'PTERODACTYL') {
        e.y = e.groundY - 110 + Math.sin(this.stats.distance * 0.08 + e.id) * 35;
      }

      // Enemy fire back (levels 5+)
      if (e.shootTimer !== undefined) {
        e.shootTimer -= dt;
        if (e.shootTimer <= 0 && e.x < this.canvas.width && e.x > 0) {
          e.shootTimer = 1.5 + Math.random(); // fire every 1.5 to 2.5 seconds
          this.enemyFireProjectiles.push({
            id: Math.random(),
            x: e.x,
            y: e.y + e.height / 2,
            vx: -300 - Math.random() * 100, // fast projectile towards player
            vy: (Math.random() - 0.5) * 50,
            radius: 12 + Math.random() * 5,
            life: 0,
            maxLife: 2.0,
          });
          sound.playFireBreath();
        }
      }

      // Check Fire Breath vs Enemy
      let enemyDefeated = false;
      for (const f of this.fireProjectiles) {
        const eHitBox = { x: e.x, y: e.y, width: e.width, height: e.height };
        const fBox = { x: f.x - f.radius, y: f.y - f.radius, width: f.radius * 2, height: f.radius * 2 };
        if (this.checkCollision(eHitBox, fBox)) {
          e.hp -= 1;
          this.createExplosionParticles(e.x + e.width / 2, e.y + e.height / 2, '#ff9800');
          sound.playHit();
          if (e.hp <= 0) {
            enemyDefeated = true;
            this.stats.enemiesDefeated++;
            this.stats.score += 400 * e.level;
            sound.playScorePing();
            break;
          }
        }
      }

      if (enemyDefeated) {
        this.enemies.splice(i, 1);
        continue;
      }

      // Check Player vs Enemy collision
      if (this.player.invulnerableTimer <= 0) {
        const playerBox = {
          x: this.player.x + 8,
          y: this.player.y + (this.player.isDucking ? 25 : 8),
          width: this.player.width - 16,
          height: this.player.height - (this.player.isDucking ? 30 : 16),
        };
        const eHitBox = { x: e.x + 6, y: e.y + 6, width: e.width - 12, height: e.height - 12 };

        if (this.checkCollision(playerBox, eHitBox)) {
          this.hurtPlayer(1, `Hit by Level ${e.level} ${e.type}!`);
        }
      }

      // Remove offscreen
      if (e.x + e.width < -100) {
        this.enemies.splice(i, 1);
      }
    }

    // Update Fire Projectiles
    for (let i = this.fireProjectiles.length - 1; i >= 0; i--) {
      const f = this.fireProjectiles[i];
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      f.life += dt;
      f.radius += dt * 15; // expand flame cloud

      if (f.life >= f.maxLife || f.x > this.canvas.width + 100) {
        this.fireProjectiles.splice(i, 1);
      }
    }

    // Update Enemy Fire Projectiles
    for (let i = this.enemyFireProjectiles.length - 1; i >= 0; i--) {
      const f = this.enemyFireProjectiles[i];
      f.x += (f.vx - speed) * dt;
      f.y += f.vy * dt;
      f.life += dt;

      // Check collision with player
      if (this.player.invulnerableTimer <= 0) {
        const playerCenterX = this.player.x + this.player.width / 2;
        const playerCenterY = this.player.y + this.player.height / 2;
        const dist = Math.hypot(f.x - playerCenterX, f.y - playerCenterY);
        if (dist < f.radius + 20) {
          this.hurtPlayer(1, 'Hit by enemy fire!');
          this.createExplosionParticles(f.x, f.y, '#ff1744');
          sound.playExplosion();
          this.enemyFireProjectiles.splice(i, 1);
          continue;
        }
      }

      if (f.life >= f.maxLife || f.x < -100) {
        this.enemyFireProjectiles.splice(i, 1);
      }
    }
  }

  private updateSpawners(dt: number, speed: number) {
    // Spawners tuned for balanced arcade pacing
    this.volcanoTimer -= dt;
    if (this.volcanoTimer <= 0) {
      const vWidth = 80 + Math.random() * 50;
      const vHeight = 55 + Math.random() * 35;
      this.volcanoes.push({
        id: Math.random(),
        type: 'VOLCANO',
        x: this.canvas.width + 100,
        y: this.groundY - vHeight + 10,
        width: vWidth,
        height: vHeight,
        eruptionTimer: Math.random() * 2,
        isErupting: false,
        cleared: false,
      });
      // Spawn interval based on level configuration
      this.volcanoTimer = (3.2 - Math.min(1.5, (this.currentLevel - 1) * 0.3)) / this.levelConfig.volcanoSpawnRate + Math.random() * 1.5;
    }

    // Meteors
    this.meteorTimer -= dt;
    if (this.meteorTimer <= 0) {
      this.meteors.push({
        id: Math.random(),
        x: this.canvas.width * (0.3 + Math.random() * 0.7),
        y: -40,
        vx: -150 - Math.random() * 100,
        vy: 280 + Math.random() * 200,
        radius: 16 + Math.random() * 14,
        hp: 1,
        rotation: 0,
        trail: [],
      });
      this.meteorTimer = (2.8 - Math.min(1.4, (this.currentLevel - 1) * 0.3)) / this.levelConfig.meteorSpawnRate + Math.random() * 1.2;
    }

    // Enemies (Level 2+)
    if (this.levelConfig.enemyDinoTypes.length > 0) {
      this.enemyTimer -= dt;
      if (this.enemyTimer <= 0) {
        const typeIndex = Math.floor(Math.random() * this.levelConfig.enemyDinoTypes.length);
        const type = this.levelConfig.enemyDinoTypes[typeIndex];
        const isAir = type === 'PTERODACTYL';
        const eH = isAir ? 45 : 55;
        const eW = isAir ? 55 : 60;
        const eY = isAir ? this.groundY - 110 : this.groundY - eH;
        
        // Scale HP based on level for levels 5+
        const levelMultiplier = this.currentLevel >= 5 ? 2 + Math.floor((this.currentLevel - 5) / 5) : 1;
        const eHp = (type === 'ARMORED_TRICERATOPS' ? 2 : type === 'T_REX_MINI' ? 3 : 1) * levelMultiplier;

        let shootTimer: number | undefined = undefined;
        if (this.currentLevel >= 5) {
          shootTimer = Math.random() * 1.5 + 0.5; // start shooting between 0.5 - 2 seconds after spawn
        }

        this.enemies.push({
          id: Math.random(),
          type,
          level: this.currentLevel,
          x: this.canvas.width + 100,
          y: eY,
          width: eW,
          height: eH,
          vx: type === 'RAPTOR' ? -120 : -40,
          vy: 0,
          hp: eHp,
          maxHp: eHp,
          animFrame: 0,
          animTimer: 0,
          groundY: this.groundY,
          shootTimer,
        });

        this.enemyTimer = (4.0 - Math.min(1.8, (this.currentLevel - 1) * 0.4)) / this.levelConfig.enemySpawnRate + Math.random() * 2.0;
      }
    }
  }

  private triggerVictorySequence() {
    this.changeState('VICTORY_DANCING');
    this.victoryDanceTimer = 0;
    this.player.isGrounded = true;
    this.player.vy = 0;
    this.player.y = this.groundY - this.player.height;
    this.player.animState = 'DANCE';

    // Start victory dance disco chiptune!
    sound.startVictoryDanceMusic();

    // Bonus Points Calculation
    const hpBonus = this.player.hp * 500;
    const distanceBonus = 1000 * this.currentLevel;
    this.stats.score += hpBonus + distanceBonus;

    if (this.onLevelComplete) {
      this.onLevelComplete(this.currentLevel, this.stats);
    }
  }

  private updateVictoryDancing(dt: number) {
    this.victoryDanceTimer += dt;
    this.player.danceTimer += dt;

    if (this.player.danceTimer > 0.18) {
      this.player.danceTimer = 0;
      this.player.danceStep = (this.player.danceStep + 1) % 6;
    }

    // Spawn disco celebration particles & confetti
    if (Math.random() > 0.3) {
      const colors = ['#ff007f', '#00e5ff', '#ffd600', '#76ff03', '#d500f9', '#ffffff'];
      this.particles.push({
        x: this.player.x + (Math.random() - 0.5) * 160 + 20,
        y: this.player.y - Math.random() * 120,
        vx: (Math.random() - 0.5) * 80,
        vy: -Math.random() * 150 - 50,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: 1.5,
        gravity: 120,
        shape: Math.random() > 0.3 ? 'square' : 'note',
      });
    }

    // Portal spin
    if (this.portal) {
      this.portal.spinAngle += dt * 4;
    }
  }

  private updateGameOver(dt: number) {
    this.extinctionTimer += dt;
    this.player.cryTimer += dt;

    // Spawn crying teardrop particles
    if (Math.random() > 0.4) {
      this.particles.push({
        x: this.player.x + 45 + (Math.random() - 0.5) * 8,
        y: this.player.y + 25,
        vx: Math.random() * 30 + 10,
        vy: Math.random() * 60 + 30,
        size: Math.random() * 4 + 3,
        color: '#00e5ff',
        alpha: 1,
        life: 0,
        maxLife: 0.8,
        gravity: 250,
        shape: 'tear',
      });
    }
  }

  private hurtPlayer(dmg: number, _reason: string) {
    if (this.player.invulnerableTimer > 0) return;

    this.player.hp -= dmg;
    this.player.invulnerableTimer = 1.2; // 1.2s invulnerability
    sound.playHit();

    // Damage impact particles
    this.createExplosionParticles(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, '#ff1744');

    if (this.player.hp <= 0) {
      this.player.hp = 0;
      this.changeState('GAME_OVER');
      this.player.animState = 'CRY';
      this.player.vy = 0;
      this.player.y = this.groundY - this.player.height;
      sound.playExtinctLossTune();
    }
  }

  private createExplosionParticles(x: number, y: number, color: string) {
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 220 + 40;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 7 + 3,
        color,
        alpha: 1,
        life: 0,
        maxLife: 0.6,
        gravity: 180,
      });
    }
  }

  private updateParticles(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.gravity) {
        p.vy += p.gravity * dt;
      }
      p.life += dt;
      p.alpha = 1 - (p.life / p.maxLife);

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  private checkCollision(
    a: { x: number; y: number; width: number; height: number },
    b: { x: number; y: number; width: number; height: number }
  ): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  // --- RENDER ---

  public render() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Clear canvas
    this.ctx.clearRect(0, 0, w, h);

    // 1. Sky Gradient & Atmospheric Ash
    this.renderSky(w, h);

    // 2. Parallax Mountain Volcano Ranges
    this.renderParallaxBackground(w, h);

    // 3. Volcanic Ground & Magma Rivers
    this.renderGround(w, h);

    // 4. Portal (if present)
    if (this.portal) {
      drawPortal(this.ctx, this.portal);
    }

    // 5. Volcanoes
    const nowSec = performance.now() / 1000;
    for (const v of this.volcanoes) {
      drawVolcano(this.ctx, v.x, v.y, v.width, v.height, v.isErupting, nowSec);
    }

    // 6. Meteors
    for (const m of this.meteors) {
      drawMeteor(this.ctx, m);
    }

    // 7. Enemy Dinosaurs
    for (const e of this.enemies) {
      drawEnemyDino(this.ctx, e);
    }

    // 8. Fire Breath Projectiles & Flame Plumes
    this.renderFireBreath();
    this.renderEnemyFireBreath();

    // 9. Player Dinosaur
    this.renderPlayer(nowSec);

    // 10. Pixel Particles
    this.renderParticles();

    // 11. End Screen Animations & Overlays
    if (this.state === 'GAME_OVER') {
      this.renderGameOverScene(w, h);
    } else if (this.state === 'VICTORY_DANCING') {
      this.renderVictoryDanceScene(w, h);
    }
  }

  private renderSky(w: number, h: number) {
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.groundY);
    grad.addColorStop(0, this.levelConfig.skyColorTop);
    grad.addColorStop(1, this.levelConfig.skyColorBottom);
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, this.groundY);

    // Distant falling volcanic embers / ash flakes
    this.ctx.fillStyle = 'rgba(255, 152, 0, 0.4)';
    const time = performance.now() * 0.001;
    for (let i = 0; i < 24; i++) {
      const ashX = ((i * 73 + time * 30) % w);
      const ashY = ((i * 59 + time * 60) % this.groundY);
      this.ctx.fillRect(ashX, ashY, 3, 3);
    }
  }

  private renderParallaxBackground(w: number, _h: number) {
    const gy = this.groundY;

    // Distant Volcano Peaks (slow scrolling)
    this.ctx.fillStyle = this.levelConfig.mountainColor;
    const peakW = 280;
    const peakCount = Math.ceil(w / peakW) + 2;

    this.ctx.beginPath();
    this.ctx.moveTo(0, gy);
    for (let i = -1; i < peakCount; i++) {
      const peakX = i * peakW - (this.bgOffsetFar % peakW);
      this.ctx.lineTo(peakX, gy - 160);
      this.ctx.lineTo(peakX + peakW / 2, gy - 240);
      this.ctx.lineTo(peakX + peakW, gy - 160);
    }
    this.ctx.lineTo(w, gy);
    this.ctx.closePath();
    this.ctx.fill();

    // Glowing calderas on distant mountains
    for (let i = -1; i < peakCount; i++) {
      const peakX = i * peakW - (this.bgOffsetFar % peakW) + peakW / 2;
      this.ctx.fillStyle = 'rgba(255, 87, 34, 0.6)';
      this.ctx.fillRect(peakX - 15, gy - 242, 30, 6);
    }

    // Midground Basalt Ridges (medium scrolling)
    this.ctx.fillStyle = 'rgba(28, 16, 16, 0.85)';
    const ridgeW = 140;
    const ridgeCount = Math.ceil(w / ridgeW) + 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, gy);
    for (let i = -1; i < ridgeCount; i++) {
      const rx = i * ridgeW - (this.bgOffsetMid % ridgeW);
      this.ctx.lineTo(rx, gy - 80);
      this.ctx.lineTo(rx + ridgeW / 2, gy - 110);
      this.ctx.lineTo(rx + ridgeW, gy - 80);
    }
    this.ctx.lineTo(w, gy);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private renderGround(w: number, h: number) {
    const gy = this.groundY;

    // Ground Base
    this.ctx.fillStyle = this.levelConfig.groundColor;
    this.ctx.fillRect(0, gy, w, h - gy);

    // Glowing Magma Fissure Line
    this.ctx.fillStyle = this.levelConfig.lavaColor;
    this.ctx.fillRect(0, gy, w, 6);

    // Flowing Lava Veins (fast scrolling)
    this.ctx.fillStyle = '#ff6d00';
    for (let x = - (this.bgOffsetNear % 80); x < w; x += 80) {
      this.ctx.fillRect(x + 20, gy + 12, 35, 4);
      this.ctx.fillRect(x + 10, gy + 28, 45, 5);
      this.ctx.fillRect(x + 30, gy + 45, 25, 4);
    }

    // Pixel rocks on surface
    this.ctx.fillStyle = '#212121';
    for (let x = - (this.bgOffsetNear % 100); x < w; x += 100) {
      this.ctx.fillRect(x + 5, gy - 4, 12, 4);
      this.ctx.fillRect(x + 60, gy - 3, 8, 3);
    }
  }

  private renderFireBreath() {
    for (const f of this.fireProjectiles) {
      const grad = this.ctx.createRadialGradient(f.x, f.y, 2, f.x, f.y, f.radius);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.3, 'rgba(255, 235, 59, 0.9)');
      grad.addColorStop(0.7, 'rgba(255, 87, 34, 0.7)');
      grad.addColorStop(1, 'rgba(244, 67, 54, 0)');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Pixelated flame spikes
      this.ctx.fillStyle = '#ffd600';
      this.ctx.fillRect(f.x - f.radius * 0.4, f.y - f.radius * 0.4, f.radius * 0.8, f.radius * 0.8);
    }
  }

  private renderEnemyFireBreath() {
    for (const f of this.enemyFireProjectiles) {
      const grad = this.ctx.createRadialGradient(f.x, f.y, 2, f.x, f.y, f.radius);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.3, 'rgba(156, 39, 176, 0.9)'); // Purpleish hue for enemy fire
      grad.addColorStop(0.7, 'rgba(103, 58, 183, 0.7)');
      grad.addColorStop(1, 'rgba(81, 45, 168, 0)');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Pixelated flame spikes
      this.ctx.fillStyle = '#e040fb';
      this.ctx.fillRect(f.x - f.radius * 0.4, f.y - f.radius * 0.4, f.radius * 0.8, f.radius * 0.8);
    }
  }

  private renderPlayer(nowSec: number) {
    const isHurt = this.player.invulnerableTimer > 0;
    const ps = 3;

    if (this.state === 'VICTORY_DANCING') {
      drawDinoVictoryDance(this.ctx, this.player.x, this.player.y, this.player.danceStep, 3.8);
    } else if (this.state === 'GAME_OVER') {
      drawDinoCrying(this.ctx, this.player.x, this.player.y, this.player.cryTimer, 3.8);
    } else if (this.player.isBreathingFire) {
      drawDinoFireBreath(this.ctx, this.player.x, this.player.y, ps, isHurt);
    } else if (this.player.isSwingingSword) {
      // Draw base dino running or jumping
      if (!this.player.isGrounded) {
        drawDinoJump(this.ctx, this.player.x, this.player.y, ps, isHurt);
      } else {
        drawDinoRun(this.ctx, this.player.x, this.player.y, this.player.animFrame, ps, isHurt);
      }
      
      // Draw sword slash
      this.ctx.save();
      const slashProgress = 1 - (this.player.swordTimer / 0.3); // 0 to 1
      this.ctx.translate(this.player.x + 40, this.player.y + 20);
      
      // Arc slash
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 40, -Math.PI / 2 + (slashProgress * Math.PI), -Math.PI / 4 + (slashProgress * Math.PI * 1.5));
      this.ctx.lineWidth = 6;
      this.ctx.lineCap = 'round';
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.stroke();

      // Outer glow slash
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 45, -Math.PI / 2 + (slashProgress * Math.PI), -Math.PI / 4 + (slashProgress * Math.PI * 1.5));
      this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = '#00e5ff';
      this.ctx.stroke();

      this.ctx.restore();
    } else if (!this.player.isGrounded) {
      drawDinoJump(this.ctx, this.player.x, this.player.y, ps, isHurt);
    } else {
      drawDinoRun(this.ctx, this.player.x, this.player.y, this.player.animFrame, ps, isHurt);
    }
  }

  private renderParticles() {
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'tear') {
        // Teardrop shape
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillRect(p.x - p.size / 4, p.y - p.size, p.size / 2, p.size);
      } else if (p.shape === 'note') {
        // Pixel music note
        this.ctx.fillRect(p.x, p.y, p.size, p.size);
        this.ctx.fillRect(p.x + p.size, p.y - p.size * 1.5, p.size / 2, p.size * 2);
      } else {
        this.ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }

      this.ctx.restore();
    }
  }

  private renderVictoryDanceScene(w: number, _h: number) {
    this.ctx.save();
    // Victory banner text
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#ffeb3b';
    this.ctx.font = '24px "Press Start 2P", monospace';
    this.ctx.shadowColor = '#000000';
    this.ctx.shadowOffsetX = 4;
    this.ctx.shadowOffsetY = 4;

    this.ctx.fillText('PORTAL REACHED!', w / 2, 100);

    this.ctx.fillStyle = '#00e5ff';
    this.ctx.font = '16px "Press Start 2P", monospace';
    this.ctx.fillText('VICTORY DANCE PARTY!', w / 2, 140);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '20px "VT323", monospace';
    this.ctx.fillText(`Entering Level ${this.currentLevel + 1} with Extra Speed...`, w / 2, 175);

    this.ctx.restore();
  }

  private renderGameOverScene(w: number, _h: number) {
    this.ctx.save();
    this.ctx.textAlign = 'center';

    // Ominous Blood-Red "EXTINCT" letters
    const pulse = Math.sin(this.extinctionTimer * 6) * 4;
    this.ctx.fillStyle = '#ff1744';
    this.ctx.font = '36px "Press Start 2P", monospace';
    this.ctx.shadowColor = '#000000';
    this.ctx.shadowOffsetX = 5;
    this.ctx.shadowOffsetY = 5;

    this.ctx.fillText('EXTINCT', w / 2, 110 + pulse);

    this.ctx.fillStyle = '#ff8a80';
    this.ctx.font = '14px "Press Start 2P", monospace';
    this.ctx.fillText('THE DINOSAUR COULD NOT ESCAPE THE CATACLYSM', w / 2, 155);

    this.ctx.fillStyle = '#00e5ff';
    this.ctx.font = '22px "VT323", monospace';
    this.ctx.fillText('Tears are flooding the crater...', w / 2, 185);

    this.ctx.restore();
  }
}
