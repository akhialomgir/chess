import type { Piece } from '../types/chess';

const assetBase = import.meta.env.BASE_URL; // dev: '/', pages: '/chess/'

export const pieceSprite: Record<Exclude<Piece, null>, string> = {
    P: `${assetBase}piece/wP.svg`,
    N: `${assetBase}piece/wN.svg`,
    B: `${assetBase}piece/wB.svg`,
    R: `${assetBase}piece/wR.svg`,
    Q: `${assetBase}piece/wQ.svg`,
    K: `${assetBase}piece/wK.svg`,
    p: `${assetBase}piece/bP.svg`,
    n: `${assetBase}piece/bN.svg`,
    b: `${assetBase}piece/bB.svg`,
    r: `${assetBase}piece/bR.svg`,
    q: `${assetBase}piece/bQ.svg`,
    k: `${assetBase}piece/bK.svg`,
};
