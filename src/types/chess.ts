export type Piece =
    | 'P' | 'N' | 'B' | 'R' | 'Q' | 'K'
    | 'p' | 'n' | 'b' | 'r' | 'q' | 'k'
    | null;

export type Board = Piece[][];

export type MoveRecord = {
    piece: Piece;
    from: [number, number];
    to: [number, number];
};
