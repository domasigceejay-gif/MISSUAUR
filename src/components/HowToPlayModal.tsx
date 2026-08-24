import React from 'react';
import { X, Flame, ShieldAlert, Sparkles, Droplets, Zap } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div id="how-to-play-modal" className="absolute inset-0 bg-[#050000]/80 backdrop-blur-sm flex items-center justify-center p-4 z-40 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0a0505] border border-[#331111] rounded-sm p-6 relative shadow-[0_0_30px_#4a1010] overflow-y-auto max-h-[90vh]">
        <button
          id="close-help-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#888] hover:text-[#e0e0e0] bg-[#1a0a0a] rounded-sm transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-mono font-black text-xl text-[#ffbc00] mb-1 flex items-center gap-2 uppercase tracking-[2px]">
          <span>Survival Manual</span>
        </h2>
        <p className="font-mono text-xs text-[#888] mb-4 uppercase tracking-[2px] font-bold">
          Master your dinosaur instincts to outrun the cataclysm!
        </p>

        <div className="space-y-3.5 font-mono text-xs text-[#e0e0e0]">
          {/* Volcano Jumping */}
          <div className="flex gap-3 bg-[#1a0a0a] p-3 rounded-sm border border-[#331111]">
            <ShieldAlert className="w-6 h-6 text-[#ff4444] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-mono text-[10px] text-[#ff4444] font-bold uppercase tracking-[2px] mb-0.5">1. Leap over Volcanoes</h4>
              <p className="text-xs text-[#888]">
                Active volcanoes and magma geysers dot the terrain. Press <strong className="text-[#00f2ff]">SPACE / W / JUMP</strong> to leap. Press again mid-air for a double flutter jump!
              </p>
            </div>
          </div>

          {/* Fire Breath vs Meteors */}
          <div className="flex gap-3 bg-[#1a0a0a] p-3 rounded-sm border border-[#331111]">
            <Flame className="w-6 h-6 text-[#ff4d00] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-mono text-[10px] text-[#ff4d00] font-bold uppercase tracking-[2px] mb-0.5">2. Fire Breath vs Meteors</h4>
              <p className="text-xs text-[#888]">
                Meteors plunge from the sky! Press <strong className="text-[#ffbc00]">X / F / FIRE</strong> to roar and shoot incandescent flames. Blasting meteors yields huge bonus points!
              </p>
            </div>
          </div>

          {/* Enemy Dinosaurs & Speed Increase */}
          <div className="flex gap-3 bg-[#1a0a0a] p-3 rounded-sm border border-[#331111]">
            <Zap className="w-6 h-6 text-[#ffbc00] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-mono text-[10px] text-[#ffbc00] font-bold uppercase tracking-[2px] mb-0.5">3. New Levels & Enemy Dinos</h4>
              <p className="text-xs text-[#888]">
                Each level increases dinosaur running speed. Watch out for Flying Pterodactyls (Level 2), Leaping Raptors (Level 3), and Armored Triceratops (Level 4+).
              </p>
            </div>
          </div>

          {/* Victory Dance & Extinction */}
          <div className="flex gap-3 bg-[#1a0a0a] p-3 rounded-sm border border-[#331111]">
            <Sparkles className="w-6 h-6 text-[#00f2ff] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-mono text-[10px] text-[#00f2ff] font-bold uppercase tracking-[2px] mb-0.5">4. Portal Dance & Extinction</h4>
              <p className="text-xs text-[#888]">
                Reaching the dimensional portal triggers a celebratory <span className="text-[#ffbc00]">Victory Dance</span> before warping to the next world. If you lose your 3 HP hearts, an <span className="text-[#ff4444]">EXTINCT</span> letter and a crying dinosaur will mourn your fall.
              </p>
            </div>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          id="dismiss-help-btn"
          onClick={onClose}
          className="mt-5 w-full py-3 bg-[#ff4d00] text-black font-mono tracking-[4px] uppercase text-xs font-black rounded-sm shadow-[0_0_15px_#ff4d00] hover:bg-[#ffbc00] hover:shadow-[0_0_20px_#ffbc00] active:scale-95 transition-all"
        >
          Got it - Let's Run!
        </button>
      </div>
    </div>
  );
};
