import React, { useState } from 'react';
import { AcademicTerm } from '../types';
import { calculateMapehAverage, getDescriptor } from '../data/depedGrading';
import { playPop } from '../utils/audio';
import { Palette, Activity, Award, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface MapehAveragingCardProps {
  currentTerm?: AcademicTerm;
  onApplyToTerm?: (mapehGrade: number) => void;
}

export const MapehAveragingCard: React.FC<MapehAveragingCardProps> = ({ currentTerm = 'Term 1', onApplyToTerm }) => {
  const [musicArtsGrade, setMusicArtsGrade] = useState<number | ''>(88);
  const [peHealthGrade, setPeHealthGrade] = useState<number | ''>(92);

  const mGrade = typeof musicArtsGrade === 'number' ? musicArtsGrade : 0;
  const pGrade = typeof peHealthGrade === 'number' ? peHealthGrade : 0;

  const hasInputs = typeof musicArtsGrade === 'number' && typeof peHealthGrade === 'number';
  const mapehAverage = hasInputs ? calculateMapehAverage(mGrade, pGrade) : null;
  const descriptor = mapehAverage ? getDescriptor(mapehAverage) : null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border-2 border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center text-xl font-bold">
            🎨
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white font-display">
              MAPEH Composite Grade Calculator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pursuant to DepEd Guidelines: <strong>Music & Arts</strong> and <strong>PE & Health</strong> are computed separately, and their average forms the official MAPEH grade.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-50 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-full border border-amber-200 dark:border-amber-700">
          (Music & Arts + PE & Health) ÷ 2
        </span>
      </div>

      {/* Interactive Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Component 1: Music & Arts */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Palette className="w-4 h-4 text-purple-600" />
            <span>1. Music and Arts</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="50"
              max="100"
              value={musicArtsGrade}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0));
                setMusicArtsGrade(val);
              }}
              placeholder="e.g. 88"
              className="w-full text-lg font-mono font-bold px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:border-emerald-500 focus:outline-none text-slate-900 dark:text-white"
            />
            <span className="text-xs text-slate-400 font-bold">%</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Computed from WW (20%), PT (60%), and Exams (20%)
          </p>
        </div>

        {/* Component 2: PE and Health */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>2. PE and Health</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="50"
              max="100"
              value={peHealthGrade}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0));
                setPeHealthGrade(val);
              }}
              placeholder="e.g. 92"
              className="w-full text-lg font-mono font-bold px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:border-emerald-500 focus:outline-none text-slate-900 dark:text-white"
            />
            <span className="text-xs text-slate-400 font-bold">%</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Physical activities, fitness workouts, wellness units
          </p>
        </div>

        {/* Result: MAPEH Composite */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 p-4 rounded-2xl border-2 border-emerald-500 flex flex-col justify-between shadow-2xs relative">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-1">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Official MAPEH Grade</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-1.5 py-0.5 rounded">
              Report Card SF9
            </span>
          </div>

          <div className="my-1.5 flex items-baseline gap-2">
            <span className="font-mono text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-300">
              {mapehAverage !== null ? mapehAverage : '--'}
            </span>
            {descriptor && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-md"
                style={{ backgroundColor: descriptor.bgColor, color: descriptor.textColor }}
              >
                {descriptor.level}
              </span>
            )}
          </div>

          <div className="text-[11px] text-emerald-800 dark:text-emerald-300">
            {hasInputs ? (
              <span>
                Formula: ({mGrade} + {pGrade}) ÷ 2 = <strong>{((mGrade + pGrade) / 2).toFixed(1)}</strong> (Rounded: <strong>{mapehAverage}</strong>)
              </span>
            ) : (
              <span>Enter both Music & Arts and PE & Health above</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
