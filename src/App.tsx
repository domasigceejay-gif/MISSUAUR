/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { GameUI } from './components/GameUI';
import { TouchControls } from './components/TouchControls';
import { MainMenu } from './components/MainMenu';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { DinoGameEngine } from './utils/gameEngine';
import { GameState, GameStats } from './types';
import { getLevelConfig } from './utils/levels';
import { sound } from './utils/sound';

export default function App() {
  const engineRef = useRef<DinoGameEngine | null>(null);

  const [gameState, setGameState] = useState<GameState>('MENU');
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

  const handleEngineReady = useCallback((engine: DinoGameEngine) => {
    engineRef.current = engine;
  }, []);

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
    engineRef.current.changeState('MENU');
  }, []);

  const handleToggleSound = useCallback(() => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  }, []);

  const handleToggleCrt = useCallback(() => {
    setCrtEffect((prev) => !prev);
  }, []);

  const levelConfig = getLevelConfig(currentLevel);

  return (
    <div className="flex flex-col items-center justify-between w-full h-screen min-h-[550px] bg-[#050000] text-[#e0e0e0] p-2 sm:p-4 font-mono overflow-hidden">
      {/* Game Window Wrapper */}
      <div className="relative w-full max-w-5xl flex-1 flex flex-col items-center justify-center min-h-0">
        {/* Canvas Host */}
        <GameCanvas
          onEngineReady={handleEngineReady}
          onStateChange={handleStateChange}
          onStatsUpdate={handleStatsUpdate}
          onLevelComplete={handleLevelComplete}
          crtEffect={crtEffect}
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
          />
        )}

        {/* PAUSED Overlay */}
        {gameState === 'PAUSED' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center">
            <div className="bg-[#1a0a0a] border-4 border-[#331111] p-8 text-center rounded-sm">
              <h2 className="font-arcade text-3xl text-[#ffbc00] mb-4">PAUSED</h2>
              <button
                onClick={handleTogglePause}
                className="px-6 py-2 bg-[#331111] hover:bg-[#ff4d00] text-white font-mono tracking-widest transition-colors"
              >
                RESUME
              </button>
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
        />
      )}
    </div>
  );
}
