'use client';

import { useRef, useEffect, useCallback } from 'react';
import {
  CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_Y,
  SLINGSHOT_X, SLINGSHOT_Y, MAX_DRAG,
  BIRD_CONFIGS, BLOCK_COLORS, PIG_COLOR, PIG_STROKE,
} from '@/lib/constants';
import { GameEngineState, ActiveBird, ActivePig, ActiveBlock, Particle } from '@/hooks/useGameEngine';

interface GameCanvasProps {
  engineState: GameEngineState;
  onDragStart: (x: number, y: number) => void;
  onDragMove: (x: number, y: number) => void;
  onDragEnd: () => void;
  onAbility: () => void;
  background: string;
}

// Background gradients
const BACKGROUNDS: Record<string, string[]> = {
  sky1: ['#87CEEB', '#E0F4FF', '#d4e8a0'],
  sky2: ['#FF9A56', '#FFD580', '#c8e6a0'],
  sky3: ['#2c3e50', '#4a6fa5', '#5a8c4a'],
  sky4: ['#1a1a2e', '#16213e', '#3a6a3a'],
  sky5: ['#0f0c29', '#302b63', '#24243e'],
};

export default function GameCanvas({
  engineState, onDragStart, onDragMove, onDragEnd, onAbility, background,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });

  // Compute canvas → game coordinates
  const toGameCoords = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) / scaleRef.current;
    const y = (clientY - rect.top) / scaleRef.current;
    return { x, y };
  }, []);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const { x, y } = toGameCoords(e.clientX, e.clientY);
    const dx = x - SLINGSHOT_X, dy = y - SLINGSHOT_Y;
    if (Math.sqrt(dx * dx + dy * dy) < MAX_DRAG + 30) {
      onDragStart(x, y);
    } else {
      onAbility();
    }
  }, [toGameCoords, onDragStart, onAbility]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!engineState.dragging) return;
    const { x, y } = toGameCoords(e.clientX, e.clientY);
    onDragMove(x, y);
  }, [engineState.dragging, toGameCoords, onDragMove]);

  const handleMouseUp = useCallback(() => {
    if (engineState.dragging) onDragEnd();
  }, [engineState.dragging, onDragEnd]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const { x, y } = toGameCoords(touch.clientX, touch.clientY);
    const dx = x - SLINGSHOT_X, dy = y - SLINGSHOT_Y;
    if (Math.sqrt(dx * dx + dy * dy) < MAX_DRAG + 30) {
      onDragStart(x, y);
    } else {
      onAbility();
    }
  }, [toGameCoords, onDragStart, onAbility]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const { x, y } = toGameCoords(touch.clientX, touch.clientY);
    onDragMove(x, y);
  }, [toGameCoords, onDragMove]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    onDragEnd();
  }, [onDragEnd]);

  // Responsive scale
  useEffect(() => {
    const updateScale = () => {
      const container = containerRef.current;
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const scale = Math.min(w / CANVAS_WIDTH, h / CANVAS_HEIGHT, 1);
      scaleRef.current = scale;
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Draw everything
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const bg = BACKGROUNDS[background] ?? BACKGROUNDS.sky1;

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT * 0.7);
    skyGrad.addColorStop(0, bg[0]);
    skyGrad.addColorStop(1, bg[1]);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT * 0.7);

    // Ground gradient
    const gndGrad = ctx.createLinearGradient(0, CANVAS_HEIGHT * 0.65, 0, CANVAS_HEIGHT);
    gndGrad.addColorStop(0, '#5a9e3a');
    gndGrad.addColorStop(0.15, '#4a8e2a');
    gndGrad.addColorStop(1, '#3a6e1a');
    ctx.fillStyle = gndGrad;
    ctx.fillRect(0, CANVAS_HEIGHT * 0.65, CANVAS_WIDTH, CANVAS_HEIGHT * 0.35);

    // Ground line / dirt
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(0, GROUND_Y + 20, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y - 20);

    // Clouds
    drawClouds(ctx, bg[0]);

    // Trajectory dots
    if (engineState.activeBird && !engineState.activeBird.launched && engineState.dragPos) {
      drawTrajectory(ctx, engineState.activeBird.trajectory);
    }

    // Slingshot
    drawSlingshot(ctx);

    // Waiting birds (queue)
    drawBirdQueue(ctx, engineState.birdsQueue, engineState.currentBirdIndex);

    // Blocks
    engineState.blocks.forEach(b => {
      if (b.alive) drawBlock(ctx, b);
    });

    // Pigs
    engineState.pigs.forEach(p => {
      if (p.alive) drawPig(ctx, p);
    });

    // Active bird
    if (engineState.activeBird) {
      drawBird(ctx, engineState.activeBird);
    }

    // Slingshot bands (on top of bird)
    if (engineState.activeBird && !engineState.activeBird.launched) {
      drawSlingshotBands(ctx, engineState.activeBird.body.x, engineState.activeBird.body.y);
    }

    // Particles
    engineState.particles.forEach(p => drawParticle(ctx, p));

    // Drag indicator
    if (engineState.dragging && engineState.activeBird) {
      ctx.beginPath();
      ctx.arc(engineState.activeBird.body.x, engineState.activeBird.body.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fill();
    }

  }, [engineState, background]);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="rounded-xl shadow-2xl cursor-crosshair select-none"
        style={{ imageRendering: 'pixelated', maxWidth: '100%', maxHeight: '100%' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  );
}

// ─── Draw helpers ──────────────────────────────────────────────────────────

function drawClouds(ctx: CanvasRenderingContext2D, skyColor: string) {
  const cloudData = [
    { x: 100, y: 60, r: 30, opacity: 0.8 },
    { x: 300, y: 40, r: 40, opacity: 0.7 },
    { x: 500, y: 70, r: 25, opacity: 0.9 },
    { x: 700, y: 50, r: 35, opacity: 0.75 },
  ];
  cloudData.forEach(c => {
    ctx.save();
    ctx.globalAlpha = c.opacity;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.arc(c.x + c.r * 0.7, c.y - c.r * 0.3, c.r * 0.75, 0, Math.PI * 2);
    ctx.arc(c.x - c.r * 0.7, c.y - c.r * 0.1, c.r * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  void skyColor;
}

function drawSlingshot(ctx: CanvasRenderingContext2D) {
  // Fork arms
  ctx.strokeStyle = '#5c3a1e';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  // Left arm
  ctx.beginPath();
  ctx.moveTo(SLINGSHOT_X - 5, GROUND_Y);
  ctx.quadraticCurveTo(SLINGSHOT_X - 20, GROUND_Y - 40, SLINGSHOT_X - 22, SLINGSHOT_Y);
  ctx.stroke();
  // Right arm
  ctx.beginPath();
  ctx.moveTo(SLINGSHOT_X + 5, GROUND_Y);
  ctx.quadraticCurveTo(SLINGSHOT_X + 20, GROUND_Y - 40, SLINGSHOT_X + 22, SLINGSHOT_Y);
  ctx.stroke();
  // Base / stick
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(SLINGSHOT_X, GROUND_Y + 10);
  ctx.lineTo(SLINGSHOT_X, GROUND_Y);
  ctx.stroke();
  // Fork tips
  ctx.fillStyle = '#7a4f28';
  ctx.beginPath();
  ctx.arc(SLINGSHOT_X - 22, SLINGSHOT_Y, 5, 0, Math.PI * 2);
  ctx.arc(SLINGSHOT_X + 22, SLINGSHOT_Y, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawSlingshotBands(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(SLINGSHOT_X - 22, SLINGSHOT_Y);
  ctx.lineTo(bx, by);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(SLINGSHOT_X + 22, SLINGSHOT_Y);
  ctx.lineTo(bx, by);
  ctx.stroke();
}

function drawTrajectory(ctx: CanvasRenderingContext2D, traj: { x: number; y: number }[]) {
  traj.forEach((pt, i) => {
    ctx.globalAlpha = (i / traj.length) * 0.5;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawBird(ctx: CanvasRenderingContext2D, bird: ActiveBird) {
  const { body, type } = bird;
  const cfg = BIRD_CONFIGS[type];
  const r = cfg.radius;

  ctx.save();
  ctx.translate(body.x, body.y);
  if (bird.launched) ctx.rotate(Math.atan2(body.vy, body.vx));

  // Shadow
  ctx.beginPath();
  ctx.ellipse(0, r * 0.9, r * 0.8, r * 0.2, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fill();

  // Body
  const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  grad.addColorStop(0, lighten(cfg.color, 40));
  grad.addColorStop(1, cfg.color);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = darken(cfg.color, 30);
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Eyes
  const eyeX = r * 0.25, eyeY = -r * 0.2;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, r * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(eyeX + r * 0.06, eyeY + r * 0.06, r * 0.14, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = '#f4a237';
  ctx.beginPath();
  ctx.moveTo(r * 0.6, -r * 0.05);
  ctx.lineTo(r * 0.95, r * 0.05);
  ctx.lineTo(r * 0.6, r * 0.15);
  ctx.closePath();
  ctx.fill();

  // Type-specific features
  if (type === 'black') {
    // Fuse
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(r * 0.3, -r * 1.4, r * 0.1, -r * 1.7);
    ctx.stroke();
    ctx.fillStyle = '#fff176';
    ctx.beginPath();
    ctx.arc(r * 0.1, -r * 1.7, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'yellow') {
    // Speed lines
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(-r * 0.8, -r * 0.4 + i * r * 0.4);
      ctx.lineTo(-r * 1.4, -r * 0.4 + i * r * 0.4);
      ctx.stroke();
    }
  } else if (type === 'blue') {
    // Crest dots
    ctx.fillStyle = '#0277bd';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(-r * 0.3 + i * r * 0.3, -r * 0.8, r * 0.12, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawPig(ctx: CanvasRenderingContext2D, pig: ActivePig) {
  const { body, wobble } = pig;
  const r = body.hw;

  ctx.save();
  ctx.translate(body.x, body.y);
  if (wobble > 0) ctx.rotate(Math.sin(wobble * 0.5) * 0.1);

  // Shadow
  ctx.beginPath();
  ctx.ellipse(0, r * 0.85, r * 0.8, r * 0.18, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fill();

  // Hurt glow
  if (wobble > 5) {
    ctx.beginPath();
    ctx.arc(0, 0, r + 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,0,0,${Math.min(wobble / 30, 0.4)})`;
    ctx.fill();
  }

  // Body
  const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#a0e850');
  grad.addColorStop(1, PIG_COLOR);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = PIG_STROKE;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Snout
  ctx.fillStyle = '#5daa00';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.25, r * 0.42, r * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2d5a00';
  ctx.beginPath();
  ctx.arc(-r * 0.18, r * 0.25, r * 0.1, 0, Math.PI * 2);
  ctx.arc(r * 0.18, r * 0.25, r * 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-r * 0.3, -r * 0.15, r * 0.28, 0, Math.PI * 2);
  ctx.arc(r * 0.3, -r * 0.15, r * 0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(-r * 0.25, -r * 0.1, r * 0.13, 0, Math.PI * 2);
  ctx.arc(r * 0.35, -r * 0.1, r * 0.13, 0, Math.PI * 2);
  ctx.fill();

  // Eyebrows (angry)
  ctx.strokeStyle = '#1a3d00';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-r * 0.55, -r * 0.42);
  ctx.lineTo(-r * 0.05, -r * 0.38);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(r * 0.55, -r * 0.42);
  ctx.lineTo(r * 0.05, -r * 0.38);
  ctx.stroke();

  // Ears
  ctx.fillStyle = '#5daa00';
  ctx.beginPath();
  ctx.ellipse(-r * 0.7, -r * 0.6, r * 0.2, r * 0.25, -0.4, 0, Math.PI * 2);
  ctx.ellipse(r * 0.7, -r * 0.6, r * 0.2, r * 0.25, 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawBlock(ctx: CanvasRenderingContext2D, block: ActiveBlock) {
  const { body, blockType, crackLevel } = block;
  const { hw, hh } = body;
  const colors = BLOCK_COLORS[blockType as keyof typeof BLOCK_COLORS] ?? BLOCK_COLORS.wood;

  ctx.save();
  ctx.translate(body.x, body.y);
  ctx.rotate(body.angle);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(-hw + 2, -hh + 2, hw * 2, hh * 2);

  // Block body
  ctx.fillStyle = colors.fill;
  ctx.strokeStyle = colors.stroke;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.rect(-hw, -hh, hw * 2, hh * 2);
  ctx.fill();
  ctx.stroke();

  // Grain/texture lines
  if (blockType === 'wood') {
    ctx.strokeStyle = 'rgba(100,60,0,0.15)';
    ctx.lineWidth = 1;
    for (let i = -hh + 6; i < hh; i += 8) {
      ctx.beginPath(); ctx.moveTo(-hw, i); ctx.lineTo(hw, i); ctx.stroke();
    }
  } else if (blockType === 'glass') {
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-hw * 0.6, -hh);
    ctx.lineTo(-hw * 0.4, hh);
    ctx.stroke();
  } else if (blockType === 'tnt') {
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.min(hw, hh) * 0.9}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TNT', 0, 0);
  }

  // Crack overlays
  if (crackLevel > 0) {
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = crackLevel;
    ctx.beginPath();
    ctx.moveTo(-hw * 0.3, -hh * 0.2);
    ctx.lineTo(hw * 0.1, hh * 0.5);
    ctx.lineTo(-hw * 0.1, hh * 0.8);
    ctx.stroke();
  }
  if (crackLevel > 1) {
    ctx.beginPath();
    ctx.moveTo(hw * 0.2, -hh * 0.7);
    ctx.lineTo(-hw * 0.3, hh * 0.2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawBirdQueue(
  ctx: CanvasRenderingContext2D,
  queue: string[],
  currentIndex: number
) {
  const startX = 40, startY = GROUND_Y + 35;
  queue.forEach((type, i) => {
    if (i <= currentIndex) return; // already used or current
    const birdType = type as keyof typeof BIRD_CONFIGS;
    const cfg = BIRD_CONFIGS[birdType];
    const x = startX + (i - currentIndex - 1) * 35;
    if (x > SLINGSHOT_X - 40) return;
    const scale = 0.6;
    ctx.save();
    ctx.translate(x, startY);
    ctx.scale(scale, scale);
    ctx.beginPath();
    ctx.arc(0, 0, cfg.radius, 0, Math.PI * 2);
    ctx.fillStyle = cfg.color;
    ctx.fill();
    ctx.strokeStyle = darken(cfg.color, 30);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  });
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  const alpha = p.life / p.maxLife;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius * alpha, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `rgb(${r},${g},${b})`;
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `rgb(${r},${g},${b})`;
}
