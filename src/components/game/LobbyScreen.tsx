'use client';

import React, { useState } from 'react';
import { Play, Sparkles } from 'lucide-react';

interface Props {
  onStart: (name: string) => void;
  defaultName?: string;
}

export const LobbyScreen: React.FC<Props> = ({ onStart, defaultName = '' }) => {
  const [name, setName] = useState<string>(defaultName);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('이름을 입력해주세요!');
      return;
    }
    if (trimmed.length > 12) {
      setError('이름은 12글자 이내로 입력해주세요.');
      return;
    }
    setError('');
    onStart(trimmed);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/60 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/60 dark:border-white/10 text-3xl mb-3 shadow-inner">
          🍎🍌
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          과일 카드 맞추기
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1.5">
          뒤집힌 카드를 기억하고 같은 과일 짝을 찾아보세요!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="playerName" className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            플레이어 닉네임
          </label>
          <input
            id="playerName"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="예: 과일왕김철수"
            className="w-full px-4 py-3 rounded-2xl border border-white/60 dark:border-white/10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md focus:bg-white/80 dark:focus:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-medium transition-all"
            autoFocus
          />
          {error && (
            <p className="text-rose-500 dark:text-rose-400 text-xs mt-1.5 font-medium animate-in fade-in">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 py-3.5 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>게임 시작하기</span>
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-white/40 dark:border-white/10 text-slate-500 dark:text-slate-400 text-xs space-y-1.5 text-center">
        <div className="flex items-center justify-center space-x-1 font-medium text-slate-600 dark:text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>게임 규칙</span>
        </div>
        <p>4x4 총 16장의 카드 중 2장씩 뒤집어 같은 과일을 맞추세요.</p>
        <p>최대한 빠른 시간과 적은 횟수로 완료해 보세요!</p>
      </div>
    </div>
  );
};
