import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Zap, Skull, ShieldCheck } from 'lucide-react';
import { GameStats, LevelConfig } from '../types';
import { getLevelConfig } from '../utils/levels';

interface VictoryModalProps {
  currentLevel: number;
  stats: GameStats;
  onEnterNextLevel: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  currentLevel,
  stats,
  onEnterNextLevel,
}) => {
  const nextLevel = currentLevel + 1;
  const nextConfig: LevelConfig = getLevelConfig(nextLevel);
  const [countdown, setCountdown] = useState<number>(6);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onEnterNextLevel();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        onEnterNextLevel();
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onEnterNextLevel]);

  return (
    <div id="victory-dance-modal" className="absolute inset-0 bg-[#050000]/80 backdrop-blur-sm flex items-center justify-center p-4 z-30 animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[#0a0505] border border-[#00f2ff] p-6 rounded-sm shadow-[0_0_30px_#00f2ff] text-center relative overflow-hidden">
        {/* Glowing Top Banner */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-[#ffbc00] animate-spin" />
          <span className="font-mono font-bold uppercase tracking-[4px] text-[10px] text-[#00f2ff]">LEVEL {currentLevel} CLEAR!</span>
          <Sparkles className="w-6 h-6 text-[#ffbc00] animate-spin" />
        </div>

        <h2 className="font-mono text-3xl font-black text-[#ffbc00] mb-1 tracking-wider">
          VICTORY DANCE!
        </h2>
        <p className="font-mono font-bold uppercase text-[10px] text-[#e0e0e0] mb-4 tracking-widest text-[#888]">
          The Dinosaur celebrated before warping into the dimensional rift!
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 bg-zinc-950 p-3.5 rounded-lg border border-zinc-800 text-left font-arcade text-[10px]">
          <div className="flex items-center justify-between text-zinc-300 border-b border-zinc-800 pb-1.5">
            <span>METEORS REPELLED:</span>
            <span className="text-amber-400">+{stats.meteorsDestroyed}</span>
          </div>
          <div className="flex items-center justify-between text-zinc-300 border-b border-zinc-800 pb-1.5">
            <span>VOLCANOES LEAPED:</span>
            <span className="text-orange-400">+{stats.volcanoesJumped}</span>
          </div>
          <div className="flex items-center justify-between text-zinc-300">
            <span>ENEMIES BLASTED:</span>
            <span className="text-red-400">+{stats.enemiesDefeated}</span>
          </div>
          <div className="flex items-center justify-between text-zinc-300">
            <span>TOTAL SCORE:</span>
            <span className="text-yellow-300">{stats.score}</span>
          </div>
        </div>

        {/* Next Level Preview Box */}
        <div className="bg-[#050000] border border-[#00f2ff]/40 p-3.5 rounded-sm mb-6 text-left">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono font-bold uppercase tracking-[4px] text-[10px] text-[#00f2ff]">NEXT: LEVEL {nextLevel}</span>
            <span className="font-mono text-base font-black text-[#ffbc00]">{nextConfig.name}</span>
          </div>
          
          <div className="flex flex-col gap-1.5 text-xs font-mono font-bold uppercase tracking-[1px] text-[#888]">
            <div className="flex items-center gap-1.5 text-[#ffbc00]">
              <Zap className="w-4 h-4" />
              <span>Speed: <strong>{nextConfig.baseSpeed} px/s</strong></span>
            </div>
            {nextConfig.enemyDinoTypes.length > 0 && (
              <div className="flex items-center gap-1.5 text-[#ff4444]">
                <Skull className="w-4 h-4" />
                <span>Threats: <strong>{nextConfig.enemyDinoTypes.join(', ')}</strong></span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-[#00f2ff]">
              <ShieldCheck className="w-4 h-4" />
              <span>HP Restored +1 Heart</span>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          id="enter-next-portal-btn"
          onClick={onEnterNextLevel}
          className="w-full py-3.5 px-6 bg-[#00f2ff] text-black font-mono text-sm font-black tracking-[4px] uppercase rounded-sm shadow-[0_0_15px_#00f2ff] hover:bg-[#ffbc00] hover:shadow-[0_0_20px_#ffbc00] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>Enter Portal Now ({countdown}s)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
