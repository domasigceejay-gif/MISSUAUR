import React from 'react';
import { Flame, ArrowUp, ArrowDown, Sword } from 'lucide-react';

interface TouchControlsProps {
  onJump: () => void;
  onFireBreath: () => void;
  onSword: () => void;
  onDuckStart: () => void;
  onDuckEnd: () => void;
  fireEnergy: number;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onJump,
  onFireBreath,
  onSword,
  onDuckStart,
  onDuckEnd,
  fireEnergy,
}) => {
  return (
    <div
      id="touch-controls-container"
      className="w-full flex items-center justify-between px-3 py-3 select-none touch-manipulation z-20 max-w-4xl mx-auto"
    >
      {/* Left side: Fire Breath & Sword buttons */}
      <div className="flex items-center gap-2">
        <button
          id="touch-sword-btn"
          onTouchStart={(e) => { e.preventDefault(); onSword(); }}
          onClick={onSword}
          className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-transparent border border-[#331111] hover:bg-[#331111] active:bg-[#1a0a0a] rounded-sm shadow-none active:scale-95 transition-transform"
        >
          <Sword className="w-6 h-6 text-[#e0e0e0] mb-1" />
          <span className="font-mono font-bold uppercase tracking-[2px] text-[9px] text-[#e0e0e0]">SWORD</span>
        </button>

        <button
          id="touch-fire-btn"
          onTouchStart={(e) => { e.preventDefault(); onFireBreath(); }}
          onClick={onFireBreath}
          disabled={fireEnergy < 15}
          className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-sm shadow-none active:scale-95 transition-all border ${
            fireEnergy >= 15
              ? 'bg-[#ff4d00] border-[#ff4d00] text-black shadow-[0_0_15px_#ff4d00]'
              : 'bg-transparent border-[#331111] text-[#666] cursor-not-allowed'
          }`}
        >
          <Flame className="w-6 h-6 mb-1" />
          <span className="font-mono font-bold uppercase tracking-[2px] text-[9px]">FIRE</span>
        </button>
      </div>

      {/* Center hints for desktop */}
      <div className="hidden md:flex items-center gap-4 text-[#888] font-mono uppercase tracking-[2px] text-[10px] bg-[#050000] px-4 py-1.5 rounded-sm border border-[#331111]">
        <span><kbd className="px-1.5 py-0.5 bg-[#1a0a0a] border border-[#331111] rounded-sm text-[#00f2ff]">SPACE</kbd> Jump</span>
        <span><kbd className="px-1.5 py-0.5 bg-[#1a0a0a] border border-[#331111] rounded-sm text-[#ffbc00]">DOWN</kbd> Duck</span>
        <span><kbd className="px-1.5 py-0.5 bg-[#1a0a0a] border border-[#331111] rounded-sm text-[#e0e0e0]">C</kbd> Sword</span>
        <span><kbd className="px-1.5 py-0.5 bg-[#1a0a0a] border border-[#331111] rounded-sm text-[#ff4d00]">X / F</kbd> Fire</span>
      </div>

      {/* Right side: Jump & Duck buttons */}
      <div className="flex items-center gap-3">
        {/* Duck button */}
        <button
          id="touch-duck-btn"
          onTouchStart={(e) => { e.preventDefault(); onDuckStart(); }}
          onTouchEnd={(e) => { e.preventDefault(); onDuckEnd(); }}
          onMouseDown={onDuckStart}
          onMouseUp={onDuckEnd}
          onMouseLeave={onDuckEnd}
          className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-transparent border border-[#331111] hover:bg-[#331111] active:bg-[#1a0a0a] rounded-sm shadow-none active:scale-95 transition-transform"
        >
          <ArrowDown className="w-6 h-6 text-[#e0e0e0]" />
          <span className="font-mono font-bold uppercase tracking-[2px] text-[9px] text-[#e0e0e0] mt-1">DUCK</span>
        </button>

        {/* Jump Button */}
        <button
          id="touch-jump-btn"
          onTouchStart={(e) => { e.preventDefault(); onJump(); }}
          onClick={onJump}
          className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-transparent border border-[#331111] hover:bg-[#331111] active:bg-[#1a0a0a] rounded-sm shadow-none active:scale-95 transition-transform"
        >
          <ArrowUp className="w-6 h-6 text-[#e0e0e0]" />
          <span className="font-mono font-bold uppercase tracking-[2px] text-[9px] text-[#e0e0e0] mt-1">JUMP</span>
        </button>
      </div>
    </div>
  );
};
