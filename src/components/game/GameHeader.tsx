'use client';

import React from 'react';
import { GameState } from '@/types/game';
import { Pause, Play, RotateCcw, Home, Clock, Trophy, User } from 'lucide-react';

interface Props {
  playerName: string;
  gameState: GameState;
  elapsedTime: number;
  matchedPairs: number;
  totalPairs: number;
  attempts: number;
  onTogglePause: () => void;
  onRestart: () => void;
  onResetToLobby: () => void;
}

export const GameHeader: React.FC<Props> = ({
  playerName,
  gameState,
  elapsedTime,
  matchedPairs,
  totalPairs,
  attempts,
  onTogglePause,
  onRestart,
  onResetToLobby,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  };

  return (
    <div className="w-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.06)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/60 dark:border-white/10 p-4 sm:p-5 mb-4 sm:mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-white/40 dark:border-white/10">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">플레이어</div>
            <div className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">{playerName}</div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <button
            onClick={onTogglePause}
            className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/20 transition-all cursor-pointer active:scale-95"
          >
            {gameState === 'PAUSED' ? (
              <>
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-700 dark:fill-amber-400" />
                <span>계속</span>
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-700 dark:fill-amber-400" />
                <span>멈춤</span>
              </>
            )}
          </button>

          <button
            onClick={onRestart}
            className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">다시</span>
            <span>시작</span>
          </button>

          <button
            onClick={onResetToLobby}
            className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-500/10 hover:bg-slate-500/20 text-slate-700 dark:text-slate-300 border border-slate-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">처음으로</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3.5 pt-3 text-center">
        <div className="bg-white/40 dark:bg-slate-800/40 rounded-2xl p-2 sm:p-2.5 border border-white/50 dark:border-white/5">
          <div className="flex items-center justify-center space-x-1 text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs mb-0.5">
            <Clock className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span>시간</span>
          </div>
          <div className="text-base sm:text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
            {formatTime(elapsedTime)}
          </div>
        </div>

        <div className="bg-white/40 dark:bg-slate-800/40 rounded-2xl p-2 sm:p-2.5 border border-white/50 dark:border-white/5">
          <div className="flex items-center justify-center space-x-1 text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs mb-0.5">
            <Trophy className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span>맞춤</span>
          </div>
          <div className="text-base sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {matchedPairs} <span className="text-xs font-normal text-slate-400">/ {totalPairs}</span>
          </div>
        </div>

        <div className="bg-white/40 dark:bg-slate-800/40 rounded-2xl p-2 sm:p-2.5 border border-white/50 dark:border-white/5">
          <div className="flex items-center justify-center space-x-1 text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs mb-0.5">
            <span className="text-purple-500 dark:text-purple-400 text-xs font-bold">🎯</span>
            <span>시도</span>
          </div>
          <div className="text-base sm:text-xl font-bold text-purple-600 dark:text-purple-400">
            {attempts} <span className="text-xs font-normal text-slate-400">회</span>
          </div>
        </div>
      </div>
    </div>
  );
};
