export type GameState = 
  | 'STORY_INTRO'
  | 'MENU'
  | 'PLAYING'
  | 'PAUSED'
  | 'VICTORY_DANCING'
  | 'LEVEL_TRANSITION'
  | 'GAME_OVER'
  | 'GAME_WON_ALL';

export type DinoAnimState = 
  | 'RUN'
  | 'JUMP'
  | 'FALL'
  | 'FIRE_BREATH'
  | 'SWORD_SWING'
  | 'DUCK'
  | 'DANCE'
  | 'CRY'
  | 'HURT';

export interface DinoPlayer {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
  isGrounded: boolean;
  isJumping: boolean;
  isDucking: boolean;
  isBreathingFire: boolean;
  isSwingingSword: boolean;
  swordTimer: number;
  fireBreathTimer: number; // in frames/seconds
  fireEnergy: number; // 0 to 100
  maxFireEnergy: number;
  hp: number;
  maxHp: number;
  invulnerableTimer: number;
  animState: DinoAnimState;
  animFrame: number;
  animTimer: number;
  danceStep: number;
  danceTimer: number;
  cryTimer: number;
}

export type ObstacleType = 'VOLCANO' | 'LAVA_PIT' | 'GEYSER';

export interface VolcanoObstacle {
  id: number;
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
  eruptionTimer: number;
  isErupting: boolean;
  cleared: boolean;
}

export interface Meteor {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hp: number;
  rotation: number;
  trail: { x: number; y: number; alpha: number; size: number }[];
}

export type EnemyDinoType = 'PTERODACTYL' | 'RAPTOR' | 'ARMORED_TRICERATOPS' | 'T_REX_MINI';

export interface EnemyDino {
  id: number;
  type: EnemyDinoType;
  level: number;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  hp: number;
  maxHp: number;
  animFrame: number;
  animTimer: number;
  isAttacking?: boolean;
  shootTimer?: number;
  groundY: number;
}

export interface Portal {
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
  spinAngle: number;
  particles: { x: number; y: number; angle: number; speed: number; dist: number; color: string }[];
}

export interface FireParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export interface PixelParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  gravity?: number;
  shape?: 'square' | 'circle' | 'note' | 'tear';
}

export interface FireBreathProjectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
}

export interface LevelConfig {
  levelNumber: number;
  name: string;
  themeColor: string;
  skyColorTop: string;
  skyColorBottom: string;
  mountainColor: string;
  groundColor: string;
  lavaColor: string;
  targetDistance: number; // Distance in meters to reach portal
  baseSpeed: number;
  volcanoSpawnRate: number;
  meteorSpawnRate: number;
  enemyDinoTypes: EnemyDinoType[];
  enemySpawnRate: number;
  description: string;
  visualTheme?: 'ASHEN_CRATER' | 'PTEROSAUR_PEAKS' | 'RAPTOR_CANYON' | 'BASALT_FORTRESS' | 'TITAN_RIFT';
  groundStyle?: 'MAGMA' | 'HIGHWAY_PURPLE' | 'CANYON' | 'BASALT' | 'TITAN';
}

export interface GameStats {
  score: number;
  highScore: number;
  distance: number;
  level: number;
  meteorsDestroyed: number;
  volcanoesJumped: number;
  enemiesDefeated: number;
  fireBreathsUsed: number;
}
