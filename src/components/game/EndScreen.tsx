'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface EndScreenProps {
  type: 'levelComplete' | 'gameover';
  score: number;
  stars: number;
  levelId: number;
  totalLevels: number;
  onNextLevel: () => void;
  onRestart: () => void;
  onMenu: () => void;
  isNewHighScore: boolean;
}

export default function EndScreen({
  type, score, stars, levelId, totalLevels,
  onNextLevel, onRestart, onMenu, isNewHighScore,
}: EndScreenProps) {
  const [shownStars, setShownStars] = useState(0);

  useEffect(() => {
    if (type !== 'levelComplete') return;
    const timers = [
      setTimeout(() => setShownStars(1), 300),
      setTimeout(() => setShownStars(2), 600),
      setTimeout(() => setShownStars(3), 900),
    ];
    return () => timers.forEach(clearTimeout);
  }, [type]);

  const isWin = type === 'levelComplete';

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className={`rounded-3xl p-8 flex flex-col gap-4 items-center shadow-2xl border w-[320px] max-w-[90vw] ${
          isWin
            ? 'bg-gradient-to-b from-yellow-900/90 to-orange-900/90 border-yellow-400/40'
            : 'bg-gradient-to-b from-slate-900/95 to-red-950/95 border-red-500/30'
        }`}
        initial={{ scale: 0.7, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        {/* Title */}
        <motion.div
          className="text-5xl"
          animate={isWin ? { rotate: [0, -10, 10, -5, 5, 0] } : { x: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isWin ? '🎉' : '💀'}
        </motion.div>

        <h2 className={`text-2xl font-extrabold ${isWin ? 'text-yellow-300' : 'text-red-400'}`}>
          {isWin ? 'Level Complete!' : 'Game Over!'}
        </h2>

        {/* Stars */}
        {isWin && (
          <div className="flex gap-2 my-1">
            {[1, 2, 3].map(i => (
              <motion.span
                key={i}
                className="text-4xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={shownStars >= i ? { scale: 1, rotate: 0 } : {}}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                {i <= stars ? '⭐' : '☆'}
              </motion.span>
            ))}
          </div>
        )}

        {/* Score */}
        <div className="text-center">
          <div className="text-white/60 text-sm uppercase tracking-widest">Score</div>
          <motion.div
            className="text-3xl font-extrabold text-white tabular-nums"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {score.toLocaleString()}
          </motion.div>
          {isNewHighScore && (
            <motion.div
              className="text-yellow-400 text-sm font-bold mt-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: 'spring' }}
            >
              🏆 New High Score!
            </motion.div>
          )}
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-2 mt-1">
          {isWin && levelId < totalLevels && (
            <button
              onClick={onNextLevel}
              className="w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-white font-bold text-lg transition-all active:scale-95 shadow-lg shadow-green-500/40"
            >
              Next Level →
            </button>
          )}
          <button
            onClick={onRestart}
            className="w-full py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-white font-bold transition-all active:scale-95 shadow-lg shadow-yellow-500/30"
          >
            ↺ Try Again
          </button>
          <button
            onClick={onMenu}
            className="w-full py-2.5 rounded-xl bg-slate-600 hover:bg-slate-500 text-white font-bold transition-all active:scale-95"
          >
            ☰ Main Menu
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
