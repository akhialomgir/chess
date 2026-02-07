import './Chessboard.css';
import type { Cell, Board, Position } from '../types/chess';
import { pieceSprite } from '../utils/pieceAssets';
import { inBounds, getLegalMoves } from '../utils/pieceMove';
import { useState, useRef } from 'react';

type ChessboardProps = {
  positions: Board;
  onMove: (move: { from: [number, number]; to: [number, number]; isCapture: boolean }) => void;
};

function Square({ pos, value, isDragging, isAvailable }: { pos: [number, number]; value: Cell; isDragging?: boolean; isAvailable?: boolean }) {
  const pieceSrc = value ? pieceSprite[value] : null;
  const [x, y] = pos;
  const isDark = (x + y) & 1;

  const fileLabel = String.fromCharCode(97 + x); // a-h
  const rankLabel = 8 - y; // 8-1

  return (
    <div className={`board-square ${isDark ? 'dark' : 'light'} ${isAvailable ? 'available' : ''}`}>
      {pieceSrc && <img src={pieceSrc} alt={`${value} piece`} draggable={false} style={{ opacity: isDragging ? 0.3 : 1 }} />}
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
  const [fromSrc, setFromSrc] = useState<{ fromX?: number; fromY?: number } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [availablePositions, setAvailablePositions] = useState<Position[]>([]);

  const clearDragState = () => {
    setFromSrc(null);
    setAvailablePositions([]);
    setMousePos(null);
  };

  const handleMouseDown = (fromX: number, fromY: number, fromPiece: Cell) => {
    if (!fromPiece) return;
    const legalMoves = getLegalMoves(fromPiece, [fromX, fromY], positions);
    setAvailablePositions(legalMoves.map(move => move.to));
    setFromSrc({ fromX, fromY });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (fromSrc) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleBoardPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!fromSrc || fromSrc.fromX === undefined || fromSrc.fromY === undefined || !boardRef.current) {
      clearDragState();
      return;
    }

    const rect = boardRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;

    const squareSize = rect.width / 8;
    const toX = Math.floor(relativeX / squareSize);
    const toY = Math.floor(relativeY / squareSize);
    if (!inBounds(toX, toY)) {
      clearDragState();
      return;
    }

    const fromX = fromSrc.fromX;
    const fromY = fromSrc.fromY;

    if (fromX === toX && fromY === toY) {
      clearDragState();
      return;
    }

    const toPiece = positions[toY][toX];

    onMove({
      from: [fromX, fromY],
      to: [toX, toY],
      isCapture: Boolean(toPiece),
    });

    clearDragState();
  };

  const draggingPiece = fromSrc && fromSrc.fromX !== undefined && fromSrc.fromY !== undefined
    ? positions[fromSrc.fromY][fromSrc.fromX]
    : null;

  return (
    <div className='chessboard' ref={boardRef} onPointerMove={handlePointerMove} onPointerUp={handleBoardPointerUp}>
      {
        positions.flat().map((piece, index) => {
          const x = index % 8;
          const y = Math.floor(index / 8);
          const isDragging = fromSrc && fromSrc.fromX === x && fromSrc.fromY === y;

          return (
            <div
              key={index}
              onPointerDown={() => handleMouseDown(x, y, piece)}
            >
              <Square key={index} pos={[x, y]} value={piece} isDragging={!!isDragging} isAvailable={availablePositions.some(pos => pos[0] === x && pos[1] === y)} />
            </div>
          )
        })
      }
      {draggingPiece && mousePos && (
        <img
          src={pieceSprite[draggingPiece]}
          alt="dragging piece"
          className="dragging-piece"
          style={{
            position: 'fixed',
            left: mousePos.x,
            top: mousePos.y,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 1000,
            width: '5em',
          }}
        />
      )}
    </div>
  )
}
