'use client';

import { useRef, useCallback, useEffect } from 'react';

/**
 * Generates simple sounds via Web Audio API — no external files needed.
 */
export function useSound(sfxEnabled: boolean) {
  const ctx = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!sfxEnabled) return null;
    if (!ctx.current) {
      ctx.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (ctx.current.state === 'suspended') ctx.current.resume();
    return ctx.current;
  }, [sfxEnabled]);

  const playTone = useCallback((
    freq: number, duration: number, type: OscillatorType = 'sine',
    gainStart = 0.4, gainEnd = 0, detune = 0
  ) => {
    const ac = getCtx();
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    osc.detune.setValueAtTime(detune, ac.currentTime);
    gain.gain.setValueAtTime(gainStart, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(gainEnd, 0.001), ac.currentTime + duration);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + duration);
  }, [getCtx]);

  const playNoise = useCallback((duration: number, gainVal = 0.3) => {
    const ac = getCtx();
    if (!ac) return;
    const bufferSize = ac.sampleRate * duration;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ac.createBufferSource();
    source.buffer = buffer;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(gainVal, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    source.connect(gain);
    gain.connect(ac.destination);
    source.start();
  }, [getCtx]);

  const sounds = {
    launch: useCallback(() => {
      playTone(200, 0.15, 'sawtooth', 0.3, 0.0, -20);
      playTone(300, 0.1, 'sine', 0.2, 0.0);
    }, [playTone]),

    hit: useCallback(() => {
      playNoise(0.12, 0.4);
      playTone(100, 0.12, 'sawtooth', 0.3, 0.0);
    }, [playNoise, playTone]),

    pigDie: useCallback(() => {
      playTone(600, 0.06, 'sine', 0.5, 0.0);
      playTone(400, 0.1, 'sine', 0.3, 0.0);
      playTone(200, 0.15, 'sawtooth', 0.2, 0.0);
    }, [playTone]),

    explode: useCallback(() => {
      playNoise(0.35, 0.8);
      playTone(80, 0.3, 'sawtooth', 0.6, 0.0);
    }, [playNoise, playTone]),

    ability: useCallback(() => {
      playTone(500, 0.08, 'square', 0.3, 0.0);
      playTone(700, 0.08, 'square', 0.3, 0.0);
    }, [playTone]),

    levelComplete: useCallback(() => {
      [523, 659, 784, 1047].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.3, 'sine', 0.5, 0.0), i * 120);
      });
    }, [playTone]),

    gameOver: useCallback(() => {
      [400, 300, 200, 150].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.25, 'sawtooth', 0.4, 0.0), i * 100);
      });
    }, [playTone]),

    star: useCallback(() => {
      [800, 1000, 1200].forEach((f, i) => {
        setTimeout(() => playTone(f, 0.15, 'sine', 0.4, 0.0), i * 80);
      });
    }, [playTone]),
  };

  useEffect(() => {
    return () => {
      ctx.current?.close();
    };
  }, []);

  return sounds;
}
