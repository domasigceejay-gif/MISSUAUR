import React from 'react';
import { Play, Flame, HelpCircle, Trophy, Volume2, VolumeX, Shield, Sparkles, Sun, Moon, Film } from 'lucide-react';
import { LEVEL_CONFIGS } from '../utils/levels';

interface MainMenuProps {
  onStartGame: (startLevel: number) => void;
  onOpenHelp: () => void;
  highScore: number;
  isMuted: boolean;
  onToggleSound: () => void;
  lightMode: boolean;
  onToggleLightMode: () => void;
  onWatchStory?: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenHelp,
  highScore,
  isMuted,
  onToggleSound,
  lightMode,
  onToggleLightMode,
  onWatchStory,
}) => {
  return (
    <div
      id="main-menu-screen"
      className={`absolute inset-0 backdrop-blur-md flex flex-col items-center justify-center p-4 z-30 overflow-y-auto transition-colors duration-300 ${
        lightMode ? 'bg-[#f4ebd9]/85 text-[#2c1d11]' : 'bg-[#050000]/90 text-[#e0e0e0]'
      }`}
    >
      <div
        className={`w-full max-w-xl border rounded-sm p-6 sm:p-8 text-center relative transition-colors duration-300 ${
          lightMode
            ? 'bg-[#fdfaf3] border-[#cbb99e] shadow-[0_10px_35px_rgba(180,140,80,0.25)]'
            : 'bg-[#0a0505]/95 border-[#331111] shadow-[0_0_30px_#4a1010]'
        }`}
      >
        {/* Top Sound & Light Mode Toggle & High Score */}
        <div className="flex items-center justify-between w-full mb-4">
          <div
            className={`flex items-center gap-1.5 border px-3 py-1 rounded-sm ${
              lightMode ? 'bg-[#f5ecde] border-[#cbb99e]' : 'bg-[#1a0a0a] border-[#331111]'
            }`}
          >
            <Trophy className="w-4 h-4 text-[#ffbc00]" />
            <span className="font-mono font-bold text-[10px] text-[#ffbc00]">HI: {highScore}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="menu-toggle-light-mode-btn"
              onClick={onToggleLightMode}
              title={lightMode ? 'Switch to Dark Mode Graphics (L)' : 'Switch to Light Mode Graphics (L)'}
              className={`p-2 border rounded-sm transition-colors flex items-center gap-1.5 text-xs font-mono font-bold ${
                lightMode
                  ? 'bg-amber-100 hover:bg-amber-200 border-[#cbb99e] text-[#ea580c]'
                  : 'bg-[#1a0a0a] hover:bg-[#331111] border-[#331111] text-[#00f2ff]'
              }`}
            >
              {lightMode ? (
                <>
                  <Sun className="w-4 h-4 text-[#ea580c]" />
                  <span className="hidden sm:inline text-[9px] uppercase">DAY</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#00f2ff]" />
                  <span className="hidden sm:inline text-[9px] uppercase">NIGHT</span>
                </>
              )}
            </button>

            <button
              id="menu-toggle-sound-btn"
              onClick={onToggleSound}
              className={`p-2 border rounded-sm transition-colors ${
                lightMode
                  ? 'bg-[#f5ecde] hover:bg-[#ebdcc8] border-[#cbb99e] text-[#2c1d11]'
                  : 'bg-[#1a0a0a] hover:bg-[#331111] border-[#331111] text-[#e0e0e0]'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-[#ff4444]" /> : <Volume2 className="w-4 h-4 text-[#00f2ff]" />}
            </button>
          </div>
        </div>

        {/* Title Logo */}
        <div className="relative mb-6">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 border rounded-sm font-mono text-[10px] mb-2 font-bold uppercase tracking-[4px] ${
              lightMode ? 'bg-amber-100/70 border-amber-300 text-[#c2410c]' : 'bg-[#4a1010]/20 border-[#4a1010] text-[#ff4d00]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#ff4d00] fill-[#ff4d00]" />
            <span>Pixel Arcade Survival</span>
          </div>

          <h1 className="font-mono text-3xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#ff4d00] to-[#ffbc00] tracking-wider font-black">
            MISSUSAUR
          </h1>
          <p className={`font-mono text-xs sm:text-sm mt-1 tracking-widest uppercase font-bold ${lightMode ? 'text-[#786b5e]' : 'text-[#888]'}`}>
            Volcanic Run & Meteor Blast
          </p>
        </div>

        {/* Features Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6 text-left font-mono text-[9px] uppercase tracking-widest">
          <div className={`p-2.5 rounded-sm flex items-center gap-2 border ${lightMode ? 'bg-[#f8f2e7] border-[#d8cbb8]' : 'bg-[#1a0a0a] border-[#331111]'}`}>
            <Flame className="w-4 h-4 text-[#ff4d00] shrink-0" />
            <span className={lightMode ? 'text-[#5c4d3e] font-semibold' : 'text-[#888]'}>Breath fire to repel meteors</span>
          </div>
          <div className={`p-2.5 rounded-sm flex items-center gap-2 border ${lightMode ? 'bg-[#f8f2e7] border-[#d8cbb8]' : 'bg-[#1a0a0a] border-[#331111]'}`}>
            <Shield className="w-4 h-4 text-[#ff4444] shrink-0" />
            <span className={lightMode ? 'text-[#5c4d3e] font-semibold' : 'text-[#888]'}>Leap over active volcanoes</span>
          </div>
          <div className={`p-2.5 rounded-sm flex items-center gap-2 border ${lightMode ? 'bg-[#f8f2e7] border-[#d8cbb8]' : 'bg-[#1a0a0a] border-[#331111]'}`}>
            <Sparkles className="w-4 h-4 text-[#00f2ff] shrink-0" />
            <span className={lightMode ? 'text-[#5c4d3e] font-semibold' : 'text-[#888]'}>Victory dance at portals</span>
          </div>
        </div>

        {/* Level Select / Start Game */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            id="start-game-btn"
            onClick={() => onStartGame(1)}
            className="w-full py-4 px-6 bg-[#ff4d00] text-black font-mono text-sm sm:text-base font-black tracking-[4px] rounded-sm shadow-[0_0_15px_#ff4d00] hover:bg-[#ffbc00] hover:shadow-[0_0_20px_#ffbc00] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase cursor-pointer"
          >
            <Play className="w-5 h-5 fill-black" />
            <span>Play Campaign (Level 1)</span>
          </button>
        </div>

        {/* Quick Level Warp Bar */}
        <div className={`p-3 rounded-sm mb-6 border ${lightMode ? 'bg-[#f8f2e7] border-[#d8cbb8]' : 'bg-[#1a0a0a] border-[#331111]'}`}>
          <span className="font-mono font-bold text-[9px] text-[#ff4444] block mb-2 text-left uppercase tracking-[2px]">
            Direct Level Warp
          </span>
          <div className="grid grid-cols-5 gap-1.5 font-mono text-[10px] font-bold">
            {LEVEL_CONFIGS.map((lvl) => (
              <button
                key={lvl.levelNumber}
                id={`warp-level-${lvl.levelNumber}-btn`}
                onClick={() => onStartGame(lvl.levelNumber)}
                className={`py-2 rounded-sm transition-colors flex flex-col items-center border ${
                  lightMode
                    ? 'bg-[#ffffff] hover:bg-[#ff4d00] hover:text-black text-[#5c4d3e] border-[#d8cbb8] hover:border-[#ff4d00]'
                    : 'bg-[#050000] hover:bg-[#ff4d00] hover:text-black text-[#888] border-[#331111] hover:border-[#ff4d00]'
                }`}
              >
                <span>LV.{lvl.levelNumber}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions: Story Intro & Help */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {onWatchStory && (
            <button
              id="menu-watch-story-btn"
              onClick={onWatchStory}
              className={`inline-flex items-center gap-2 font-arcade text-xs transition-colors cursor-pointer ${
                lightMode ? 'text-amber-700 hover:text-amber-900' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <Film className="w-4 h-4 text-amber-500" />
              <span>STORY PROLOGUE</span>
            </button>
          )}

          <button
            id="menu-how-to-play-btn"
            onClick={onOpenHelp}
            className={`inline-flex items-center gap-2 font-arcade text-xs transition-colors cursor-pointer ${
              lightMode ? 'text-zinc-600 hover:text-cyan-700' : 'text-zinc-400 hover:text-cyan-400'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>HOW TO PLAY & CONTROLS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
