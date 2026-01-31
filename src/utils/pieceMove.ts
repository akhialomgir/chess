import type { Side, Piece, Board, MoveRecord, Position } from "../types/chess";
import { PieceMap, isPawn, isKnight } from "../types/chess";

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
    }
  };
}

function makeMoves(
  piece: Piece,
  from: Position,
  targets: Position[]
): MoveRecord[] {
  return targets.map(to => ({ piece, from, to }));
}

//TODO: direction move
function getPawnMoves(
  piece: Piece,
  position: Position,
  board: Board
): Position[] {
  const [x, y] = position;
  const side = getPieceSide(piece);
  const checker = createMoveChecker(board, side);
  const moves: Position[] = [];

  const direction = side === 'White' ? -1 : 1;
  const startRow = side === 'White' ? 6 : 1;
  const isFirstMove = y === startRow;

  // Forward one square (cannot capture)
  const nextY = y + direction;
  if (checker.canMove(x, nextY, false)) {
    moves.push([x, nextY]);

    // Forward two squares on first move
    if (isFirstMove) {
      const twoStepsY = y + 2 * direction;
      checker.addIfValid(moves, x, twoStepsY, false);
    }
  }

  // Diagonal captures (must capture)
  for (const dx of [-1, 1]) {
    const captureX = x + dx;
    const captureY = y + direction;
    if (inBounds(captureX, captureY)) {
      const targetPiece = board[captureY][captureX];
      if (targetPiece !== null && getPieceSide(targetPiece) !== side) {
        moves.push([captureX, captureY]);
      }
    }
  }

  return moves;
}

function getKnightMoves(piece: Piece, position: Position, board: Board): Position[] {
  const [x, y] = position;
  const side = getPieceSide(piece);
  const checker = createMoveChecker(board, side);
  const moves: Position[] = [];

  const knightOffsets = [
    [2, 1], [2, -1], [-2, 1], [-2, -1],
    [1, 2], [1, -2], [-1, 2], [-1, -2]
  ];

  for (const [dx, dy] of knightOffsets) {
    checker.addIfValid(moves, x + dx, y + dy);
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
  if (isKnight(piece)) {
    return makeMoves(piece, position, getKnightMoves(piece, position, board));
  }

  return [{ piece, from: position, to: position }];
}

export { getPieceSide, getLegalMoves };
