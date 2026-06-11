import React, { useMemo } from 'react';
import type { Level } from '../engine/types';
import { LEVELS } from '../engine/levels';
import { loadProgress, isLevelUnlocked } from '../engine/storage';

interface LevelSelectProps {
  onSelectLevel: (level: Level) => void;
  onOpenEditor: () => void;
  onImportLevel: () => void;
  customLevels: Level[];
}

const DifficultyBadge: React.FC<{ difficulty: number }> = ({ difficulty }) => {
  const colors = [
    'bg-green-100 text-green-700',
    'bg-green-100 text-green-700',
    'bg-primary-100 text-primary-700',
    'bg-primary-100 text-primary-700',
    'bg-purple-100 text-purple-700',
    'bg-purple-100 text-purple-700',
    'bg-orange-100 text-orange-700',
    'bg-red-100 text-red-700',
  ];
  const color = colors[Math.min(difficulty, colors.length - 1)];
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>
      {'★'.repeat(Math.min(difficulty, 5))}
    </span>
  );
};

export const LevelSelect: React.FC<LevelSelectProps> = ({
  onSelectLevel,
  onOpenEditor,
  onImportLevel,
  customLevels,
}) => {
  const progress = useMemo(() => loadProgress(), []);
  const allLevels = useMemo(() => [...LEVELS, ...customLevels], [customLevels]);

  const [filter, setFilter] = React.useState<'all' | 'main' | 'custom'>('all');

  const displayedLevels = useMemo(() => {
    if (filter === 'main') return LEVELS;
    if (filter === 'custom') return customLevels;
    return allLevels;
  }, [filter, LEVELS, customLevels, allLevels]);

  const totalCompleted = useMemo(() => {
    return LEVELS.filter((l) => progress[l.id]?.completed).length;
  }, [progress]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="game-card p-8 mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-6xl">🤖</span>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                CodeRobot
              </h1>
              <p className="text-themed-text-secondary mt-1">图形化编程解谜游戏</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">
                {totalCompleted}/{LEVELS.length}
              </div>
              <div className="text-sm text-themed-text-secondary">关卡完成</div>
            </div>
            <div className="w-px h-12 bg-themed-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">
                {LEVELS.reduce((acc, l) => acc + (progress[l.id]?.starsCollected || 0), 0)}
                /
                {LEVELS.reduce((acc, l) => acc + l.stars.length, 0)}
              </div>
              <div className="text-sm text-themed-text-secondary">星星收集</div>
            </div>
            <div className="w-px h-12 bg-themed-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">{customLevels.length}</div>
              <div className="text-sm text-themed-text-secondary">自定义关卡</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center mt-8">
            <button onClick={onOpenEditor} className="btn-primary">
              🎨 关卡编辑器
            </button>
            <button onClick={onImportLevel} className="btn-secondary">
              📥 导入关卡
            </button>
          </div>
        </div>

        <div className="game-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-themed-text">选择关卡</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${filter === 'all' ? 'bg-primary-500 text-white' : 'bg-themed-surface-hover text-themed-text-secondary hover:bg-themed-surface-tertiary'}`}
              >
                全部
              </button>
              <button
                onClick={() => setFilter('main')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${filter === 'main' ? 'bg-primary-500 text-white' : 'bg-themed-surface-hover text-themed-text-secondary hover:bg-themed-surface-tertiary'}`}
              >
                官方
              </button>
              <button
                onClick={() => setFilter('custom')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${filter === 'custom' ? 'bg-primary-500 text-white' : 'bg-themed-surface-hover text-themed-text-secondary hover:bg-themed-surface-tertiary'}`}
              >
                自定义
              </button>
            </div>
          </div>

          {displayedLevels.length === 0 ? (
            <div className="text-center py-12 text-themed-text-muted">
              <div className="text-6xl mb-4">📭</div>
              <p>暂无{filter === 'custom' ? '自定义' : ''}关卡</p>
              {filter === 'custom' && (
                <p className="text-sm mt-2">使用关卡编辑器创建你的第一个关卡吧！</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayedLevels.map((level) => {
                const levelProgress = progress[level.id];
                const unlocked = isLevelUnlocked(level.id, allLevels) || customLevels.some(l => l.id === level.id);
                const completed = levelProgress?.completed;
                const isCustom = customLevels.some(l => l.id === level.id);

                return (
                  <button
                    key={level.id}
                    onClick={() => unlocked && onSelectLevel(level)}
                    disabled={!unlocked}
                    className={`
                      relative p-4 rounded-xl border-2 transition-all duration-200
                      ${unlocked
                        ? 'bg-themed-surface hover:scale-105 hover:shadow-lg cursor-pointer border-themed-border hover:border-primary-400'
                        : 'bg-themed-surface-alt cursor-not-allowed border-themed-border opacity-60'
                      }
                      ${completed ? 'border-green-400 bg-green-50/30' : ''}
                    `}
                  >
                    {isCustom && (
                      <span className="absolute top-1 right-1 text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">
                        自定义
                      </span>
                    )}

                    <div className="flex items-start justify-between mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold shadow-md">
                        {unlocked ? (
                          isCustom ? '✎' : level.id.split('-')[1] || '?'
                        ) : (
                          '🔒'
                        )}
                      </div>
                      <DifficultyBadge difficulty={level.difficulty} />
                    </div>

                    <h3 className="text-sm font-bold text-themed-text text-left truncate mb-1">
                      {level.name}
                    </h3>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex gap-0.5">
                        {level.stars.length > 0 ? (
                          Array.from({ length: level.stars.length }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                (levelProgress?.starsCollected || 0) > i
                                  ? 'text-yellow-400'
                                  : 'text-themed-text-muted'
                              }`}
                            >
                              ★
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-themed-text-muted">无星</span>
                        )}
                      </div>
                      {completed && (
                        <span className="text-green-500 text-sm">✓</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-themed-text-inverse/70 text-sm">
          💡 提示：使用拖拽指令块的方式编程，控制机器人到达终点并收集所有星星
        </div>
      </div>
    </div>
  );
};

export default LevelSelect;
