'use client';

import React from 'react';
import { useMemoryGame } from '@/hooks/useMemoryGame';
import { LobbyScreen } from '@/components/game/LobbyScreen';
import { GameHeader } from '@/components/game/GameHeader';
import { GameBoard } from '@/components/game/GameBoard';
import { ClearModal } from '@/components/game/ClearModal';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  const {
    playerName,
    gameState,
    cards,
    attempts,
    matchedPairs,
    totalPairs,
    elapsedTime,
    startGame,
    restartGame,
    togglePause,
    resetToLobby,
    handleCardClick,
  } = useMemoryGame();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-rose-50/70 via-sky-50/60 to-violet-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-slate-800 dark:text-slate-100 transition-colors duration-500 relative overflow-hidden">
      {/* 부드러운 파스텔 앰비언트 글로우 블러 원형 */}
      <div className="fixed -top-32 -left-32 w-80 sm:w-96 h-80 sm:h-96 bg-pink-200/35 dark:bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 -right-32 w-80 sm:w-96 h-80 sm:h-96 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-32 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-blue-200/35 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* 상단 네비게이션 / 테마 토글 */}
      <header className="relative z-20 w-full max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl sm:text-2xl">🍓</span>
          <span className="font-extrabold tracking-tight text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-300 bg-clip-text text-transparent">
            Fruit Match
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* 메인 게임 영역 */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-3 sm:px-6 py-2 sm:py-6 w-full">
        <div className="w-full max-w-2xl flex flex-col items-center">
          {/* 1. 로비 화면 */}
          {gameState === 'LOBBY' && (
            <LobbyScreen onStart={startGame} defaultName={playerName} />
          )}

          {/* 2. 게임 플레이 화면 */}
          {gameState !== 'LOBBY' && (
            <div className="w-full animate-in fade-in duration-300">
              <GameHeader
                playerName={playerName}
                gameState={gameState}
                elapsedTime={elapsedTime}
                matchedPairs={matchedPairs}
                totalPairs={totalPairs}
                attempts={attempts}
                onTogglePause={togglePause}
                onRestart={restartGame}
                onResetToLobby={resetToLobby}
              />

              <GameBoard
                cards={cards}
                isPaused={gameState === 'PAUSED'}
                onCardClick={handleCardClick}
                onResume={togglePause}
              />
            </div>
          )}

          {/* 3. 클리어 모달 */}
          {gameState === 'CLEAR' && (
            <ClearModal
              playerName={playerName}
              elapsedTime={elapsedTime}
              attempts={attempts}
              onRestart={restartGame}
              onResetToLobby={resetToLobby}
            />
          )}
        </div>
      </main>

      {/* 메인 페이지 하단 Footer */}
      <footer className="relative z-20 w-full py-4 px-4 text-center border-t border-white/40 dark:border-white/5 bg-white/20 dark:bg-slate-950/20 backdrop-blur-md">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
          Copyright INU 카드 맞추기 게임 by Noh Seoyeon
        </p>
      </footer>
    </div>
  );
}
