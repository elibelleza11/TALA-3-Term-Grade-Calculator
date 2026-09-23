import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Award,
  Target,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Copy,
  Check,
  Calculator
} from 'lucide-react';
import { playPop, playSuccessChime, playDoubleTap } from '../utils/audio';
import { transmuteGrade, getDescriptor } from '../data/depedGrading';
import { TaliTarsierMascot } from './TaliTarsierMascot';

export const PassingScoreFinder: React.FC = () => {
  // Total Score (Highest Possible Score - HPS)
  const [totalItems, setTotalItems] = useState<number | ''>(50);

  // Optional "Check My Score" simulator
  const [myScore, setMyScore] = useState<number | ''>(35);

  // Copied alert state
  const [copied, setCopied] = useState<boolean>(false);

  // Preset quick-select chips
  const presets = [10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 100];

  const total = typeof totalItems === 'number' && totalItems > 0 ? totalItems : 0;
  const score = typeof myScore === 'number' && myScore >= 0 ? myScore : 0;

  // DepEd DO 15 Transmuted 75 requires Initial Grade >= 70.00%
  // 60-based standard requires 70.00% to transmute to 75
  const passingScoreDepEd = Math.ceil(total * 0.70); // DepEd DO 15 75 Passing Mark
  const rawCutoff60 = Math.ceil(total * 0.60); // 60% Raw Cutoff

  // Honors & Target tiers for this total
  const targets = [
    { label: 'Passing (75)', desc: 'Connecting', pct: 0.70, score: Math.ceil(total * 0.70), color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800' },
    { label: 'Proficient (80)', desc: 'Benchmarking', pct: 0.759, score: Math.ceil(total * 0.759), color: 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800' },
    { label: 'Solid (85)', desc: 'Benchmarking', pct: 0.818, score: Math.ceil(total * 0.818), color: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800' },
    { label: 'Honors (90)', desc: 'Advancing', pct: 0.877, score: Math.ceil(total * 0.877), color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800' },
    { label: 'High Honors (95)', desc: 'Advancing', pct: 0.936, score: Math.ceil(total * 0.936), color: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800' },
    { label: 'Highest Honors (98)', desc: 'Advancing', pct: 0.9714, score: Math.ceil(total * 0.9714), color: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800' }
  ];

  // Simulator calculation
  const rawPct = total > 0 ? (score / total) * 100 : 0;
  const transmuted = transmuteGrade(rawPct);
  const descriptor = getDescriptor(transmuted);
  const isPassed = transmuted >= 75;
  const diffFromPassing = score - passingScoreDepEd;

  const handleCopySummary = () => {
    playSuccessChime();
    const text = `🎯 TALA DepEd Passing Score Reference\nTotal Items: ${total}\n• DepEd Passing Score (75): ${passingScoreDepEd}/${total} (${Math.round((passingScoreDepEd/total)*100)}%)\n• Honors Target (90): ${Math.ceil(total * 0.877)}/${total}\n• High Honors Target (95): ${Math.ceil(total * 0.936)}/${total}\nCompliant with DepEd Order No. 15, s. 2026.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-5 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider text-emerald-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
              <span>DepEd Passing Score Identifier · DO 15, s. 2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-display tracking-tight text-white">
              Instant Passing Score &amp; Target Revealer
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Enter the total number of items in any quiz, seatwork, or examination. TALA instantly reveals the exact score you need to reach the <strong>75 Passing mark</strong> and earn <strong>Academic Honors</strong>!
            </p>
          </div>

          <button
            onClick={handleCopySummary}
            className="btn-3d px-4 py-2 text-xs font-bold bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl border-b-3 border-emerald-900 shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer select-none transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-emerald-700" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Input Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-black text-slate-900 dark:text-white font-display">
            1. Enter Total Items (Highest Possible Score - HPS):
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <input
                type="number"
                min="1"
                max="1000"
                value={totalItems}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value) || 0);
                  setTotalItems(val);
                }}
                className="w-full text-2xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-3 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900 transition-all text-center"
                placeholder="e.g. 50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                Items
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 flex-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mr-1 hidden lg:inline">
                Presets:
              </span>
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    playPop();
                    setTotalItems(p);
                    if (typeof myScore === 'number' && myScore > p) {
                      setMyScore(Math.ceil(p * 0.7));
                    }
                  }}
                  className={`btn-3d px-2.5 py-1.5 rounded-xl text-xs font-black border-b-2 transition-all cursor-pointer select-none ${
                    totalItems === p
                      ? 'bg-emerald-600 text-white border-emerald-800 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Revealed Big Passing Card */}
        {total > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Primary Pass Card (75 Passing) */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/70 dark:from-emerald-950/40 dark:to-teal-950/20 rounded-3xl p-5 sm:p-6 border-2 border-emerald-300 dark:border-emerald-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-emerald-200 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                    DepEd Passing Mark (75)
                  </span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    70.00% Initial Grade
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Minimum Score Needed to Pass:
                </h3>
              </div>

              <div className="py-4 my-2 flex items-baseline gap-3">
                <span className="text-5xl sm:text-6xl font-black font-display text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {passingScoreDepEd}
                </span>
                <span className="text-2xl font-bold text-slate-400 dark:text-slate-500">
                  / {total}
                </span>
                <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300 ml-auto bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1 rounded-xl">
                  {Math.round((passingScoreDepEd / total) * 100)}%
                </span>
              </div>

              <div className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Transmutes to Grade 75 (Connecting)</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Compliant with the official 60-based transitional transmutation table of DepEd Order No. 15, s. 2026.
                </p>
              </div>
            </div>

            {/* Honors Card (90 Advancing) */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 dark:from-amber-950/40 dark:to-orange-950/20 rounded-3xl p-5 sm:p-6 border-2 border-amber-300 dark:border-amber-800 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-amber-200 dark:bg-amber-900/80 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                    With Honors Baseline (90)
                  </span>
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                    87.70% Initial Grade
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Score Needed for Academic Honors:
                </h3>
              </div>

              <div className="py-4 my-2 flex items-baseline gap-3">
                <span className="text-5xl sm:text-6xl font-black font-display text-amber-600 dark:text-amber-400 tracking-tight">
                  {Math.ceil(total * 0.877)}
                </span>
                <span className="text-2xl font-bold text-slate-400 dark:text-slate-500">
                  / {total}
                </span>
                <span className="text-sm font-extrabold text-amber-800 dark:text-amber-300 ml-auto bg-amber-100 dark:bg-amber-900/50 px-3 py-1 rounded-xl">
                  {Math.round((Math.ceil(total * 0.877) / total) * 100)}%
                </span>
              </div>

              <div className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-amber-200 dark:border-amber-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Transmutes to Grade 90 (Advancing)</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Qualifies for Academic Honors if all quarterly learning areas meet or exceed 80!
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* 4. Complete Target Matrix for this Exam Size */}
        {total > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-500" />
              <span>Complete Score Milestones for a {total}-Item Assessment:</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {targets.map((t, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between ${t.color}`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide opacity-80 block truncate">
                      {t.label}
                    </span>
                    <span className="text-2xl font-black font-display block">
                      {t.score} <span className="text-xs font-semibold opacity-70">/ {total}</span>
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-current/15 flex items-center justify-between text-[11px] font-bold">
                    <span>{t.desc}</span>
                    <span>{Math.round((t.score / total) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. "Test My Score" Simulator */}
        {total > 0 && (
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-teal-500" />
                  <span>Score Checker: What grade do I get with my score?</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Type your actual test score to see if you passed and what transmuted grade it becomes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  My Score:
                </label>
                <input
                  type="number"
                  min="0"
                  max={total}
                  value={myScore}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : Math.min(total, Math.max(0, parseInt(e.target.value) || 0));
                    setMyScore(val);
                  }}
                  className="w-20 px-3 py-1.5 text-center font-black text-lg bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:outline-hidden focus:border-teal-500"
                />
                <span className="text-xs font-bold text-slate-400">/ {total}</span>
              </div>
            </div>

            {/* Result strip */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-white ${
                    isPassed ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                >
                  {isPassed ? '✓' : '✗'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900 dark:text-white font-display">
                      {isPassed ? 'PASSED!' : 'BELOW PASSING MARK'}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isPassed
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {descriptor.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Raw Score: {score}/{total} ({rawPct.toFixed(1)}%) · Transmuted Grade: <strong>{transmuted}</strong>
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                  Margin from Pass (75):
                </span>
                <span
                  className={`text-sm font-black ${
                    diffFromPassing >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {diffFromPassing >= 0 ? `+${diffFromPassing} points above` : `${Math.abs(diffFromPassing)} points below`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 6. Cheat Sheet Reference Table */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Common Assessment Passing Scores Quick Guide:</span>
            </h4>
            <span className="text-xs text-slate-400">DO 15, s. 2026 Reference</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Total Items</th>
                  <th className="py-2.5 px-3">Pass (75) Score</th>
                  <th className="py-2.5 px-3">Proficient (80)</th>
                  <th className="py-2.5 px-3">Honors (90)</th>
                  <th className="py-2.5 px-3">High Honors (95)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {[10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 100].map((items) => (
                  <tr
                    key={items}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                      total === items ? 'bg-emerald-50/70 dark:bg-emerald-950/30 font-bold text-emerald-950 dark:text-emerald-200' : ''
                    }`}
                  >
                    <td className="py-2 px-3 font-black text-slate-900 dark:text-white">
                      {items} items {total === items && '👈'}
                    </td>
                    <td className="py-2 px-3 text-emerald-700 dark:text-emerald-400 font-extrabold">
                      {Math.ceil(items * 0.70)} / {items}
                    </td>
                    <td className="py-2 px-3 text-sky-700 dark:text-sky-400 font-bold">
                      {Math.ceil(items * 0.759)} / {items}
                    </td>
                    <td className="py-2 px-3 text-amber-700 dark:text-amber-400 font-bold">
                      {Math.ceil(items * 0.877)} / {items}
                    </td>
                    <td className="py-2 px-3 text-purple-700 dark:text-purple-400 font-bold">
                      {Math.ceil(items * 0.936)} / {items}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tali advice */}
        <div className="pt-2">
          <TaliTarsierMascot
            state={isPassed ? 'advancing' : 'connecting'}
            message={`Pushing my glasses up! For a ${total}-item test, getting at least ${passingScoreDepEd} points guarantees a Passing grade of 75 (Connecting), and ${Math.ceil(total * 0.877)} points secures Academic Honors (90)! 🎯`}
          />
        </div>
      </div>
    </div>
  );
};
