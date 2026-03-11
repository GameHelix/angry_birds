// Core game types

export type BirdType = 'red' | 'blue' | 'yellow' | 'black';
export type BlockType = 'wood' | 'stone' | 'glass' | 'tnt';
export type GameState = 'menu' | 'playing' | 'paused' | 'levelComplete' | 'gameover' | 'win';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Vec2 {
  x: number;
  y: number;
}

export interface BirdConfig {
  type: BirdType;
  /** Canvas radius in pixels (at reference 800px width) */
  radius: number;
  color: string;
  eyeColor: string;
  /** Special ability: split | speedBoost | explode | egg */
  ability: 'split' | 'speedBoost' | 'explode' | 'egg' | 'none';
  mass: number;
  restitution: number;
}

export interface BlockConfig {
  x: number;
  y: number;
  w: number;
  h: number;
  type: BlockType;
  angle?: number;
}

export interface PigConfig {
  x: number;
  y: number;
  radius: number;
  health?: number;
}

export interface LevelData {
  id: number;
  name: string;
  birds: BirdType[];
  blocks: BlockConfig[];
  pigs: PigConfig[];
  background: string; // Tailwind/CSS gradient string
  par: number; // score threshold for 3 stars
}

export interface GameScore {
  level: number;
  score: number;
  stars: number;
  timestamp: number;
}

export interface HighScores {
  [levelId: number]: GameScore;
}

export interface GameStats {
  pigsDestroyed: number;
  blocksDestroyed: number;
  birdsUsed: number;
  totalScore: number;
}
