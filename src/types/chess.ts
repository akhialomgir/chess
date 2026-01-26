export const PieceMap = {
  White: ['Pawn', 'Knight', 'Bishop', 'Rook', 'Queen', 'King'] as const,
  Black: ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'] as const,
} as const;

export type Side = keyof typeof PieceMap;
export type Piece = typeof PieceMap[keyof typeof PieceMap][number];

export type Position = [number, number];

export type Pawn = 'Pawn' | 'pawn';
export type Knight = 'Knight' | 'knight';
export type Bishop = 'Bishop' | 'bishop';
export type Rook = 'Rook' | 'rook';
export type Queen = 'Queen' | 'queen';
export type King = 'King' | 'king';

function createPieceChecker<T extends Piece>(
  whitePiece: T,
  blackPiece: T
): (piece: Piece) => piece is T {
  return (piece: Piece): piece is T => piece === whitePiece || piece === blackPiece;
}

export const isPawn = createPieceChecker<Pawn>('Pawn', 'pawn');
export const isKnight = createPieceChecker<Knight>('Knight', 'knight');
export const isBishop = createPieceChecker<Bishop>('Bishop', 'bishop');
export const isRook = createPieceChecker<Rook>('Rook', 'rook');
export const isQueen = createPieceChecker<Queen>('Queen', 'queen');
export const isKing = createPieceChecker<King>('King', 'king');

export type Cell = Piece | null;

export type Board = Cell[][];

export type MoveRecord = {
  piece: Piece;
  from: Position;
  to: Position;
};
