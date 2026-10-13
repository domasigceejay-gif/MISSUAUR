/**
 * Pixel Art Sprite Rendering Engine
 * Renders crisp 8-bit / 16-bit style pixel sprites directly to canvas.
 */

// Helper to draw pixel matrix
export function drawPixelMatrix(
  ctx: CanvasRenderingContext2D,
  matrix: (string | null)[][],
  x: number,
  y: number,
  pixelSize: number = 3,
  flipX: boolean = false
) {
  const rows = matrix.length;
  const cols = matrix[0]?.length || 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const color = matrix[r][c];
      if (color) {
        ctx.fillStyle = color;
        const drawCol = flipX ? cols - 1 - c : c;
        ctx.fillRect(
          Math.floor(x + drawCol * pixelSize),
          Math.floor(y + r * pixelSize),
          pixelSize,
          pixelSize
        );
      }
    }
  }
}

// Color palettes
const C = {
  // Dino main
  D_GREEN_D: '#1e5128',
  D_GREEN_M: '#4e9f3d',
  D_GREEN_L: '#d8e9a8',
  D_BELLY: '#f0e68c',
  D_EYE_W: '#ffffff',
  D_EYE_P: '#111111',
  D_SPIKE: '#ff5722',
  D_CLAW: '#e0e0e0',
  D_FIRE_Y: '#ffeb3b',
  D_FIRE_O: '#ff9800',
  D_FIRE_R: '#f44336',
  D_TEAR: '#00e5ff',
  D_TEAR_L: '#b2ebf2',

  // Enemies
  PTERO_BODY: '#7b1fa2',
  PTERO_WING: '#ba68c8',
  PTERO_BEAK: '#ffa000',
  RAPTOR_B: '#d84315',
  RAPTOR_L: '#ff8a65',
  TRI_B: '#546e7a',
  TRI_HORN: '#eceff1',
  REX_B: '#c2185b',
  REX_BELLY: '#f48fb1',

  // Volcano & Rock
  ROCK_D: '#212121',
  ROCK_M: '#424242',
  ROCK_L: '#616161',
  LAVA_R: '#d50000',
  LAVA_O: '#ff6d00',
  LAVA_Y: '#ffd600',
  ASH_W: '#9e9e9e',
};

// Player Dino Running Animation Frames
export function drawDinoRun(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  pixelSize: number = 3,
  isHurt: boolean = false
) {
  ctx.save();
  if (isHurt && Math.floor(Date.now() / 80) % 2 === 0) {
    ctx.globalAlpha = 0.4;
  }

  const f = Math.floor(frame) % 4;
  const legOffset = f === 0 ? 0 : f === 1 ? 2 : f === 2 ? 0 : -2;
  const bob = f % 2 === 1 ? 1 : 0;

  // Render Dino body procedurally with sharp pixel precision
  const ps = pixelSize;

  // Tail
  ctx.fillStyle = C.D_GREEN_M;
  ctx.fillRect(x - 14 * ps, y + (6 + bob) * ps, 6 * ps, 4 * ps);
  ctx.fillRect(x - 8 * ps, y + (4 + bob) * ps, 8 * ps, 6 * ps);
  ctx.fillStyle = C.D_SPIKE;
  ctx.fillRect(x - 12 * ps, y + (4 + bob) * ps, 2 * ps, 2 * ps);
  ctx.fillRect(x - 6 * ps, y + (2 + bob) * ps, 2 * ps, 2 * ps);
  ctx.fillRect(x - 0 * ps, y + (0 + bob) * ps, 2 * ps, 2 * ps);

  // Torso
  ctx.fillStyle = C.D_GREEN_M;
  ctx.fillRect(x - 2 * ps, y + (2 + bob) * ps, 14 * ps, 12 * ps);
  // Belly
  ctx.fillStyle = C.D_BELLY;
  ctx.fillRect(x + 4 * ps, y + (6 + bob) * ps, 6 * ps, 7 * ps);

  // Tiny Arms
  ctx.fillStyle = C.D_GREEN_D;
  ctx.fillRect(x + 10 * ps, y + (7 + bob) * ps, 4 * ps, 2 * ps);
  ctx.fillRect(x + 12 * ps, y + (8 + bob) * ps, 2 * ps, 3 * ps);
  ctx.fillStyle = C.D_CLAW;
  ctx.fillRect(x + 13 * ps, y + (10 + bob) * ps, 2 * ps, 1 * ps);

  // Head & Snout
  ctx.fillStyle = C.D_GREEN_M;
  ctx.fillRect(x + 4 * ps, y - (8 - bob) * ps, 14 * ps, 11 * ps);
  ctx.fillRect(x + 14 * ps, y - (4 - bob) * ps, 6 * ps, 7 * ps);

  // Spikes on head
  ctx.fillStyle = C.D_SPIKE;
  ctx.fillRect(x + 4 * ps, y - (10 - bob) * ps, 2 * ps, 3 * ps);
  ctx.fillRect(x + 8 * ps, y - (10 - bob) * ps, 2 * ps, 3 * ps);

  // Eye
  ctx.fillStyle = C.D_EYE_W;
  ctx.fillRect(x + 10 * ps, y - (5 - bob) * ps, 4 * ps, 4 * ps);
  ctx.fillStyle = C.D_FIRE_O;
  ctx.fillRect(x + 12 * ps, y - (4 - bob) * ps, 2 * ps, 3 * ps);
  ctx.fillStyle = C.D_EYE_P;
  ctx.fillRect(x + 13 * ps, y - (4 - bob) * ps, 1 * ps, 2 * ps);

  // Teeth / Mouth line
  ctx.fillStyle = C.D_GREEN_D;
  ctx.fillRect(x + 12 * ps, y + (0 + bob) * ps, 8 * ps, 1 * ps);
  ctx.fillStyle = C.D_CLAW;
  ctx.fillRect(x + 14 * ps, y - (1 - bob) * ps, 1 * ps, 2 * ps);
  ctx.fillRect(x + 17 * ps, y - (1 - bob) * ps, 1 * ps, 2 * ps);

  // Legs (Animated cycle)
  ctx.fillStyle = C.D_GREEN_D;
  // Left leg
  const lY = y + 14 * ps;
  if (f === 0 || f === 2) {
    ctx.fillRect(x + 0 * ps, lY, 4 * ps, 6 * ps);
    ctx.fillRect(x + 2 * ps, lY + 5 * ps, 4 * ps, 2 * ps);
    ctx.fillRect(x + 8 * ps, lY, 4 * ps, 6 * ps);
    ctx.fillRect(x + 10 * ps, lY + 5 * ps, 4 * ps, 2 * ps);
  } else if (f === 1) {
    // Left forward, right back
    ctx.fillRect(x - 3 * ps, lY - 1 * ps, 4 * ps, 5 * ps);
    ctx.fillRect(x - 2 * ps, lY + 3 * ps, 4 * ps, 2 * ps);
    ctx.fillRect(x + 10 * ps, lY + 1 * ps, 4 * ps, 5 * ps);
    ctx.fillRect(x + 12 * ps, lY + 5 * ps, 4 * ps, 2 * ps);
  } else {
    // Left back, right forward
    ctx.fillRect(x + 5 * ps, lY + 1 * ps, 4 * ps, 5 * ps);
    ctx.fillRect(x + 7 * ps, lY + 5 * ps, 4 * ps, 2 * ps);
    ctx.fillRect(x - 1 * ps, lY - 1 * ps, 4 * ps, 5 * ps);
    ctx.fillRect(x + 0 * ps, lY + 3 * ps, 4 * ps, 2 * ps);
  }

  ctx.restore();
}

// Player Dino Jumping / Air
export function drawDinoJump(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  pixelSize: number = 3,
  isHurt: boolean = false
) {
  ctx.save();
  if (isHurt && Math.floor(Date.now() / 80) % 2 === 0) {
    ctx.globalAlpha = 0.4;
  }
  const ps = pixelSize;

  // Tail angled down
  ctx.fillStyle = C.D_GREEN_M;
  ctx.fillRect(x - 14 * ps, y + 8 * ps, 6 * ps, 5 * ps);
  ctx.fillRect(x - 8 * ps, y + 5 * ps, 8 * ps, 6 * ps);
  ctx.fillStyle = C.D_SPIKE;
  ctx.fillRect(x - 12 * ps, y + 6 * ps, 2 * ps, 2 * ps);
  ctx.fillRect(x - 6 * ps, y + 3 * ps, 2 * ps, 2 * ps);

  // Torso stretched
  ctx.fillStyle = C.D_GREEN_M;
  ctx.fillRect(x - 2 * ps, y + 2 * ps, 14 * ps, 11 * ps);
  ctx.fillStyle = C.D_BELLY;
  ctx.fillRect(x + 4 * ps, y + 5 * ps, 6 * ps, 7 * ps);

  // Arms up in air excitement
  ctx.fillStyle = C.D_GREEN_D;
  ctx.fillRect(x + 10 * ps, y + 4 * ps, 4 * ps, 2 * ps);
  ctx.fillRect(x + 12 * ps, y + 2 * ps, 3 * ps, 3 * ps);
  ctx.fillStyle = C.D_CLAW;
  ctx.fillRect(x + 14 * ps, y + 1 * ps, 2 * ps, 2 * ps);

  // Head tilted up
  ctx.fillStyle = C.D_GREEN_M;
  ctx.fillRect(x + 4 * ps, y - 9 * ps, 14 * ps, 11 * ps);
  ctx.fillRect(x + 14 * ps, y - 7 * ps, 7 * ps, 7 * ps);
  ctx.fillStyle = C.D_SPIKE;
  ctx.fillRect(x + 4 * ps, y - 11 * ps, 2 * ps, 3 * ps);
  ctx.fillRect(x + 8 * ps, y - 11 * ps, 2 * ps, 3 * ps);

  // Eye determined
  ctx.fillStyle = C.D_EYE_W;
  ctx.fillRect(x + 11 * ps, y - 6 * ps, 4 * ps, 4 * ps);
  ctx.fillStyle = C.D_FIRE_O;
  ctx.fillRect(x + 13 * ps, y - 5 * ps, 2 * ps, 3 * ps);
  ctx.fillStyle = C.D_EYE_P;
  ctx.fillRect(x + 14 * ps, y - 5 * ps, 1 * ps, 2 * ps);

  // Mouth slightly open
  ctx.fillStyle = C.D_GREEN_D;
  ctx.fillRect(x + 13 * ps, y - 2 * ps, 8 * ps, 2 * ps);

  // Legs tucked in for leap
  ctx.fillStyle = C.D_GREEN_D;
  ctx.fillRect(x - 2 * ps, y + 13 * ps, 6 * ps, 4 * ps);
  ctx.fillRect(x + 6 * ps, y + 12 * ps, 6 * ps, 4 * ps);
  ctx.fillStyle = C.D_CLAW;
  ctx.fillRect(x + 2 * ps, y + 15 * ps, 3 * ps, 2 * ps);
  ctx.fillRect(x + 10 * ps, y + 14 * ps, 3 * ps, 2 * ps);

  ctx.restore();
}

// Player Dino Breathing Fire (Roaring attack)
export function drawDinoFireBreath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  pixelSize: number = 3,
  isHurt: boolean = false
) {
  ctx.save();
  if (isHurt && Math.floor(Date.now() / 80) % 2 === 0) {
    ctx.globalAlpha = 0.4;
  }
  const ps = pixelSize;

  // Sturdy battle stance
  ctx.fillStyle = C.D_GREEN_M;
  ctx.fillRect(x - 14 * ps, y + 6 * ps, 6 * ps, 4 * ps);
  ctx.fillRect(x - 8 * ps, y + 4 * ps, 8 * ps, 6 * ps);
  ctx.fillStyle = C.D_SPIKE;
  ctx.fillRect(x - 12 * ps, y + 4 * ps, 2 * ps, 2 * ps);
  ctx.fillRect(x - 6 * ps, y + 2 * ps, 2 * ps, 2 * ps);

  // Torso
  ctx.fillStyle = C.D_GREEN_M;
  ctx.fillRect(x - 2 * ps, y + 3 * ps, 14 * ps, 11 * ps);
  // Glowing fiery throat & belly
  ctx.fillStyle = Math.random() > 0.5 ? C.D_FIRE_Y : C.D_FIRE_O;
  ctx.fillRect(x + 4 * ps, y + 5 * ps, 6 * ps, 7 * ps);

  // Claws forward bracing
  ctx.fillStyle = C.D_GREEN_D;
  ctx.fillRect(x + 10 * ps, y + 8 * ps, 5 * ps, 3 * ps);
  ctx.fillStyle = C.D_CLAW;
  ctx.fillRect(x + 14 * ps, y + 8 * ps, 2 * ps, 3 * ps);

  // Head - Snout Wide Open Roaring!
  ctx.fillStyle = C.D_GREEN_M;
  // Upper Jaw
  ctx.fillRect(x + 4 * ps, y - 9 * ps, 13 * ps, 8 * ps);
  ctx.fillRect(x + 14 * ps, y - 8 * ps, 8 * ps, 4 * ps);
  // Lower Jaw dropped
  ctx.fillRect(x + 6 * ps, y + 1 * ps, 14 * ps, 4 * ps);

  // Glowing red/yellow throat interior
  ctx.fillStyle = C.LAVA_R || '#ff1744';
  ctx.fillRect(x + 13 * ps, y - 4 * ps, 5 * ps, 5 * ps);
  ctx.fillStyle = C.D_FIRE_Y;
  ctx.fillRect(x + 15 * ps, y - 3 * ps, 4 * ps, 3 * ps);

  // Sharp fangs
  ctx.fillStyle = C.D_CLAW;
  ctx.fillRect(x + 16 * ps, y - 4 * ps, 1 * ps, 2 * ps);
  ctx.fillRect(x + 19 * ps, y - 4 * ps, 1 * ps, 2 * ps);
  ctx.fillRect(x + 17 * ps, y + 0 * ps, 1 * ps, 2 * ps);
  ctx.fillRect(x + 19 * ps, y + 0 * ps, 1 * ps, 2 * ps);

  // Fiery Eye
  ctx.fillStyle = C.D_FIRE_Y;
  ctx.fillRect(x + 10 * ps, y - 7 * ps, 4 * ps, 4 * ps);
  ctx.fillStyle = C.D_FIRE_R;
  ctx.fillRect(x + 12 * ps, y - 6 * ps, 2 * ps, 3 * ps);

  // Legs braced wide
  ctx.fillStyle = C.D_GREEN_D;
  ctx.fillRect(x - 2 * ps, y + 13 * ps, 5 * ps, 6 * ps);
  ctx.fillRect(x - 1 * ps, y + 17 * ps, 5 * ps, 2 * ps);
  ctx.fillRect(x + 8 * ps, y + 13 * ps, 5 * ps, 6 * ps);
  ctx.fillRect(x + 10 * ps, y + 17 * ps, 5 * ps, 2 * ps);

  ctx.restore();
}

// Victory Dancing Dinosaur (Funky celebration dance sequence)
export function drawDinoVictoryDance(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  step: number,
  pixelSize: number = 3.5
) {
  const ps = pixelSize;
  const s = Math.floor(step) % 6;

  ctx.save();

  // Dance movements: sway left/right, raise arms, bob head, party hat / sunglasses!
  const sway = s === 0 ? -3 : s === 1 ? -1 : s === 2 ? 2 : s === 3 ? 4 : s === 4 ? 2 : -1;
  const hop = s % 2 === 1 ? -4 : 0;
  const armUpLeft = s === 0 || s === 1 || s === 4;
  const armUpRight = s === 2 || s === 3 || s === 5;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(x + 7 * ps, y + 20 * ps, 14 * ps, 4 * ps, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tail wagging happily
  ctx.fillStyle = C.D_GREEN_M;
  const tailDir = s % 2 === 0 ? -1 : 1;
  ctx.fillRect(x - 10 * ps, y + (8 + hop) * ps, 6 * ps, 5 * ps);
  ctx.fillRect(x - (14 + tailDir * 2) * ps, y + (4 + hop) * ps, 6 * ps, 5 * ps);
  ctx.fillStyle = C.D_SPIKE;
  ctx.fillRect(x - 12 * ps, y + (3 + hop) * ps, 2 * ps, 3 * ps);

  // Torso front-facing groove
  ctx.fillStyle = C.D_GREEN_M;
  ctx.fillRect(x + sway * ps, y + (3 + hop) * ps, 16 * ps, 12 * ps);
  // Belly
  ctx.fillStyle = C.D_BELLY;
  ctx.fillRect(x + (sway + 3) * ps, y + (5 + hop) * ps, 10 * ps, 8 * ps);

  // Arms dancing (waving left/right/up)
  ctx.fillStyle = C.D_GREEN_D;
  if (armUpLeft) {
    ctx.fillRect(x + (sway - 4) * ps, y + (1 + hop) * ps, 4 * ps, 3 * ps);
    ctx.fillRect(x + (sway - 6) * ps, y - (3 - hop) * ps, 3 * ps, 5 * ps);
    ctx.fillStyle = C.D_CLAW;
    ctx.fillRect(x + (sway - 7) * ps, y - (4 - hop) * ps, 3 * ps, 2 * ps);
  } else {
    ctx.fillRect(x + (sway - 4) * ps, y + (6 + hop) * ps, 4 * ps, 3 * ps);
    ctx.fillRect(x + (sway - 5) * ps, y + (8 + hop) * ps, 3 * ps, 4 * ps);
  }

  ctx.fillStyle = C.D_GREEN_D;
  if (armUpRight) {
    ctx.fillRect(x + (sway + 16) * ps, y + (1 + hop) * ps, 4 * ps, 3 * ps);
    ctx.fillRect(x + (sway + 19) * ps, y - (3 - hop) * ps, 3 * ps, 5 * ps);
    ctx.fillStyle = C.D_CLAW;
    ctx.fillRect(x + (sway + 20) * ps, y - (4 - hop) * ps, 3 * ps, 2 * ps);
  } else {
    ctx.fillRect(x + (sway + 16) * ps, y + (6 + hop) * ps, 4 * ps, 3 * ps);
    ctx.fillRect(x + (sway + 18) * ps, y + (8 + hop) * ps, 3 * ps, 4 * ps);
  }

  // Head front/smiling happy
  ctx.fillStyle = C.D_GREEN_M;
  ctx.fillRect(x + (sway + 1) * ps, y - (9 - hop) * ps, 14 * ps, 11 * ps);

  // Golden Party Crown / Retro Sunglasses
  ctx.fillStyle = '#ffd700'; // Gold party crown
  ctx.fillRect(x + (sway + 3) * ps, y - (14 - hop) * ps, 10 * ps, 2 * ps);
  ctx.fillRect(x + (sway + 3) * ps, y - (17 - hop) * ps, 2 * ps, 3 * ps);
  ctx.fillRect(x + (sway + 7) * ps, y - (18 - hop) * ps, 2 * ps, 4 * ps);
  ctx.fillRect(x + (sway + 11) * ps, y - (17 - hop) * ps, 2 * ps, 3 * ps);
  ctx.fillStyle = '#ff1744';
  ctx.fillRect(x + (sway + 7) * ps, y - (15 - hop) * ps, 2 * ps, 2 * ps);

  // Big Happy Smiling Eyes
  ctx.fillStyle = C.D_EYE_P;
  // "^ ^" Happy eyes
  ctx.fillRect(x + (sway + 4) * ps, y - (6 - hop) * ps, 3 * ps, 1 * ps);
  ctx.fillRect(x + (sway + 3) * ps, y - (5 - hop) * ps, 1 * ps, 2 * ps);
  ctx.fillRect(x + (sway + 6) * ps, y - (5 - hop) * ps, 1 * ps, 2 * ps);

  ctx.fillRect(x + (sway + 10) * ps, y - (6 - hop) * ps, 3 * ps, 1 * ps);
  ctx.fillRect(x + (sway + 9) * ps, y - (5 - hop) * ps, 1 * ps, 2 * ps);
  ctx.fillRect(x + (sway + 12) * ps, y - (5 - hop) * ps, 1 * ps, 2 * ps);

  // Happy Blushing Cheeks
  ctx.fillStyle = '#ff5252';
  ctx.fillRect(x + (sway + 2) * ps, y - (3 - hop) * ps, 3 * ps, 2 * ps);
  ctx.fillRect(x + (sway + 12) * ps, y - (3 - hop) * ps, 3 * ps, 2 * ps);

  // Happy Open Smile
  ctx.fillStyle = '#212121';
  ctx.fillRect(x + (sway + 5) * ps, y - (2 - hop) * ps, 6 * ps, 3 * ps);
  ctx.fillStyle = '#ff4081'; // Tongue
  ctx.fillRect(x + (sway + 6) * ps, y - (1 - hop) * ps, 4 * ps, 2 * ps);

  // Legs dancing / shuffling
  ctx.fillStyle = C.D_GREEN_D;
  if (s % 2 === 0) {
    ctx.fillRect(x + (sway + 1) * ps, y + (15 + hop) * ps, 4 * ps, 5 * ps);
    ctx.fillRect(x + (sway - 1) * ps, y + (18 + hop) * ps, 5 * ps, 2 * ps);
    ctx.fillRect(x + (sway + 10) * ps, y + (15 + hop) * ps, 4 * ps, 3 * ps);
    ctx.fillRect(x + (sway + 12) * ps, y + (16 + hop) * ps, 5 * ps, 2 * ps);
  } else {
    ctx.fillRect(x + (sway + 2) * ps, y + (15 + hop) * ps, 4 * ps, 3 * ps);
    ctx.fillRect(x + (sway + 0) * ps, y + (16 + hop) * ps, 5 * ps, 2 * ps);
    ctx.fillRect(x + (sway + 11) * ps, y + (15 + hop) * ps, 4 * ps, 5 * ps);
    ctx.fillRect(x + (sway + 12) * ps, y + (18 + hop) * ps, 5 * ps, 2 * ps);
  }

  // Floating disco musical notes
  const noteY = y - 24 * ps - (s * 3);
  ctx.fillStyle = s % 2 === 0 ? '#ffeb3b' : '#00e5ff';
  ctx.fillRect(x + 22 * ps, noteY, 3 * ps, 3 * ps);
  ctx.fillRect(x + 24 * ps, noteY - 6 * ps, 2 * ps, 7 * ps);
  ctx.fillRect(x + 24 * ps, noteY - 6 * ps, 5 * ps, 2 * ps);

  ctx.restore();
}

// Crying Extinct Dinosaur (Sorrowful loss animation)
export function drawDinoCrying(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  timer: number,
  pixelSize: number = 3.5
) {
  const ps = pixelSize;
  const sob = Math.sin(timer * 8) * 1.5;
  const tearCycle = (timer * 3) % 1;

  ctx.save();

  // Shadow with puddle of tears
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(x + 8 * ps, y + 19 * ps, 16 * ps, 5 * ps, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tear puddle on the floor
  ctx.fillStyle = 'rgba(0, 229, 255, 0.7)';
  ctx.beginPath();
  ctx.ellipse(x + 18 * ps, y + 20 * ps, (8 + sob) * ps, 2.5 * ps, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tail curled on ground
  ctx.fillStyle = C.D_GREEN_D;
  ctx.fillRect(x - 12 * ps, y + 14 * ps, 6 * ps, 4 * ps);
  ctx.fillRect(x - 8 * ps, y + 12 * ps, 8 * ps, 5 * ps);

  // Body slumped down sadly
  ctx.fillStyle = C.D_GREEN_M;
  ctx.fillRect(x - 2 * ps, y + (7 + sob) * ps, 15 * ps, 11 * ps);
  ctx.fillStyle = C.D_BELLY;
  ctx.fillRect(x + 4 * ps, y + (9 + sob) * ps, 7 * ps, 8 * ps);

  // Arms wiping eyes / drooped
  ctx.fillStyle = C.D_GREEN_D;
  ctx.fillRect(x + 9 * ps, y + (5 + sob) * ps, 4 * ps, 5 * ps);
  ctx.fillRect(x + 12 * ps, y + (3 + sob) * ps, 3 * ps, 4 * ps);

  // Head drooped low
  ctx.fillStyle = C.D_GREEN_M;
  ctx.fillRect(x + 4 * ps, y - (1 - sob) * ps, 14 * ps, 10 * ps);
  ctx.fillRect(x + 14 * ps, y + (1 + sob) * ps, 6 * ps, 6 * ps);

  // Drooped Spikes
  ctx.fillStyle = C.D_SPIKE;
  ctx.fillRect(x + 4 * ps, y - (3 - sob) * ps, 2 * ps, 3 * ps);
  ctx.fillRect(x + 8 * ps, y - (3 - sob) * ps, 2 * ps, 3 * ps);

  // Sad Eyes (Crying waterfall streams)
  ctx.fillStyle = C.D_EYE_P;
  // Sad curved eye line "> <"
  ctx.fillRect(x + 11 * ps, y + (2 + sob) * ps, 3 * ps, 2 * ps);

  // Massive Pixel Tear Streams gushing out!
  ctx.fillStyle = C.D_TEAR;
  ctx.fillRect(x + 14 * ps, y + (3 + sob) * ps, 3 * ps, 3 * ps);
  ctx.fillRect(x + 16 * ps, y + (5 + sob) * ps, 4 * ps, 4 * ps);

  // Animated falling teardrops
  const tear1Y = y + (8 + sob) * ps + tearCycle * 35;
  const tear2Y = y + (10 + sob) * ps + ((tearCycle + 0.5) % 1) * 35;

  ctx.fillStyle = C.D_TEAR;
  ctx.fillRect(x + 18 * ps, tear1Y, 3 * ps, 4 * ps);
  ctx.fillStyle = C.D_TEAR_L;
  ctx.fillRect(x + 19 * ps, tear1Y, 1 * ps, 2 * ps);

  ctx.fillStyle = C.D_TEAR;
  ctx.fillRect(x + 15 * ps, tear2Y, 2.5 * ps, 3.5 * ps);

  // Sad trembling mouth frown
  ctx.fillStyle = C.D_GREEN_D;
  ctx.fillRect(x + 14 * ps, y + (6 + sob) * ps, 5 * ps, 2 * ps);
  ctx.fillRect(x + 13 * ps, y + (7 + sob) * ps, 2 * ps, 2 * ps);
  ctx.fillRect(x + 18 * ps, y + (7 + sob) * ps, 2 * ps, 2 * ps);

  // Legs sitting on ground
  ctx.fillStyle = C.D_GREEN_D;
  ctx.fillRect(x + 0 * ps, y + 16 * ps, 8 * ps, 4 * ps);
  ctx.fillRect(x + 6 * ps, y + 17 * ps, 6 * ps, 3 * ps);
  ctx.fillStyle = C.D_CLAW;
  ctx.fillRect(x + 11 * ps, y + 18 * ps, 3 * ps, 2 * ps);

  ctx.restore();
}

// Volcano Obstacle with bubbling magma and eruption sparks
export function drawVolcano(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  isErupting: boolean,
  timer: number
) {
  ctx.save();
  const ps = 4;

  // Base mountain slope
  const steps = Math.floor(height / ps);
  const w = width;

  for (let s = 0; s < steps; s++) {
    const progress = s / steps; // 0 at top, 1 at bottom
    const currentW = w * (0.35 + progress * 0.65);
    const currX = x + (w - currentW) / 2;
    const currY = y + s * ps;

    // Rock shading
    ctx.fillStyle = progress > 0.7 ? C.ROCK_D : progress > 0.3 ? C.ROCK_M : C.ROCK_L;
    ctx.fillRect(currX, currY, currentW, ps);

    // Glowing magma fissures
    if (s % 3 === 0 && progress > 0.2) {
      ctx.fillStyle = Math.sin(timer * 5 + s) > 0 ? C.LAVA_O : C.LAVA_R;
      ctx.fillRect(currX + currentW * 0.4, currY, ps * 1.5, ps);
      ctx.fillRect(currX + currentW * 0.7, currY, ps * 1.5, ps);
    }
  }

  // Volcano Crater Peak with glowing lava
  const craterW = w * 0.45;
  const craterX = x + (w - craterW) / 2;
  const lavaPulse = Math.sin(timer * 8) * 0.5 + 0.5;

  ctx.fillStyle = lavaPulse > 0.5 ? C.LAVA_Y : C.LAVA_O;
  ctx.fillRect(craterX, y, craterW, ps * 2);
  ctx.fillStyle = C.LAVA_R;
  ctx.fillRect(craterX + 2 * ps, y + ps, craterW - 4 * ps, ps);

  // Eruption magma plume when erupting
  if (isErupting) {
    const plumeH = 40 + Math.sin(timer * 20) * 15;
    ctx.fillStyle = C.LAVA_Y;
    ctx.fillRect(craterX + craterW * 0.35, y - plumeH, craterW * 0.3, plumeH);

    // Magma sparks bursting
    ctx.fillStyle = C.LAVA_O;
    for (let i = 0; i < 5; i++) {
      const sparkX = craterX + (Math.sin(timer * 12 + i * 2) * 30);
      const sparkY = y - plumeH - (Math.cos(timer * 15 + i) * 20);
      ctx.fillRect(sparkX, sparkY, ps, ps);
    }
  }

  ctx.restore();
}

// Falling Fiery Meteor
export function drawMeteor(
  ctx: CanvasRenderingContext2D,
  meteor: { x: number; y: number; radius: number; rotation: number; trail: { x: number; y: number; alpha: number; size: number }[] }
) {
  ctx.save();

  // Fiery smoke trail
  for (const t of meteor.trail) {
    ctx.fillStyle = `rgba(255, 109, 0, ${t.alpha * 0.6})`;
    ctx.fillRect(t.x - t.size / 2, t.y - t.size / 2, t.size, t.size);
    ctx.fillStyle = `rgba(255, 214, 0, ${t.alpha * 0.9})`;
    ctx.fillRect(t.x - t.size / 4, t.y - t.size / 4, t.size / 2, t.size / 2);
  }

  ctx.translate(meteor.x, meteor.y);
  ctx.rotate(meteor.rotation);

  const r = meteor.radius;
  const ps = 3;

  // Meteor outer flame aura
  ctx.fillStyle = C.D_FIRE_O;
  ctx.fillRect(-r - 4, -r - 4, (r + 4) * 2, (r + 4) * 2);

  // Meteor core rock (jagged pixel asteroid)
  ctx.fillStyle = C.ROCK_D;
  ctx.fillRect(-r, -r, r * 2, r * 2);
  ctx.fillRect(-r + 2, -r - 2, r * 2 - 4, 2);
  ctx.fillRect(-r + 2, r, r * 2 - 4, 2);

  // Molten cracks
  ctx.fillStyle = C.LAVA_Y;
  ctx.fillRect(-r / 2, -r / 2, ps * 2, ps);
  ctx.fillRect(0, 0, ps * 2, ps);
  ctx.fillRect(-r / 3, r / 3, ps * 3, ps);

  ctx.restore();
}

// Enemy Dinosaurs
export function drawEnemyDino(
  ctx: CanvasRenderingContext2D,
  enemy: { type: string; level: number; x: number; y: number; width: number; height: number; animFrame: number }
) {
  ctx.save();
  const ps = 3;
  const f = Math.floor(enemy.animFrame);

  if (enemy.type === 'PTERODACTYL') {
    // Floating Level indicator badge as seen in screenshot
    ctx.save();
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(enemy.x + 2, enemy.y - 12, 30, 9);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`LV. ${enemy.level}`, enemy.x + 17, enemy.y - 5);
    ctx.restore();

    // Flying Pterosaur
    const flap = f % 2 === 0;
    const wingY = flap ? -8 * ps : 6 * ps;

    // Body
    ctx.fillStyle = C.PTERO_BODY;
    ctx.fillRect(enemy.x, enemy.y + 4 * ps, 12 * ps, 6 * ps);

    // Beak
    ctx.fillStyle = C.PTERO_BEAK;
    ctx.fillRect(enemy.x - 8 * ps, enemy.y + 6 * ps, 9 * ps, 3 * ps);

    // Eye
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(enemy.x - 2 * ps, enemy.y + 5 * ps, 2 * ps, 2 * ps);
    ctx.fillStyle = '#000000';
    ctx.fillRect(enemy.x - 2 * ps, enemy.y + 5 * ps, 1 * ps, 1 * ps);

    // Crest
    ctx.fillStyle = '#d50000';
    ctx.fillRect(enemy.x + 8 * ps, enemy.y + 2 * ps, 6 * ps, 4 * ps);

    // Wings
    ctx.fillStyle = C.PTERO_WING;
    ctx.fillRect(enemy.x + 2 * ps, enemy.y + 4 * ps + (flap ? -6 * ps : 0), 10 * ps, 4 * ps);
    ctx.fillRect(enemy.x + 6 * ps, enemy.y + 4 * ps + wingY, 12 * ps, 3 * ps);
  } else if (enemy.type === 'RAPTOR') {
    // Fast Leaping Raptor
    ctx.fillStyle = C.RAPTOR_B;
    ctx.fillRect(enemy.x - 2 * ps, enemy.y + 2 * ps, 14 * ps, 8 * ps);
    // Head forward
    ctx.fillRect(enemy.x - 10 * ps, enemy.y - 4 * ps, 10 * ps, 7 * ps);
    ctx.fillRect(enemy.x - 14 * ps, enemy.y - 1 * ps, 6 * ps, 4 * ps);

    // Eye
    ctx.fillStyle = '#ffeb3b';
    ctx.fillRect(enemy.x - 7 * ps, enemy.y - 2 * ps, 2 * ps, 2 * ps);
    ctx.fillStyle = '#000';
    ctx.fillRect(enemy.x - 7 * ps, enemy.y - 2 * ps, 1 * ps, 2 * ps);

    // Claws
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(enemy.x - 14 * ps, enemy.y + 2 * ps, 2 * ps, 2 * ps);

    // Legs
    const legF = f % 2;
    ctx.fillStyle = C.RAPTOR_B;
    ctx.fillRect(enemy.x + (legF ? 0 : 6) * ps, enemy.y + 10 * ps, 4 * ps, 6 * ps);
    ctx.fillRect(enemy.x + (legF ? 6 : 0) * ps, enemy.y + 9 * ps, 4 * ps, 7 * ps);
  } else if (enemy.type === 'ARMORED_TRICERATOPS') {
    // Heavy Armored Spiked Triceratops
    ctx.fillStyle = C.TRI_B;
    ctx.fillRect(enemy.x - 4 * ps, enemy.y + 2 * ps, 18 * ps, 12 * ps);
    // Skull Frill Shield
    ctx.fillStyle = '#37474f';
    ctx.fillRect(enemy.x - 8 * ps, enemy.y - 6 * ps, 6 * ps, 14 * ps);
    // Horns
    ctx.fillStyle = C.TRI_HORN;
    ctx.fillRect(enemy.x - 14 * ps, enemy.y - 5 * ps, 7 * ps, 2 * ps);
    ctx.fillRect(enemy.x - 12 * ps, enemy.y + 1 * ps, 5 * ps, 2 * ps);
    // Nose horn
    ctx.fillRect(enemy.x - 14 * ps, enemy.y + 5 * ps, 4 * ps, 2 * ps);

    // Eye
    ctx.fillStyle = '#ff1744';
    ctx.fillRect(enemy.x - 6 * ps, enemy.y + 1 * ps, 2 * ps, 2 * ps);

    // Sturdy Legs
    ctx.fillStyle = '#263238';
    ctx.fillRect(enemy.x - 2 * ps, enemy.y + 14 * ps, 5 * ps, 6 * ps);
    ctx.fillRect(enemy.x + 8 * ps, enemy.y + 14 * ps, 5 * ps, 6 * ps);
  } else {
    // Mini T-Rex / Boss Drake
    ctx.fillStyle = C.REX_B;
    ctx.fillRect(enemy.x - 2 * ps, enemy.y + 0 * ps, 18 * ps, 14 * ps);
    ctx.fillStyle = C.REX_BELLY;
    ctx.fillRect(enemy.x - 6 * ps, enemy.y + 4 * ps, 6 * ps, 8 * ps);
    // Big head
    ctx.fillStyle = C.REX_B;
    ctx.fillRect(enemy.x - 14 * ps, enemy.y - 8 * ps, 14 * ps, 12 * ps);
    // Eye
    ctx.fillStyle = '#ffd600';
    ctx.fillRect(enemy.x - 10 * ps, enemy.y - 5 * ps, 3 * ps, 3 * ps);
    // Teeth
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(enemy.x - 14 * ps, enemy.y + 1 * ps, 8 * ps, 2 * ps);
    // Legs
    ctx.fillStyle = '#880e4f';
    ctx.fillRect(enemy.x - 0 * ps, enemy.y + 14 * ps, 6 * ps, 7 * ps);
    ctx.fillRect(enemy.x + 8 * ps, enemy.y + 14 * ps, 6 * ps, 7 * ps);
  }

  // Level Badge over enemy
  ctx.fillStyle = '#ffeb3b';
  ctx.font = '10px "Press Start 2P", monospace';
  ctx.fillText(`LV.${enemy.level}`, enemy.x - 8, enemy.y - 12);

  ctx.restore();
}

// End-of-Level Dimension Portal Vortex
export function drawPortal(
  ctx: CanvasRenderingContext2D,
  portal: { x: number; y: number; width: number; height: number; spinAngle: number; particles: { x: number; y: number; angle: number; speed: number; dist: number; color: string }[] }
) {
  ctx.save();
  const centerX = portal.x + portal.width / 2;
  const centerY = portal.y + portal.height / 2;

  // Swirling dimensional vortex rings
  const ringColors = ['#00e5ff', '#d500f9', '#651fff', '#76ff03', '#ffffff'];

  for (let i = 4; i >= 0; i--) {
    const radiusX = (portal.width / 2) * (0.3 + i * 0.18);
    const radiusY = (portal.height / 2) * (0.3 + i * 0.18);

    ctx.strokeStyle = ringColors[i % ringColors.length];
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, portal.spinAngle * (i % 2 === 0 ? 1 : -1), 0, Math.PI * 2);
    ctx.stroke();
  }

  // Glowing center beam
  const glow = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, portal.width / 2);
  glow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  glow.addColorStop(0.4, 'rgba(0, 229, 255, 0.7)');
  glow.addColorStop(0.8, 'rgba(213, 0, 249, 0.4)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, portal.width / 2, portal.height / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Portal orbiting particles
  for (const p of portal.particles) {
    const px = centerX + Math.cos(p.angle) * p.dist;
    const py = centerY + Math.sin(p.angle) * (p.dist * 1.4);
    ctx.fillStyle = p.color;
    ctx.fillRect(px - 2, py - 2, 4, 4);
  }

  // Portal Arch frame
  ctx.fillStyle = '#37474f';
  ctx.fillRect(portal.x, portal.y + portal.height - 8, portal.width, 8);

  ctx.restore();
}
