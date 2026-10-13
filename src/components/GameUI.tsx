import React from 'react';
import { Heart, Flame, Volume2, VolumeX, Monitor, HelpCircle, Compass, Pause, Play, LogOut, Sun, Moon } from 'lucide-react';
import { GameStats, LevelConfig } from '../types';

interface GameUIProps {
  stats: GameStats;
  hp: number;
  maxHp: number;
  fireEnergy: number;
  maxFireEnergy: number;
  levelConfig: LevelConfig;
  isMuted: boolean;
  onToggleSound: () => void;
  crtEffect: boolean;
  onToggleCrt: () => void;
  onOpenHelp: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  lightMode: boolean;
  onToggleLightMode: () => void;
  onQuit: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({
  stats,
  hp,
  maxHp,
  fireEnergy,
  maxFireEnergy,
  levelConfig,
  isMuted,
  onToggleSound,
  crtEffect,
  onToggleCrt,
  onOpenHelp,
  isPaused,
  onTogglePause,
  lightMode,
  onToggleLightMode,
  onQuit,
}) => {
  const distanceProgress = Math.min(100, Math.floor((stats.distance / levelConfig.targetDistance) * 100));

  const cardBaseStyle = lightMode
    ? 'bg-[#fdfbf6]/90 backdrop-blur-sm border border-[#cbb99e] shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-[#2c1d11]'
    : 'bg-[#050000]/80 backdrop-blur-sm border border-[#331111] shadow-none text-[#e0e0e0]';

  const dividerStyle = lightMode ? 'bg-[#cbb99e]' : 'bg-[#331111]';

  return (
    <div id="game-hud-overlay" className="absolute inset-x-0 top-0 p-3 sm:p-4 pointer-events-none z-20">
      <div className="flex flex-col gap-2.5 max-w-5xl mx-auto">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: Health & Fire Energy & Pause + Quit */}
          <div className={`flex flex-wrap items-center gap-2.5 ${cardBaseStyle} px-3.5 py-2 rounded-sm pointer-events-auto`}>
            {/* Pause Button */}
            <button
              id="toggle-pause-btn"
              onClick={onTogglePause}
              title={isPaused ? 'Resume (P or Esc)' : 'Pause (P or Esc)'}
              className={`p-1.5 rounded-sm transition-colors ${
                lightMode
                  ? 'text-[#2c1d11] hover:bg-[#ebdcc8]'
                  : 'text-[#e0e0e0] hover:bg-[#331111]'
              }`}
            >
              {isPaused ? <Play className="w-5 h-5 text-[#00f2ff]" /> : <Pause className="w-5 h-5 text-[#ffbc00]" />}
            </button>

            {/* Quit Button (Next to Pause button) */}
            <button
              id="quit-game-btn"
              onClick={onQuit}
              title="Quit to Menu (Q)"
              className={`p-1.5 rounded-sm transition-colors border-r flex items-center gap-1 font-mono pr-2.5 mr-0.5 ${
                lightMode
                  ? 'border-[#cbb99e] text-[#c62828] hover:bg-red-100/90'
                  : 'border-[#331111] text-[#ff4444] hover:bg-[#331111]'
              }`}
            >
              <LogOut className="w-4 h-4 text-[#ff4444]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff4444]">QUIT</span>
            </button>

            {/* Health Hearts */}
            <div className="flex items-center gap-1.5" id="health-meter">
              <span className={`font-arcade text-[10px] mr-1 hidden sm:inline ${lightMode ? 'text-zinc-600 font-bold' : 'text-zinc-400'}`}>
                HP:
              </span>
              {Array.from({ length: maxHp }).map((_, idx) => {
                const filled = idx < hp;
                return (
                  <Heart
                    key={idx}
                    className={`w-5 h-5 transition-all duration-300 ${
                      filled
                        ? 'text-[#ff4444] fill-[#ff4444] scale-100 drop-shadow-[0_0_8px_#ff4444]'
                        : lightMode
                        ? 'text-[#d6c7b2] fill-[#d6c7b2] scale-90'
                        : 'text-[#331111] fill-[#331111] scale-90'
                    }`}
                  />
                );
              })}
            </div>

            <div className={`h-4 w-px ${dividerStyle} mx-1 hidden sm:block`} />

            {/* Fire Energy Gauge */}
            <div className="flex items-center gap-2" id="fire-energy-meter">
              <Flame
                className={`w-5 h-5 ${
                  fireEnergy >= 20
                    ? 'text-[#ff4d00] fill-[#ff4d00] animate-pulse drop-shadow-[0_0_8px_#ff4d00]'
                    : lightMode
                    ? 'text-[#cbb99e]'
                    : 'text-[#331111]'
                }`}
              />
              <div className="flex flex-col gap-0.5">
                <div
                  className={`w-20 sm:w-28 h-3 rounded-full overflow-hidden p-0.5 border ${
                    lightMode
                      ? 'bg-[#eae0d0] border-[#cbb99e]'
                      : 'bg-[#1a0a0a] border-[#331111]'
                  }`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#ff4d00] to-[#ffbc00] transition-all duration-150 rounded-full"
                    style={{ width: `${(fireEnergy / maxFireEnergy) * 100}%` }}
                  />
                </div>
              </div>
              <span className={`font-arcade text-[9px] w-7 text-right font-bold ${lightMode ? 'text-[#b45309]' : 'text-amber-300'}`}>
                {Math.floor(fireEnergy)}%
              </span>
            </div>
          </div>

          {/* Center: Level Badge */}
          <div className={`hidden md:flex flex-col items-center gap-0 ${cardBaseStyle} px-4 py-1 rounded-sm pointer-events-auto`}>
            <span className="text-[10px] text-[#ff4444] uppercase tracking-[4px] font-bold">World Status</span>
            <span className={`font-mono text-base tracking-wide font-black ${lightMode ? 'text-[#1c1917]' : 'text-white'}`}>
              LVL {stats.level}: {levelConfig.name}
            </span>
          </div>

          {/* Right: Score & Settings */}
          <div className={`flex items-center gap-4 ${cardBaseStyle} px-4 py-1.5 rounded-sm pointer-events-auto`}>
            {/* Score */}
            <div className="flex items-center text-center">
              <div className="flex flex-col text-center">
                <span className={`text-[10px] uppercase tracking-widest ${lightMode ? 'text-zinc-500 font-bold' : 'opacity-50 text-[#e0e0e0]'}`}>
                  SCORE
                </span>
                <span className={`font-mono text-xl font-bold tracking-wider ${lightMode ? 'text-[#c2410c]' : 'text-[#ffbc00]'}`}>
                  {stats.score.toString().padStart(6, '0')}
                </span>
              </div>
            </div>

            {/* High Score */}
            <div className={`hidden lg:flex items-center gap-1.5 pl-4 border-l ${lightMode ? 'border-[#cbb99e]' : 'border-[#331111]'}`}>
              <div className="flex flex-col text-center">
                <span className={`text-[10px] uppercase tracking-widest ${lightMode ? 'text-zinc-500 font-bold' : 'opacity-50 text-[#e0e0e0]'}`}>
                  HI
                </span>
                <span className="font-mono text-lg font-bold text-[#ff4d00]">
                  {stats.highScore.toString().padStart(6, '0')}
                </span>
              </div>
            </div>

            {/* Toggles */}
            <div className={`flex items-center gap-1.5 pl-3 border-l ${lightMode ? 'border-[#cbb99e]' : 'border-[#331111]'}`}>
              {/* Light Mode / Dark Mode Toggle */}
              <button
                id="toggle-light-mode-btn"
                onClick={onToggleLightMode}
                title={lightMode ? 'Switch to Dark Mode Graphics (L)' : 'Switch to Light Mode Graphics (L)'}
                className={`p-1.5 rounded-sm transition-colors ${
                  lightMode
                    ? 'text-[#ea580c] bg-amber-100 hover:bg-amber-200'
                    : 'text-[#888] hover:text-[#e0e0e0] hover:bg-[#331111]'
                }`}
              >
                {lightMode ? <Sun className="w-4 h-4 text-[#ea580c]" /> : <Moon className="w-4 h-4 text-[#00f2ff]" />}
              </button>

              <button
                id="toggle-sound-btn"
                onClick={onToggleSound}
                title={isMuted ? 'Unmute Sound (M)' : 'Mute Sound (M)'}
                className={`p-1.5 rounded-sm transition-colors ${
                  lightMode
                    ? 'text-[#555] hover:text-black hover:bg-[#ebdcc8]'
                    : 'text-[#888] hover:text-[#e0e0e0] hover:bg-[#331111]'
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-[#ff4444]" /> : <Volume2 className="w-4 h-4 text-[#00f2ff]" />}
              </button>

              <button
                id="toggle-crt-btn"
                onClick={onToggleCrt}
                title="Toggle Retro CRT Scanlines"
                className={`p-1.5 rounded-sm transition-colors ${
                  crtEffect
                    ? 'text-[#00f2ff] bg-[#00f2ff]/20'
                    : lightMode
                    ? 'text-[#555] hover:text-black hover:bg-[#ebdcc8]'
                    : 'text-[#888] hover:text-[#e0e0e0] hover:bg-[#331111]'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>

              <button
                id="open-help-btn"
                onClick={onOpenHelp}
                title="How to Play"
                className={`p-1.5 rounded-sm transition-colors ${
                  lightMode
                    ? 'text-[#555] hover:text-black hover:bg-[#ebdcc8]'
                    : 'text-[#888] hover:text-[#e0e0e0] hover:bg-[#331111]'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Portal Distance Progress Track */}
        <div className={`${cardBaseStyle} px-4 py-2 rounded-sm pointer-events-auto`}>
          <div className={`flex items-center justify-between text-[10px] font-mono mb-1 tracking-widest uppercase ${lightMode ? 'text-[#6b5846] font-bold' : 'text-[#666]'}`}>
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#00f2ff]" />
              <span>Portal Distance</span>
            </div>
            <span className={lightMode ? 'text-[#0284c7] font-bold' : 'text-[#00f2ff] font-bold'}>
              {stats.distance}m / {levelConfig.targetDistance}m ({distanceProgress}%)
            </span>
          </div>

          <div className={`relative w-full h-2 rounded-full overflow-hidden ${lightMode ? 'bg-[#e5d8c3]' : 'bg-[#1a0a0a]'}`}>
            {/* Progress bar */}
            <div
              className="h-full bg-gradient-to-r from-[#ff4d00] to-[#00f2ff] transition-all duration-200"
              style={{ width: `${distanceProgress}%` }}
            />
            {/* Running Dino Marker */}
            <div
              className="absolute top-0 bottom-0 flex items-center transition-all duration-200"
              style={{ left: `calc(${distanceProgress}% - 8px)` }}
            >
              <div className={`w-3 h-3 rounded-full border-2 ${lightMode ? 'bg-[#ff4d00] border-[#fdfbf6]' : 'bg-[#e0e0e0] border-[#1a0a0a]'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
