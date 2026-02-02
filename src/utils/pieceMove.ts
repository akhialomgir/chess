import type { Side, Piece, Board, MoveRecord, Position } from "../types/chess";
import { PieceMap, isPawn, isKnight, isBishop, isRook, isQueen, isKing } from "../types/chess";

function getPieceSide(piece: Piece): Side {
  return PieceMap.White.some(p => p === piece) ? 'White' : 'Black';
}

function inBounds(x: number, y: number): boolean {
  return x >= 0 && x < 8 && y >= 0 && y < 8;
}

function canMoveTo(
  targetX: number,
  targetY: number,
  board: Board,
  side: Side,
  canCapture: boolean = true
): boolean {
  if (!inBounds(targetX, targetY)) return false;

  const targetPiece = board[targetY][targetX];
  if (targetPiece === null) return true;
  if (!canCapture) return false;

  return getPieceSide(targetPiece) !== side;
}

function createMoveChecker(board: Board, side: Side) {
  return {
    canMove: (x: number, y: number, canCapture = true) =>
      canMoveTo(x, y, board, side, canCapture),
    addIfValid: (moves: Position[], x: number, y: number, canCapture = true) => {
      if (canMoveTo(x, y, board, side, canCapture)) {
        moves.push([x, y]);
      }
    },
    hasPiece: (x: number, y: number) => {
      if (!inBounds(x, y)) return false;
      return board[y][x] !== null;
    }
  };
}

function getPawnDirection(side: Side) {
  return {
    direction: side === 'White' ? -1 : 1,
    startRow: side === 'White' ? 6 : 1,
    isFirstMove: (y: number) => y === (side === 'White' ? 6 : 1)
  };
}

function makeMoves(
  piece: Piece,
  from: Position,
  targets: Position[]
): MoveRecord[] {
  return targets.map(to => ({ piece, from, to }));
}

function getPawnMoves(
  piece: Piece,
  position: Position,
  board: Board
): Position[] {
  const [x, y] = position;
  const side = getPieceSide(piece);
  const checker = createMoveChecker(board, side);
  const { direction, isFirstMove } = getPawnDirection(side);
  const moves: Position[] = [];

  // Forward move (cannot capture)
  for (let i = 1; i <= (isFirstMove(y) ? 2 : 1); i++) {
    const [nextX, nextY] = [x, y + direction * i];
    if (!checker.canMove(nextX, nextY, false)) break;
    moves.push([nextX, nextY]);
  }

  // Diagonal capture
  for (const dx of [-1, 1]) {
    const [captureX, captureY] = [x + dx, y + direction];
    if (inBounds(captureX, captureY)) {
      const targetPiece = board[captureY][captureX];
      if (targetPiece !== null && getPieceSide(targetPiece) !== side) {
        moves.push([captureX, captureY]);
      }
    }
  }

  return moves;
}

function getMoves(
  piece: Piece,
  position: Position,
  board: Board,
  directions: number[][],
  maxDistance: number = 1
): Position[] {
  const [x, y] = position;
  const side = getPieceSide(piece);
  const checker = createMoveChecker(board, side);
  const moves: Position[] = [];

  for (const [dx, dy] of directions) {
    for (let i = 1; i <= maxDistance; i++) {
      const [nextX, nextY] = [x + (dx * i), y + (dy * i)];
      checker.addIfValid(moves, nextX, nextY);
      if (maxDistance > 1 && checker.hasPiece(nextX, nextY)) break;
    }
  }

  return moves;
}

function getJumpMoves(piece: Piece, position: Position, board: Board, offsets: number[][]): Position[] {
  return getMoves(piece, position, board, offsets, 1);
}

function getSlidingMoves(piece: Piece, position: Position, board: Board, directions: number[][]): Position[] {
  return getMoves(piece, position, board, directions, 7);
}

function getKnightMoves(piece: Piece, position: Position, board: Board): Position[] {
  return getJumpMoves(piece, position, board, [
    [2, 1], [2, -1], [-2, 1], [-2, -1],
    [1, 2], [1, -2], [-1, 2], [-1, -2]
  ]);
}

function getBishopMoves(piece: Piece, position: Position, board: Board): Position[] {
  return getSlidingMoves(piece, position, board, [
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ]);
}

function getRookMoves(piece: Piece, position: Position, board: Board): Position[] {
  return getSlidingMoves(piece, position, board, [
    [0, 1], [0, -1], [-1, 0], [1, 0]
  ]);
}

function getQueenMoves(piece: Piece, position: Position, board: Board): Position[] {
  return Array.from(new Set([...getBishopMoves(piece, position, board), ...getRookMoves(piece, position, board)]));
}

function getKingMoves(piece: Piece, position: Position, board: Board): Position[] {
  return getJumpMoves(piece, position, board, [
    [0, 1], [0, -1], [-1, 0], [1, 0],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ]);
}


function getLegalMoves(
  piece: Piece,
  position: [number, number],
  board: Board
): MoveRecord[] {
  if (isPawn(piece)) {
    return makeMoves(piece, position, getPawnMoves(piece, position, board));
  }
  if (isKnight(piece)) {
    return makeMoves(piece, position, getKnightMoves(piece, position, board));
  }
  if (isBishop(piece)) {
    return makeMoves(piece, position, getBishopMoves(piece, position, board));
  }
  if (isRook(piece)) {
    return makeMoves(piece, position, getRookMoves(piece, position, board));
  }
  if (isQueen(piece)) {
    return makeMoves(piece, position, getQueenMoves(piece, position, board));
  }
  if (isKing(piece)) {
    return makeMoves(piece, position, getKingMoves(piece, position, board));
  }

  return [{ piece, from: position, to: position }];
}

export { getPieceSide, getLegalMoves };
