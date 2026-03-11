'use client';

import { motion } from 'framer-motion';
import { BirdType, Difficulty } from '@/lib/types';
import { BIRD_CONFIGS } from '@/lib/constants';

interface GameHUDProps {
  score: number;
  highScore: number;
  levelId: number;
  birdsQueue: BirdType[];
  currentBirdIndex: number;
  pigsLeft: number;
  difficulty: Difficulty;
  onPause: () => void;
  onAbility: () => void;
  abilityUsed: boolean;
  activeBirdType: BirdType | null;
}

export default function GameHUD({
  score, highScore, levelId, birdsQueue, currentBirdIndex,
  pigsLeft, difficulty, onPause, onAbility, abilityUsed, activeBirdType,
}: GameHUDProps) {
  const birdsLeft = Math.max(0, birdsQueue.length - currentBirdIndex);

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-start justify-between px-3 pt-2 gap-2">
        {/* Score */}
        <motion.div
          className="bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5 text-white pointer-events-auto"
          key={score}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-xs text-yellow-300 font-bold tracking-widest uppercase">Score</div>
          <div className="text-xl font-extrabold tabular-nums leading-none">{score.toLocaleString()}</div>
          <div className="text-xs text-white/60">Best: {highScore.toLocaleString()}</div>
        </motion.div>

        {/* Level + difficulty */}
        <div className="bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5 text-white text-center">
          <div className="text-xs text-blue-300 font-bold uppercase tracking-widest">Level {levelId}</div>
          <div className={`text-xs font-semibold capitalize ${
            difficulty === 'easy' ? 'text-green-400' :
            difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'
          }`}>{difficulty}</div>
        </div>

        {/* Pause button */}
        <button
          className="pointer-events-auto bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5 text-white hover:bg-black/70 transition-colors"
          onClick={onPause}
          aria-label="Pause"
        >
          <span className="text-xl">⏸</span>
        </button>
      </div>

      {/* Birds remaining (bottom left) */}
      <div className="absolute bottom-2 left-2 flex gap-1 items-end">
        {birdsQueue.map((type, i) => {
          const cfg = BIRD_CONFIGS[type];
          const isUsed = i < currentBirdIndex;
          const isCurrent = i === currentBirdIndex;
          return (
            <motion.div
              key={i}
              className={`rounded-full border-2 flex items-center justify-center transition-all ${
                isUsed ? 'opacity-20 border-gray-400' :
                isCurrent ? 'border-yellow-400 shadow-lg shadow-yellow-400/40' : 'border-white/40'
              }`}
              style={{
                width: isCurrent ? 36 : 28,
                height: isCurrent ? 36 : 28,
                backgroundColor: cfg.color,
              }}
              animate={isCurrent ? { y: [0, -3, 0] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          );
        })}
      </div>

      {/* Pigs left (bottom right) */}
      <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5 text-white text-right">
        <div className="text-xs text-green-400 font-bold uppercase tracking-widest">Pigs</div>
        <div className="text-xl font-extrabold">{pigsLeft} 🐷</div>
      </div>

      {/* Ability button (center bottom) */}
      {activeBirdType && activeBirdType !== 'red' && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-auto">
          <motion.button
            onClick={onAbility}
            disabled={abilityUsed}
            className={`px-4 py-2 rounded-full font-bold text-sm shadow-lg transition-all ${
              abilityUsed
                ? 'bg-gray-600/70 text-gray-400 cursor-not-allowed'
                : 'bg-yellow-400 text-black hover:bg-yellow-300 active:scale-95 shadow-yellow-400/50'
            }`}
            whileTap={{ scale: 0.9 }}
          >
            {abilityUsed ? 'Used' : abilityLabel(activeBirdType)} ✨
          </motion.button>
        </div>
      )}

      {/* Birds count badge */}
      <div className="absolute top-16 right-3 bg-black/40 rounded-lg px-2 py-1 text-white text-xs">
        🐦 {birdsLeft} left
      </div>
    </div>
  );
}

function abilityLabel(type: BirdType): string {
  switch (type) {
    case 'yellow': return 'Speed Boost';
    case 'blue': return 'Split';
    case 'black': return 'Explode';
    default: return 'Ability';
  }
}
