import React from 'react';
import { Play, Flame, HelpCircle, Trophy, Volume2, VolumeX, Shield, Sparkles } from 'lucide-react';
import { LEVEL_CONFIGS } from '../utils/levels';

interface MainMenuProps {
  onStartGame: (startLevel: number) => void;
  onOpenHelp: () => void;
  highScore: number;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenHelp,
  highScore,
  isMuted,
  onToggleSound,
}) => {
  return (
    <div id="main-menu-screen" className="absolute inset-0 bg-[#050000]/90 backdrop-blur-md flex flex-col items-center justify-center p-4 z-30 overflow-y-auto">
      <div className="w-full max-w-xl bg-[#0a0505]/90 border border-[#331111] rounded-sm p-6 sm:p-8 text-center shadow-[0_0_30px_#4a1010] relative">
        {/* Top Sound Toggle & High Score */}
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center gap-1.5 bg-[#1a0a0a] border border-[#331111] px-3 py-1 rounded-sm">
            <Trophy className="w-4 h-4 text-[#ffbc00]" />
            <span className="font-mono font-bold text-[10px] text-[#ffbc00]">HI: {highScore}</span>
          </div>

          <button
            id="menu-toggle-sound-btn"
            onClick={onToggleSound}
            className="p-2 bg-[#1a0a0a] hover:bg-[#331111] border border-[#331111] rounded-sm text-[#e0e0e0] transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#ff4444]" /> : <Volume2 className="w-4 h-4 text-[#00f2ff]" />}
          </button>
        </div>

        {/* Title Logo */}
        <div className="relative mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4a1010]/20 border border-[#4a1010] rounded-sm text-[#ff4d00] font-mono text-[10px] mb-2 font-bold uppercase tracking-[4px]">
            <Flame className="w-3.5 h-3.5 text-[#ff4d00] fill-[#ff4d00]" />
            <span>Pixel Arcade Survival</span>
          </div>

          <h1 className="font-mono text-3xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d00] to-[#ffbc00] tracking-wider font-black">
            MISSUSAUR
          </h1>
          <p className="font-mono text-xs sm:text-sm text-[#888] mt-1 tracking-widest uppercase font-bold">
            Volcanic Run & Meteor Blast
          </p>
        </div>

        {/* Features Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6 text-left font-mono text-[9px] uppercase tracking-widest">
          <div className="bg-[#1a0a0a] border border-[#331111] p-2.5 rounded-sm flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#ff4d00] shrink-0" />
            <span className="text-[#888]">Breath fire to repel meteors</span>
          </div>
          <div className="bg-[#1a0a0a] border border-[#331111] p-2.5 rounded-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#ff4444] shrink-0" />
            <span className="text-[#888]">Leap over active volcanoes</span>
          </div>
          <div className="bg-[#1a0a0a] border border-[#331111] p-2.5 rounded-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00f2ff] shrink-0" />
            <span className="text-[#888]">Victory dance at portals</span>
          </div>
        </div>

        {/* Level Select / Start Game */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            id="start-game-btn"
            onClick={() => onStartGame(1)}
            className="w-full py-4 px-6 bg-[#ff4d00] text-black font-mono text-sm sm:text-base font-black tracking-[4px] rounded-sm shadow-[0_0_15px_#ff4d00] hover:bg-[#ffbc00] hover:shadow-[0_0_20px_#ffbc00] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase"
          >
            <Play className="w-5 h-5 fill-black" />
            <span>Play Campaign (Level 1)</span>
          </button>
        </div>

        {/* Quick Level Warp Bar */}
        <div className="bg-[#1a0a0a] border border-[#331111] p-3 rounded-sm mb-6">
          <span className="font-mono font-bold text-[9px] text-[#ff4444] block mb-2 text-left uppercase tracking-[2px]">
            Direct Level Warp
          </span>
          <div className="grid grid-cols-5 gap-1.5 font-mono text-[10px] font-bold">
            {LEVEL_CONFIGS.map((lvl) => (
              <button
                key={lvl.levelNumber}
                id={`warp-level-${lvl.levelNumber}-btn`}
                onClick={() => onStartGame(lvl.levelNumber)}
                className="py-2 bg-[#050000] hover:bg-[#ff4d00] hover:text-black text-[#888] border border-[#331111] hover:border-[#ff4d00] rounded-sm transition-colors flex flex-col items-center"
              >
                <span>LV.{lvl.levelNumber}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Help Button */}
        <button
          id="menu-how-to-play-btn"
          onClick={onOpenHelp}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-cyan-400 font-arcade text-xs transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>HOW TO PLAY & CONTROLS</span>
        </button>
      </div>
    </div>
  );
};
