import { LevelData } from './types';

// GROUND_Y = 390 (= CANVAS_HEIGHT - 60)
// Box resting on ground:  center_y = 390 - h/2
// Box on top of another:  center_y = base_cy - base_hh - own_hh
// Circle on ground:       center_y = 390 - radius

export const LEVELS: LevelData[] = [
  // ─── Level 1 – Tutorial: Glass tower ───
  {
    id: 1,
    name: 'First Strike',
    birds: ['red', 'red', 'red'],
    background: 'sky1',
    par: 12000,
    pigs: [
      { x: 615, y: 370, radius: 20 }, // on ground, between pillars
      { x: 665, y: 370, radius: 20 },
    ],
    blocks: [
      // Pillars: h=60, center_y = 390-30 = 360, tops at y=330
      { x: 580, y: 360, w: 20, h: 60, type: 'glass' },
      { x: 700, y: 360, w: 20, h: 60, type: 'glass' },
      // Roof: h=16, on pillar tops (330): center_y = 330-8 = 322
      { x: 640, y: 322, w: 120, h: 16, type: 'glass' },
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
      { x: 560, y: 370, radius: 20 }, // ground left
      { x: 650, y: 220, radius: 20 }, // 2F plank top=240, y=240-20=220
      { x: 720, y: 370, radius: 20 }, // ground right
    ],
    blocks: [
      // Ground columns: h=70, center_y = 390-35 = 355, tops at 320
      { x: 540, y: 355, w: 18, h: 70, type: 'wood' },
      { x: 620, y: 355, w: 18, h: 70, type: 'wood' },
      { x: 700, y: 355, w: 18, h: 70, type: 'wood' },
      // Floor 1 planks: h=16, on col tops (320): y = 320-8 = 312, tops at 304
      { x: 570, y: 312, w: 100, h: 16, type: 'wood' },
      { x: 640, y: 312, w: 100, h: 16, type: 'wood' },
      // 2F columns: h=50, on plank tops (304): y = 304-25 = 279, tops at 254
      { x: 590, y: 279, w: 18, h: 50, type: 'wood' },
      { x: 660, y: 279, w: 18, h: 50, type: 'wood' },
      // 2F plank: h=14, on 2F col tops (254): y = 254-7 = 247, top at 240
      { x: 625, y: 247, w: 90, h: 14, type: 'wood' },
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
      { x: 530, y: 368, radius: 22 }, // ground: 390-22=368
      { x: 630, y: 368, radius: 22 },
      { x: 730, y: 368, radius: 22 },
      { x: 630, y: 184, radius: 18 }, // on TNT top (202): y=202-18=184
    ],
    blocks: [
      // Outer walls: h=80, center_y = 390-40 = 350, tops at 310
      { x: 510, y: 350, w: 20, h: 80, type: 'stone' },
      { x: 750, y: 350, w: 20, h: 80, type: 'stone' },
      // Inner walls: h=80, y=350, tops at 310
      { x: 590, y: 350, w: 20, h: 80, type: 'stone' },
      { x: 670, y: 350, w: 20, h: 80, type: 'stone' },
      // Floor 1 planks: h=16, on wall tops (310): y = 310-8 = 302, tops at 294
      { x: 520, y: 302, w: 100, h: 16, type: 'wood' },
      { x: 640, y: 302, w: 100, h: 16, type: 'wood' },
      // 2F walls: h=50, on plank tops (294): y = 294-25 = 269, tops at 244
      { x: 590, y: 269, w: 20, h: 50, type: 'stone' },
      { x: 670, y: 269, w: 20, h: 50, type: 'stone' },
      // Top plank: h=14, on 2F wall tops (244): y = 244-7 = 237, top at 230
      { x: 630, y: 237, w: 100, h: 14, type: 'wood' },
      // TNT crate: h=28, on top plank (230): y = 230-14 = 216, top at 202
      { x: 630, y: 216, w: 28, h: 28, type: 'tnt' },
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
      { x: 510, y: 370, radius: 20 }, // ground: 390-20=370
      { x: 590, y: 370, radius: 20 },
      { x: 670, y: 370, radius: 20 },
      { x: 750, y: 370, radius: 20 },
      { x: 630, y: 220, radius: 22 }, // 2F plank top=242: y=242-22=220
      { x: 630, y: 162, radius: 18 }, // 3F plank top=180: y=180-18=162
    ],
    blocks: [
      // Ground columns: h=70, y=390-35=355, tops at 320
      { x: 490, y: 355, w: 16, h: 70, type: 'stone' },
      { x: 560, y: 355, w: 16, h: 70, type: 'stone' },
      { x: 630, y: 355, w: 16, h: 70, type: 'stone' },
      { x: 700, y: 355, w: 16, h: 70, type: 'stone' },
      { x: 760, y: 355, w: 16, h: 70, type: 'stone' },
      // Floor 1 planks: h=14, on col tops (320): y=320-7=313, tops at 306
      { x: 498, y: 313, w: 76, h: 14, type: 'glass' },
      { x: 572, y: 313, w: 72, h: 14, type: 'glass' },
      { x: 644, y: 313, w: 72, h: 14, type: 'glass' },
      { x: 718, y: 313, w: 60, h: 14, type: 'glass' },
      // 2F pillars: h=50, on F1 tops (306): y=306-25=281, tops at 256
      { x: 560, y: 281, w: 16, h: 50, type: 'wood' },
      { x: 700, y: 281, w: 16, h: 50, type: 'wood' },
      // 2F plank: h=14, on 2F pillar tops (256): y=256-7=249, top at 242
      { x: 630, y: 249, w: 160, h: 14, type: 'wood' },
      // 3F pillars: h=48, on 2F plank top (242): y=242-24=218, tops at 194
      { x: 615, y: 218, w: 16, h: 48, type: 'glass' },
      { x: 645, y: 218, w: 16, h: 48, type: 'glass' },
      // 3F plank: h=14, on 3F pillar tops (194): y=194-7=187, top at 180
      { x: 606, y: 187, w: 68, h: 14, type: 'glass' },
      // 4F pillars: h=40, on 3F plank top (180): y=180-20=160, tops at 140
      { x: 614, y: 160, w: 16, h: 40, type: 'wood' },
      { x: 644, y: 160, w: 16, h: 40, type: 'wood' },
      // 4F plank: h=14, on 4F pillar tops (140): y=140-7=133, top at 126
      { x: 608, y: 133, w: 62, h: 14, type: 'wood' },
      // TNT: h=26, on 4F plank top (126): y=126-13=113
      { x: 630, y: 113, w: 26, h: 26, type: 'tnt' },
    ],
  },

  // ─── Level 5 – Boss Fortress ───
  {
    id: 5,
    name: "King's Castle",
    birds: ['black', 'yellow', 'blue', 'black', 'yellow', 'red'],
    background: 'sky5',
    par: 35000,
    pigs: [
      { x: 520, y: 366, radius: 22 }, // ground, left chamber: 390-22=368 (approx)
      { x: 590, y: 370, radius: 18 }, // ground, center-left narrow chamber
      { x: 650, y: 370, radius: 18 }, // ground, center-right narrow chamber
      { x: 720, y: 366, radius: 22 }, // ground, right chamber
      { x: 540, y: 202, radius: 20 }, // 2F: plank top=222, y=222-20=202
      { x: 700, y: 202, radius: 20 },
      { x: 620, y: 66,  radius: 26 }, // King pig: cap plank top=92, y=92-26=66
    ],
    blocks: [
      // Foundation columns: h=84, y=390-42=348, tops at 306
      { x: 480, y: 348, w: 22, h: 84, type: 'stone' },
      { x: 560, y: 348, w: 22, h: 84, type: 'stone' },
      { x: 620, y: 348, w: 22, h: 84, type: 'stone' },
      { x: 680, y: 348, w: 22, h: 84, type: 'stone' },
      { x: 758, y: 348, w: 22, h: 84, type: 'stone' },
      // Floor 1 planks: h=16, on foundation tops (306): y=306-8=298, tops at 290
      { x: 480, y: 298, w: 100, h: 16, type: 'stone' },
      { x: 622, y: 298, w:  80, h: 16, type: 'stone' },
      { x: 682, y: 298, w: 100, h: 16, type: 'stone' },
      // 2F pillars: h=52, on F1 plank tops (290): y=290-26=264, tops at 238
      { x: 520, y: 264, w: 18, h: 52, type: 'stone' },
      { x: 560, y: 264, w: 18, h: 52, type: 'stone' },
      { x: 680, y: 264, w: 18, h: 52, type: 'stone' },
      { x: 720, y: 264, w: 18, h: 52, type: 'stone' },
      // Floor 2 planks: h=16, on 2F pillar tops (238): y=238-8=230, tops at 222
      { x: 510, y: 230, w: 88, h: 16, type: 'wood' },
      { x: 668, y: 230, w: 88, h: 16, type: 'wood' },
      // TNT: h=26, on F2 plank tops (222): y=222-13=209
      { x: 540, y: 209, w: 26, h: 26, type: 'tnt' },
      { x: 700, y: 209, w: 26, h: 26, type: 'tnt' },
      // Top tower pillars: h=56, on F2 plank tops (222): y=222-28=194, tops at 166
      { x: 590, y: 194, w: 20, h: 56, type: 'stone' },
      { x: 650, y: 194, w: 20, h: 56, type: 'stone' },
      // Top plank: h=16, on top tower tops (166): y=166-8=158, top at 150
      { x: 580, y: 158, w: 100, h: 16, type: 'stone' },
      // Glass pillars: h=44, on top plank top (150): y=150-22=128, tops at 106
      { x: 580, y: 128, w: 20, h: 44, type: 'glass' },
      { x: 660, y: 128, w: 20, h: 44, type: 'glass' },
      // Cap plank: h=14, on glass pillar tops (106): y=106-7=99, top at 92
      { x: 574, y: 99, w: 112, h: 14, type: 'glass' },
    ],
  },
];
