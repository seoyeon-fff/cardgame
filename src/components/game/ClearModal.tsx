'use client';

import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, RotateCcw, Home, Sparkles, CheckCircle2, AlertCircle, Loader2, Medal } from 'lucide-react';
import { LeaderboardEntry } from '@/types/game';

interface Props {
  playerName: string;
  elapsedTime: number;
  attempts: number;
  onRestart: () => void;
  onResetToLobby: () => void;
}

export const ClearModal: React.FC<Props> = ({
  playerName,
  elapsedTime,
  attempts,
  onRestart,
  onResetToLobby,
}) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState<boolean>(true);
  const hasSavedRef = useRef(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return String(mins) + '분 ' + String(secs) + '초';
    }
    return String(secs) + '초';
  };

  // 점수 계산 (시도 횟수와 소요 시간을 바탕으로 한 점수: 기본 1000점에서 차감, 최소 100점)
  const calculateScore = () => {
    const base = 1000;
    const penalty = attempts * 20 + elapsedTime * 5;
    return Math.max(100, base - penalty);
  };

  // 상위 3명 랭킹 가져오기 함수
  const fetchTopRankings = (scriptUrl: string) => {
    setLoadingLeaderboard(true);
    fetch(scriptUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.top3)) {
          setLeaderboard(data.top3);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch leaderboard:', err);
      })
      .finally(() => {
        setLoadingLeaderboard(false);
      });
  };

  useEffect(() => {
    // 1. 팡파레 효과 (Confetti)
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 40 * (timeLeft / duration);
      confetti({
        particleCount,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        spread: 60,
      });
    }, 250);

    // 2. 구글 앱스 스크립트로 결과 데이터 저장 (성공 시 1회만 전송) 및 Top 3 랭킹 불러오기
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    if (scriptUrl && !hasSavedRef.current) {
      hasSavedRef.current = true;
      setSaveStatus('saving');

      const payload = {
        name: playerName,
        score: calculateScore(),
        finishtime: formatTime(elapsedTime),
      };

      fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors', // 구글 앱스 스크립트 리디렉션 및 CORS 대응
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      })
        .then(() => {
          setSaveStatus('saved');
          // 구글 시트에 행이 추가된 후 최신 순위 가져오기 (1초 버퍼 후 호출)
          setTimeout(() => {
            fetchTopRankings(scriptUrl);
          }, 1000);
        })
        .catch((err) => {
          console.error('Failed to save to Google Sheets:', err);
          setSaveStatus('error');
          // 에러 시에도 기존 랭킹이라도 조회 시도
          fetchTopRankings(scriptUrl);
        });
    }

    return () => clearInterval(interval);
  }, [playerName, elapsedTime, attempts]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/60 dark:border-white/10 text-center transform animate-in zoom-in-95 duration-200 my-auto">
        <div className="relative inline-block mb-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center mx-auto text-3xl sm:text-4xl shadow-inner">
            🏆
          </div>
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          축하합니다!
        </h2>
        <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm sm:text-base mt-0.5">
          {playerName}님이 모든 과일 카드를 맞췄습니다!
        </p>

        {/* 내 게임 결과 */}
        <div className="grid grid-cols-2 gap-2.5 my-3.5 bg-white/40 dark:bg-slate-800/40 p-3 sm:p-3.5 rounded-2xl border border-white/50 dark:border-white/10">
          <div className="flex flex-col items-center justify-center p-2.5 bg-white/60 dark:bg-slate-800/60 rounded-xl shadow-xs">
            <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 text-xs mb-0.5">
              <Clock className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              <span>완료 시간</span>
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-blue-600 dark:text-blue-400">
              {formatTime(elapsedTime)}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2.5 bg-white/60 dark:bg-slate-800/60 rounded-xl shadow-xs">
            <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 text-xs mb-0.5">
              <Trophy className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
              <span>총 시도</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
              {attempts}회
            </div>
          </div>
        </div>

        {/* 구글 시트 저장 상태 알림 */}
        <div className="mb-3.5 flex items-center justify-center">
          {saveStatus === 'saving' && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium border border-blue-500/20">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>구글 시트에 기록 중...</span>
            </div>
          )}
          {saveStatus === 'saved' && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>구글 시트에 기록되었습니다!</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-medium border border-rose-500/20">
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>기록 저장에 실패했습니다.</span>
            </div>
          )}
        </div>

        {/* 🏆 명예의 전당 (Top 3 랭킹) 영역 */}
        <div className="my-3.5 bg-gradient-to-br from-amber-500/5 via-indigo-500/5 to-purple-500/5 dark:bg-slate-800/50 p-3 sm:p-4 rounded-2xl border border-amber-500/20 dark:border-white/10 text-left">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200/60 dark:border-white/10">
            <div className="flex items-center space-x-1.5">
              <Medal className="w-4 h-4 text-amber-500" />
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                명예의 전당 (종료시간 TOP 3)
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">최단 시간 오름차순</span>
          </div>

          {loadingLeaderboard ? (
            <div className="py-4 flex items-center justify-center space-x-2 text-slate-400 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
              <span>랭킹 불러오는 중...</span>
            </div>
          ) : leaderboard.length > 0 ? (
            <div className="space-y-1.5">
              {leaderboard.map((entry) => {
                const isMe = entry.name === playerName;
                const medalColors = [
                  'bg-amber-400 text-white shadow-amber-300', // 1등 금
                  'bg-slate-300 text-slate-800 shadow-slate-200', // 2등 은
                  'bg-amber-700 text-white shadow-amber-600', // 3등 동
                ];
                const badgeColor = medalColors[entry.rank - 1] || 'bg-slate-200 text-slate-700';

                return (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all ${
                      isMe
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800'
                        : 'bg-white/70 dark:bg-slate-800/70 border border-white/60 dark:border-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs shrink-0 ${badgeColor}`}
                      >
                        {entry.rank}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {entry.name}
                        {isMe && <span className="ml-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">(나)</span>}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        ⏱️ {entry.finishtime}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-3 text-center text-slate-400 text-xs">
              아직 등록된 랭킹 기록이 없습니다.
            </div>
          )}
        </div>

        {/* 제어 버튼 */}
        <div className="space-y-2 mt-4">
          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>다시 도전하기</span>
          </button>

          <button
            onClick={onResetToLobby}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-2xl bg-slate-500/10 hover:bg-slate-500/20 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>처음으로 (이름 입력 화면으로)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
