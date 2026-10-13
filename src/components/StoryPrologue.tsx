import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, FastForward, Play } from 'lucide-react';
import { sound } from '../utils/sound';

interface StoryPrologueProps {
  onComplete: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const StoryPrologue: React.FC<StoryPrologueProps> = ({
  onComplete,
  isMuted,
  onToggleSound,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [subtitle, setSubtitle] = useState<string>('A peaceful morning in the ancient oasis valley...');
  const [scenePhase, setScenePhase] = useState<number>(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let startTime: number | null = null;
    let hasPlayedWater = false;
    let hasPlayedRumble = false;
    let hasPlayedExplosion = false;
    let hasPlayedRoar = false;

    // Particles for scene
    const splashParticles: { x: number; y: number; vx: number; vy: number; alpha: number; size: number }[] = [];
    const lavaParticles: { x: number; y: number; vx: number; vy: number; color: string; size: number }[] = [];

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        canvas.width = Math.floor(rect.width);
        canvas.height = Math.floor(rect.height);
        ctx.imageSmoothingEnabled = false;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const renderFrame = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = (now - startTime) / 1000; // seconds

      const w = canvas.width;
      const h = canvas.height;
      const gy = h * 0.72;

      ctx.clearRect(0, 0, w, h);

      // Phase calculation
      // 0 - 4s: Drinking water peacefully
      // 4 - 7s: Sky darkens, tremor
      // 7 - 10s: Meteor strikes volcano peak! Screen shake & flash
      // 10 - 13s: Volcano erupts fiercely
      // 13 - 16s: Dino draws sword, roars fire, sprints to escape!
      // > 16.5s: onComplete()

      let shakeX = 0;
      let shakeY = 0;

      if (elapsed > 4.5 && elapsed < 7.0) {
        // Minor ground tremor
        shakeX = (Math.random() - 0.5) * 3;
        shakeY = (Math.random() - 0.5) * 3;
        if (!hasPlayedRumble) {
          hasPlayedRumble = true;
          sound.playMeteorRumble();
        }
      } else if (elapsed >= 7.8 && elapsed < 9.5) {
        // Massive impact shockwave
        const intensity = Math.max(0, 1 - (elapsed - 7.8) / 1.7) * 16;
        shakeX = (Math.random() - 0.5) * intensity;
        shakeY = (Math.random() - 0.5) * intensity;
        if (!hasPlayedExplosion) {
          hasPlayedExplosion = true;
          sound.playExplosion();
          sound.playVolcanoErupt();
        }
      } else if (elapsed >= 9.5 && elapsed < 13.5) {
        // Continuous eruption rumble
        shakeX = (Math.random() - 0.5) * 4;
        shakeY = (Math.random() - 0.5) * 4;
      }

      ctx.save();
      ctx.translate(shakeX, shakeY);

      // 1. Sky rendering
      let skyTop = '#74b9ff';
      let skyBottom = '#dfe6e9';

      if (elapsed >= 4.0 && elapsed < 7.5) {
        const p = (elapsed - 4.0) / 3.5;
        // Shift to ominous sunset
        skyTop = p > 0.5 ? '#b71540' : '#e55039';
        skyBottom = p > 0.5 ? '#e58e26' : '#f6b93b';
      } else if (elapsed >= 7.5) {
        // Full volcanic apocalyptic sky
        skyTop = '#2d0c1e';
        skyBottom = '#b71540';
      }

      const skyGrad = ctx.createLinearGradient(0, 0, 0, gy);
      skyGrad.addColorStop(0, skyTop);
      skyGrad.addColorStop(1, skyBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, gy);

      // Clouds
      ctx.fillStyle = elapsed > 5 ? 'rgba(80, 50, 60, 0.6)' : 'rgba(255, 255, 255, 0.85)';
      for (let i = 0; i < 4; i++) {
        const cx = ((i * 260 + elapsed * 15) % (w + 160)) - 80;
        const cy = 40 + i * 25;
        ctx.fillRect(cx, cy, 70, 16);
        ctx.fillRect(cx + 10, cy - 8, 45, 12);
      }

      // 2. Distant Sleeping/Erupting Volcano in background
      const volcX = w * 0.68;
      const volcY = gy;
      const volcW = Math.min(320, w * 0.5);
      const volcH = 180;

      // Draw Volcano mountain
      ctx.fillStyle = elapsed >= 8.0 ? '#2c1810' : '#3d405b';
      ctx.beginPath();
      ctx.moveTo(volcX - volcW / 2, volcY);
      ctx.lineTo(volcX - 35, volcY - volcH);
      ctx.lineTo(volcX + 35, volcY - volcH);
      ctx.lineTo(volcX + volcW / 2, volcY);
      ctx.closePath();
      ctx.fill();

      // Shaded slope
      ctx.fillStyle = elapsed >= 8.0 ? '#1f0d06' : '#2b2d42';
      ctx.beginPath();
      ctx.moveTo(volcX, volcY - volcH);
      ctx.lineTo(volcX + volcW / 2, volcY);
      ctx.lineTo(volcX, volcY);
      ctx.closePath();
      ctx.fill();

      // Volcano Crater top
      ctx.fillStyle = elapsed >= 8.0 ? '#ff4d00' : '#8187a2';
      ctx.fillRect(volcX - 38, volcY - volcH - 6, 76, 8);

      // 3. Falling Meteor (Phase 2 -> Phase 3: between 6.0s and 7.8s)
      if (elapsed >= 6.2 && elapsed <= 7.9) {
        const meteorProgress = (elapsed - 6.2) / 1.6; // 0 to 1
        const startMx = -50;
        const startMy = -30;
        const targetMx = volcX;
        const targetMy = volcY - volcH;

        const curMx = startMx + (targetMx - startMx) * meteorProgress;
        const curMy = startMy + (targetMy - startMy) * meteorProgress;

        // Meteor fireball trail
        for (let t = 0; t < 12; t++) {
          const trailX = curMx - (t * 12) + (Math.random() - 0.5) * 10;
          const trailY = curMy - (t * 8) + (Math.random() - 0.5) * 10;
          ctx.fillStyle = t % 2 === 0 ? 'rgba(255, 77, 0, 0.8)' : 'rgba(255, 200, 0, 0.9)';
          ctx.fillRect(trailX, trailY, 18 - t, 18 - t);
        }

        // Giant meteor core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(curMx, curMy, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ff7b00';
        ctx.beginPath();
        ctx.arc(curMx, curMy, 22, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Volcanic Eruption & Shockwave (after 7.8s)
      if (elapsed >= 7.8) {
        // Eruption plume
        const plumeH = Math.min(220, (elapsed - 7.8) * 90);
        ctx.fillStyle = '#ff4d00';
        ctx.fillRect(volcX - 25, volcY - volcH - plumeH, 50, plumeH);

        ctx.fillStyle = '#ffd600';
        ctx.fillRect(volcX - 15, volcY - volcH - plumeH + 10, 30, plumeH * 0.8);

        // Huge rising smoke cloud
        ctx.fillStyle = 'rgba(40, 20, 25, 0.85)';
        for (let c = 0; c < 5; c++) {
          const cloudY = volcY - volcH - plumeH + c * 25;
          ctx.fillRect(volcX - 60 - c * 8, cloudY, 120 + c * 16, 35);
        }

        // Spawn erupting lava sparks
        if (Math.random() > 0.15) {
          lavaParticles.push({
            x: volcX + (Math.random() - 0.5) * 40,
            y: volcY - volcH - 10,
            vx: (Math.random() - 0.5) * 240,
            vy: -Math.random() * 320 - 80,
            color: Math.random() > 0.5 ? '#ff4d00' : '#ffd600',
            size: Math.random() * 7 + 4,
          });
        }

        // Render lava particles
        for (let i = lavaParticles.length - 1; i >= 0; i--) {
          const lp = lavaParticles[i];
          lp.x += lp.vx * 0.016;
          lp.y += lp.vy * 0.016;
          lp.vy += 320 * 0.016; // gravity
          ctx.fillStyle = lp.color;
          ctx.fillRect(lp.x, lp.y, lp.size, lp.size);
          if (lp.y > h) lavaParticles.splice(i, 1);
        }

        // Lava river flowing down volcano sides
        ctx.fillStyle = '#ff3838';
        ctx.beginPath();
        ctx.moveTo(volcX - 10, volcY - volcH);
        ctx.lineTo(volcX - 45, volcY);
        ctx.lineTo(volcX - 35, volcY);
        ctx.lineTo(volcX, volcY - volcH + 20);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(volcX + 10, volcY - volcH);
        ctx.lineTo(volcX + 65, volcY);
        ctx.lineTo(volcX + 55, volcY);
        ctx.lineTo(volcX + 5, volcY - volcH + 20);
        ctx.closePath();
        ctx.fill();
      }

      // Screen flash on impact
      if (elapsed >= 7.8 && elapsed <= 8.2) {
        const flashAlpha = 1 - (elapsed - 7.8) / 0.4;
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.95})`;
        ctx.fillRect(0, 0, w, h);
      }

      // 5. Foreground Oasis Ground & Fresh Water Pond
      ctx.fillStyle = elapsed > 8 ? '#3a2016' : '#27ae60'; // Lush green grass turns to scorched earth
      ctx.fillRect(0, gy, w, h - gy);

      // Oasis Freshwater Spring / Pond
      const pondX = w * 0.18;
      const pondW = Math.min(300, w * 0.45);
      const pondH = 65;

      // Water pond base
      ctx.fillStyle = elapsed > 8 ? '#c0392b' : '#3498db';
      ctx.beginPath();
      ctx.ellipse(pondX + pondW / 2, gy + 32, pondW / 2, pondH / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Water surface shine & animated gentle ripples
      ctx.fillStyle = elapsed > 8 ? 'rgba(255, 100, 50, 0.4)' : 'rgba(255, 255, 255, 0.45)';
      const rip = Math.sin(now * 0.005) * 8;
      ctx.fillRect(pondX + 40 + rip, gy + 22, 60, 4);
      ctx.fillRect(pondX + 90 - rip, gy + 36, 80, 4);

      // Lotus / Fern plants around pond
      if (elapsed < 8) {
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(pondX - 10, gy - 12, 14, 18);
        ctx.fillRect(pondX + pondW + 6, gy - 8, 16, 14);
      }

      // 6. Missusaur Dinosaur Animation
      // Dino sits at edge of water
      const dinoBaseX = w * 0.12;
      const dinoY = gy - 60;
      const ps = 3;

      if (elapsed < 4.5) {
        // Scene 1: Drinking water peacefully
        setScenePhase(1);
        setSubtitle('A peaceful morning in the prehistoric oasis valley...');

        // Dino bent down sipping water
        const sip = Math.sin(now * 0.008) > 0;
        const headDip = sip ? 12 : 6;

        // Tail
        ctx.fillStyle = '#4e9f3d';
        ctx.fillRect(dinoBaseX - 30, dinoY + 20, 24, 15);
        ctx.fillStyle = '#ff5722';
        ctx.fillRect(dinoBaseX - 22, dinoY + 14, 8, 8);

        // Body
        ctx.fillStyle = '#4e9f3d';
        ctx.fillRect(dinoBaseX, dinoY + 12, 38, 34);
        ctx.fillStyle = '#f0e68c';
        ctx.fillRect(dinoBaseX + 6, dinoY + 24, 18, 20);

        // Bent Neck and Head reaching down to pond
        ctx.fillStyle = '#4e9f3d';
        ctx.fillRect(dinoBaseX + 28, dinoY + 14 + headDip, 24, 20);
        ctx.fillRect(dinoBaseX + 46, dinoY + 22 + headDip, 18, 14); // Snout touching water!

        // Happy closed eye curve
        ctx.fillStyle = '#111111';
        ctx.fillRect(dinoBaseX + 42, dinoY + 18 + headDip, 6, 2);

        // Feet on grass
        ctx.fillStyle = '#1e5128';
        ctx.fillRect(dinoBaseX + 6, dinoY + 44, 14, 14);
        ctx.fillRect(dinoBaseX + 24, dinoY + 44, 14, 14);

        // Little water sip droplets
        if (sip && Math.random() > 0.4) {
          splashParticles.push({
            x: dinoBaseX + 62,
            y: dinoY + 34 + headDip,
            vx: (Math.random() - 0.5) * 30 + 10,
            vy: -Math.random() * 40 - 15,
            alpha: 1,
            size: 3,
          });
          if (!hasPlayedWater && Math.random() > 0.7) {
            sound.playWaterDrop();
          }
        }
      } else if (elapsed >= 4.5 && elapsed < 7.5) {
        // Scene 2: Head snaps up, alerted by tremor!
        setScenePhase(2);
        setSubtitle('Suddenly... the ground trembles and a shadow covers the sun!');

        // Tail
        ctx.fillStyle = '#4e9f3d';
        ctx.fillRect(dinoBaseX - 30, dinoY + 20, 24, 15);
        ctx.fillStyle = '#ff5722';
        ctx.fillRect(dinoBaseX - 22, dinoY + 14, 8, 8);

        // Body
        ctx.fillStyle = '#4e9f3d';
        ctx.fillRect(dinoBaseX, dinoY + 10, 38, 36);
        ctx.fillStyle = '#f0e68c';
        ctx.fillRect(dinoBaseX + 6, dinoY + 22, 18, 22);

        // Head raised high looking at sky
        ctx.fillStyle = '#4e9f3d';
        ctx.fillRect(dinoBaseX + 26, dinoY - 8, 22, 28);
        ctx.fillRect(dinoBaseX + 40, dinoY - 14, 24, 18);

        // Wide startled eye
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(dinoBaseX + 44, dinoY - 10, 8, 8);
        ctx.fillStyle = '#111111';
        ctx.fillRect(dinoBaseX + 48, dinoY - 8, 4, 4);

        // Alert "!" bubble above dino head
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(dinoBaseX + 50, dinoY - 44, 16, 22);
        ctx.fillStyle = '#ff1744';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('!', dinoBaseX + 54, dinoY - 28);

        // Feet
        ctx.fillStyle = '#1e5128';
        ctx.fillRect(dinoBaseX + 6, dinoY + 44, 14, 14);
        ctx.fillRect(dinoBaseX + 24, dinoY + 44, 14, 14);
      } else if (elapsed >= 7.5 && elapsed < 11.5) {
        // Scene 3: Meteor crashes into volcano! Shock and awe!
        setScenePhase(3);
        setSubtitle('BOOM!! A massive meteor crashes straight into the volcano peak!');

        // Dino recoiling in shock
        ctx.fillStyle = '#4e9f3d';
        ctx.fillRect(dinoBaseX - 34, dinoY + 18, 24, 15);

        ctx.fillStyle = '#4e9f3d';
        ctx.fillRect(dinoBaseX - 6, dinoY + 8, 38, 36);
        ctx.fillStyle = '#f0e68c';
        ctx.fillRect(dinoBaseX, dinoY + 20, 18, 22);

        // Head looking back in panic
        ctx.fillStyle = '#4e9f3d';
        ctx.fillRect(dinoBaseX + 20, dinoY - 12, 24, 28);
        ctx.fillRect(dinoBaseX + 36, dinoY - 18, 24, 18);

        // Eyes wide open in terror
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(dinoBaseX + 42, dinoY - 14, 10, 10);
        ctx.fillStyle = '#00e5ff';
        ctx.fillRect(dinoBaseX + 48, dinoY - 12, 4, 4);

        // Open mouth in gasp
        ctx.fillStyle = '#111111';
        ctx.fillRect(dinoBaseX + 52, dinoY - 6, 8, 8);

        // Feet
        ctx.fillStyle = '#1e5128';
        ctx.fillRect(dinoBaseX, dinoY + 44, 14, 14);
        ctx.fillRect(dinoBaseX + 18, dinoY + 44, 14, 14);
      } else {
        // Scene 4: Missusaur draws sword, roars fire breath, and runs for its life!
        setScenePhase(4);
        setSubtitle('RUN, MISSUSAUR! ESCAPE THE EXTINCTION CATACLYSM!');

        if (!hasPlayedRoar) {
          hasPlayedRoar = true;
          sound.playFireBreath();
        }

        // Animated running sprint across screen
        const sprintProgress = (elapsed - 11.5) / 4.5;
        const runX = dinoBaseX + sprintProgress * (w * 0.7);
        const legStep = Math.floor(now * 0.015) % 2;

        // Tail
        ctx.fillStyle = '#4e9f3d';
        ctx.fillRect(runX - 28, dinoY + 14, 24, 14);
        ctx.fillStyle = '#ff5722';
        ctx.fillRect(runX - 22, dinoY + 8, 8, 8);

        // Body
        ctx.fillStyle = '#4e9f3d';
        ctx.fillRect(runX, dinoY + 6, 40, 36);
        ctx.fillStyle = '#f0e68c';
        ctx.fillRect(runX + 6, dinoY + 18, 18, 22);

        // Head forward
        ctx.fillStyle = '#4e9f3d';
        ctx.fillRect(runX + 32, dinoY + 2, 24, 24);
        ctx.fillRect(runX + 48, dinoY + 6, 20, 18);

        // Determined eye
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(runX + 52, dinoY + 8, 8, 6);
        ctx.fillStyle = '#111111';
        ctx.fillRect(runX + 56, dinoY + 10, 4, 4);

        // Swinging Sword in hand!
        ctx.save();
        ctx.translate(runX + 42, dinoY + 24);
        ctx.rotate(-Math.PI / 4 + Math.sin(now * 0.02) * 0.4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, -28, 6, 28);
        ctx.fillStyle = '#00f2ff';
        ctx.fillRect(-4, 0, 14, 4);
        ctx.restore();

        // Fire breath roar burst
        for (let f = 0; f < 4; f++) {
          const fx = runX + 68 + f * 12 + (Math.random() - 0.5) * 6;
          const fy = dinoY + 12 + (Math.random() - 0.5) * 8;
          ctx.fillStyle = f % 2 === 0 ? '#ff4d00' : '#ffd600';
          ctx.fillRect(fx, fy, 14, 14);
        }

        // Running Legs
        ctx.fillStyle = '#1e5128';
        if (legStep === 0) {
          ctx.fillRect(runX + 8, dinoY + 40, 12, 18);
          ctx.fillRect(runX + 26, dinoY + 36, 16, 14);
        } else {
          ctx.fillRect(runX + 4, dinoY + 36, 16, 14);
          ctx.fillRect(runX + 24, dinoY + 40, 12, 18);
        }
      }

      // Splash particles update
      for (let i = splashParticles.length - 1; i >= 0; i--) {
        const sp = splashParticles[i];
        sp.x += sp.vx * 0.016;
        sp.y += sp.vy * 0.016;
        sp.vy += 180 * 0.016;
        sp.alpha -= 0.02;
        ctx.fillStyle = `rgba(255, 255, 255, ${sp.alpha})`;
        ctx.fillRect(sp.x, sp.y, sp.size, sp.size);
        if (sp.alpha <= 0) splashParticles.splice(i, 1);
      }

      ctx.restore();

      // Automatically conclude after 16.5s
      if (elapsed >= 16.5) {
        onComplete();
        return;
      }

      animId = requestAnimationFrame(renderFrame);
    };

    animId = requestAnimationFrame(renderFrame);

    // Keyboard shortcut to skip intro
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Escape' || e.code === 'Enter') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      id="story-prologue-screen"
      className="absolute inset-0 bg-black flex flex-col items-center justify-between z-40 select-none overflow-hidden font-mono"
    >
      {/* Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block pixel-art" />

      {/* Top Header Controls */}
      <div className="absolute top-3 inset-x-3 sm:inset-x-6 flex items-center justify-between pointer-events-auto z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/75 border border-[#331111] rounded-sm text-[#ffbc00] text-xs font-arcade">
          <span>PROLOGUE: THE CATACLYSM</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            title={isMuted ? 'Unmute' : 'Mute'}
            className="p-2 bg-black/80 hover:bg-[#331111] border border-[#331111] rounded-sm text-white transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#ff4444]" /> : <Volume2 className="w-4 h-4 text-[#00f2ff]" />}
          </button>

          <button
            id="skip-story-intro-btn"
            onClick={onComplete}
            title="Skip Intro (Space / Esc)"
            className="px-4 py-2 bg-[#ff4d00] hover:bg-[#ffbc00] text-black font-mono font-black text-xs sm:text-sm tracking-widest rounded-sm transition-all flex items-center gap-2 shadow-[0_0_15px_#ff4d00] cursor-pointer"
          >
            <span>SKIP INTRO</span>
            <FastForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Subtitle Bar */}
      <div className="absolute bottom-4 inset-x-3 sm:inset-x-8 bg-black/85 border-2 border-[#ff4d00]/70 p-3 sm:p-4 rounded-sm shadow-[0_0_25px_rgba(255,77,0,0.4)] pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-[#ff4d00] rounded-full animate-ping shrink-0" />
          <p className="text-white font-mono text-sm sm:text-base tracking-wide font-bold">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};
