'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { PhysicsWorld, PhysicsBody } from '@/lib/physics';
import { LevelData, Difficulty, GameState, BirdType } from '@/lib/types';
import {
  CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_Y,
  SLINGSHOT_X, SLINGSHOT_Y, MAX_DRAG, LAUNCH_POWER,
  BIRD_CONFIGS, BLOCK_HEALTH, PIG_BASE_HEALTH,
  SCORE_PER_PIG, SCORE_PER_BLOCK, SCORE_PER_LEFTOVER_BIRD,
} from '@/lib/constants';

export interface ActiveBird {
  body: PhysicsBody;
  type: BirdType;
  launched: boolean;
  abilityUsed: boolean;
  trajectory: { x: number; y: number }[];
}

export interface ActivePig {
  body: PhysicsBody;
  alive: boolean;
  wobble: number; // flash timer
}

export interface ActiveBlock {
  body: PhysicsBody;
  blockType: string;
  alive: boolean;
  crackLevel: number; // 0..2
}

export interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: string; radius: number;
}

export interface GameEngineState {
  gameState: GameState;
  score: number;
  currentBirdIndex: number;
  birdsQueue: BirdType[];
  activeBird: ActiveBird | null;
  pigs: ActivePig[];
  blocks: ActiveBlock[];
  particles: Particle[];
  dragging: boolean;
  dragPos: { x: number; y: number } | null;
  levelId: number;
  stars: number;
}

export function useGameEngine(
  difficulty: Difficulty,
  onLevelComplete: (score: number, stars: number) => void,
  onGameOver: () => void,
  soundRef: React.MutableRefObject<{
    launch: () => void; hit: () => void; pigDie: () => void;
    explode: () => void; ability: () => void; levelComplete: () => void;
    gameOver: () => void; star: () => void;
  } | null>
) {
  const worldRef = useRef<PhysicsWorld | null>(null);
  const groundBodyRef = useRef<PhysicsBody | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const waitAfterLaunchRef = useRef<number>(0); // frames to wait before checking win

  const [state, setState] = useState<GameEngineState>({
    gameState: 'menu',
    score: 0,
    currentBirdIndex: 0,
    birdsQueue: [],
    activeBird: null,
    pigs: [],
    blocks: [],
    particles: [],
    dragging: false,
    dragPos: null,
    levelId: 1,
    stars: 0,
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  const spawnParticles = useCallback((
    x: number, y: number, color: string, count = 8, speed = 4
  ) => {
    const newParticles: Particle[] = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const spd = speed * (0.5 + Math.random());
      return {
        x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd - 2,
        life: 40, maxLife: 40,
        color, radius: 3 + Math.random() * 4,
      };
    });
    setState(s => ({ ...s, particles: [...s.particles, ...newParticles] }));
  }, []);

  const loadLevel = useCallback((level: LevelData) => {
    const world = new PhysicsWorld();
    world.gravity = 0.6;

    // Ground (static)
    const ground = world.addBox(
      CANVAS_WIDTH / 2, CANVAS_HEIGHT - 15,
      CANVAS_WIDTH * 2, 30,
      { isStatic: true, friction: 0.6, restitution: 0.2, userData: { kind: 'ground' } }
    );
    groundBodyRef.current = ground;

    // Side walls
    world.addBox(-20, CANVAS_HEIGHT / 2, 40, CANVAS_HEIGHT * 2, { isStatic: true, userData: { kind: 'wall' } });
    world.addBox(CANVAS_WIDTH + 20, CANVAS_HEIGHT / 2, 40, CANVAS_HEIGHT * 2, { isStatic: true, userData: { kind: 'wall' } });

    const diffMul = difficulty === 'easy' ? 0.7 : difficulty === 'hard' ? 1.4 : 1.0;
    const pigHealth = PIG_BASE_HEALTH[difficulty];

    // Pigs
    const pigs: ActivePig[] = level.pigs.map(p => {
      const body = world.addCircle(p.x, p.y, p.radius, {
        mass: 1.2,
        restitution: 0.3,
        friction: 0.5,
        health: pigHealth * (p.health ?? 1),
        userData: { kind: 'pig' },
      });
      return { body, alive: true, wobble: 0 };
    });

    // Blocks
    const blocks: ActiveBlock[] = level.blocks.map(b => {
      const baseHealth = BLOCK_HEALTH[b.type as keyof typeof BLOCK_HEALTH] ?? 50;
      const body = world.addBox(b.x, b.y, b.w, b.h, {
        mass: baseHealth * 0.02 * diffMul,
        restitution: b.type === 'glass' ? 0.5 : 0.2,
        friction: 0.5,
        angle: (b.angle ?? 0) * Math.PI / 180,
        health: baseHealth * diffMul,
        userData: { kind: 'block', blockType: b.type },
      });
      return { body, blockType: b.type, alive: true, crackLevel: 0 };
    });

    // Collision handler
    world.onCollision(({ bodyA, bodyB, impulse }) => {
      const kindA = bodyA.userData.kind as string;
      const kindB = bodyB.userData.kind as string;
      if (impulse > 3) soundRef.current?.hit();
      if (kindA === 'bird' || kindB === 'bird') {
        if (impulse > 8) soundRef.current?.hit();
      }
    });

    worldRef.current = world;

    setState(s => ({
      ...s,
      gameState: 'playing',
      score: 0,
      currentBirdIndex: 0,
      birdsQueue: [...level.birds],
      activeBird: null,
      pigs,
      blocks,
      particles: [],
      dragging: false,
      dragPos: null,
      levelId: level.id,
      stars: 0,
    }));
    waitAfterLaunchRef.current = 0;
  }, [difficulty, soundRef]);

  const setNextBird = useCallback(() => {
    const s = stateRef.current;
    const nextIndex = s.currentBirdIndex + 1;
    if (nextIndex >= s.birdsQueue.length) {
      setState(prev => ({ ...prev, activeBird: null, currentBirdIndex: nextIndex }));
      return;
    }
    const birdType = s.birdsQueue[nextIndex];
    const cfg = BIRD_CONFIGS[birdType];
    const body = worldRef.current!.addCircle(
      SLINGSHOT_X, SLINGSHOT_Y - cfg.radius,
      cfg.radius,
      {
        mass: cfg.mass, restitution: cfg.restitution, friction: 0.3,
        isStatic: true,
        userData: { kind: 'bird', birdType },
      }
    );
    setState(prev => ({
      ...prev,
      activeBird: { body, type: birdType, launched: false, abilityUsed: false, trajectory: [] },
      currentBirdIndex: nextIndex,
    }));
  }, []);

  const readyFirstBird = useCallback(() => {
    const s = stateRef.current;
    if (s.birdsQueue.length === 0) return;
    const birdType = s.birdsQueue[0];
    const cfg = BIRD_CONFIGS[birdType];
    const body = worldRef.current!.addCircle(
      SLINGSHOT_X, SLINGSHOT_Y - cfg.radius,
      cfg.radius,
      {
        mass: cfg.mass, restitution: cfg.restitution, friction: 0.3,
        isStatic: true,
        userData: { kind: 'bird', birdType },
      }
    );
    setState(prev => ({
      ...prev,
      activeBird: { body, type: birdType, launched: false, abilityUsed: false, trajectory: [] },
      currentBirdIndex: 0,
    }));
  }, []);

  /** Called when user starts dragging the slingshot */
  const onDragStart = useCallback((_x: number, _y: number) => {
    const s = stateRef.current;
    if (s.gameState !== 'playing' || s.dragging) return;
    if (!s.activeBird || s.activeBird.launched) return;
    setState(prev => ({ ...prev, dragging: true }));
  }, []);

  const onDragMove = useCallback((x: number, y: number) => {
    const s = stateRef.current;
    if (!s.dragging || !s.activeBird) return;
    const dx = x - SLINGSHOT_X;
    const dy = y - SLINGSHOT_Y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clamped = Math.min(dist, MAX_DRAG);
    const nx = dist > 0 ? dx / dist : 0;
    const ny = dist > 0 ? dy / dist : 0;
    const cx = SLINGSHOT_X + nx * clamped;
    const cy = SLINGSHOT_Y + ny * clamped;
    s.activeBird.body.x = cx;
    s.activeBird.body.y = cy;

    // Compute preview trajectory
    const power = clamped * LAUNCH_POWER;
    const vx = -(dx / dist || 0) * clamped * power * 60;
    const vy = -(dy / dist || 0) * clamped * power * 60;
    const traj: { x: number; y: number }[] = [];
    let tx = cx, ty = cy, tvx = vx * 0.016, tvy = vy * 0.016;
    for (let i = 0; i < 30; i++) {
      tvy += 0.6 * 0.016;
      tx += tvx; ty += tvy;
      if (ty > GROUND_Y) break;
      traj.push({ x: tx, y: ty });
    }
    setState(prev => ({ ...prev, dragPos: { x: cx, y: cy }, activeBird: prev.activeBird ? { ...prev.activeBird, trajectory: traj } : null }));
  }, []);

  const onDragEnd = useCallback(() => {
    const s = stateRef.current;
    if (!s.dragging || !s.activeBird || s.activeBird.launched) return;
    const dx = s.activeBird.body.x - SLINGSHOT_X;
    const dy = s.activeBird.body.y - SLINGSHOT_Y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 5) {
      setState(prev => ({ ...prev, dragging: false, dragPos: null }));
      return;
    }
    const power = dist * LAUNCH_POWER;
    const vx = -(dx / dist) * dist * power * 60;
    const vy = -(dy / dist) * dist * power * 60;
    s.activeBird.body.isStatic = false;
    s.activeBird.body.invMass = 1 / s.activeBird.body.mass;
    s.activeBird.body.vx = vx * 0.016;
    s.activeBird.body.vy = vy * 0.016;
    s.activeBird.launched = true;
    soundRef.current?.launch();
    waitAfterLaunchRef.current = 180; // ~3s at 60fps
    setState(prev => ({
      ...prev,
      dragging: false,
      dragPos: null,
      activeBird: prev.activeBird ? { ...prev.activeBird, launched: true, trajectory: [] } : null,
    }));
  }, [soundRef]);

  /** Activate bird special ability */
  const onAbility = useCallback(() => {
    const s = stateRef.current;
    if (!s.activeBird || !s.activeBird.launched || s.activeBird.abilityUsed) return;
    const { type, body } = s.activeBird;
    const world = worldRef.current!;
    soundRef.current?.ability();

    if (type === 'yellow') {
      body.vx *= 2.5;
      body.vy *= 2.5;
      spawnParticles(body.x, body.y, '#ffd166', 6, 5);
    } else if (type === 'black') {
      // Explosion — push nearby bodies
      spawnParticles(body.x, body.y, '#ff6b35', 20, 8);
      soundRef.current?.explode();
      for (const b of world.bodies) {
        if (b.isStatic || b.id === body.id) continue;
        const dx = b.x - body.x, dy = b.y - body.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = Math.max(0, (120 - dist)) * 0.8;
        b.vx += (dx / dist) * force * b.invMass;
        b.vy += (dy / dist) * force * b.invMass - 3;
        b.sleeping = false;
        b.health -= force * 2;
      }
      body.health = 0;
    } else if (type === 'blue') {
      // Split into 3
      const angles = [-0.4, 0, 0.4];
      for (const angle of angles) {
        const spd = Math.sqrt(body.vx * body.vx + body.vy * body.vy);
        const baseAngle = Math.atan2(body.vy, body.vx);
        const newBody = world.addCircle(body.x, body.y, 10, {
          mass: 0.5, restitution: 0.4, friction: 0.3,
          userData: { kind: 'bird', birdType: 'blue' },
        });
        newBody.vx = Math.cos(baseAngle + angle) * spd;
        newBody.vy = Math.sin(baseAngle + angle) * spd;
      }
      body.health = 0;
      spawnParticles(body.x, body.y, '#4fc3f7', 10, 5);
    }

    setState(prev => ({
      ...prev,
      activeBird: prev.activeBird ? { ...prev.activeBird, abilityUsed: true } : null,
    }));
  }, [spawnParticles, soundRef]);

  const checkWinLose = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== 'playing') return;

    const allPigsDead = s.pigs.every(p => !p.alive);
    if (allPigsDead) {
      const leftovers = Math.max(0, s.birdsQueue.length - s.currentBirdIndex - 1);
      const bonus = leftovers * SCORE_PER_LEFTOVER_BIRD;
      const totalScore = s.score + bonus;
      const stars = totalScore >= 30000 ? 3 : totalScore >= 18000 ? 2 : 1;
      soundRef.current?.levelComplete();
      setState(prev => ({ ...prev, gameState: 'levelComplete', score: totalScore, stars }));
      onLevelComplete(totalScore, stars);
      return;
    }

    const outOfBirds = s.currentBirdIndex >= s.birdsQueue.length && !s.activeBird;
    if (outOfBirds) {
      soundRef.current?.gameOver();
      setState(prev => ({ ...prev, gameState: 'gameover' }));
      onGameOver();
    }
  }, [onLevelComplete, onGameOver, soundRef]);

  // Main game loop
  const gameLoop = useCallback((timestamp: number) => {
    const dt = Math.min((timestamp - (lastTimeRef.current || timestamp)) / 1000, 0.05);
    lastTimeRef.current = timestamp;

    const s = stateRef.current;
    if (s.gameState !== 'playing') {
      rafRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const world = worldRef.current;
    if (!world) { rafRef.current = requestAnimationFrame(gameLoop); return; }

    // Step physics (60fps equivalent)
    const steps = Math.max(1, Math.round(dt * 60));
    for (let i = 0; i < steps; i++) world.step(1);

    // Sync active bird trajectory
    if (s.activeBird?.launched) {
      const b = s.activeBird.body;
      s.activeBird.trajectory.push({ x: b.x, y: b.y });
      if (s.activeBird.trajectory.length > 40) s.activeBird.trajectory.shift();
    }

    // Update pigs
    let pigScoreGained = 0;
    const updatedPigs = s.pigs.map(p => {
      if (!p.alive) return p;
      if (p.body.health <= 0) {
        world.remove(p.body.id);
        spawnParticles(p.body.x, p.body.y, '#78c800', 12, 6);
        soundRef.current?.pigDie();
        pigScoreGained += SCORE_PER_PIG;
        return { ...p, alive: false };
      }
      const hit = p.body.health < p.body.maxHealth * 0.7;
      return { ...p, wobble: hit ? p.wobble + 1 : Math.max(0, p.wobble - 1) };
    });

    // Update blocks
    let blockScoreGained = 0;
    const updatedBlocks = s.blocks.map(b => {
      if (!b.alive) return b;
      if (b.body.health <= 0) {
        world.remove(b.body.id);
        spawnParticles(b.body.x, b.body.y, '#c8a46e', 6, 3);
        blockScoreGained += SCORE_PER_BLOCK;
        return { ...b, alive: false };
      }
      const ratio = b.body.health / b.body.maxHealth;
      const crack = ratio > 0.66 ? 0 : ratio > 0.33 ? 1 : 2;
      return { ...b, crackLevel: crack };
    });

    // Update particles
    const updatedParticles = s.particles
      .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.2, life: p.life - 1 }))
      .filter(p => p.life > 0 && p.y < CANVAS_HEIGHT + 50);

    // Check if active bird is off screen or at rest
    let newActiveBird = s.activeBird;
    let newBirdIndex = s.currentBirdIndex;
    let shouldCheckWin = false;

    if (s.activeBird?.launched) {
      const b = s.activeBird.body;
      const offScreen = b.x < -50 || b.x > CANVAS_WIDTH + 50 || b.y > CANVAS_HEIGHT + 50;
      const resting = b.sleeping && b.y > GROUND_Y - 50;
      if ((offScreen || resting) && waitAfterLaunchRef.current <= 0) {
        world.remove(b.id);
        newActiveBird = null;
        shouldCheckWin = true;
      }
    }

    if (waitAfterLaunchRef.current > 0) waitAfterLaunchRef.current--;

    const scoreGain = pigScoreGained + blockScoreGained;

    setState(prev => ({
      ...prev,
      pigs: updatedPigs,
      blocks: updatedBlocks,
      particles: updatedParticles,
      score: prev.score + scoreGain,
      activeBird: newActiveBird ?? prev.activeBird,
      currentBirdIndex: newBirdIndex,
    }));

    if (shouldCheckWin) {
      setTimeout(() => {
        checkWinLose();
        // Schedule next bird
        const s2 = stateRef.current;
        if (s2.gameState === 'playing' && !s2.activeBird) {
          setNextBird();
        }
      }, 800);
    }

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [spawnParticles, checkWinLose, setNextBird, soundRef]);

  const startLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  const stopLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, gameState: 'paused' }));
  }, []);

  const resume = useCallback(() => {
    setState(prev => ({ ...prev, gameState: 'playing' }));
  }, []);

  useEffect(() => {
    return () => stopLoop();
  }, [stopLoop]);

  return {
    state,
    loadLevel,
    readyFirstBird,
    startLoop,
    stopLoop,
    onDragStart,
    onDragMove,
    onDragEnd,
    onAbility,
    pause,
    resume,
  };
}
