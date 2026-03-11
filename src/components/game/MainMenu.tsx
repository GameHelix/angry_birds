'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Difficulty } from '@/lib/types';
import { LEVELS } from '@/lib/levels';
import { HighScores } from '@/lib/types';

interface MainMenuProps {
  onStart: (levelId: number, difficulty: Difficulty) => void;
  highScores: HighScores;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export default function MainMenu({
  onStart, highScores, soundEnabled, musicEnabled, onToggleSound, onToggleMusic,
}: MainMenuProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [view, setView] = useState<'home' | 'levels'>('home');

  if (view === 'levels') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-green-400 flex flex-col items-center justify-center p-4">
        <motion.div
          className="bg-black/30 backdrop-blur-md rounded-3xl p-6 w-full max-w-lg border border-white/20 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => setView('home')}
              className="text-white/70 hover:text-white text-2xl transition-colors"
            >
              ←
            </button>
            <h2 className="text-2xl font-extrabold text-white">Select Level</h2>
          </div>

          {/* Difficulty selector */}
          <div className="flex gap-2 mb-5">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`flex-1 py-1.5 rounded-xl font-bold capitalize text-sm transition-all ${
                  difficulty === d
                    ? d === 'easy' ? 'bg-green-500 text-white shadow-lg shadow-green-500/40'
                    : d === 'medium' ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/40'
                    : 'bg-red-500 text-white shadow-lg shadow-red-500/40'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Level grid */}
          <div className="grid grid-cols-5 gap-2 mb-5">
            {LEVELS.map(level => {
              const hs = highScores[level.id];
              const stars = hs?.stars ?? 0;
              const isSelected = selectedLevel === level.id;
              return (
                <motion.button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 border-2 transition-all font-bold text-lg ${
                    isSelected
                      ? 'border-yellow-400 bg-yellow-400/20 text-white'
                      : 'border-white/20 bg-white/10 text-white/80 hover:border-white/40'
                  }`}
                >
                  <span>{level.id}</span>
                  <div className="flex text-yellow-400 text-[10px]">
                    {[1, 2, 3].map(i => <span key={i}>{i <= stars ? '★' : '☆'}</span>)}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Level info */}
          {selectedLevel && (
            <div className="bg-white/10 rounded-xl p-3 mb-4 text-white">
              <div className="font-bold">{LEVELS[selectedLevel - 1].name}</div>
              <div className="text-sm text-white/70">
                Birds: {LEVELS[selectedLevel - 1].birds.length} ·
                Pigs: {LEVELS[selectedLevel - 1].pigs.length}
              </div>
              {highScores[selectedLevel] && (
                <div className="text-sm text-yellow-300">
                  Best: {highScores[selectedLevel].score.toLocaleString()}
                </div>
              )}
            </div>
          )}

          <motion.button
            onClick={() => onStart(selectedLevel, difficulty)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-extrabold text-xl shadow-xl shadow-red-500/40 hover:from-red-400 hover:to-orange-400 transition-all"
          >
            Launch! 🚀
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-500 via-sky-300 to-green-500 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Decorative birds */}
      <motion.div
        className="absolute top-8 left-8 text-5xl"
        animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >🐦</motion.div>
      <motion.div
        className="absolute top-12 right-12 text-4xl"
        animate={{ y: [0, -8, 0], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      >🐦</motion.div>

      {/* Logo */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="text-center mb-8"
      >
        <h1 className="text-6xl font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] leading-tight">
          Angry<br />
          <span className="text-red-400 drop-shadow-[0_4px_12px_rgba(239,68,68,0.8)]">Birds</span>
        </h1>
        <p className="text-white/80 text-lg mt-2 font-medium">Save the eggs! Smash the piggies! 🥚</p>
      </motion.div>

      {/* Main card */}
      <motion.div
        className="bg-black/25 backdrop-blur-md rounded-3xl p-6 w-full max-w-sm border border-white/20 shadow-2xl flex flex-col gap-3"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 20 }}
      >
        <motion.button
          onClick={() => setView('levels')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-extrabold text-2xl shadow-xl shadow-red-500/40 hover:from-red-400 hover:to-orange-400 transition-all"
        >
          🐦 Play
        </motion.button>

        <motion.button
          onClick={() => onStart(1, 'medium')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-lg transition-all border border-white/20"
        >
          ⚡ Quick Play
        </motion.button>

        {/* Sound toggles */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={onToggleSound}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 border ${
              soundEnabled
                ? 'bg-blue-500/60 border-blue-400 text-white'
                : 'bg-white/10 border-white/20 text-white/50'
            }`}
          >
            {soundEnabled ? '🔊' : '🔇'} SFX
          </button>
          <button
            onClick={onToggleMusic}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 border ${
              musicEnabled
                ? 'bg-purple-500/60 border-purple-400 text-white'
                : 'bg-white/10 border-white/20 text-white/50'
            }`}
          >
            {musicEnabled ? '🎵' : '🎵'} Music
          </button>
        </div>
      </motion.div>

      {/* Controls hint */}
      <motion.div
        className="mt-5 text-white/60 text-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        🖱 Drag slingshot to aim · Click/Tap in flight to use ability
      </motion.div>

      {/* Ground decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-around px-4 pointer-events-none overflow-hidden">
        {['🌴', '🌿', '🌱', '🌿', '🌴'].map((emoji, i) => (
          <span key={i} className="text-2xl">{emoji}</span>
        ))}
      </div>
    </div>
  );
}
