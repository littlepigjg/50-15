import React, { useMemo } from 'react';
import type { CellType, Direction, EditorTool, Position } from '../../engine/types';
import { positionEquals } from '../../engine/GameEngine';

interface EditorGridProps {
  width: number;
  height: number;
  grid: CellType[][];
  start: Position;
  goal: Position;
  stars: Position[];
  startDirection: Direction;
  tool: EditorTool;
  onCellClick: (x: number, y: number) => void;
}

const WallCell: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center"
    style={{ background: `linear-gradient(to bottom right, var(--wall-from), var(--wall-to))` }}
  >
    <div className="w-3/4 h-3/4 rounded-sm"
      style={{ background: `linear-gradient(to bottom right, var(--wall-from), var(--wall-to))`, opacity: 0.8 }}
    />
  </div>
);

const PitCell: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-4/5 h-4/5 rounded-full flex items-center justify-center text-red-400"
      style={{
        background: `linear-gradient(to bottom right, var(--pit-from), var(--pit-to))`,
        border: '2px solid var(--pit-border)',
      }}
    >
      ⚠
    </div>
  </div>
);

const StartMarker: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
    <div className="w-4/5 h-4/5 rounded-lg border-2 border-dashed flex items-center justify-center"
      style={{ borderColor: 'var(--start-border)', backgroundColor: 'var(--start-bg)' }}
    >
      <span className="text-xs font-bold" style={{ color: 'var(--start-border)' }}>起</span>
    </div>
  </div>
);

const GoalMarker: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-pulse z-10">
    <div className="w-4/5 h-4/5 rounded-lg flex items-center justify-center shadow-md"
      style={{ background: `linear-gradient(to bottom right, var(--goal-from), var(--goal-to))` }}
    >
      <span className="text-xl">🏁</span>
    </div>
  </div>
);

const StarMarker: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 animate-bounce-slow">
    <svg width="60%" height="60%" viewBox="0 0 24 24" className="drop-shadow-md">
      <defs>
        <linearGradient id="editorStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--star-from)" />
          <stop offset="100%" stopColor="var(--star-to)" />
        </linearGradient>
      </defs>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="url(#editorStarGrad)"
        stroke="var(--star-stroke)"
        strokeWidth="0.5"
      />
    </svg>
  </div>
);

const DirectionIndicator: React.FC<{ direction: Direction }> = ({ direction }) => {
  const rotations: Record<Direction, number> = {
    0: 0,
    1: 90,
    2: 180,
    3: 270,
  };
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
      style={{ transform: `rotate(${rotations[direction]}deg)` }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5">
        <div
          className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-transparent drop-shadow-sm"
          style={{ borderBottomColor: 'var(--start-border)' }}
        />
      </div>
    </div>
  );
};

export const EditorGrid: React.FC<EditorGridProps> = ({
  width,
  height,
  grid,
  start,
  goal,
  stars,
  startDirection,
  tool,
  onCellClick,
}) => {
  const cellSize = useMemo(() => {
    return Math.min(48, Math.floor(500 / Math.max(width, height)));
  }, [width, height]);

  const starKeys = useMemo(() => {
    const set = new Set<string>();
    stars.forEach((s) => set.add(`${s.x},${s.y}`));
    return set;
  }, [stars]);

  return (
    <div className="flex justify-center overflow-auto p-4 rounded-xl border shadow-inner"
      style={{
        backgroundColor: 'rgb(var(--theme-surface))',
        borderColor: 'rgb(var(--theme-border))',
      }}
    >
      <div
        className="relative border-2 rounded-lg overflow-hidden shadow-lg"
        style={{
          width: width * cellSize,
          height: height * cellSize,
          backgroundColor: 'rgb(var(--grid-inner-bg))',
          borderColor: 'rgb(var(--grid-border))',
        }}
      >
        {grid.map((row, y) =>
          row.map((cell, x) => {
            const pos = { x, y };
            const isStart = positionEquals(pos, start);
            const isGoal = positionEquals(pos, goal);
            const hasStar = starKeys.has(`${x},${y}`);

            return (
              <div
                key={`editor-cell-${x}-${y}`}
                onClick={() => onCellClick(x, y)}
                className="absolute cell-hover transition-colors duration-100"
                style={{
                  left: x * cellSize,
                  top: y * cellSize,
                  width: cellSize,
                  height: cellSize,
                  border: '0.5px solid rgb(var(--grid-border) / 0.6)',
                  backgroundColor: (x + y) % 2 === 0
                    ? 'rgb(var(--grid-cell-a))'
                    : 'rgb(var(--grid-cell-b))',
                  cursor: tool === 'select' ? 'default' : 'pointer',
                }}
              >
                {cell === 'wall' && <WallCell />}
                {cell === 'pit' && <PitCell />}

                {isStart && <StartMarker />}
                {isStart && <DirectionIndicator direction={startDirection} />}
                {isGoal && <GoalMarker />}
                {hasStar && <StarMarker />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EditorGrid;
