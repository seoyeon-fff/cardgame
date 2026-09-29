'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CardItem, GameState } from '@/types/game';
import { FRUITS } from '@/constants/fruits';

export function useMemoryGame() {
  const [playerName, setPlayerName] = useState<string>('');
  const [gameState, setGameState] = useState<GameState>('LOBBY');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 카드 셔플 함수
  const generateDeck = useCallback((): CardItem[] => {
    const deck: CardItem[] = [];
    FRUITS.forEach((fruit) => {
      // 과일당 2장씩 생성
      for (let i = 1; i <= 2; i++) {
        deck.push({
          id: `fruit_${fruit.id}_${i}`,
          fruitId: fruit.id,
          name: fruit.name,
          emoji: fruit.emoji,
          color: fruit.color,
          bgLight: fruit.bgLight,
          isFlipped: false,
          isMatched: false,
        });
      }
    });

    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }, []);

  // 타이머 작동
  useEffect(() => {
    if (gameState === 'PLAYING') {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState]);

  // 게임 시작
  const startGame = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPlayerName(trimmed);
    setCards(generateDeck());
    setFlippedIndices([]);
    setIsChecking(false);
    setMatchedPairs(0);
    setAttempts(0);
    setElapsedTime(0);
    setGameState('PLAYING');
  }, [generateDeck]);

  // 게임 다시 시작 (이름 유지)
  const restartGame = useCallback(() => {
    setCards(generateDeck());
    setFlippedIndices([]);
    setIsChecking(false);
    setMatchedPairs(0);
    setAttempts(0);
    setElapsedTime(0);
    setGameState('PLAYING');
  }, [generateDeck]);

  // 일시정지 토글
  const togglePause = useCallback(() => {
    setGameState((prev) => {
      if (prev === 'PLAYING') return 'PAUSED';
      if (prev === 'PAUSED') return 'PLAYING';
      return prev;
    });
  }, []);

  // 처음으로 (로비로 복귀)
  const resetToLobby = useCallback(() => {
    setGameState('LOBBY');
    setCards([]);
    setFlippedIndices([]);
    setIsChecking(false);
    setMatchedPairs(0);
    setAttempts(0);
    setElapsedTime(0);
  }, []);

  // 카드 클릭 처리
  const handleCardClick = useCallback((index: number) => {
    if (gameState !== 'PLAYING' || isChecking) return;

    const clickedCard = cards[index];
    if (!clickedCard || clickedCard.isMatched || clickedCard.isFlipped) return;

    // 현재 뒤집힌 카드가 없을 때 (첫 번째 카드 오픈)
    if (flippedIndices.length === 0) {
      setCards((prev) =>
        prev.map((c, idx) => (idx === index ? { ...c, isFlipped: true } : c))
      );
      setFlippedIndices([index]);
      return;
    }

    // 두 번째 카드 오픈
    if (flippedIndices.length === 1) {
      const firstIndex = flippedIndices[0];
      if (firstIndex === index) return;

      const firstCard = cards[firstIndex];

      // 두 번째 카드 뒤집기
      setCards((prev) =>
        prev.map((c, idx) => (idx === index ? { ...c, isFlipped: true } : c))
      );
      setFlippedIndices([firstIndex, index]);
      setIsChecking(true);
      setAttempts((prev) => prev + 1);

      // 매칭 검사
      if (firstCard.fruitId === clickedCard.fruitId) {
        // 일치: 매칭 성공
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === firstIndex || idx === index
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            )
          );
          setFlippedIndices([]);
          setIsChecking(false);
          setMatchedPairs((prev) => {
            const nextPairs = prev + 1;
            if (nextPairs === FRUITS.length) {
              setGameState('CLEAR');
            }
            return nextPairs;
          });
        }, 500);
      } else {
        // 불일치: 1초 후 둘 다 다시 덮기
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === firstIndex || idx === index
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedIndices([]);
          setIsChecking(false);
        }, 900);
      }
    }
  }, [gameState, isChecking, cards, flippedIndices]);

  return {
    playerName,
    gameState,
    cards,
    attempts,
    matchedPairs,
    totalPairs: FRUITS.length,
    elapsedTime,
    startGame,
    restartGame,
    togglePause,
    resetToLobby,
    handleCardClick,
  };
}