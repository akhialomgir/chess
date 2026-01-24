import './MoveList.css';
import type { MoveRecord } from '../types/chess';

type MoveListProps = {
  moves: MoveRecord[];
  currentStep: number;
  onJumpTo: (step: number) => void;
};

function posToNotation(pos: [number, number]): string {
  const [x, y] = pos;
  const file = String.fromCharCode(97 + x); // a-h
  const rank = 8 - y; // 8-1
  return `${file}${rank}`;
}

export default function MoveList({ moves, currentStep, onJumpTo }: MoveListProps) {
  return (
    <div className="movelist">
      {moves.length === 0 ? (
        <p>No moves yet</p>
      ) : (
        <ol>
          <li
            onClick={() => onJumpTo(0)}
            className={currentStep === 0 ? 'current' : ''}
          >
            Dummy Start
          </li>
          {moves.map((move, index) => (
            <li
              key={index}
              onClick={() => onJumpTo(index + 1)}
              className={currentStep === index + 1 ? 'current' : ''}
            >
              {move.piece}:{posToNotation(move.from)}-&gt;{posToNotation(move.to)}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
