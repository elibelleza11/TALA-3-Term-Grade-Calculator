import React, { useState } from 'react';
import { calculateGoalAssessmentTarget, getDescriptor } from '../data/depedGrading';
import { Target, Sparkles, CheckCircle2, AlertCircle, Compass, Trophy, ArrowRight } from 'lucide-react';
import { playPop } from '../utils/audio';

interface GoalPlannerProps {
  currentWwPct: number;
  currentPtPct: number;
  learningAreaName: string;
  weights: {
    writtenWork: number;
    performanceTask: number;
    termAssessment: number;
  };
}

export const GoalPlannerSection: React.FC<GoalPlannerProps> = ({
  currentWwPct,
  currentPtPct,
  learningAreaName,
  weights
}) => {
  // Mode 1: Component Exam Goal Planner
  const [targetTransmuted, setTargetTransmuted] = useState<number>(90);
  const [examTotalPoints, setExamTotalPoints] = useState<number>(110); // ST1(30) + ST2(30) + TE(50)

  // Mode 2: Multi-term GWA Goal Planner
  const [term1Gwa, setTerm1Gwa] = useState<number | ''>(88);
  const [term2Gwa, setTerm2Gwa] = useState<number | ''>(89);
  const [targetAnnualGwa, setTargetAnnualGwa] = useState<number>(90);

  const goalCalculation = calculateGoalAssessmentTarget(
    targetTransmuted,
    weights,
    currentWwPct,
    currentPtPct,
    examTotalPoints
  );

  const targetDesc = getDescriptor(targetTransmuted);

  // Calculate required Term 3 GWA
  const t1 = typeof term1Gwa === 'number' ? term1Gwa : 0;
  const t2 = typeof term2Gwa === 'number' ? term2Gwa : 0;
  const neededTerm3 = Math.round(((targetAnnualGwa * 3) - t1 - t2) * 100) / 100;
  const isTerm3Feasible = neededTerm3 <= 100 && neededTerm3 >= 0;

  const presetTargets = [
    { label: 'Passing (75)', val: 75, badge: 'Developing', color: 'bg-amber-100 text-amber-800' },
    { label: 'Honor Baseline (80)', val: 80, badge: 'Connecting', color: 'bg-blue-100 text-blue-800' },
    { label: 'Benchmarking (85)', val: 85, badge: 'Benchmarking', color: 'bg-indigo-100 text-indigo-800' },
    { label: 'With Honors (90)', val: 90, badge: 'Advancing', color: 'bg-emerald-100 text-emerald-800' },
    { label: 'With High Honors (95)', val: 95, badge: 'Excellence', color: 'bg-purple-100 text-purple-800' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border-2 border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-2xl font-bold shadow-xs">
            🎯
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
              <span>Goal Planner</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Find out what score you need on your exam or next term to hit your goal!
            </p>
          </div>
        </div>

        <div className="text-xs font-bold px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <span>Active Subject: </span>
          <span className="font-extrabold">{learningAreaName}</span>
        </div>
      </div>

      {/* SECTION 1: Subject Exam Score Target Planner */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>Target 1: What exam score do I need for this term?</span>
          </h4>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Based on current WW ({(currentWwPct).toFixed(1)}%) &amp; PT ({(currentPtPct).toFixed(1)}%)
          </span>
        </div>

        {/* Target Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {presetTargets.map((item) => (
            <button
              key={item.val}
              type="button"
              onClick={() => {
                playPop();
                setTargetTransmuted(item.val);
              }}
              className={`btn-3d px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer border-b-4 select-none ${
                targetTransmuted === item.val
                  ? 'bg-indigo-600 text-white border-indigo-800 shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Goal Calculation Box */}
        <div
          className={`p-4 rounded-2xl border-2 transition-all ${
            goalCalculation.isFeasible
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500/50 text-emerald-950 dark:text-emerald-200'
              : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-500/50 text-amber-950 dark:text-amber-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Target: {targetTransmuted} ({targetDesc.level})
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-white/80 dark:bg-slate-800/80 shadow-2xs">
                  Req. Initial: {goalCalculation.targetInitialGrade}%
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold leading-snug">
                {goalCalculation.message}
              </p>
            </div>

            {goalCalculation.isFeasible && (
              <div className="shrink-0 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 text-center shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  Exam Score Needed
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-300">
                  {goalCalculation.neededRawPoints} / {examTotalPoints}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">
                  ({goalCalculation.neededAssessmentPct}%)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: 3-Term Annual GWA Planner */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Target 2: 3-Term GWA Planner for Academic Honors</span>
          </h4>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Terms 1 &amp; 2 → Term 3 Target
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          {/* Term 1 */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Term 1 GWA
            </label>
            <input
              type="number"
              min="60"
              max="100"
              value={term1Gwa}
              onChange={(e) =>
                setTerm1Gwa(
                  e.target.value === ''
                    ? ''
                    : Math.min(100, Math.max(0, parseFloat(e.target.value) || 0))
                )
              }
              placeholder="e.g. 88"
              className="w-full text-sm font-mono font-bold px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:border-indigo-500"
            />
          </div>

          {/* Term 2 */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Term 2 GWA
            </label>
            <input
              type="number"
              min="60"
              max="100"
              value={term2Gwa}
              onChange={(e) =>
                setTerm2Gwa(
                  e.target.value === ''
                    ? ''
                    : Math.min(100, Math.max(0, parseFloat(e.target.value) || 0))
                )
              }
              placeholder="e.g. 89"
              className="w-full text-sm font-mono font-bold px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:border-indigo-500"
            />
          </div>

          {/* Target Annual GWA */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Desired Final GWA
            </label>
            <select
              value={targetAnnualGwa}
              onChange={(e) => setTargetAnnualGwa(parseFloat(e.target.value))}
              className="w-full text-sm font-bold px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:border-indigo-500"
            >
              <option value={90}>90.00 (With Honors)</option>
              <option value={95}>95.00 (With High Honors)</option>
              <option value={98}>98.00 (With Highest Honors)</option>
              <option value={85}>85.00 (Benchmarking)</option>
              <option value={75}>75.00 (Passing)</option>
            </select>
          </div>

          {/* Term 3 Needed Result */}
          <div className="bg-indigo-50 dark:bg-indigo-950/60 p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-center">
            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 block uppercase">
              Needed in Term 3
            </span>
            <span
              className={`font-mono text-xl font-black ${
                isTerm3Feasible
                  ? 'text-indigo-900 dark:text-indigo-200'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {neededTerm3 > 0 ? neededTerm3.toFixed(2) : '--'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isTerm3Feasible ? (
            <span>
              💡 Formula: ({targetAnnualGwa} × 3) - {t1} - {t2} = <strong>{neededTerm3.toFixed(2)}</strong>. You need at least <strong>{neededTerm3.toFixed(2)}</strong> GWA in Term 3 (with no grade below 80 in any subject) to achieve your target!
            </span>
          ) : (
            <span className="text-rose-600 dark:text-rose-400 font-medium">
              ⚠️ Target {targetAnnualGwa} is not mathematically possible from Term 1 ({t1}) and Term 2 ({t2}) because Term 3 requires &gt; 100.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
