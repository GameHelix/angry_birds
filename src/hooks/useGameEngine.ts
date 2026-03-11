'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { PhysicsWorld, PhysicsBody } from '@/lib/physics';
import { LevelData, Difficulty, GameState, BirdType } from '@/lib/types';
import {
  CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_Y,
  SLINGSHOT_X, SLINGSHOT_Y, MAX_DRAG,
  BIRD_CONFIGS, BLOCK_HEALTH, PIG_BASE_HEALTH,
  SCORE_PER_PIG, SCORE_PER_BLOCK, SCORE_PER_LEFTOVER_BIRD,
} from '@/lib/constants';

/** Max launch speed in pixels per physics step */
const MAX_BIRD_SPEED = 13;

/** Steps to pre-simulate so blocks settle before player sees them */
/** Steps to pre-simulate to resolve minor initial penetrations (positions are now exact) */
const PRESIM_STEPS = 30;

/** After launch, wait this many steps before checking if bird has landed */
const POST_LAUNCH_WAIT = 60;

export interface ActiveBird {
  body: PhysicsBody;
  type: BirdType;
  launched: boolean;
  abilityUsed: boolean;
  /** Trail dots (launched) or aim dots (dragging) */
  trajectory: { x: number; y: number }[];
}

export interface ActivePig {
  body: PhysicsBody;
  alive: boolean;
  wobble: number;
}

export interface ActiveBlock {
  body: PhysicsBody;
  blockType: string;
  alive: boolean;
  crackLevel: number; // 0-2
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

type SoundBag = {
  launch: () => void; hit: () => void; pigDie: () => void;
  explode: () => void; ability: () => void; levelComplete: () => void;
  gameOver: () => void; star: () => void;
};

export function useGameEngine(
  difficulty: Difficulty,
  onLevelComplete: (score: number, stars: number) => void,
  onGameOver: () => void,
  soundRef: React.MutableRefObject<SoundBag | null>
) {
  const worldRef = useRef<PhysicsWorld | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  /**
   * POST_LAUNCH_WAIT countdown — decrements each step after launch.
   * Bird landing is only checked once this reaches 0.
   */
  const postLaunchRef = useRef<number>(0);

  /**
   * Guard flag: true between the moment a bird lands and the next bird
   * appears on the slingshot. Prevents the game loop from firing
   * shouldCheckWin every frame (the infinite-loop bug).
   */
  const awaitingNextBirdRef = useRef(false);

  // Keep callbacks in refs so the game loop never has stale closures
  const onLevelCompleteRef = useRef(onLevelComplete);
  const onGameOverRef = useRef(onGameOver);
  useEffect(() => { onLevelCompleteRef.current = onLevelComplete; }, [onLevelComplete]);
  useEffect(() => { onGameOverRef.current = onGameOver; }, [onGameOver]);

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

  // Always-current mirror of React state (read in rAF callbacks without stale closure)
  const stateRef = useRef(state);
  stateRef.current = state;

  // ─── Particles ───────────────────────────────────────────────────────────

  const spawnParticles = useCallback((
    x: number, y: number, color: string, count = 8, speed = 4
  ) => {
    const arr: Particle[] = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const spd = speed * (0.5 + Math.random());
      return {
        x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd - 2,
        life: 40, maxLife: 40, color, radius: 3 + Math.random() * 4,
      };
    });
    setState(s => ({ ...s, particles: [...s.particles, ...arr] }));
  }, []);

  // Keep spawnParticles available inside the stable game loop
  const spawnParticlesRef = useRef(spawnParticles);
  useEffect(() => { spawnParticlesRef.current = spawnParticles; }, [spawnParticles]);

  // ─── Level load ──────────────────────────────────────────────────────────

  const loadLevel = useCallback((level: LevelData) => {
    // Cancel any running loop so we start fresh
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    awaitingNextBirdRef.current = false;
    postLaunchRef.current = 0;

    const world = new PhysicsWorld();
    world.gravity = 0.6;

    // *** FIX: physics ground top = GROUND_Y (was CANVAS_HEIGHT-15, 30px too low) ***
    world.addBox(
      CANVAS_WIDTH / 2, GROUND_Y + 500,
      CANVAS_WIDTH * 2, 1000,
      { isStatic: true, friction: 0.7, restitution: 0.15, userData: { kind: 'ground' } }
    );
    // Side walls
    world.addBox(-30, CANVAS_HEIGHT / 2, 60, CANVAS_HEIGHT * 2, { isStatic: true, userData: { kind: 'wall' } });
    world.addBox(CANVAS_WIDTH + 30, CANVAS_HEIGHT / 2, 60, CANVAS_HEIGHT * 2, { isStatic: true, userData: { kind: 'wall' } });

    const diffMul = difficulty === 'easy' ? 0.65 : difficulty === 'hard' ? 1.5 : 1.0;
    const pigHealth = PIG_BASE_HEALTH[difficulty];

    // Build pig bodies
    const pigs: ActivePig[] = level.pigs.map(p => {
      const body = world.addCircle(p.x, p.y, p.radius, {
        mass: 1.2, restitution: 0.25, friction: 0.6,
        health: pigHealth * (p.health ?? 1),
        userData: { kind: 'pig' },
      });
      return { body, alive: true, wobble: 0 };
    });

    // Build block bodies
    const blocks: ActiveBlock[] = level.blocks.map(b => {
      const baseHealth = BLOCK_HEALTH[b.type as keyof typeof BLOCK_HEALTH] ?? 50;
      const body = world.addBox(b.x, b.y, b.w, b.h, {
        mass: baseHealth * 0.02 * diffMul,
        restitution: b.type === 'glass' ? 0.4 : 0.15,
        friction: 0.55,
        angle: (b.angle ?? 0) * Math.PI / 180,
        health: baseHealth * diffMul,
        userData: { kind: 'block', blockType: b.type },
      });
      return { body, blockType: b.type, alive: true, crackLevel: 0 };
    });

    // Collision sounds
    world.onCollision(({ bodyA, bodyB, impulse }) => {
      void bodyA; void bodyB;
      if (impulse > 5) soundRef.current?.hit();
    });

    worldRef.current = world;

    // *** FIX: Pre-simulate so blocks settle onto ground before player sees them ***
    for (let i = 0; i < PRESIM_STEPS; i++) world.step(1);

    setState(() => ({
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
  }, [difficulty, soundRef]);

  // ─── Bird management ─────────────────────────────────────────────────────

  /** Places the bird at index `idx` on the slingshot as a static body */
  const spawnBirdAtIndex = useCallback((idx: number) => {
    setState(prev => {
      if (idx >= prev.birdsQueue.length || !worldRef.current) {
        return { ...prev, activeBird: null, currentBirdIndex: idx };
      }
      const birdType = prev.birdsQueue[idx];
      const cfg = BIRD_CONFIGS[birdType];
      const body = worldRef.current.addCircle(
        SLINGSHOT_X, SLINGSHOT_Y,
        cfg.radius,
        { mass: cfg.mass, restitution: cfg.restitution, friction: 0.3,
          isStatic: true, userData: { kind: 'bird', birdType } }
      );
      return {
        ...prev,
        activeBird: { body, type: birdType, launched: false, abilityUsed: false, trajectory: [] },
        currentBirdIndex: idx,
      };
    });
  }, []);

  const readyFirstBird = useCallback(() => {
    spawnBirdAtIndex(0);
  }, [spawnBirdAtIndex]);

  // ─── Win / lose check (called inside a setTimeout after bird lands) ──────

  const resolveRound = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== 'playing') {
      awaitingNextBirdRef.current = false;
      return;
    }

    const allDead = s.pigs.every(p => !p.alive);
    if (allDead) {
      const leftovers = Math.max(0, s.birdsQueue.length - s.currentBirdIndex - 1);
      const totalScore = s.score + leftovers * SCORE_PER_LEFTOVER_BIRD;
      const stars = totalScore >= 30000 ? 3 : totalScore >= 15000 ? 2 : 1;
      soundRef.current?.levelComplete();
      setState(prev => ({ ...prev, gameState: 'levelComplete', score: totalScore, stars }));
      onLevelCompleteRef.current(totalScore, stars);
      awaitingNextBirdRef.current = false;
      return;
    }

    const nextIdx = s.currentBirdIndex + 1;
    if (nextIdx >= s.birdsQueue.length) {
      soundRef.current?.gameOver();
      setState(prev => ({ ...prev, gameState: 'gameover' }));
      onGameOverRef.current();
      awaitingNextBirdRef.current = false;
      return;
    }

    // More birds available — place the next one
    spawnBirdAtIndex(nextIdx);
    // awaitingNextBirdRef cleared inside spawnBirdAtIndex's setState callback
    awaitingNextBirdRef.current = false;
  }, [soundRef, spawnBirdAtIndex]);

  const resolveRoundRef = useRef(resolveRound);
  useEffect(() => { resolveRoundRef.current = resolveRound; }, [resolveRound]);

  // ─── Input handlers ──────────────────────────────────────────────────────

  const onDragStart = useCallback((_x: number, _y: number) => {
    const s = stateRef.current;
    if (s.gameState !== 'playing' || s.dragging) return;
    if (!s.activeBird || s.activeBird.launched) return;
    setState(prev => ({ ...prev, dragging: true }));
  }, []);

  const onDragMove = useCallback((x: number, y: number) => {
    const s = stateRef.current;
    if (!s.dragging || !s.activeBird) return;

    // Clamp drag to MAX_DRAG radius around slingshot anchor
    const dx = x - SLINGSHOT_X;
    const dy = y - SLINGSHOT_Y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
    const clamped = Math.min(dist, MAX_DRAG);
    const cx = SLINGSHOT_X + (dx / dist) * clamped;
    const cy = SLINGSHOT_Y + (dy / dist) * clamped;

    // Move physics body (static — won't be overridden by engine)
    s.activeBird.body.x = cx;
    s.activeBird.body.y = cy;

    // *** FIX: Trajectory preview uses same units as physics launch ***
    const power = clamped / MAX_DRAG;
    const speed = power * MAX_BIRD_SPEED;
    const launchVx = -(dx / dist) * speed;
    const launchVy = -(dy / dist) * speed;

    const traj: { x: number; y: number }[] = [];
    let tx = cx, ty = cy;
    let tvx = launchVx, tvy = launchVy;
    for (let i = 0; i < 80; i++) {
      // Mirror exactly what the physics engine does per step
      tvy += 0.6;       // gravity
      tvx *= 0.998;     // linear damping
      tvy *= 0.998;
      tx += tvx;
      ty += tvy;
      if (ty > GROUND_Y + 5 || tx < -20 || tx > CANVAS_WIDTH + 20) break;
      if (i % 2 === 0) traj.push({ x: tx, y: ty }); // every other dot for performance
    }

    setState(prev => ({
      ...prev,
      dragPos: { x: cx, y: cy },
      activeBird: prev.activeBird ? { ...prev.activeBird, trajectory: traj } : null,
    }));
  }, []);

  const onDragEnd = useCallback(() => {
    const s = stateRef.current;
    if (!s.dragging || !s.activeBird || s.activeBird.launched) {
      setState(prev => ({ ...prev, dragging: false, dragPos: null }));
      return;
    }

    const dx = s.activeBird.body.x - SLINGSHOT_X;
    const dy = s.activeBird.body.y - SLINGSHOT_Y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Too small a drag — snap bird back to slingshot center
    if (dist < 6) {
      s.activeBird.body.x = SLINGSHOT_X;
      s.activeBird.body.y = SLINGSHOT_Y;
      setState(prev => ({ ...prev, dragging: false, dragPos: null,
        activeBird: prev.activeBird ? { ...prev.activeBird, trajectory: [] } : null }));
      return;
    }

    // *** FIX: Simple, correct velocity formula ***
    // power ∈ [0,1] at max drag; speed in pixels per physics step
    const power = Math.min(dist / MAX_DRAG, 1);
    const speed = power * MAX_BIRD_SPEED;

    const body = s.activeBird.body;
    body.isStatic = false;
    body.invMass = 1 / body.mass;
    body.vx = -(dx / dist) * speed;
    body.vy = -(dy / dist) * speed;
    body.sleeping = false;
    body.sleepTimer = 0;

    soundRef.current?.launch();
    postLaunchRef.current = POST_LAUNCH_WAIT;

    setState(prev => ({
      ...prev,
      dragging: false,
      dragPos: null,
      activeBird: prev.activeBird
        ? { ...prev.activeBird, launched: true, trajectory: [] }
        : null,
    }));
  }, [soundRef]);

  const onAbility = useCallback(() => {
    const s = stateRef.current;
    if (!s.activeBird || !s.activeBird.launched || s.activeBird.abilityUsed) return;
    const { type, body } = s.activeBird;
    const world = worldRef.current;
    if (!world) return;

    soundRef.current?.ability();

    if (type === 'yellow') {
      // Speed boost — multiply current velocity
      const spd = Math.sqrt(body.vx * body.vx + body.vy * body.vy);
      if (spd > 0) {
        body.vx = (body.vx / spd) * (spd * 2.2);
        body.vy = (body.vy / spd) * (spd * 2.2);
      }
      spawnParticlesRef.current(body.x, body.y, '#ffd166', 8, 5);

    } else if (type === 'black') {
      // Explosion
      soundRef.current?.explode();
      spawnParticlesRef.current(body.x, body.y, '#ff6b35', 25, 9);
      for (const b of world.bodies) {
        if (b.isStatic || b.id === body.id) continue;
        const dx = b.x - body.x;
        const dy = b.y - body.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = Math.max(0, 140 - dist) * 0.9;
        if (force <= 0) continue;
        b.vx += (dx / dist) * force * b.invMass;
        b.vy += (dy / dist) * force * b.invMass - 2;
        b.sleeping = false;
        b.health -= force * 1.5;
      }
      body.health = 0;

    } else if (type === 'blue') {
      // Split into 3 fragments
      const baseAngle = Math.atan2(body.vy, body.vx);
      const spd = Math.sqrt(body.vx * body.vx + body.vy * body.vy);
      for (const angleDelta of [-0.35, 0, 0.35]) {
        const nb = world.addCircle(body.x, body.y, 10, {
          mass: 0.45, restitution: 0.4, friction: 0.3,
          userData: { kind: 'bird', birdType: 'blue' },
        });
        nb.vx = Math.cos(baseAngle + angleDelta) * spd;
        nb.vy = Math.sin(baseAngle + angleDelta) * spd;
      }
      body.health = 0;
      spawnParticlesRef.current(body.x, body.y, '#4fc3f7', 10, 5);
    }

    setState(prev => ({
      ...prev,
      activeBird: prev.activeBird ? { ...prev.activeBird, abilityUsed: true } : null,
    }));
  }, [soundRef]);

  // ─── Main game loop (stable — no React state dependencies) ───────────────

  const gameLoop = useCallback((timestamp: number) => {
    const dt = Math.min((timestamp - (lastTimeRef.current || timestamp)) / 1000, 0.05);
    lastTimeRef.current = timestamp;

    const s = stateRef.current;

    if (s.gameState !== 'playing') {
      rafRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const world = worldRef.current;
    if (!world) {
      rafRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    // Step physics — catch-up if frame was slow (cap at 3 steps)
    const steps = Math.min(Math.max(1, Math.round(dt * 60)), 3);
    for (let i = 0; i < steps; i++) world.step(1);

    if (postLaunchRef.current > 0) postLaunchRef.current -= steps;

    // ─ Update launched-bird trail ─
    if (s.activeBird?.launched) {
      const b = s.activeBird.body;
      s.activeBird.trajectory.push({ x: b.x, y: b.y });
      if (s.activeBird.trajectory.length > 50) s.activeBird.trajectory.shift();
    }

    // ─ Destroy dead pigs ─
    let pigScore = 0;
    const updatedPigs = s.pigs.map(p => {
      if (!p.alive) return p;
      if (p.body.health <= 0) {
        world.remove(p.body.id);
        spawnParticlesRef.current(p.body.x, p.body.y, '#78c800', 14, 6);
        soundRef.current?.pigDie();
        pigScore += SCORE_PER_PIG;
        return { ...p, alive: false };
      }
      const hurt = p.body.health < p.body.maxHealth * 0.65;
      return { ...p, wobble: hurt ? p.wobble + 1 : Math.max(0, p.wobble - 1) };
    });

    // ─ Destroy dead blocks ─
    let blockScore = 0;
    const updatedBlocks = s.blocks.map(b => {
      if (!b.alive) return b;
      if (b.body.health <= 0) {
        world.remove(b.body.id);
        spawnParticlesRef.current(b.body.x, b.body.y, '#c8a46e', 7, 3);
        blockScore += SCORE_PER_BLOCK;
        return { ...b, alive: false };
      }
      const ratio = b.body.health / b.body.maxHealth;
      return { ...b, crackLevel: ratio > 0.66 ? 0 : ratio > 0.33 ? 1 : 2 };
    });

    // ─ Age particles ─
    const updatedParticles = s.particles
      .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.18, life: p.life - 1 }))
      .filter(p => p.life > 0 && p.y < CANVAS_HEIGHT + 100);

    // ─ Detect bird landing ─
    // *** FIX: `awaitingNextBirdRef` prevents this block from firing every frame ***
    let birdRemoved = false;
    if (
      s.activeBird?.launched &&
      !awaitingNextBirdRef.current &&
      postLaunchRef.current <= 0
    ) {
      const b = s.activeBird.body;
      const offScreen =
        b.x < -100 || b.x > CANVAS_WIDTH + 100 || b.y > CANVAS_HEIGHT + 100;
      const atRest =
        b.sleeping && b.y > GROUND_Y - 80;

      if (offScreen || atRest) {
        world.remove(b.id);
        birdRemoved = true;
        awaitingNextBirdRef.current = true; // ← prevents re-trigger

        // Delay so player can see the last collision
        setTimeout(() => resolveRoundRef.current(), 700);
      }
    }

    // *** FIX: use explicit `birdRemoved` flag, not `null ??` which ignored null ***
    setState(prev => ({
      ...prev,
      pigs: updatedPigs,
      blocks: updatedBlocks,
      particles: updatedParticles,
      score: prev.score + pigScore + blockScore,
      activeBird: birdRemoved ? null : prev.activeBird,
    }));

    rafRef.current = requestAnimationFrame(gameLoop);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← stable: reads everything through refs, no stale closures

  const startLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  const stopLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, gameState: 'paused' }));
  }, []);

  const resume = useCallback(() => {
    setState(prev => ({ ...prev, gameState: 'playing' }));
  }, []);

  useEffect(() => () => stopLoop(), [stopLoop]);

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
