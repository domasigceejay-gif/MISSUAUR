/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback } from 'react';
import { LogOut } from 'lucide-react';
import { GameCanvas } from './components/GameCanvas';
import { GameUI } from './components/GameUI';
import { TouchControls } from './components/TouchControls';
import { MainMenu } from './components/MainMenu';
import { StoryPrologue } from './components/StoryPrologue';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { DinoGameEngine } from './utils/gameEngine';
import { GameState, GameStats } from './types';
import { getLevelConfig } from './utils/levels';
import { sound } from './utils/sound';

export default function App() {
  const engineRef = useRef<DinoGameEngine | null>(null);

  const [gameState, setGameState] = useState<GameState>('STORY_INTRO');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [hp, setHp] = useState<number>(3);
  const [maxHp] = useState<number>(3);
  const [fireEnergy, setFireEnergy] = useState<number>(100);
  const [maxFireEnergy] = useState<number>(100);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    highScore: parseInt(localStorage.getItem('dino_high_score') || '0', 10),
    distance: 0,
    level: 1,
    meteorsDestroyed: 0,
    volcanoesJumped: 0,
    enemiesDefeated: 0,
    fireBreathsUsed: 0,
  });

  const [isMuted, setIsMuted] = useState<boolean>(sound.getIsMuted());
  const [crtEffect, setCrtEffect] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Light Mode Graphics State (persisted in localStorage)
  const [lightMode, setLightMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dino_light_mode') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleLightMode = useCallback(() => {
    setLightMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('dino_light_mode', String(next));
      } catch {}
      return next;
    });
  }, []);

  const handleEngineReady = useCallback((engine: DinoGameEngine) => {
    engineRef.current = engine;
    engine.setLightMode(lightMode);
  }, [lightMode]);

  const handleStateChange = useCallback((newState: GameState) => {
    setGameState(newState);
  }, []);

  const handleStatsUpdate = useCallback((newStats: GameStats, currentHp: number, currentFireEnergy: number) => {
    setStats({ ...newStats });
    setHp(currentHp);
    setFireEnergy(currentFireEnergy);
  }, []);

  const handleLevelComplete = useCallback((level: number, latestStats: GameStats) => {
    setCurrentLevel(level);
    setStats({ ...latestStats });
  }, []);

  // Player input actions
  const handleJump = useCallback(() => {
    engineRef.current?.jump();
  }, []);

  const handleFireBreath = useCallback(() => {
    engineRef.current?.startFireBreath();
  }, []);

  const handleSword = useCallback(() => {
    engineRef.current?.swingSword();
  }, []);

  const handleDuckStart = useCallback(() => {
    engineRef.current?.setDucking(true);
  }, []);

  const handleDuckEnd = useCallback(() => {
    engineRef.current?.setDucking(false);
  }, []);

  const handleTogglePause = useCallback(() => {
    engineRef.current?.togglePause();
  }, []);

  // Menu / Level navigation
  const handleStartGame = useCallback((startLevel: number = 1) => {
    if (!engineRef.current) return;
    engineRef.current.currentLevel = startLevel;
    engineRef.current.levelConfig = getLevelConfig(startLevel);
    setCurrentLevel(startLevel);
    engineRef.current.startNewGame();
  }, []);

  const handleEnterNextLevel = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.advanceToNextLevel();
    setCurrentLevel(engineRef.current.currentLevel);
  }, []);

  const handleRetry = useCallback(() => {
    // Every even number level is a checkpoint
    const checkpointLevel = Math.max(1, currentLevel % 2 === 0 ? currentLevel : currentLevel - 1);
    handleStartGame(checkpointLevel);
  }, [currentLevel, handleStartGame]);

  const handleGoMenu = useCallback(() => {
    if (!engineRef.current) return;
    sound.stopVictoryDanceMusic();
    engineRef.current.changeState('MENU');
    setGameState('MENU');
  }, []);

  const handleQuitGame = useCallback(() => {
    handleGoMenu();
  }, [handleGoMenu]);

  const handleToggleSound = useCallback(() => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  }, []);

  const handleToggleCrt = useCallback(() => {
    setCrtEffect((prev) => !prev);
  }, []);

  const levelConfig = getLevelConfig(currentLevel);

  return (
    <div
      className={`flex flex-col items-center justify-between w-full h-screen min-h-[550px] p-2 sm:p-4 font-mono overflow-hidden transition-colors duration-300 ${
        lightMode ? 'bg-[#f4ebd9] text-[#2c1d11]' : 'bg-[#050000] text-[#e0e0e0]'
      }`}
    >
      {/* Game Window Wrapper */}
      <div className="relative w-full max-w-5xl flex-1 flex flex-col items-center justify-center min-h-0">
        {/* Canvas Host */}
        <GameCanvas
          onEngineReady={handleEngineReady}
          onStateChange={handleStateChange}
          onStatsUpdate={handleStatsUpdate}
          onLevelComplete={handleLevelComplete}
          crtEffect={crtEffect}
          lightMode={lightMode}
          onQuit={handleQuitGame}
          onToggleLightMode={handleToggleLightMode}
        />

        {/* HUD (shown when playing or during victory/loss) */}
        {gameState !== 'MENU' && (
          <GameUI
            stats={stats}
            hp={hp}
            maxHp={maxHp}
            fireEnergy={fireEnergy}
            maxFireEnergy={maxFireEnergy}
            levelConfig={levelConfig}
            isMuted={isMuted}
            onToggleSound={handleToggleSound}
            crtEffect={crtEffect}
            onToggleCrt={handleToggleCrt}
            onOpenHelp={() => setShowHelpModal(true)}
            isPaused={gameState === 'PAUSED'}
            onTogglePause={handleTogglePause}
            lightMode={lightMode}
            onToggleLightMode={handleToggleLightMode}
            onQuit={handleQuitGame}
          />
        )}

        {/* Story Prologue Cutscene (Runs before Main Menu or when requested) */}
        {gameState === 'STORY_INTRO' && (
          <StoryPrologue
            onComplete={() => setGameState('MENU')}
            isMuted={isMuted}
            onToggleSound={handleToggleSound}
          />
        )}

        {/* Main Menu Screen */}
        {gameState === 'MENU' && (
          <MainMenu
            onStartGame={handleStartGame}
            onOpenHelp={() => setShowHelpModal(true)}
            highScore={stats.highScore}
            isMuted={isMuted}
            onToggleSound={handleToggleSound}
            lightMode={lightMode}
            onToggleLightMode={handleToggleLightMode}
            onWatchStory={() => setGameState('STORY_INTRO')}
          />
        )}

        {/* PAUSED Overlay */}
        {gameState === 'PAUSED' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center">
            <div
              className={`p-8 text-center rounded-sm border-4 transition-colors ${
                lightMode
                  ? 'bg-[#fdfbf6] border-[#cbb99e] text-[#2c1d11] shadow-[0_10px_30px_rgba(0,0,0,0.15)]'
                  : 'bg-[#1a0a0a] border-[#331111] text-white'
              }`}
            >
              <h2 className="font-arcade text-3xl text-[#ffbc00] mb-5">PAUSED</h2>
              <div className="flex items-center gap-3 justify-center">
                <button
                  id="paused-resume-btn"
                  onClick={handleTogglePause}
                  className="px-6 py-2.5 bg-[#ff4d00] hover:bg-[#ffbc00] text-black font-mono font-bold tracking-widest transition-colors rounded-sm cursor-pointer shadow-[0_0_15px_#ff4d00]"
                >
                  RESUME
                </button>
                <button
                  id="paused-quit-btn"
                  onClick={handleQuitGame}
                  className="px-5 py-2.5 bg-transparent hover:bg-red-500/20 border border-[#ff4444] text-[#ff4444] font-mono font-bold tracking-widest transition-colors rounded-sm flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  QUIT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Victory Dancing & Level Warp Modal */}
        {gameState === 'VICTORY_DANCING' && (
          <VictoryModal
            currentLevel={currentLevel}
            stats={stats}
            onEnterNextLevel={handleEnterNextLevel}
          />
        )}

        {/* Game Over - Extinct & Crying Dinosaur Modal */}
        {gameState === 'GAME_OVER' && (
          <GameOverModal
            stats={stats}
            onRetry={handleRetry}
            onGoMenu={handleGoMenu}
          />
        )}

        {/* How to Play Manual Modal */}
        {showHelpModal && (
          <HowToPlayModal onClose={() => setShowHelpModal(false)} />
        )}
      </div>

      {/* Responsive Touch / Action Buttons Bar */}
      {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
        <TouchControls
          onJump={handleJump}
          onFireBreath={handleFireBreath}
          onSword={handleSword}
          onDuckStart={handleDuckStart}
          onDuckEnd={handleDuckEnd}
          fireEnergy={fireEnergy}
          lightMode={lightMode}
        />
      )}
    </div>
  );
}
