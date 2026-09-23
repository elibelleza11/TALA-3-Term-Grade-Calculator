import React from 'react';
import { DESCRIPTORS_CONFIG } from '../data/depedGrading';
import { DescriptorLevel } from '../types';
import { HelpCircle, Check, Award, ArrowUpRight } from 'lucide-react';

interface DescriptorsLegendProps {
  currentLevel?: DescriptorLevel;
}

export const DescriptorsLegend: React.FC<DescriptorsLegendProps> = ({ currentLevel }) => {
  const levels: DescriptorLevel[] = [
    'Advancing',
    'Benchmarking',
    'Connecting',
    'Developing',
    'Emerging'
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border-2 border-slate-200/90 dark:border-slate-700 shadow-sm transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100 dark:border-slate-700">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white font-display">
              Descriptors
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Five levels showing how your child or student is doing.
          </p>
        </div>

        <div className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-600">
          DepEd Scale
        </div>
      </div>

      {/* Grid of 5 official descriptors */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
        {levels.map((levelKey) => {
          const item = DESCRIPTORS_CONFIG[levelKey];
          const isHighlighted = currentLevel === levelKey;

          return (
            <div
              key={levelKey}
              className={`rounded-2xl p-4 border-2 transition-all relative flex flex-col justify-between ${
                isHighlighted
                  ? 'ring-4 ring-offset-2 scale-102 shadow-md'
                  : 'hover:shadow-xs'
              }`}
              style={{
                backgroundColor: item.bgColor,
                borderColor: item.borderColor
              }}
            >
              {isHighlighted && (
                <div
                  className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-white shadow-xs"
                  style={{ backgroundColor: item.color }}
                >
                  Your Level
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-2xl">{item.icon}</span>
                  <span
                    className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-white/70 shadow-2xs"
                    style={{ color: item.color }}
                  >
                    {item.minGrade}–{item.maxGrade}
                  </span>
                </div>

                <h4
                  className="font-black text-sm font-display mb-1"
                  style={{ color: item.textColor }}
                >
                  {item.level}
                </h4>

                <p
                  className="text-[11px] leading-relaxed font-medium"
                  style={{ color: item.textColor }}
                >
                  {item.summary}
                </p>
              </div>

              <div
                className="mt-3 pt-2 border-t border-black/10 text-[10px] font-bold"
                style={{ color: item.color }}
              >
                {item.level === 'Advancing' && '★ Honors Candidate Range'}
                {item.level === 'Benchmarking' && '✓ Expected Grade-Level Skills'}
                {item.level === 'Connecting' && '✓ Passing Threshold (75+)'}
                {item.level === 'Developing' && '! Targeted Support Needed'}
                {item.level === 'Emerging' && '! Intensive Support Needed'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
