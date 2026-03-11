'use client';

import { motion } from 'framer-motion';

interface PauseScreenProps {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

export default function PauseScreen({ onResume, onRestart, onMenu }: PauseScreenProps) {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-8 flex flex-col gap-4 items-center shadow-2xl border border-white/10 min-w-[240px]"
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="text-4xl">⏸</div>
        <h2 className="text-2xl font-extrabold text-white">Paused</h2>
        <div className="w-full flex flex-col gap-2 mt-2">
          <button
            onClick={onResume}
            className="w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-white font-bold text-lg transition-all active:scale-95 shadow-lg shadow-green-500/30"
          >
            ▶ Resume
          </button>
          <button
            onClick={onRestart}
            className="w-full py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-white font-bold text-lg transition-all active:scale-95 shadow-lg shadow-yellow-500/30"
          >
            ↺ Restart
          </button>
          <button
            onClick={onMenu}
            className="w-full py-2.5 rounded-xl bg-slate-600 hover:bg-slate-500 text-white font-bold text-lg transition-all active:scale-95"
          >
            ☰ Menu
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
