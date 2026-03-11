'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Difficulty } from '@/lib/types';
import { LEVELS } from '@/lib/levels';
import { LOCAL_STORAGE_KEY, LOCAL_STORAGE_SOUND_KEY, LOCAL_STORAGE_MUSIC_KEY } from '@/lib/constants';
import { HighScores } from '@/lib/types';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useSound } from '@/hooks/useSound';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import GameCanvas from './GameCanvas';
import GameHUD from './GameHUD';
import PauseScreen from './PauseScreen';
import EndScreen from './EndScreen';
import MainMenu from './MainMenu';

export default function Game() {
  const [soundEnabled, setSoundEnabled] = useLocalStorage(LOCAL_STORAGE_SOUND_KEY, true);
  const [musicEnabled, setMusicEnabled] = useLocalStorage(LOCAL_STORAGE_MUSIC_KEY, true);
  const [highScores, setHighScores] = useLocalStorage<HighScores>(LOCAL_STORAGE_KEY, {});
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [showMenu, setShowMenu] = useState(true);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const sounds = useSound(soundEnabled);
  const soundRef = useRef(sounds);
  useEffect(() => { soundRef.current = sounds; }, [sounds]);

  const handleLevelComplete = useCallback((score: number, stars: number) => {
    setHighScores(prev => {
      const existing = prev[currentLevelId];
      const isNew = !existing || score > existing.score;
      setIsNewHighScore(isNew);
      if (isNew) {
        return { ...prev, [currentLevelId]: { level: currentLevelId, score, stars, timestamp: Date.now() } };
      }
      return prev;
    });
  }, [currentLevelId, setHighScores]);

  const handleGameOver = useCallback(() => {
    setIsNewHighScore(false);
  }, []);

  const engine = useGameEngine(difficulty, handleLevelComplete, handleGameOver, soundRef);
  const { state, loadLevel, readyFirstBird, startLoop, stopLoop, onDragStart, onDragMove, onDragEnd, onAbility, pause, resume } = engine;

  const startLevel = useCallback((levelId: number, diff: Difficulty) => {
    const level = LEVELS.find(l => l.id === levelId);
    if (!level) return;
    setCurrentLevelId(levelId);
    setDifficulty(diff);
    setShowMenu(false);
    loadLevel(level);
    setTimeout(() => {
      readyFirstBird();
      startLoop();
    }, 50);
  }, [loadLevel, readyFirstBird, startLoop]);

  const restartLevel = useCallback(() => {
    stopLoop();
    startLevel(currentLevelId, difficulty);
  }, [stopLoop, startLevel, currentLevelId, difficulty]);

  const goToMenu = useCallback(() => {
    stopLoop();
    setShowMenu(true);
  }, [stopLoop]);

  const goToNextLevel = useCallback(() => {
    const nextId = currentLevelId + 1;
    if (nextId <= LEVELS.length) {
      startLevel(nextId, difficulty);
    } else {
      goToMenu();
    }
  }, [currentLevelId, difficulty, startLevel, goToMenu]);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (state.gameState === 'playing') pause();
        else if (state.gameState === 'paused') resume();
      }
      if (e.key === ' ') {
        e.preventDefault();
        if (state.gameState === 'playing') onAbility();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.gameState, pause, resume, onAbility]);

  const currentLevel = LEVELS.find(l => l.id === currentLevelId);
  const highScore = highScores[currentLevelId]?.score ?? 0;
  const pigsLeft = state.pigs.filter(p => p.alive).length;
  const activeBirdType = state.activeBird?.type ?? null;

  if (showMenu) {
    return (
      <MainMenu
        onStart={startLevel}
        highScores={highScores}
        soundEnabled={soundEnabled}
        musicEnabled={musicEnabled}
        onToggleSound={() => setSoundEnabled(v => !v)}
        onToggleMusic={() => setMusicEnabled(v => !v)}
      />
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-black overflow-hidden">
      {/* Game canvas area */}
      <div className="relative flex-1 min-h-0">
        <GameCanvas
          engineState={state}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          onAbility={onAbility}
          background={currentLevel?.background ?? 'sky1'}
        />

        <GameHUD
          score={state.score}
          highScore={highScore}
          levelId={currentLevelId}
          birdsQueue={state.birdsQueue}
          currentBirdIndex={state.currentBirdIndex}
          pigsLeft={pigsLeft}
          difficulty={difficulty}
          onPause={pause}
          onAbility={onAbility}
          abilityUsed={state.activeBird?.abilityUsed ?? false}
          activeBirdType={activeBirdType}
        />

        <AnimatePresence>
          {state.gameState === 'paused' && (
            <PauseScreen
              onResume={resume}
              onRestart={restartLevel}
              onMenu={goToMenu}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(state.gameState === 'levelComplete' || state.gameState === 'gameover') && (
            <EndScreen
              type={state.gameState}
              score={state.score}
              stars={state.stars}
              levelId={currentLevelId}
              totalLevels={LEVELS.length}
              onNextLevel={goToNextLevel}
              onRestart={restartLevel}
              onMenu={goToMenu}
              isNewHighScore={isNewHighScore}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Mobile control bar */}
      <div className="flex md:hidden items-center justify-between px-4 py-2 bg-black/80 border-t border-white/10">
        <button
          onClick={pause}
          className="p-2 rounded-lg bg-white/10 text-white active:bg-white/20"
        >
          ⏸
        </button>
        <div className="text-white font-bold text-lg">{state.score.toLocaleString()}</div>
        <button
          onClick={onAbility}
          disabled={state.activeBird?.abilityUsed ?? true}
          className="p-2 rounded-lg bg-yellow-500/80 text-white font-bold disabled:opacity-40 active:bg-yellow-400"
        >
          ✨
        </button>
      </div>
    </div>
  );
}
