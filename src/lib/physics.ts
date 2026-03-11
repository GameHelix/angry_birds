/**
 * Self-contained 2-D physics engine for Angry Birds.
 * Uses impulse-based collision resolution with sub-step integration.
 */

export interface PhysicsBody {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularVelocity: number;
  /** half-width (boxes) or radius (circles) */
  hw: number;
  hh: number; // 0 for circles (use hw as radius)
  isCircle: boolean;
  mass: number;
  invMass: number;
  restitution: number;
  friction: number;
  isStatic: boolean;
  health: number;
  maxHealth: number;
  userData: Record<string, unknown>;
  sleeping: boolean;
  sleepTimer: number;
}

export interface CollisionEvent {
  bodyA: PhysicsBody;
  bodyB: PhysicsBody;
  impulse: number;
  normal: { x: number; y: number };
}

type CollisionHandler = (event: CollisionEvent) => void;

const SLEEP_THRESHOLD_V = 0.15;
const SLEEP_FRAMES = 40;
const SUB_STEPS = 3;
const DAMPING = 0.998;
const ANGULAR_DAMPING = 0.98;

export class PhysicsWorld {
  bodies: PhysicsBody[] = [];
  gravity = 0.5;
  private collisionHandlers: CollisionHandler[] = [];
  private idCounter = 0;

  private nextId(): string {
    return `body_${++this.idCounter}`;
  }

  addCircle(
    x: number, y: number, radius: number,
    options: Partial<PhysicsBody> = {}
  ): PhysicsBody {
    const mass = options.mass ?? 1;
    const body: PhysicsBody = {
      id: this.nextId(), x, y, vx: 0, vy: 0, angle: 0, angularVelocity: 0,
      hw: radius, hh: 0, isCircle: true,
      mass, invMass: mass === 0 ? 0 : 1 / mass,
      restitution: options.restitution ?? 0.4,
      friction: options.friction ?? 0.3,
      isStatic: options.isStatic ?? false,
      health: options.health ?? 100, maxHealth: options.health ?? 100,
      userData: options.userData ?? {},
      sleeping: false, sleepTimer: 0,
      ...options,
    };
    if (body.isStatic) body.invMass = 0;
    this.bodies.push(body);
    return body;
  }

  addBox(
    x: number, y: number, w: number, h: number,
    options: Partial<PhysicsBody> = {}
  ): PhysicsBody {
    const mass = options.mass ?? (w * h * 0.001);
    const body: PhysicsBody = {
      id: this.nextId(), x, y, vx: 0, vy: 0, angle: options.angle ?? 0, angularVelocity: 0,
      hw: w / 2, hh: h / 2, isCircle: false,
      mass, invMass: mass === 0 ? 0 : 1 / mass,
      restitution: options.restitution ?? 0.3,
      friction: options.friction ?? 0.4,
      isStatic: options.isStatic ?? false,
      health: options.health ?? 100, maxHealth: options.health ?? 100,
      userData: options.userData ?? {},
      sleeping: false, sleepTimer: 0,
      ...options,
    };
    if (body.isStatic) body.invMass = 0;
    this.bodies.push(body);
    return body;
  }

  remove(id: string) {
    this.bodies = this.bodies.filter(b => b.id !== id);
  }

  onCollision(handler: CollisionHandler) {
    this.collisionHandlers.push(handler);
  }

  step(dt: number) {
    const subDt = dt / SUB_STEPS;
    for (let s = 0; s < SUB_STEPS; s++) {
      this._integrate(subDt);
      this._resolveCollisions();
    }
  }

  private _integrate(dt: number) {
    for (const b of this.bodies) {
      if (b.isStatic || b.sleeping) continue;
      b.vy += this.gravity * dt;
      b.vx *= DAMPING;
      b.vy *= DAMPING;
      b.angularVelocity *= ANGULAR_DAMPING;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.angle += b.angularVelocity * dt;
      // Sleep check
      const speed = Math.abs(b.vx) + Math.abs(b.vy) + Math.abs(b.angularVelocity);
      if (speed < SLEEP_THRESHOLD_V) {
        b.sleepTimer++;
        if (b.sleepTimer > SLEEP_FRAMES) b.sleeping = true;
      } else {
        b.sleepTimer = 0;
        b.sleeping = false;
      }
    }
  }

  private _resolveCollisions() {
    const bodies = this.bodies;
    for (let ii = 0; ii < bodies.length; ii++) {
      for (let jj = ii + 1; jj < bodies.length; jj++) {
        const a = bodies[ii], b = bodies[jj];
        if (a.isStatic && b.isStatic) continue;
        if (a.sleeping && b.sleeping) continue;

        const col = this._testCollision(a, b);
        if (!col) continue;

        // Wake sleeping bodies
        a.sleeping = false; a.sleepTimer = 0;
        b.sleeping = false; b.sleepTimer = 0;

        const { nx, ny, depth } = col;
        const totalInvMass = a.invMass + b.invMass;
        if (totalInvMass === 0) continue;

        // Positional correction
        const correction = Math.max(depth - 0.5, 0) / totalInvMass * 0.4;
        a.x -= nx * correction * a.invMass;
        a.y -= ny * correction * a.invMass;
        b.x += nx * correction * b.invMass;
        b.y += ny * correction * b.invMass;

        // Relative velocity
        const rvx = b.vx - a.vx;
        const rvy = b.vy - a.vy;
        const velAlongNormal = rvx * nx + rvy * ny;
        if (velAlongNormal > 0) continue;

        const e = Math.min(a.restitution, b.restitution);
        const j = -(1 + e) * velAlongNormal / totalInvMass;
        const impulse = Math.abs(j);

        a.vx -= j * a.invMass * nx;
        a.vy -= j * a.invMass * ny;
        b.vx += j * b.invMass * nx;
        b.vy += j * b.invMass * ny;

        // Angular from offset
        const rap = { x: 0, y: 0 };
        const rbp = { x: 0, y: 0 };
        const torqueA = rap.x * (j * ny) - rap.y * (j * nx);
        const torqueB = rbp.x * (j * ny) - rbp.y * (j * nx);
        a.angularVelocity -= torqueA * a.invMass * 0.01;
        b.angularVelocity += torqueB * b.invMass * 0.01;

        // Friction
        const tangentX = rvx - velAlongNormal * nx;
        const tangentY = rvy - velAlongNormal * ny;
        const tLen = Math.sqrt(tangentX * tangentX + tangentY * tangentY);
        if (tLen > 0.0001) {
          const tx = tangentX / tLen, ty = tangentY / tLen;
          const frictionMag = Math.min(
            Math.sqrt(a.friction * b.friction) * Math.abs(j) / totalInvMass,
            tLen / totalInvMass
          );
          a.vx += frictionMag * a.invMass * tx;
          a.vy += frictionMag * a.invMass * ty;
          b.vx -= frictionMag * b.invMass * tx;
          b.vy -= frictionMag * b.invMass * ty;
        }

        // Damage based on impulse
        const dmg = impulse * 3;
        if (dmg > 2) {
          a.health -= dmg;
          b.health -= dmg;
        }

        this.collisionHandlers.forEach(h =>
          h({ bodyA: a, bodyB: b, impulse, normal: { x: nx, y: ny } })
        );
      }
    }
  }

  private _testCollision(
    a: PhysicsBody, b: PhysicsBody
  ): { nx: number; ny: number; depth: number } | null {
    if (a.isCircle && b.isCircle) return this._circleCircle(a, b);
    if (!a.isCircle && !b.isCircle) return this._boxBox(a, b);
    if (a.isCircle && !b.isCircle) return this._circleBox(a, b);
    return this._circleBox(b, a) ? this._flipNormal(this._circleBox(b, a)!) : null;
  }

  private _circleCircle(
    a: PhysicsBody, b: PhysicsBody
  ): { nx: number; ny: number; depth: number } | null {
    const dx = b.x - a.x, dy = b.y - a.y;
    const dist2 = dx * dx + dy * dy;
    const radSum = a.hw + b.hw;
    if (dist2 >= radSum * radSum) return null;
    const dist = Math.sqrt(dist2) || 0.01;
    return { nx: dx / dist, ny: dy / dist, depth: radSum - dist };
  }

  private _boxBox(
    a: PhysicsBody, b: PhysicsBody
  ): { nx: number; ny: number; depth: number } | null {
    // AABB only (ignore rotation for simplicity)
    const dx = b.x - a.x, dy = b.y - a.y;
    const overlapX = a.hw + b.hw - Math.abs(dx);
    const overlapY = a.hh + b.hh - Math.abs(dy);
    if (overlapX <= 0 || overlapY <= 0) return null;
    if (overlapX < overlapY) {
      return { nx: dx < 0 ? -1 : 1, ny: 0, depth: overlapX };
    }
    return { nx: 0, ny: dy < 0 ? -1 : 1, depth: overlapY };
  }

  private _circleBox(
    circle: PhysicsBody, box: PhysicsBody
  ): { nx: number; ny: number; depth: number } | null {
    const dx = circle.x - box.x;
    const dy = circle.y - box.y;
    const clampedX = Math.max(-box.hw, Math.min(box.hw, dx));
    const clampedY = Math.max(-box.hh, Math.min(box.hh, dy));
    const nearestX = box.x + clampedX;
    const nearestY = box.y + clampedY;
    const distX = circle.x - nearestX;
    const distY = circle.y - nearestY;
    const dist2 = distX * distX + distY * distY;
    if (dist2 >= circle.hw * circle.hw) return null;
    const dist = Math.sqrt(dist2) || 0.01;
    return { nx: distX / dist, ny: distY / dist, depth: circle.hw - dist };
  }

  private _flipNormal(col: { nx: number; ny: number; depth: number }) {
    return { nx: -col.nx, ny: -col.ny, depth: col.depth };
  }
}
