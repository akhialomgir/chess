import { useReducer } from 'react';

import Chessboard from './Chessboard.tsx';
import MoveList from './MoveList.tsx';
import type { Board, MoveRecord } from '../types/chess';

type GameState = {
  history: Board[]; // stack
  cursor: number;   // index
  moveHistory: MoveRecord[];
};

type MoveAction =
  | { type: 'exchange'; from: [number, number]; to: [number, number] }
  | { type: 'capture'; from: [number, number]; to: [number, number] }
  | { type: 'jumpTo'; cursor: number };

type MoveInput = {
  from: [number, number];
  to: [number, number];
  isCapture: boolean;
};

const initialBoard: Board = [
  ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
  ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn'],
  ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook'],
];

function cloneBoard(board: Board): Board {
  return board.map(row => [...row]);
}

type MoveActionWithPositions =
  | { type: 'exchange'; from: [number, number]; to: [number, number] }
  | { type: 'capture'; from: [number, number]; to: [number, number] };

function applyMove(board: Board, action: MoveActionWithPositions): Board {
  const next = cloneBoard(board);
  const [fromX, fromY] = action.from;
  const [toX, toY] = action.to;
  const movingPiece = board[fromY][fromX];

  if (!movingPiece) {
    return next;
  }

  switch (action.type) {
    case 'exchange': {
      [next[fromY][fromX], next[toY][toX]] = [board[toY][toX], movingPiece];
      break;
    }
    case 'capture': {
      next[toY][toX] = movingPiece;
      next[fromY][fromX] = null;
      break;
    }
  }

  return next;
}

function gameReducer(state: GameState, action: MoveAction): GameState {
  if (action.type === 'jumpTo') {
    return {
      ...state,
      cursor: action.cursor,
    };
  }

  // Prevent moving to the same square
  const [fromX, fromY] = action.from;
  const [toX, toY] = action.to;
  if (fromX === toX && fromY === toY) {
    return state;
  }

  const currentBoard = state.history[state.cursor];
  const movingPiece = currentBoard[fromY][fromX];

  if (!movingPiece) {
    return state;
  }

  const updatedBoard = applyMove(currentBoard, action);

  const trimmedHistory = state.history.slice(0, state.cursor + 1);
  const trimmedMoves = state.moveHistory.slice(0, state.cursor);

  return {
    history: [...trimmedHistory, updatedBoard],
    cursor: trimmedHistory.length,
    moveHistory: [...trimmedMoves, { piece: movingPiece, from: action.from, to: action.to }],
  };
}

export default function GameBox() {
  const [{ history, cursor, moveHistory }, dispatch] = useReducer(gameReducer, {
    history: [initialBoard],
    cursor: 0,
    moveHistory: [],
  });

  const positions = history[cursor];

  const handleMove = ({ from, to, isCapture }: MoveInput) => {
    dispatch({ type: isCapture ? 'capture' : 'exchange', from, to });
  };

  const handleJumpTo = (step: number) => {
    dispatch({ type: 'jumpTo', cursor: step });
  };

  return (
    <div className="game-box">
      <Chessboard
        positions={positions}
        onMove={handleMove}
      />
      <MoveList moves={moveHistory} currentStep={cursor} onJumpTo={handleJumpTo} />
    </div>
  );
}
