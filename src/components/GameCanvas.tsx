import React, { useEffect, useRef } from 'react';
import { DinoGameEngine } from '../utils/gameEngine';
import { GameState, GameStats } from '../types';

interface GameCanvasProps {
  onEngineReady: (engine: DinoGameEngine) => void;
  onStateChange: (state: GameState) => void;
  onStatsUpdate: (stats: GameStats, hp: number, fireEnergy: number) => void;
  onLevelComplete: (level: number, stats: GameStats) => void;
  crtEffect: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  onEngineReady,
  onStateChange,
  onStatsUpdate,
  onLevelComplete,
  crtEffect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<DinoGameEngine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new DinoGameEngine(canvasRef.current);
    engineRef.current = engine;

    engine.onStateChange = onStateChange;
    engine.onStatsUpdate = onStatsUpdate;
    engine.onLevelComplete = onLevelComplete;

    onEngineReady(engine);
    engine.startLoop();

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      engine.resizeCanvas();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Keyboard bindings
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling
      if (['Space', 'ArrowUp', 'ArrowDown', 'KeyW', 'KeyS', 'KeyX', 'KeyF', 'KeyC'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        engine.jump();
      } else if (e.code === 'KeyX' || e.code === 'KeyF' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        engine.startFireBreath();
      } else if (e.code === 'KeyC') {
        engine.swingSword();
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        engine.setDucking(true);
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        engine.togglePause();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        engine.setDucking(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      resizeObserver.disconnect();
      engine.stopLoop();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="game-canvas-container"
      className="relative w-full h-full min-h-[420px] max-h-[750px] bg-[#050000] overflow-hidden select-none border border-[#331111] shadow-[0_0_30px_#4a1010]"
      style={{ background: 'radial-gradient(circle at 50% 120%, #4a1010 0%, #050000 70%)' }}
    >
      <canvas
        ref={canvasRef}
        id="dino-game-canvas"
        className="w-full h-full block pixel-art"
      />
      {crtEffect && (
        <div
          id="crt-scanline-overlay"
          className="absolute inset-0 scanlines pointer-events-none rounded-lg z-10"
        />
      )}
    </div>
  );
};
