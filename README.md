# 🐦 Angry Birds — Next.js Edition

A full-featured, browser-based Angry Birds clone built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**. Features a custom 2D physics engine, 5 hand-crafted levels, 4 unique bird types with special abilities, and a polished UI with smooth animations.

---

## ✨ Features

- **5 levels** with increasing difficulty and unique structures (glass, wood, stone, TNT)
- **4 bird types** — Red (standard), Blue (splits into 3), Yellow (speed boost), Black (explodes)
- **3 difficulty modes** — Easy, Medium, Hard (affects pig health and block strength)
- **Custom 2D physics engine** — impulse-based collision resolution with friction, restitution, angular velocity, and sleep optimization
- **Trajectory preview** — dotted arc shown while dragging the slingshot
- **Particle effects** — debris, explosions, pig death animations
- **Damage system** — blocks crack visually as health drops; pigs wobble/flash when hurt
- **Scoring** — points for pigs (+5,000), blocks (+500), leftover birds (+3,000 each)
- **3-star rating** per level, persisted to localStorage
- **High score tracking** with localStorage persistence
- **Sound effects** generated with Web Audio API — no external assets needed
- **Pause / Resume** (Esc or P key)
- **Special ability** on tap/click while bird is in flight (Spacebar or on-screen button)
- **Fully responsive** — scales to any screen with touch support
- **Animated UI** — Framer Motion transitions on menus, end screens, and score popups
- **Custom SVG favicon** — themed red bird icon

---

## 🎮 Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| Aim | Click & drag slingshot | Touch & drag slingshot |
| Launch | Release drag | Release touch |
| Special ability | Click/tap canvas or **Space** | Tap canvas or on-screen ✨ button |
| Pause | **Esc** or **P** | Tap ⏸ button |
| Resume | **Esc** or **P** | Tap ▶ Resume |

---

## 🐦 Bird Types

| Bird | Color | Ability |
|------|-------|---------|
| Red | 🔴 | None — reliable and sturdy |
| Blue | 🔵 | **Split** — divides into 3 birds mid-flight |
| Yellow | 🟡 | **Speed Boost** — doubles velocity instantly |
| Black | ⚫ | **Explode** — massive area damage |

Tap or click while the bird is airborne to activate its ability.

---

## 🛠 Tech Stack

- **Next.js 16** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **Framer Motion** — UI animations
- **Web Audio API** — procedural sound effects (no files needed)
- Custom **impulse-based 2D physics engine** (`src/lib/physics.ts`)
- **HTML5 Canvas** for all game rendering

---

## 🚀 Run Locally

```bash
# Clone the repository
git clone <your-repo-url>
cd angry_birds

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploy to Vercel

1. Push the repository to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your repository — Vercel auto-detects Next.js
4. Click **Deploy** — no extra configuration needed

Or use the CLI:

```bash
npm i -g vercel
vercel
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout + metadata + viewport
│   ├── page.tsx          # Entry point → <Game />
│   └── globals.css       # Base styles + Tailwind import
├── components/
│   └── game/
│       ├── Game.tsx          # Main orchestrator component
│       ├── GameCanvas.tsx    # HTML5 Canvas renderer
│       ├── GameHUD.tsx       # Score, birds, controls overlay
│       ├── MainMenu.tsx      # Main menu + level select
│       ├── PauseScreen.tsx   # Pause overlay
│       └── EndScreen.tsx     # Win / game-over screen
├── hooks/
│   ├── useGameEngine.ts  # Game loop, physics sync, state
│   ├── useSound.ts       # Web Audio API sound effects
│   └── useLocalStorage.ts
└── lib/
    ├── physics.ts        # Custom 2D physics engine
    ├── levels.ts         # Level data (birds, pigs, blocks)
    ├── constants.ts      # Game tuning constants
    └── types.ts          # TypeScript type definitions
```

---

## 📜 License

MIT
