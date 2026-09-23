import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CalculationResult } from '../types';
import { playSuccessChime, playPop, playDoubleTap, playCelebrationChime } from '../utils/audio';
import { TaliTarsierMascot } from './TaliTarsierMascot';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Printer,
  Heart,
  Target,
  ChevronRight,
  Sparkle
} from 'lucide-react';

interface GradeRevealCardProps {
  isRevealed: boolean;
  onRevealClick: () => void;
  result: CalculationResult | null;
  onPrintClick: () => void;
  onRecalculateClick: () => void;
  onNavigateToGoalPlanner?: () => void;
  onViewTransmutation?: () => void;
}

export const GradeRevealCard: React.FC<GradeRevealCardProps> = ({
  isRevealed,
  onRevealClick,
  result,
  onPrintClick,
  onRecalculateClick,
  onNavigateToGoalPlanner,
  onViewTransmutation
}) => {
  const [showAdvancingSlideIn, setShowAdvancingSlideIn] = useState(false);
  const [screenTapped, setScreenTapped] = useState(false);
  const [developingHovered, setDevelopingHovered] = useState(false);

  const triggerConfetti = (isTopTier: boolean) => {
    try {
      if (isTopTier) {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899', '#FBBF24']
        });
        setTimeout(() => {
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 60,
            origin: { x: 0.1, y: 0.7 }
          });
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 60,
            origin: { x: 0.9, y: 0.7 }
          });
        }, 280);
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
    const isConnecting = result?.descriptor.level === 'Connecting' || result?.descriptor.level === 'Benchmarking';

    playSuccessChime(isAdvancing);
    triggerConfetti(isAdvancing || isConnecting);

    if (isAdvancing) {
      setShowAdvancingSlideIn(true);
    }
  };

  const handleScreenDoubleTap = () => {
    playDoubleTap();
    setScreenTapped(true);
    setTimeout(() => setScreenTapped(false), 800);
  };

  return (
    <div className="w-full relative">
      {/* 1. NOT YET REVEALED STATE */}
      {!isRevealed ? (
        <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl text-center relative overflow-hidden border-4 border-indigo-400">
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />

          <div className="max-w-xl mx-auto space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-indigo-50">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Assessment Ready for Analysis</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight">
              Ready to see your standing?
            </h2>

            <p className="text-sm sm:text-base text-indigo-100 font-medium">
              Your scores are ready! Click below to reveal your Initial Grade, Transmuted Grade, and Descriptor.
            </p>

            {/* Duolingo 3D Tactile Button */}
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

            <p className="text-xs text-indigo-200/90 pt-1 font-medium">
              🔒 100% Private · Computed directly on your device
            </p>
          </div>
        </div>
      ) : result ? (
        /* 2. REVEALED GRADE CARD */
        <div className="relative pt-6">
          {/* A. CONNECTING / BENCHMARKING PEEKING INTERACTION */}
          {/* "He peeks over the top of the Summary Report Card, playfully tapping the screen twice from the inside" */}
          {(result.descriptor.level === 'Connecting' || result.descriptor.level === 'Benchmarking') && (
            <div
              onClick={handleScreenDoubleTap}
              className="absolute -top-7 left-8 sm:left-12 z-30 cursor-pointer group flex items-end gap-2.5 transition-transform hover:-translate-y-1"
              title="Tap Tali to hear him tap the screen from inside!"
            >
              <div className="relative w-20 h-16 sm:w-24 sm:h-20 shrink-0">
                {/* Visual Tali peeking over card edge */}
                <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-md">
                  {/* Ears */}
                  <ellipse cx="22" cy="30" rx="14" ry="18" fill="#DDD6FE" stroke="#4338CA" strokeWidth="2" />
                  <ellipse cx="23" cy="30" rx="9" ry="13" fill="#FBCFE8" />
                  <ellipse cx="78" cy="30" rx="14" ry="18" fill="#DDD6FE" stroke="#4338CA" strokeWidth="2" />
                  <ellipse cx="77" cy="30" rx="9" ry="13" fill="#FBCFE8" />
                  {/* Head */}
                  <circle cx="50" cy="50" r="32" fill="#FAF7F5" stroke="#4338CA" strokeWidth="2.5" />
                  {/* Big Hazel Eyes */}
                  <ellipse cx="37" cy="46" rx="12" ry="13" fill="#FFFFFF" stroke="#4338CA" strokeWidth="2" />
                  <ellipse cx="63" cy="46" rx="12" ry="13" fill="#FFFFFF" stroke="#4338CA" strokeWidth="2" />
                  <circle cx="37" cy="46" r="9" fill="#F59E0B" />
                  <circle cx="63" cy="46" r="9" fill="#F59E0B" />
                  <circle cx="38" cy="46" r="6" fill="#1E1B4B" />
                  <circle cx="64" cy="46" r="6" fill="#1E1B4B" />
                  <circle cx="35" cy="43" r="2.5" fill="#FFFFFF" />
                  <circle cx="61" cy="43" r="2.5" fill="#FFFFFF" />
                  {/* Academic Glasses */}
                  <rect x="23" y="32" width="26" height="26" rx="13" stroke="#312E81" strokeWidth="2.5" fill="none" />
                  <rect x="51" y="32" width="26" height="26" rx="13" stroke="#312E81" strokeWidth="2.5" fill="none" />
                  <line x1="47" y1="44" x2="53" y2="44" stroke="#312E81" strokeWidth="2.5" />
                  {/* Paws resting on card edge & tapping glass */}
                  <ellipse cx="30" cy="74" rx="7" ry="5" fill="#C4B5FD" stroke="#312E81" strokeWidth="2" />
                  <ellipse cx="70" cy="74" rx="7" ry="5" fill="#C4B5FD" stroke="#312E81" strokeWidth="2" />
                  {/* Thumb sticking up */}
                  <rect x="73" y="65" width="4" height="8" rx="2" fill="#C4B5FD" stroke="#312E81" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Speech bubble: Solid work, you're right on track */}
              <div className="bg-indigo-900 text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-2xl shadow-lg border border-indigo-400/50 flex items-center gap-1.5 animate-bounce-subtle">
                <span className="text-amber-300">👓</span>
                <span>"Solid work, you're right on track!"</span>
                <span className="text-[10px] text-indigo-300 font-normal hidden sm:inline">(Tap to hear tap!)</span>
              </div>
            </div>
          )}

          {/* B. MAIN REPORT CARD */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border-3 border-emerald-500/80 shadow-xl relative overflow-hidden transition-all duration-500 animate-fadeIn">
            {/* Header */}
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
              {/* 1. Initial Grade (with DEVELOPING Tali interaction if applicable) */}
              <div
                className={`bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border-2 relative transition-all ${
                  result.descriptor.level === 'Developing'
                    ? 'border-amber-400 dark:border-amber-600 ring-2 ring-amber-200 dark:ring-amber-950'
                    : 'border-slate-200/80 dark:border-slate-700'
                } flex flex-col justify-between`}
                onMouseEnter={() => setDevelopingHovered(true)}
                onMouseLeave={() => setDevelopingHovered(false)}
              >
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider mb-2">
                  <span>Initial Grade</span>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">Raw Weighted</span>
                </div>

                <div className="my-2 flex items-baseline justify-between">
                  <div>
                    <span className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                      {result.initialGrade.toFixed(2)}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-bold text-sm ml-1">%</span>
                  </div>

                  {/* C. DEVELOPING INTERACTION: Tali with textbooks + flexed bicep thought bubble */}
                  {result.descriptor.level === 'Developing' && (
                    <div
                      className="cursor-pointer group flex items-center gap-1"
                      onClick={() => {
                        playPop();
                        onNavigateToGoalPlanner?.();
                      }}
                      title="Tali says: Building foundational skills takes effort! Click to open Goal Planner."
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                        <TaliTarsierMascot state="developing" compact size="sm" />
                      </div>
                    </div>
                  )}
                </div>

                {result.descriptor.level === 'Developing' ? (
                  <div className="pt-2 border-t border-amber-200/80 dark:border-amber-800/60 space-y-1">
                    <p className="text-[11px] text-amber-900 dark:text-amber-200 font-semibold leading-tight">
                      Foundational skills are being built! 💪
                    </p>
                    {onNavigateToGoalPlanner && (
                      <button
                        type="button"
                        onClick={() => {
                          playPop();
                          onNavigateToGoalPlanner();
                        }}
                        className="text-[11px] text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-bold flex items-center gap-1 underline underline-offset-2"
                      >
                        <span>Strategize in Goal Planner</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Combined weighted score from Written Works, Performance Tasks, and Summative Assessments.
                  </p>
                )}
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
                    {result.transmutedGrade >= 75 ? 'Passed ✓' : 'Needs Practice'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300/90 leading-snug">
                    SY 2026–2027 60-based transmutation.
                  </p>
                  {onViewTransmutation && (
                    <button
                      type="button"
                      onClick={() => {
                        playPop();
                        onViewTransmutation();
                      }}
                      className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 underline underline-offset-2 hover:text-emerald-900 cursor-pointer"
                    >
                      View Table →
                    </button>
                  )}
                </div>
              </div>

              {/* 3. DepEd Descriptor */}
              <div
                className="rounded-2xl p-5 border-2 flex flex-col justify-between shadow-sm relative"
                style={{
                  backgroundColor: result.descriptor.bgColor,
                  borderColor: result.descriptor.borderColor
                }}
              >
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2" style={{ color: result.descriptor.textColor }}>
                  <span>Descriptor</span>
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

            {/* D. EMERGING INTERACTION: Tali tugging on red banner with Red Panyo & "Let's plan!" Whiteboard */}
            {result.descriptor.level === 'Emerging' && (
              <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-400 dark:border-rose-600 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className="w-18 h-18 shrink-0">
                    <TaliTarsierMascot state="emerging" compact size="sm" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black uppercase text-rose-800 dark:text-rose-300">
                        Growth Mindset Active!
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200 rounded">
                        Red Panyo On 🔥
                      </span>
                    </div>
                    <p className="text-xs text-rose-900 dark:text-rose-200 font-medium mt-0.5 leading-snug">
                      Tali is tugging on the banner with his whiteboard: <strong>"Let's plan!"</strong> Find the exact score needed on your next Written Work or Performance Task to pass!
                    </p>
                  </div>
                </div>

                {onNavigateToGoalPlanner && (
                  <button
                    type="button"
                    onClick={() => {
                      playPop();
                      onNavigateToGoalPlanner();
                    }}
                    className="shrink-0 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Target className="w-4 h-4" />
                    <span>Target Grade Simulator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

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

          {/* E. ADVANCING SLIDE-IN FROM BOTTOM RIGHT: TOSSING DIGITAL CONFETTI ACROSS GREEN RESULT BANNER */}
          {result.descriptor.level === 'Advancing' && showAdvancingSlideIn && (
            <div className="fixed bottom-5 right-5 z-50 bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border-3 border-emerald-500 shadow-2xl max-w-sm w-full animate-slideInRight flex items-center gap-3">
              <div className="w-20 h-20 shrink-0">
                <TaliTarsierMascot state="advancing" compact size="sm" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 font-display">
                    🌟 Tali: Advancing Flip!
                  </span>
                  <button
                    onClick={() => setShowAdvancingSlideIn(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-200 font-medium leading-snug">
                  Spinning star eyes activated! Tossing confetti across your green result banner!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    playCelebrationChime();
                    triggerConfetti(true);
                  }}
                  className="mt-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Toss More Confetti!</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
