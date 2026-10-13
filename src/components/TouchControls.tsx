import React from 'react';
import { Flame, ArrowUp, ArrowDown, Sword } from 'lucide-react';

interface TouchControlsProps {
  onJump: () => void;
  onFireBreath: () => void;
  onSword: () => void;
  onDuckStart: () => void;
  onDuckEnd: () => void;
  fireEnergy: number;
  lightMode?: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onJump,
  onFireBreath,
  onSword,
  onDuckStart,
  onDuckEnd,
  fireEnergy,
  lightMode = false,
}) => {
  const btnBaseStyle = lightMode
    ? 'bg-[#fcf9f2] border-[#cbb99e] hover:bg-[#efe4d3] active:bg-[#e2d5c1] text-[#2c1d11]'
    : 'bg-transparent border-[#331111] hover:bg-[#331111] active:bg-[#1a0a0a] text-[#e0e0e0]';

  const iconColor = lightMode ? 'text-[#2c1d11]' : 'text-[#e0e0e0]';

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
          className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 border rounded-sm shadow-none active:scale-95 transition-transform ${btnBaseStyle}`}
        >
          <Sword className={`w-6 h-6 mb-1 ${iconColor}`} />
          <span className={`font-mono font-bold uppercase tracking-[2px] text-[9px] ${iconColor}`}>SWORD</span>
        </button>

        <button
          id="touch-fire-btn"
          onTouchStart={(e) => { e.preventDefault(); onFireBreath(); }}
          onClick={onFireBreath}
          disabled={fireEnergy < 15}
          className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-sm shadow-none active:scale-95 transition-all border ${
            fireEnergy >= 15
              ? 'bg-[#ff4d00] border-[#ff4d00] text-black shadow-[0_0_15px_#ff4d00]'
              : lightMode
              ? 'bg-[#ebdcc8]/50 border-[#cbb99e] text-[#a89b8d] cursor-not-allowed'
              : 'bg-transparent border-[#331111] text-[#666] cursor-not-allowed'
          }`}
        >
          <Flame className="w-6 h-6 mb-1" />
          <span className="font-mono font-bold uppercase tracking-[2px] text-[9px]">FIRE</span>
        </button>
      </div>

      {/* Center hints for desktop */}
      <div
        className={`hidden md:flex items-center gap-4 font-mono uppercase tracking-[2px] text-[10px] px-4 py-1.5 rounded-sm border ${
          lightMode
            ? 'bg-[#fdfbf6] text-[#665544] border-[#cbb99e] shadow-sm'
            : 'bg-[#050000] text-[#888] border-[#331111]'
        }`}
      >
        <span>
          <kbd
            className={`px-1.5 py-0.5 border rounded-sm ${
              lightMode ? 'bg-[#f0e6d6] border-[#cbb99e] text-[#0284c7] font-bold' : 'bg-[#1a0a0a] border-[#331111] text-[#00f2ff]'
            }`}
          >
            SPACE
          </kbd>{' '}
          Jump
        </span>
        <span>
          <kbd
            className={`px-1.5 py-0.5 border rounded-sm ${
              lightMode ? 'bg-[#f0e6d6] border-[#cbb99e] text-[#b45309] font-bold' : 'bg-[#1a0a0a] border-[#331111] text-[#ffbc00]'
            }`}
          >
            DOWN
          </kbd>{' '}
          Duck
        </span>
        <span>
          <kbd
            className={`px-1.5 py-0.5 border rounded-sm ${
              lightMode ? 'bg-[#f0e6d6] border-[#cbb99e] text-[#1c1917] font-bold' : 'bg-[#1a0a0a] border-[#331111] text-[#e0e0e0]'
            }`}
          >
            C
          </kbd>{' '}
          Sword
        </span>
        <span>
          <kbd
            className={`px-1.5 py-0.5 border rounded-sm ${
              lightMode ? 'bg-[#f0e6d6] border-[#cbb99e] text-[#c2410c] font-bold' : 'bg-[#1a0a0a] border-[#331111] text-[#ff4d00]'
            }`}
          >
            X / F
          </kbd>{' '}
          Fire
        </span>
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
          className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 border rounded-sm shadow-none active:scale-95 transition-transform ${btnBaseStyle}`}
        >
          <ArrowDown className={`w-6 h-6 ${iconColor}`} />
          <span className={`font-mono font-bold uppercase tracking-[2px] text-[9px] mt-1 ${iconColor}`}>DUCK</span>
        </button>

        {/* Jump Button */}
        <button
          id="touch-jump-btn"
          onTouchStart={(e) => { e.preventDefault(); onJump(); }}
          onClick={onJump}
          className={`flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 border rounded-sm shadow-none active:scale-95 transition-transform ${btnBaseStyle}`}
        >
          <ArrowUp className={`w-6 h-6 ${iconColor}`} />
          <span className={`font-mono font-bold uppercase tracking-[2px] text-[9px] mt-1 ${iconColor}`}>JUMP</span>
        </button>
      </div>
    </div>
  );
};
