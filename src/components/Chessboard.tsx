import './Chessboard.css';
import { useState } from 'react';

type Piece = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K' |
  'p' | 'n' | 'b' | 'r' | 'q' | 'k' |
  null;

const pieceSprite: Record<Exclude<Piece, null>, string> = {
  P: '/piece/wP.svg',
  N: '/piece/wN.svg',
  B: '/piece/wB.svg',
  R: '/piece/wR.svg',
  Q: '/piece/wQ.svg',
  K: '/piece/wK.svg',
  p: '/piece/bP.svg',
  n: '/piece/bN.svg',
  b: '/piece/bB.svg',
  r: '/piece/bR.svg',
  q: '/piece/bQ.svg',
  k: '/piece/bK.svg',
};

function Square({ pos, value }: { pos: [number, number]; value: Piece }) {
  const pieceSrc = value ? pieceSprite[value] : null;

  return (
    <div className={`board-square ${(pos[0] + pos[1]) & 1 ? 'dark' : 'light'}`}>
      {pieceSrc && <img src={pieceSrc} alt={`${value} piece`} />}
    </div>
  );
}

export default function Chessboard() {
  const [Positions, setPositions] = useState<Piece[][]>([
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ]);

  return (
    <div className='chessboard'>
      {
        Positions.flat().map((piece, index) => {
          return (
            <Square key={index} pos={[index % 8, Math.floor(index / 8)]} value={piece} />
          )
        })
      }
    </div>
  )
}
