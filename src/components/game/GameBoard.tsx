'use client';

import React from 'react';
import { CardItem as CardItemType } from '@/types/game';
import { CardItem } from './CardItem';
import { Play } from 'lucide-react';

interface Props {
  cards: CardItemType[];
  isPaused: boolean;
  onCardClick: (index: number) => void;
  onResume: () => void;
}

export const GameBoard: React.FC<Props> = ({
  cards,
  isPaused,
  onCardClick,
  onResume,
}) => {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* 4x4 카드 그리드 - 글래스모피즘 & 모바일 반응형 패딩 */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3.5 p-3 sm:p-5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.06)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        {cards.map((card, index) => (
          <CardItem
            key={card.id}
            card={card}
            index={index}
            onClick={onCardClick}
            disabled={isPaused}
          />
        ))}
      </div>

      {/* 일시정지 상태 오버레이 (카드 가리기 & 치팅 방지) */}
      {isPaused && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-3xl bg-slate-900/70 dark:bg-black/80 backdrop-blur-xl text-white p-6 animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center border border-white/25 mb-4 animate-bounce">
            <span className="text-3xl">⏸️</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">게임이 일시정지되었습니다</h3>
          <p className="text-slate-300 text-xs sm:text-sm mb-6 text-center max-w-xs">
            카드가 가려졌습니다. 준비가 되면 아래 버튼을 눌러 다시 진행하세요.
          </p>
          <button
            onClick={onResume}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>게임 계속하기</span>
          </button>
        </div>
      )}
    </div>
  );
};
