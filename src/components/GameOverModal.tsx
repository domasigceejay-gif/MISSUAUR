import React, { useEffect } from 'react';
import { RotateCcw, Home, Trophy, Skull, Droplets } from 'lucide-react';
import { GameStats } from '../types';

interface GameOverModalProps {
  stats: GameStats;
  onRetry: () => void;
  onGoMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  onRetry,
  onGoMenu,
}) => {
  const isNewHighScore = stats.score >= stats.highScore && stats.score > 0;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        onRetry();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onRetry]);

  return (
    <div id="game-over-extinct-modal" className="absolute inset-0 bg-[#050000]/90 backdrop-blur-sm flex items-center justify-center p-4 z-30 animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[#0a0505] border border-[#ff4444] p-6 rounded-sm shadow-[0_0_30px_#4a1010] text-center relative">
        {/* Extinct Header */}
        <div className="flex items-center justify-center gap-2 mb-1 text-[#ff4444]">
          <Skull className="w-6 h-6 animate-pulse" />
          <span className="font-mono font-bold text-[10px] tracking-[4px] uppercase">Cataclysm Fatal Strike</span>
          <Skull className="w-6 h-6 animate-pulse" />
        </div>

        <h1 className="font-mono text-3xl sm:text-4xl font-black text-[#ff4444] mb-2 tracking-wider">
          EXTINCT!
        </h1>

        <div className="flex items-center justify-center gap-1.5 text-[#888] font-mono uppercase tracking-[2px] text-[10px] mb-4">
          <Droplets className="w-4 h-4 text-[#00f2ff] animate-bounce" />
          <span>The dinosaur is crying in the ashes...</span>
          <Droplets className="w-4 h-4 text-[#00f2ff] animate-bounce" />
        </div>

        {/* High score badge if beaten */}
        {isNewHighScore && (
          <div className="mb-4 inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/60 px-3.5 py-1 rounded-full text-amber-300 font-arcade text-[10px]">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>NEW HIGH SCORE RECORD!</span>
          </div>
        )}

        {/* Stats Table */}
        <div className="bg-[#1a0a0a] border border-[#331111] rounded-sm p-4 mb-5 text-left font-mono font-bold uppercase tracking-[2px] text-[10px] space-y-2">
          <div className="flex items-center justify-between text-[#888] border-b border-[#331111] pb-1.5">
            <span>FINAL SCORE:</span>
            <span className="text-[#ffbc00] text-xs">{stats.score}</span>
          </div>
          <div className="flex items-center justify-between text-[#888] border-b border-[#331111] pb-1.5">
            <span>HIGH SCORE:</span>
            <span className="text-[#ffbc00]">{stats.highScore}</span>
          </div>
          <div className="flex items-center justify-between text-[#888] border-b border-[#331111] pb-1.5">
            <span>LEVEL REACHED:</span>
            <span className="text-[#00f2ff]">LEVEL {stats.level}</span>
          </div>
          <div className="flex items-center justify-between text-[#888] border-b border-[#331111] pb-1.5">
            <span>DISTANCE COVERED:</span>
            <span className="text-[#ff4d00]">{stats.distance} METERS</span>
          </div>
          <div className="flex items-center justify-between text-[#888]">
            <span>METEORS REPELLED:</span>
            <span className="text-[#ff4d00]">{stats.meteorsDestroyed}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            id="revive-retry-btn"
            onClick={onRetry}
            className="flex-1 py-3.5 px-4 bg-[#ff4444] text-black font-mono tracking-[4px] uppercase text-xs font-black rounded-sm shadow-[0_0_15px_#ff4444] hover:bg-[#ffbc00] hover:shadow-[0_0_20px_#ffbc00] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 font-black" />
            <span>Restart Game (Space)</span>
          </button>

          <button
            id="return-menu-btn"
            onClick={onGoMenu}
            className="py-3.5 px-5 bg-transparent hover:bg-[#331111] text-[#888] hover:text-[#e0e0e0] font-mono tracking-[2px] uppercase text-xs font-bold rounded-sm border border-[#331111] active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
