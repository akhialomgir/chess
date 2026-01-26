import type { Piece } from '../types/chess';

const assetBase = import.meta.env.BASE_URL; // dev: '/', pages: '/chess/'

export const pieceSprite: Record<Exclude<Piece, null>, string> = {
    Pawn: `${assetBase}piece/wP.svg`,
    Knight: `${assetBase}piece/wN.svg`,
    Bishop: `${assetBase}piece/wB.svg`,
    Rook: `${assetBase}piece/wR.svg`,
    Queen: `${assetBase}piece/wQ.svg`,
    King: `${assetBase}piece/wK.svg`,
    pawn: `${assetBase}piece/bP.svg`,
    knight: `${assetBase}piece/bN.svg`,
    bishop: `${assetBase}piece/bB.svg`,
    rook: `${assetBase}piece/bR.svg`,
    queen: `${assetBase}piece/bQ.svg`,
    king: `${assetBase}piece/bK.svg`,
};
