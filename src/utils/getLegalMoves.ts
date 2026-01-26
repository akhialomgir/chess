import type { Side, Piece, Board, MoveRecord, Position } from "../types/chess";
import { PieceMap, isPawn } from "../types/chess";

function getSide(piece: Piece): Side {
  return PieceMap.White.includes(piece as any) ? 'White' : 'Black';
}

function inBounds(x: number, y: number): boolean {
  return x >= 0 && x < 8 && y >= 0 && y < 8;
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
  const side = getSide(piece);
  const moves: Array<[number, number]> = [];

  const direction = side === 'White' ? -1 : 1;
  const startRow = side === 'White' ? 6 : 1;
  const isFirstMove = y === startRow;

  // Forward one square
  const nextY = y + direction;
  if (inBounds(x, nextY) && board[nextY][x] === null) {
    moves.push([x, nextY]);

    // Forward two squares on first move
    if (isFirstMove) {
      const twoStepsY = y + 2 * direction;
      if (inBounds(x, twoStepsY) && board[twoStepsY][x] === null) {
        moves.push([x, twoStepsY]);
      }
    }
  }

  // Diagonal captures
  for (const dx of [-1, 1]) {
    const captureX = x + dx;
    const captureY = y + direction;
    if (!inBounds(captureX, captureY)) continue;

    const targetPiece = board[captureY][captureX];
    if (targetPiece !== null && getSide(targetPiece) !== side) {
      moves.push([captureX, captureY]);
    }
  }

  return moves;
}

function getLegalMoves(
  piece: Piece,
  position: [number, number],
  board: Board
): MoveRecord[] {
  if (isPawn(piece)) {
    return makeMoves(piece, position, getPawnMoves(piece, position, board));
  }

  return [{ piece, from: position, to: position }];
}

export default getLegalMoves;
