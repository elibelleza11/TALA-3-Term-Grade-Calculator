import React from 'react';
import confetti from 'canvas-confetti';
import { CalculationResult } from '../types';
import { playSuccessChime, playPop } from '../utils/audio';
import {
  Sparkles,
  Trophy,
  BookOpen,
  ArrowRight,
  Printer,
  Share2,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Heart
} from 'lucide-react';

interface GradeRevealCardProps {
  isRevealed: boolean;
  onRevealClick: () => void;
  result: CalculationResult | null;
  onPrintClick: () => void;
  onRecalculateClick: () => void;
}

export const GradeRevealCard: React.FC<GradeRevealCardProps> = ({
  isRevealed,
  onRevealClick,
  result,
  onPrintClick,
  onRecalculateClick
}) => {
  const triggerConfetti = (isTopTier: boolean) => {
    try {
      if (isTopTier) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899']
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 250);
      } else {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch {
      // Confetti fallback
    }
  };

  const handleReveal = () => {
    onRevealClick();
    const isAdvancing = result?.descriptor.level === 'Advancing';
    playSuccessChime(isAdvancing);
    triggerConfetti(isAdvancing || result?.descriptor.level === 'Benchmarking');
  };

  return (
    <div className="w-full">
      {/* If not yet revealed, show the giant interactive Duolingo-style REVEAL BUTTON */}
      {!isRevealed ? (
        <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl text-center relative overflow-hidden border-4 border-emerald-400">
          {/* Decorative background shapes */}
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-emerald-400/20 blur-xl pointer-events-none" />

          <div className="max-w-xl mx-auto space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-emerald-50">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Assessment Completed &amp; Ready</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight">
              Ready to see your standing?
            </h2>

            <p className="text-sm sm:text-base text-emerald-50 font-medium">
              We have compiled your Written Works, Performance Tasks, ST1, ST2, and Term Exam. Click below to reveal your Initial Grade, Transmuted Term Grade, and DepEd DO 15, s. 2026 Descriptor!
            </p>

            {/* Giant Duolingo 3D Tactile Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleReveal}
                className="w-full sm:w-auto px-8 py-4 sm:py-5 text-base sm:text-lg font-black uppercase tracking-wider rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-xl border-b-6 border-amber-600 active:border-b-0 active:translate-y-1.5 transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer"
              >
                <Sparkles className="w-6 h-6 text-amber-900 fill-amber-900 animate-spin-slow" />
                <span>🌟 REVEAL MY GRADES 🌟</span>
                <ArrowRight className="w-6 h-6 stroke-[3]" />
              </button>
            </div>

            <p className="text-xs text-emerald-100/90 pt-1 font-medium">
              🔒 Safe &amp; Private · Automatically recorded to community log report with privacy mask
            </p>
          </div>
        </div>
      ) : result ? (
        /* The REVEALED GRADE CARD */
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border-3 border-emerald-500/80 shadow-xl relative overflow-hidden transition-all duration-500 animate-fadeIn">
          {/* Top banner header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-sm"
                style={{ backgroundColor: result.descriptor.bgColor, color: result.descriptor.color }}
              >
                {result.descriptor.icon}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Official DepEd Standing · {result.term}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-display">
                  {result.learningAreaName}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playPop();
                  onPrintClick();
                }}
                className="px-3 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl transition-colors border border-slate-300 dark:border-slate-600 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title="Print or save DepEd Grade Slip"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Slip</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPop();
                  handleReveal();
                }}
                className="px-3 py-2 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-xl transition-colors border border-emerald-200 dark:border-emerald-700 flex items-center gap-1.5 cursor-pointer"
                title="Celebrate again"
              >
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Celebrate</span>
              </button>
            </div>
          </div>

          {/* Central Grade Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {/* 1. Initial Grade */}
            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border-2 border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider mb-2">
                <span>Initial Grade</span>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">Raw Weighted</span>
              </div>
              <div className="my-2">
                <span className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                  {result.initialGrade.toFixed(2)}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-bold text-sm ml-1">%</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                Combined weighted score from Written Works, Performance Tasks, and Summative Assessments.
              </p>
            </div>

            {/* 2. Transmuted Term Grade (Center Stage) */}
            <div className="bg-gradient-to-b from-emerald-50 to-teal-50/50 dark:from-emerald-950/40 dark:to-teal-950/30 rounded-2xl p-5 border-3 border-emerald-500 flex flex-col justify-between shadow-sm relative">
              <div className="absolute -top-3 right-4 px-2.5 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                Official Term Grade
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-300 font-bold uppercase tracking-wider mb-2">
                <span>Transmuted Grade</span>
                <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">DepEd Scale</span>
              </div>
              <div className="my-2 flex items-baseline gap-2">
                <span className="font-mono text-4xl sm:text-5xl font-black text-emerald-700 dark:text-emerald-300 tracking-tight">
                  {result.transmutedGrade}
                </span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                  {result.transmutedGrade >= 75 ? 'Passed ✓' : 'Intervention Needed'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300/90 leading-snug">
                Transmuted using the official Philippine DepEd 100-point Transmutation Table.
              </p>
            </div>

            {/* 3. DepEd DO 15, s. 2026 Descriptor */}
            <div
              className="rounded-2xl p-5 border-2 flex flex-col justify-between shadow-sm"
              style={{
                backgroundColor: result.descriptor.bgColor,
                borderColor: result.descriptor.borderColor
              }}
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2" style={{ color: result.descriptor.textColor }}>
                <span>DO 15, s. 2026 Descriptor</span>
                <span className="text-sm">{result.descriptor.icon}</span>
              </div>
              <div className="my-2">
                <span
                  className="text-2xl sm:text-3xl font-extrabold font-display leading-tight block"
                  style={{ color: result.descriptor.textColor }}
                >
                  {result.descriptor.level}
                </span>
                <span className="text-xs font-semibold opacity-90 block mt-0.5" style={{ color: result.descriptor.textColor }}>
                  Scale: {result.descriptor.minGrade} – {result.descriptor.maxGrade}
                </span>
              </div>
              <p className="text-[11px] leading-snug" style={{ color: result.descriptor.textColor }}>
                {result.descriptor.summary}
              </p>
            </div>
          </div>

          {/* Component Breakdown Progress Bars */}
          <div className="bg-slate-50/90 dark:bg-slate-900/60 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 mb-6">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Component Performance Breakdown
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* WW */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Written Works (WW)</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                    {result.wwPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, result.wwPercentage)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
                  Weighted: {result.wwWeighted.toFixed(2)} pts
                </span>
              </div>

              {/* PT */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Performance Tasks (PT)</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {result.ptPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, result.ptPercentage)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
                  Weighted: {result.ptWeighted.toFixed(2)} pts
                </span>
              </div>

              {/* ST & TE */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">ST1, ST2 &amp; Term Exam</span>
                  <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
                    {result.termAssessmentPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, result.termAssessmentPercentage)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
                  Weighted: {result.termAssessmentWeighted.toFixed(2)} pts
                </span>
              </div>
            </div>
          </div>

          {/* Meaningful Interpretation & Advice for Students & Parents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Advice */}
            <div className="bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <h5 className="text-xs font-bold text-emerald-950 dark:text-emerald-200 uppercase tracking-wider">
                  Advice for the Student
                </h5>
              </div>
              <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-300 leading-relaxed font-medium">
                {result.descriptor.studentAdvice}
              </p>
            </div>

            {/* Parent Guidance */}
            <div className="bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Heart className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <h5 className="text-xs font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wider">
                  Guidance for Parents &amp; Guardians
                </h5>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-300 leading-relaxed font-medium">
                {result.descriptor.parentAdvice}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
