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
  const [x, y] = pos;
  const isDark = (x + y) & 1;

  const fileLabel = String.fromCharCode(97 + x); // a-h
  const rankLabel = 8 - y; // 8-1

  return (
    <div className={`board-square ${isDark ? 'dark' : 'light'}`}>
      {pieceSrc && <img src={pieceSrc} alt={`${value} piece`} />}
      <span className={`file-label ${isDark ? 'light-text' : 'dark-text'}`}>
        {fileLabel}
      </span>
      <span className={`rank-label ${isDark ? 'light-text' : 'dark-text'}`}>
        {rankLabel}
      </span>
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

  //const eatPiece = (fromPiece: Piece, _: Piece): [Piece, Piece] => [null, fromPiece];
  const exchangePieces = (fromPiece: Piece, toPiece: Piece): [Piece, Piece] => [toPiece, fromPiece];

  const handleDrop = (e: React.DragEvent, targetX: number, targetY: number) => {
    const fromStr = e.dataTransfer.getData('from');
    const [fromX, fromY] = fromStr.split(',').map(Number);

    const newBoard = Positions.map(row => [...row]);
    [newBoard[fromY][fromX], newBoard[targetY][targetX]] =
      exchangePieces(newBoard[fromY][fromX], newBoard[targetY][targetX]);
    setPositions(newBoard);
  };

  return (
    <div className='chessboard'>
      {
        Positions.flat().map((piece, index) => {
          const x = index % 8;
          const y = Math.floor(index / 8);

          return (
            <div
              onDragStart={(e) => {
                e.dataTransfer.setData('from', `${x},${y}`);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, x, y)}
              draggable={piece !== null}
            >
              <Square key={index} pos={[x, y]} value={piece} />
            </div>
          )
        })
      }
    </div>
  )
}
