export type GameState = 'LOBBY' | 'PLAYING' | 'PAUSED' | 'CLEAR';

export interface FruitDef {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgLight: string;
}

export interface CardItem {
  id: string;
  fruitId: string;
  name: string;
  emoji: string;
  color: string;
  bgLight: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  finishtime: string;
  score: number;
  timestamp: string;
}