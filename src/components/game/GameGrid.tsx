import React, { useMemo } from 'react';
import type { CellType, Direction, Level, Position, RobotState } from '../../engine/types';
import { positionEquals } from '../../engine/GameEngine';

interface GameGridProps {
  level: Level;
  robotState: RobotState;
  collectedStars: Position[];
  cellSize?: number;
  isAnimating?: boolean;
}

const DIRECTION_ROTATION: Record<Direction, number> = {
  0: -90,
  1: 0,
  2: 90,
  3: 180,
};

const CellContent: React.FC<{ type: CellType }> = ({ type }) => {
  switch (type) {
    case 'wall':
      return (
        <div className="w-full h-full rounded-sm flex items-center justify-center"
          style={{ background: `linear-gradient(to bottom right, var(--wall-from), var(--wall-to))` }}
        >
          <div className="w-3/4 h-3/4 rounded-sm border"
            style={{
              background: `linear-gradient(to bottom right, var(--wall-from), var(--wall-to))`,
              borderColor: 'var(--pit-border)',
              opacity: 0.8,
            }}
          />
        </div>
      );
    case 'pit':
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-4/5 h-4/5 rounded-full shadow-inner"
            style={{
              background: `linear-gradient(to bottom right, var(--pit-from), var(--pit-to))`,
              border: `2px solid var(--pit-border)`,
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-red-500 text-xs">
              ⚠
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const Robot: React.FC<{ direction: Direction; size: number }> = ({ direction, size }) => {
  const rotation = DIRECTION_ROTATION[direction];
  const robotSize = size * 0.7;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out z-20"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <svg
        width={robotSize}
        height={robotSize}
        viewBox="0 0 64 64"
        className="drop-shadow-lg"
      >
        <defs>
          <linearGradient id="robotBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--robot-body-from)" />
            <stop offset="100%" stopColor="var(--robot-body-to)" />
          </linearGradient>
          <linearGradient id="robotHead" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--robot-head-from)" />
            <stop offset="100%" stopColor="var(--robot-head-to)" />
          </linearGradient>
        </defs>
        <ellipse cx="32" cy="52" rx="18" ry="6" fill="rgba(0,0,0,0.2)" />
        <rect x="14" y="28" width="36" height="24" rx="4" fill="url(#robotBody)" />
        <circle cx="32" cy="20" r="14" fill="url(#robotHead)" />
        <rect x="22" y="34" width="20" height="10" rx="2" fill="var(--robot-dark)" />
        <circle cx="26" cy="18" r="3" fill="#fff" />
        <circle cx="38" cy="18" r="3" fill="#fff" />
        <circle cx="26" cy="18" r="1.5" fill="var(--robot-dark)" />
        <circle cx="38" cy="18" r="1.5" fill="var(--robot-dark)" />
        <path d="M56 32 L62 32 M62 32 L58 28 M62 32 L58 36" stroke="var(--robot-antenna)" strokeWidth="3" strokeLinecap="round" fill="none" />
        <rect x="18" y="40" width="4" height="8" rx="1" fill="var(--robot-arm)" />
        <rect x="42" y="40" width="4" height="8" rx="1" fill="var(--robot-arm)" />
      </svg>
    </div>
  );
};

const Star: React.FC<{ collected?: boolean; justCollected?: boolean }> = ({
  collected,
  justCollected,
}) => (
  <div
    className={`absolute inset-0 flex items-center justify-center z-10 transition-all duration-500
      ${collected ? 'opacity-0 scale-0' : 'opacity-100'}
      ${justCollected ? 'animate-pop scale-150' : 'animate-bounce-slow'}
    `}
  >
    <svg
      width="60%"
      height="60%"
      viewBox="0 0 24 24"
      className="drop-shadow-md"
    >
      <defs>
        <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--star-from)" />
          <stop offset="100%" stopColor="var(--star-to)" />
        </linearGradient>
      </defs>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="url(#starGrad)"
        stroke="var(--star-stroke)"
        strokeWidth="0.5"
      />
    </svg>
  </div>
);

const Goal: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center z-0">
    <div className="w-4/5 h-4/5 rounded-lg flex items-center justify-center animate-pulse"
      style={{ background: `linear-gradient(to bottom right, var(--goal-from), var(--goal-to))` }}
    >
      <span className="text-white text-xl font-bold drop-shadow">🏁</span>
    </div>
  </div>
);

const Start: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center z-0">
    <div className="w-4/5 h-4/5 rounded-lg border-2 border-dashed flex items-center justify-center"
      style={{ borderColor: 'var(--start-border)', backgroundColor: 'var(--start-bg)' }}
    >
      <span className="text-sm font-bold" style={{ color: 'var(--start-border)' }}>起</span>
    </div>
  </div>
);

export const GameGrid: React.FC<GameGridProps> = ({
  level,
  robotState,
  collectedStars,
  cellSize = 60,
}) => {
  const { grid, width, height, start, goal, stars } = level;

  const cells = useMemo(() => {
    const result: { x: number; y: number; type: CellType }[] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        result.push({ x, y, type: grid[y][x] });
      }
    }
    return result;
  }, [grid, width, height]);

  const collectedIds = useMemo(() => {
    const set = new Set<string>();
    collectedStars.forEach((p) => set.add(`${p.x},${p.y}`));
    return set;
  }, [collectedStars]);

  const starIds = useMemo(() => {
    const set = new Set<string>();
    stars.forEach((p) => set.add(`${p.x},${p.y}`));
    return set;
  }, [stars]);

  return (
    <div
      className="relative rounded-2xl p-2 shadow-inner"
      style={{
        width: width * cellSize + 16,
        height: height * cellSize + 16,
        background: `linear-gradient(to bottom right, rgb(var(--grid-bg-from)), rgb(var(--grid-bg-to)))`,
      }}
    >
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          width: width * cellSize,
          height: height * cellSize,
          backgroundColor: 'rgb(var(--grid-inner-bg))',
        }}
      >
        {cells.map(({ x, y, type }) => (
          <div
            key={`cell-${x}-${y}`}
            className="absolute"
            style={{
              left: x * cellSize,
              top: y * cellSize,
              width: cellSize,
              height: cellSize,
              border: '0.5px solid rgb(var(--grid-border) / 0.5)',
              backgroundColor: (x + y) % 2 === 0
                ? 'rgb(var(--grid-cell-a))'
                : 'rgb(var(--grid-cell-b))',
            }}
          >
            <CellContent type={type} />

            {positionEquals({ x, y }, start) && <Start />}

            {positionEquals({ x, y }, goal) && <Goal />}

            {starIds.has(`${x},${y}`) && (
              <Star
                collected={collectedIds.has(`${x},${y}`)}
                justCollected={false}
              />
            )}
          </div>
        ))}

        <div
          className="absolute transition-all duration-300 ease-in-out"
          style={{
            left: robotState.position.x * cellSize,
            top: robotState.position.y * cellSize,
            width: cellSize,
            height: cellSize,
          }}
        >
          <Robot direction={robotState.direction} size={cellSize} />
        </div>
      </div>
    </div>
  );
};

export default GameGrid;
