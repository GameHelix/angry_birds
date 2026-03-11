import { LevelData } from './types';

export const LEVELS: LevelData[] = [
  // ─── Level 1 – Tutorial: Glass tower ───
  {
    id: 1,
    name: 'First Strike',
    birds: ['red', 'red', 'red'],
    background: 'sky1',
    par: 12000,
    pigs: [
      { x: 600, y: 340, radius: 20 },
      { x: 680, y: 340, radius: 20 },
    ],
    blocks: [
      // Left pillar
      { x: 580, y: 370, w: 20, h: 60, type: 'glass' },
      { x: 700, y: 370, w: 20, h: 60, type: 'glass' },
      // Roof
      { x: 620, y: 342, w: 120, h: 16, type: 'glass' },
    ],
  },

  // ─── Level 2 – Wood structure ───
  {
    id: 2,
    name: 'Timber!',
    birds: ['red', 'blue', 'red', 'red'],
    background: 'sky2',
    par: 18000,
    pigs: [
      { x: 560, y: 340, radius: 20 },
      { x: 650, y: 290, radius: 20 },
      { x: 720, y: 340, radius: 20 },
    ],
    blocks: [
      // Ground floor columns
      { x: 540, y: 375, w: 18, h: 70, type: 'wood' },
      { x: 620, y: 375, w: 18, h: 70, type: 'wood' },
      { x: 700, y: 375, w: 18, h: 70, type: 'wood' },
      // Ground floor planks
      { x: 570, y: 342, w: 100, h: 16, type: 'wood' },
      { x: 640, y: 342, w: 100, h: 16, type: 'wood' },
      // Second floor columns
      { x: 590, y: 310, w: 18, h: 50, type: 'wood' },
      { x: 660, y: 310, w: 18, h: 50, type: 'wood' },
      // Second floor plank
      { x: 605, y: 285, w: 90, h: 14, type: 'wood' },
    ],
  },

  // ─── Level 3 – Stone fortress ───
  {
    id: 3,
    name: 'Stone Age',
    birds: ['yellow', 'yellow', 'black', 'red'],
    background: 'sky3',
    par: 20000,
    pigs: [
      { x: 530, y: 335, radius: 22 },
      { x: 630, y: 335, radius: 22 },
      { x: 730, y: 335, radius: 22 },
      { x: 630, y: 255, radius: 18 },
    ],
    blocks: [
      // Outer walls
      { x: 510, y: 375, w: 20, h: 80, type: 'stone' },
      { x: 750, y: 375, w: 20, h: 80, type: 'stone' },
      // Mid walls
      { x: 590, y: 375, w: 20, h: 80, type: 'stone' },
      { x: 670, y: 375, w: 20, h: 80, type: 'stone' },
      // Floor planks
      { x: 520, y: 338, w: 100, h: 16, type: 'wood' },
      { x: 640, y: 338, w: 100, h: 16, type: 'wood' },
      // Second floor walls
      { x: 590, y: 306, w: 20, h: 50, type: 'stone' },
      { x: 670, y: 306, w: 20, h: 50, type: 'stone' },
      // Top plank
      { x: 600, y: 278, w: 100, h: 14, type: 'wood' },
      // TNT crate
      { x: 630, y: 250, w: 28, h: 28, type: 'tnt' },
    ],
  },

  // ─── Level 4 – Mixed mayhem ───
  {
    id: 4,
    name: 'Piggy Paradise',
    birds: ['blue', 'yellow', 'black', 'black', 'red'],
    background: 'sky4',
    par: 28000,
    pigs: [
      { x: 510, y: 335, radius: 20 },
      { x: 590, y: 335, radius: 20 },
      { x: 670, y: 335, radius: 20 },
      { x: 750, y: 335, radius: 20 },
      { x: 630, y: 245, radius: 22 },
      { x: 630, y: 175, radius: 18 },
    ],
    blocks: [
      // Ground row
      { x: 490, y: 370, w: 16, h: 70, type: 'stone' },
      { x: 560, y: 370, w: 16, h: 70, type: 'stone' },
      { x: 630, y: 370, w: 16, h: 70, type: 'stone' },
      { x: 700, y: 370, w: 16, h: 70, type: 'stone' },
      { x: 760, y: 370, w: 16, h: 70, type: 'stone' },
      // Floor 1 planks
      { x: 498, y: 338, w: 76, h: 14, type: 'glass' },
      { x: 572, y: 338, w: 72, h: 14, type: 'glass' },
      { x: 644, y: 338, w: 72, h: 14, type: 'glass' },
      { x: 718, y: 338, w: 60, h: 14, type: 'glass' },
      // Floor 2 pillars
      { x: 560, y: 304, w: 16, h: 50, type: 'wood' },
      { x: 700, y: 304, w: 16, h: 50, type: 'wood' },
      // Floor 2 plank
      { x: 560, y: 275, w: 160, h: 14, type: 'wood' },
      // Floor 3
      { x: 615, y: 240, w: 16, h: 48, type: 'glass' },
      { x: 645, y: 240, w: 16, h: 48, type: 'glass' },
      { x: 606, y: 213, w: 68, h: 14, type: 'glass' },
      // Top tower
      { x: 614, y: 190, w: 16, h: 40, type: 'wood' },
      { x: 644, y: 190, w: 16, h: 40, type: 'wood' },
      { x: 608, y: 165, w: 62, h: 14, type: 'wood' },
      // TNT
      { x: 630, y: 155, w: 26, h: 26, type: 'tnt' },
    ],
  },

  // ─── Level 5 – Boss Fortress ───
  {
    id: 5,
    name: 'King\'s Castle',
    birds: ['black', 'yellow', 'blue', 'black', 'yellow', 'red'],
    background: 'sky5',
    par: 35000,
    pigs: [
      { x: 500, y: 330, radius: 24 },
      { x: 580, y: 330, radius: 22 },
      { x: 660, y: 330, radius: 22 },
      { x: 740, y: 330, radius: 24 },
      { x: 540, y: 250, radius: 20 },
      { x: 700, y: 250, radius: 20 },
      { x: 620, y: 170, radius: 26 }, // King pig
    ],
    blocks: [
      // Foundation
      { x: 480, y: 372, w: 22, h: 84, type: 'stone' },
      { x: 560, y: 372, w: 22, h: 84, type: 'stone' },
      { x: 620, y: 372, w: 22, h: 84, type: 'stone' },
      { x: 680, y: 372, w: 22, h: 84, type: 'stone' },
      { x: 758, y: 372, w: 22, h: 84, type: 'stone' },
      // Floor 1
      { x: 480, y: 334, w: 100, h: 16, type: 'stone' },
      { x: 622, y: 334, w: 80, h: 16, type: 'stone' },
      { x: 682, y: 334, w: 100, h: 16, type: 'stone' },
      // Floor 2 pillars
      { x: 520, y: 298, w: 18, h: 52, type: 'stone' },
      { x: 560, y: 298, w: 18, h: 52, type: 'stone' },
      { x: 680, y: 298, w: 18, h: 52, type: 'stone' },
      { x: 720, y: 298, w: 18, h: 52, type: 'stone' },
      // Floor 2
      { x: 510, y: 258, w: 88, h: 16, type: 'wood' },
      { x: 668, y: 258, w: 88, h: 16, type: 'wood' },
      // TNT towers
      { x: 540, y: 248, w: 26, h: 26, type: 'tnt' },
      { x: 700, y: 248, w: 26, h: 26, type: 'tnt' },
      // Top tower
      { x: 590, y: 220, w: 20, h: 56, type: 'stone' },
      { x: 650, y: 220, w: 20, h: 56, type: 'stone' },
      { x: 580, y: 193, w: 100, h: 16, type: 'stone' },
      { x: 580, y: 165, w: 20, h: 44, type: 'glass' },
      { x: 660, y: 165, w: 20, h: 44, type: 'glass' },
      { x: 574, y: 140, w: 112, h: 14, type: 'glass' },
    ],
  },
];
