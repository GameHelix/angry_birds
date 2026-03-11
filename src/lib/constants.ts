// Game constants

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 450;

export const GRAVITY = 1.5;
export const GROUND_Y = CANVAS_HEIGHT - 60; // ground surface y

export const SLINGSHOT_X = 140;
export const SLINGSHOT_Y = GROUND_Y - 70; // fork tip y

/** Max drag distance from slingshot anchor */
export const MAX_DRAG = 80;
/** Launch power multiplier */
export const LAUNCH_POWER = 0.018;

export const BIRD_CONFIGS = {
  red: { radius: 18, color: '#e63946', eyeColor: '#fff', ability: 'none', mass: 1, restitution: 0.4 },
  blue: { radius: 14, color: '#4fc3f7', eyeColor: '#fff', ability: 'split', mass: 0.7, restitution: 0.5 },
  yellow: { radius: 17, color: '#ffd166', eyeColor: '#fff', ability: 'speedBoost', mass: 0.9, restitution: 0.3 },
  black: { radius: 20, color: '#2d2d2d', eyeColor: '#fff', ability: 'explode', mass: 1.5, restitution: 0.1 },
} as const;

export const BLOCK_HEALTH = {
  glass: 20,
  wood: 50,
  stone: 120,
  tnt: 80,
} as const;

export const BLOCK_COLORS = {
  glass: { fill: 'rgba(180,230,255,0.7)', stroke: '#a0d8ef' },
  wood: { fill: '#c8a46e', stroke: '#8B6914' },
  stone: { fill: '#9e9e9e', stroke: '#616161' },
  tnt: { fill: '#e74c3c', stroke: '#c0392b' },
} as const;

export const PIG_COLOR = '#78c800';
export const PIG_STROKE = '#4a7c00';
export const PIG_BASE_HEALTH = { easy: 40, medium: 60, hard: 100 } as const;

export const SCORE_PER_PIG = 5000;
export const SCORE_PER_BLOCK = 500;
export const SCORE_PER_LEFTOVER_BIRD = 3000;

export const LOCAL_STORAGE_KEY = 'angrybirds_highscores';
export const LOCAL_STORAGE_SOUND_KEY = 'angrybirds_sound';
export const LOCAL_STORAGE_MUSIC_KEY = 'angrybirds_music';
