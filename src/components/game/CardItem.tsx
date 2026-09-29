'use client';

import React from 'react';
import { CardItem as CardItemType } from '@/types/game';

interface Props {
  card: CardItemType;
  index: number;
  onClick: (index: number) => void;
  disabled: boolean;
}

export const CardItem: React.FC<Props> = ({ card, index, onClick, disabled }) => {
  const isRevealed = card.isFlipped || card.isMatched;

  return (
    <div
      onClick={() => {
        if (!disabled && !isRevealed) {
          onClick(index);
        }
      }}
      className={`group relative h-20 sm:h-24 md:h-28 w-full cursor-pointer select-none perspective-1000 ${
        card.isMatched ? 'cursor-default' : ''
      }`}
    >
      <div
        className={`relative w-full h-full duration-500 transform-style-3d transition-transform rounded-2xl shadow-sm hover:shadow-lg ${
          isRevealed ? 'rotate-y-180' : ''
        }`}
      >
        {/* 카드 뒷면: 반투명 흐린 질감의 글래스모피즘 */}
        <div className="absolute inset-0 w-full h-full backface-hidden flex items-center justify-center rounded-2xl bg-white/30 dark:bg-slate-800/40 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 group-hover:scale-[1.03] group-hover:bg-white/45 dark:group-hover:bg-slate-800/60 group-active:scale-95">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/60 dark:border-white/20 shadow-inner">
            <span className="text-xl sm:text-2xl opacity-75 group-hover:scale-110 transition-transform">❓</span>
          </div>
        </div>

        {/* 카드 앞면: 투명 유리 베이스 위에 과일 */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
            card.isMatched
              ? 'bg-emerald-500/20 dark:bg-emerald-500/25 border-emerald-400 dark:border-emerald-500/60 ring-2 ring-emerald-400/50 shadow-emerald-500/20 shadow-md'
              : 'bg-white/70 dark:bg-slate-800/70 border-white/60 dark:border-white/15 shadow-sm'
          }`}
        >
          <span className="text-3xl sm:text-4xl md:text-5xl transition-transform duration-300 transform scale-100 group-hover:scale-110 drop-shadow-sm">
            {card.emoji}
          </span>
          <span className="mt-1 text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200">
            {card.name}
          </span>
        </div>
      </div>
    </div>
  );
};
