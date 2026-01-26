import './Chessboard.css';
import type { DragEvent } from 'react';
import type { Cell, Board } from '../types/chess';
import { pieceSprite } from '../utils/pieceAssets';

type ChessboardProps = {
  positions: Board;
  onMove: (move: { from: [number, number]; to: [number, number]; isCapture: boolean }) => void;
};

function Square({ pos, value }: { pos: [number, number]; value: Cell }) {
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

export default function Chessboard({ positions, onMove }: ChessboardProps) {
  const handleDrop = (e: DragEvent, targetX: number, targetY: number) => {
    const fromStr = e.dataTransfer.getData('from');
    const [fromX, fromY] = fromStr.split(',').map(Number);

    const fromPiece = positions[fromY][fromX];
    const toPiece = positions[targetY][targetX];

    if (!fromPiece) return; // nothing to move

    onMove({
      from: [fromX, fromY],
      to: [targetX, targetY],
      isCapture: Boolean(toPiece),
    });
  };

  return (
    <div className='chessboard'>
      {
        positions.flat().map((piece, index) => {
          const x = index % 8;
          const y = Math.floor(index / 8);

          return (
            <div
              key={index}
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
