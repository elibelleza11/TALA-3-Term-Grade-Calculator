import React, { useState } from 'react';
import { ScoreItem } from '../types';
import { playPop, playGentleBonk, playSuccessChime } from '../utils/audio';
import { TaliTarsierMascot } from './TaliTarsierMascot';
import {
  FileText,
  Activity,
  Award,
  Plus,
  Trash2,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Star,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface ScoreInputSectionProps {
  writtenWorks: ScoreItem[];
  onWrittenWorksChange: (items: ScoreItem[]) => void;
  performanceTasks: ScoreItem[];
  onPerformanceTasksChange: (items: ScoreItem[]) => void;
  st1Score: number | '';
  onSt1ScoreChange: (val: number | '') => void;
  st1Total: number | '';
  onSt1TotalChange: (val: number | '') => void;
  st2Score: number | '';
  onSt2ScoreChange: (val: number | '') => void;
  st2Total: number | '';
  onSt2TotalChange: (val: number | '') => void;
  teScore: number | '';
  onTeScoreChange: (val: number | '') => void;
  teTotal: number | '';
  onTeTotalChange: (val: number | '') => void;
  wwWeightPct: number;
  ptWeightPct: number;
  termAssessmentWeightPct: number;
  onScoresReset?: () => void;
  onAwardTalaPoints?: (points: number, message: string) => void;
}

export const ScoreInputSection: React.FC<ScoreInputSectionProps> = ({
  writtenWorks,
  onWrittenWorksChange,
  performanceTasks,
  onPerformanceTasksChange,
  st1Score,
  onSt1ScoreChange,
  st1Total,
  onSt1TotalChange,
  st2Score,
  onSt2ScoreChange,
  st2Total,
  onSt2TotalChange,
  teScore,
  onTeScoreChange,
  teTotal,
  onTeTotalChange,
  wwWeightPct,
  ptWeightPct,
  termAssessmentWeightPct,
  onScoresReset,
  onAwardTalaPoints
}) => {
  // Track last modified item for animation triggers
  const [bouncingInputId, setBouncingInputId] = useState<string | null>(null);
  const [shakingInputId, setShakingInputId] = useState<string | null>(null);

  const triggerInputFeedback = (id: string, score: number, total: number) => {
    if (total <= 0) return;
    const ratio = score / total;
    if (ratio >= 0.85) {
      setBouncingInputId(id);
      setTimeout(() => setBouncingInputId((prev) => (prev === id ? null : prev)), 500);
    } else if (ratio < 0.75) {
      setShakingInputId(id);
      setTimeout(() => setShakingInputId((prev) => (prev === id ? null : prev)), 450);
    }
  };

  // Helpers for Written Works
  const handleAddWW = () => {
    playPop();
    onScoresReset?.();
    const nextNum = writtenWorks.length + 1;
    onWrittenWorksChange([
      ...writtenWorks,
      { id: `ww_${Date.now()}`, name: `WW ${nextNum}`, score: '', highestScore: 20 }
    ]);
    onAwardTalaPoints?.(10, 'Added Written Work (+10 TP)');
  };

  const handleUpdateWW = (id: string, field: 'score' | 'highestScore', val: string) => {
    onScoresReset?.();
    const num = val === '' ? '' : Math.max(0, parseFloat(val) || 0);
    const updated = writtenWorks.map((item) => {
      if (item.id === id) {
        const newItem = { ...item, [field]: num };
        if (field === 'score' && typeof num === 'number' && typeof newItem.highestScore === 'number') {
          triggerInputFeedback(id, num, newItem.highestScore);
        }
        return newItem;
      }
      return item;
    });
    onWrittenWorksChange(updated);
  };

  const handleRemoveWW = (id: string) => {
    playPop();
    onScoresReset?.();
    onWrittenWorksChange(writtenWorks.filter((item) => item.id !== id));
  };

  // Helpers for Performance Tasks
  const handleAddPT = () => {
    playPop();
    onScoresReset?.();
    const nextNum = performanceTasks.length + 1;
    onPerformanceTasksChange([
      ...performanceTasks,
      { id: `pt_${Date.now()}`, name: `PT ${nextNum}`, score: '', highestScore: 50 }
    ]);
    onAwardTalaPoints?.(15, 'Added Performance Task (+15 TP)');
  };

  const handleUpdatePT = (id: string, field: 'score' | 'highestScore', val: string) => {
    onScoresReset?.();
    const num = val === '' ? '' : Math.max(0, parseFloat(val) || 0);
    const updated = performanceTasks.map((item) => {
      if (item.id === id) {
        const newItem = { ...item, [field]: num };
        if (field === 'score' && typeof num === 'number' && typeof newItem.highestScore === 'number') {
          triggerInputFeedback(id, num, newItem.highestScore);
        }
        return newItem;
      }
      return item;
    });
    onPerformanceTasksChange(updated);
  };

  const handleRemovePT = (id: string) => {
    playPop();
    onScoresReset?.();
    onPerformanceTasksChange(performanceTasks.filter((item) => item.id !== id));
  };

  // WW calculations for live progress bar
  const wwRaw = writtenWorks.reduce((acc, item) => acc + (typeof item.score === 'number' ? item.score : 0), 0);
  const wwHigh = writtenWorks.reduce((acc, item) => acc + (typeof item.highestScore === 'number' ? item.highestScore : 0), 0);
  const wwPct = wwHigh > 0 ? (wwRaw / wwHigh) * 100 : 0;

  // PT calculations for live progress bar
  const ptRaw = performanceTasks.reduce((acc, item) => acc + (typeof item.score === 'number' ? item.score : 0), 0);
  const ptHigh = performanceTasks.reduce((acc, item) => acc + (typeof item.highestScore === 'number' ? item.highestScore : 0), 0);
  const ptPct = ptHigh > 0 ? (ptRaw / ptHigh) * 100 : 0;

  // ST & TE calculations for live progress bar
  const st1R = typeof st1Score === 'number' ? st1Score : 0;
  const st1H = typeof st1Total === 'number' ? st1Total : 0;
  const st2R = typeof st2Score === 'number' ? st2Score : 0;
  const st2H = typeof st2Total === 'number' ? st2Total : 0;
  const teR = typeof teScore === 'number' ? teScore : 0;
  const teH = typeof teTotal === 'number' ? teTotal : 0;

  const stTotalRaw = st1R + st2R + teR;
  const stTotalHigh = st1H + st2H + teH;
  const stPct = stTotalHigh > 0 ? (stTotalRaw / stTotalHigh) * 100 : 0;

  // Live Weighted Scores (DepEd DO 15, s. 2026)
  const wwWeightedVal = wwPct * (wwWeightPct / 100);
  const ptWeightedVal = ptPct * (ptWeightPct / 100);
  const st1WeightedVal = st1H > 0 ? (st1R / st1H) * 9 : 0;
  const st2WeightedVal = st2H > 0 ? (st2R / st2H) * 9 : 0;
  const teWeightedVal = teH > 0 ? (teR / teH) * 12 : 0;
  const examWeightedVal = st1WeightedVal + st2WeightedVal + teWeightedVal;
  const totalSumWeightedVal = wwWeightedVal + ptWeightedVal + examWeightedVal;

  // Demo sample loader
  const loadSampleScores = (tier: 'advancing' | 'benchmarking' | 'developing') => {
    playPop();
    onScoresReset?.();
    if (tier === 'advancing') {
      onWrittenWorksChange([
        { id: 'ww_1', name: 'WW 1 (Quiz)', score: 20, highestScore: 20 },
        { id: 'ww_2', name: 'WW 2 (Seatwork)', score: 24, highestScore: 25 },
        { id: 'ww_3', name: 'WW 3 (Journal)', score: 20, highestScore: 20 }
      ]);
      onPerformanceTasksChange([
        { id: 'pt_1', name: 'PT 1 (Project)', score: 48, highestScore: 50 },
        { id: 'pt_2', name: 'PT 2 (Presentation)', score: 49, highestScore: 50 }
      ]);
      onSt1ScoreChange(28);
      onSt1TotalChange(30);
      onSt2ScoreChange(29);
      onSt2TotalChange(30);
      onTeScoreChange(47);
      onTeTotalChange(50);
      onAwardTalaPoints?.(20, 'Loaded Advancing Preset (+20 TP)');
    } else if (tier === 'benchmarking') {
      onWrittenWorksChange([
        { id: 'ww_1', name: 'WW 1 (Quiz)', score: 17, highestScore: 20 },
        { id: 'ww_2', name: 'WW 2 (Seatwork)', score: 21, highestScore: 25 },
        { id: 'ww_3', name: 'WW 3 (Journal)', score: 18, highestScore: 20 }
      ]);
      onPerformanceTasksChange([
        { id: 'pt_1', name: 'PT 1 (Project)', score: 42, highestScore: 50 },
        { id: 'pt_2', name: 'PT 2 (Activity)', score: 44, highestScore: 50 }
      ]);
      onSt1ScoreChange(24);
      onSt1TotalChange(30);
      onSt2ScoreChange(25);
      onSt2TotalChange(30);
      onTeScoreChange(42);
      onTeTotalChange(50);
      onAwardTalaPoints?.(15, 'Loaded Benchmarking Preset (+15 TP)');
    } else {
      onWrittenWorksChange([
        { id: 'ww_1', name: 'WW 1 (Quiz)', score: 14, highestScore: 20 },
        { id: 'ww_2', name: 'WW 2 (Seatwork)', score: 16, highestScore: 25 },
        { id: 'ww_3', name: 'WW 3 (Journal)', score: 14, highestScore: 20 }
      ]);
      onPerformanceTasksChange([
        { id: 'pt_1', name: 'PT 1 (Project)', score: 35, highestScore: 50 },
        { id: 'pt_2', name: 'PT 2 (Activity)', score: 36, highestScore: 50 }
      ]);
      onSt1ScoreChange(19);
      onSt1TotalChange(30);
      onSt2ScoreChange(20);
      onSt2TotalChange(30);
      onTeScoreChange(32);
      onTeTotalChange(50);
      onAwardTalaPoints?.(10, 'Loaded Developing Preset (+10 TP)');
    }
  };

  const handleClearAll = () => {
    playGentleBonk();
    onScoresReset?.();
    onWrittenWorksChange([
      { id: 'ww_1', name: 'WW 1', score: '', highestScore: 20 },
      { id: 'ww_2', name: 'WW 2', score: '', highestScore: 25 }
    ]);
    onPerformanceTasksChange([
      { id: 'pt_1', name: 'PT 1', score: '', highestScore: 50 }
    ]);
    onSt1ScoreChange('');
    onSt1TotalChange(30);
    onSt2ScoreChange('');
    onSt2TotalChange(30);
    onTeScoreChange('');
    onTeTotalChange(50);
  };

  return (
    <div className="space-y-6">
      {/* Quick Demo Assist bar with Chunky 3D Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-50/90 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 rounded-3xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-black text-amber-950 dark:text-amber-200">
          <span className="p-1 bg-amber-400 text-amber-950 rounded-lg">⭐</span>
          <span>Quick Sample Presets (or Start Blank for Fresh Student):</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => loadSampleScores('advancing')}
            className="btn-3d px-3 py-1.5 text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-white border-b-4 border-emerald-700 rounded-xl shadow-xs cursor-pointer select-none"
          >
            🌟 Advancing (90+)
          </button>
          <button
            type="button"
            onClick={() => loadSampleScores('benchmarking')}
            className="btn-3d px-3 py-1.5 text-xs font-black bg-blue-500 hover:bg-blue-400 text-white border-b-4 border-blue-700 rounded-xl shadow-xs cursor-pointer select-none"
          >
            🎯 Benchmarking (85+)
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="btn-3d px-3 py-1.5 text-xs font-black bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 border-b-4 border-slate-400 dark:border-slate-800 rounded-xl flex items-center gap-1.5 cursor-pointer select-none"
            title="Clear all scores to blank"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear to Blank</span>
          </button>
        </div>
      </div>

      {/* Grid of 3 Assessment Components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* COMPONENT 1: Written Works (WW) */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border-2 border-amber-300 dark:border-amber-700/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-amber-100 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xs shadow-sm border-b-2 border-amber-600">
                  WW
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white font-display">
                    Written Works (WW)
                  </h3>
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                    DepEd Weight: {wwWeightPct}%
                  </span>
                </div>
              </div>

              {/* Chunky 3D Add Button */}
              <button
                type="button"
                onClick={handleAddWW}
                className="btn-3d flex items-center gap-1 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 border-b-4 border-amber-600 text-xs font-black rounded-xl cursor-pointer select-none"
                title="Add another quiz or written task"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Item</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 font-medium">
              Quizzes, unit tests, essays, seatworks, and journals
            </p>

            {/* Score Items list OR Mascot Empty State */}
            {writtenWorks.length === 0 ? (
              <div className="text-center py-6 px-4 bg-amber-50/60 dark:bg-slate-900/40 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-700 flex flex-col items-center animate-fadeIn">
                <div className="w-20 h-20 mb-1">
                  <TaliTarsierMascot state="empty" compact size="sm" />
                </div>
                <h4 className="font-black text-xs text-slate-800 dark:text-white font-display">
                  No written works yet!
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-xs mb-2.5 font-medium">
                  Tali is holding your blank notebook, waiting for your quizzes!
                </p>
                <button
                  type="button"
                  onClick={handleAddWW}
                  className="btn-3d px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs rounded-xl border-b-4 border-amber-600 shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Quiz 📓</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {writtenWorks.map((item) => {
                  const isOver =
                    typeof item.score === 'number' &&
                    typeof item.highestScore === 'number' &&
                    item.score > item.highestScore;

                  const ratio =
                    typeof item.score === 'number' && typeof item.highestScore === 'number' && item.highestScore > 0
                      ? item.score / item.highestScore
                      : 0;

                  const isHigh = typeof item.score === 'number' && ratio >= 0.85;
                  const isLow = typeof item.score === 'number' && ratio < 0.75;
                  const isBouncing = bouncingInputId === item.id;
                  const isShaking = shakingInputId === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-2xl border-2 transition-all flex items-center gap-2 ${
                        isBouncing
                          ? 'animate-happy-bounce border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-emerald-300'
                          : isShaking
                          ? 'animate-gentle-shake border-rose-400 bg-rose-50 dark:bg-rose-950/40'
                          : isOver
                          ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40'
                          : isHigh
                          ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/60'
                      }`}
                    >
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          onScoresReset?.();
                          onWrittenWorksChange(
                            writtenWorks.map((w) =>
                              w.id === item.id ? { ...w, name: e.target.value } : w
                            )
                          );
                        }}
                        className="w-24 text-xs font-bold bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white"
                      />

                      <div className="flex items-center gap-1.5 ml-auto">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max={item.highestScore || 100}
                            placeholder="Score"
                            value={item.score}
                            onChange={(e) => handleUpdateWW(item.id, 'score', e.target.value)}
                            className={`w-14 text-center py-1.5 text-xs font-black rounded-xl border-2 transition-all ${
                              isOver
                                ? 'border-red-500 text-red-600 bg-red-50 dark:bg-red-950/50'
                                : isHigh
                                ? 'border-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200'
                                : isLow
                                ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300'
                                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-amber-500'
                            } focus:outline-none`}
                          />
                          <span className="text-slate-400 font-black text-xs">/</span>
                          <input
                            type="number"
                            min="1"
                            placeholder="Total"
                            value={item.highestScore}
                            onChange={(e) =>
                              handleUpdateWW(item.id, 'highestScore', e.target.value)
                            }
                            className="w-14 text-center py-1.5 text-xs font-black rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-amber-500 focus:outline-none text-slate-700 dark:text-slate-200"
                          />
                        </div>

                        {isHigh && <span className="text-xs" title="High Score! ⭐">⭐</span>}

                        <button
                          type="button"
                          onClick={() => handleRemoveWW(item.id)}
                          className="text-slate-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chunky Animated XP Progress Bar & Score Gauge */}
          <div className="mt-4 pt-3.5 border-t border-amber-100 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                WW Mastery &amp; Weighted
              </span>
              <span className="font-mono font-black text-amber-700 dark:text-amber-400">
                {wwRaw} / {wwHigh} pts ({Math.round(wwPct)}%)
              </span>
            </div>

            {/* Visual Chunky XP Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-700/80 h-3.5 rounded-full overflow-hidden p-0.5 border border-amber-200 dark:border-slate-600 shadow-inner">
              <div
                className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500 shadow-xs relative"
                style={{ width: `${Math.min(100, Math.max(0, wwPct))}%` }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full h-1/2" />
              </div>
            </div>

            {/* Live Weighted Score Display */}
            <div className="flex items-center justify-between text-[11px] bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-200/80 dark:border-amber-800/60">
              <span className="font-bold text-amber-900 dark:text-amber-200">WW Weighted Score:</span>
              <span className="font-mono font-black text-amber-800 dark:text-amber-300">
                {wwWeightedVal.toFixed(2)} pts <span className="text-amber-600 dark:text-amber-400 font-medium">({wwWeightPct}% max)</span>
              </span>
            </div>
          </div>
        </div>

        {/* COMPONENT 2: Performance Tasks (PT) */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border-2 border-emerald-300 dark:border-emerald-700/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-emerald-100 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-sm border-b-2 border-emerald-700">
                  PT
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white font-display">
                    Performance Tasks (PT)
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    DepEd Weight: {ptWeightPct}%
                  </span>
                </div>
              </div>

              {/* Chunky 3D Add Button */}
              <button
                type="button"
                onClick={handleAddPT}
                className="btn-3d flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white border-b-4 border-emerald-700 text-xs font-black rounded-xl cursor-pointer select-none"
                title="Add another hands-on task or project"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Item</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 font-medium">
              Projects, portfolios, experiments, roleplays, speeches &amp; skills
            </p>

            {/* Score Items list OR Mascot Empty State */}
            {performanceTasks.length === 0 ? (
              <div className="text-center py-6 px-4 bg-emerald-50/60 dark:bg-slate-900/40 rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-700 flex flex-col items-center animate-fadeIn">
                <div className="w-20 h-20 mb-1">
                  <TaliTarsierMascot state="empty" compact size="sm" />
                </div>
                <h4 className="font-black text-xs text-slate-800 dark:text-white font-display">
                  No performance tasks yet!
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-xs mb-2.5 font-medium">
                  Log your projects, presentations, and experiments with Tali!
                </p>
                <button
                  type="button"
                  onClick={handleAddPT}
                  className="btn-3d px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs rounded-xl border-b-4 border-emerald-700 shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Task 🎨</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {performanceTasks.map((item) => {
                  const isOver =
                    typeof item.score === 'number' &&
                    typeof item.highestScore === 'number' &&
                    item.score > item.highestScore;

                  const ratio =
                    typeof item.score === 'number' && typeof item.highestScore === 'number' && item.highestScore > 0
                      ? item.score / item.highestScore
                      : 0;

                  const isHigh = typeof item.score === 'number' && ratio >= 0.85;
                  const isLow = typeof item.score === 'number' && ratio < 0.75;
                  const isBouncing = bouncingInputId === item.id;
                  const isShaking = shakingInputId === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-2xl border-2 transition-all flex items-center gap-2 ${
                        isBouncing
                          ? 'animate-happy-bounce border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-emerald-300'
                          : isShaking
                          ? 'animate-gentle-shake border-rose-400 bg-rose-50 dark:bg-rose-950/40'
                          : isOver
                          ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40'
                          : isHigh
                          ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/60'
                      }`}
                    >
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          onScoresReset?.();
                          onPerformanceTasksChange(
                            performanceTasks.map((p) =>
                              p.id === item.id ? { ...p, name: e.target.value } : p
                            )
                          );
                        }}
                        className="w-24 text-xs font-bold bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                      />

                      <div className="flex items-center gap-1.5 ml-auto">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max={item.highestScore || 100}
                            placeholder="Score"
                            value={item.score}
                            onChange={(e) => handleUpdatePT(item.id, 'score', e.target.value)}
                            className={`w-14 text-center py-1.5 text-xs font-black rounded-xl border-2 transition-all ${
                              isOver
                                ? 'border-red-500 text-red-600 bg-red-50 dark:bg-red-950/50'
                                : isHigh
                                ? 'border-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200'
                                : isLow
                                ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300'
                                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500'
                            } focus:outline-none`}
                          />
                          <span className="text-slate-400 font-black text-xs">/</span>
                          <input
                            type="number"
                            min="1"
                            placeholder="Total"
                            value={item.highestScore}
                            onChange={(e) =>
                              handleUpdatePT(item.id, 'highestScore', e.target.value)
                            }
                            className="w-14 text-center py-1.5 text-xs font-black rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-emerald-500 focus:outline-none text-slate-700 dark:text-slate-200"
                          />
                        </div>

                        {isHigh && <span className="text-xs" title="High Score! ⭐">⭐</span>}

                        <button
                          type="button"
                          onClick={() => handleRemovePT(item.id)}
                          className="text-slate-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chunky Animated XP Progress Bar & Score Gauge */}
          <div className="mt-4 pt-3.5 border-t border-emerald-100 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                PT Mastery Progress
              </span>
              <span className="font-mono font-black text-emerald-700 dark:text-emerald-400">
                {ptRaw} / {ptHigh} pts ({Math.round(ptPct)}%)
              </span>
            </div>

            {/* Visual Chunky XP Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-700/80 h-3.5 rounded-full overflow-hidden p-0.5 border border-emerald-200 dark:border-slate-600 shadow-inner">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500 shadow-xs relative"
                style={{ width: `${Math.min(100, Math.max(0, ptPct))}%` }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full h-1/2" />
              </div>
            </div>

            {/* Live Weighted Score Display */}
            <div className="flex items-center justify-between text-[11px] bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60">
              <span className="font-bold text-emerald-900 dark:text-emerald-200">PT Weighted Score:</span>
              <span className="font-mono font-black text-emerald-800 dark:text-emerald-300">
                {ptWeightedVal.toFixed(2)} pts <span className="text-emerald-600 dark:text-emerald-400 font-medium">({ptWeightPct}% max)</span>
              </span>
            </div>
          </div>
        </div>

        {/* COMPONENT 3: ST1, ST2, and TE (Summative Tests & Term Exam) */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border-2 border-blue-300 dark:border-blue-700/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-blue-100 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-sm border-b-2 border-blue-800">
                  ST/TE
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white font-display">
                    ST1, ST2 &amp; Term Exam
                  </h3>
                  <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400">
                    DepEd Weight: {termAssessmentWeightPct}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-blue-700 dark:text-blue-300 font-black px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 rounded-lg">
                <Award className="w-3.5 h-3.5" />
                <span>Summative</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 font-medium">
              ST1 (9%), ST2 (9%), and Terminal Exam (12%) totaling 30% Assessment weight
            </p>

            <div className="space-y-3">
              {/* ST1 */}
              <div className="p-2.5 bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                    Summative Test 1 (ST1)
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                    9%
                  </span>
                  <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">
                    ({st1WeightedVal.toFixed(2)} pts)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max={typeof st1Total === 'number' ? st1Total : 100}
                    placeholder="Score"
                    value={st1Score}
                    onChange={(e) => {
                      onScoresReset?.();
                      const val = e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0);
                      onSt1ScoreChange(val);
                      if (typeof val === 'number' && typeof st1Total === 'number') {
                        triggerInputFeedback('st1', val, st1Total);
                      }
                    }}
                    className={`w-14 text-center py-1.5 text-xs font-black rounded-xl border-2 transition-all ${
                      typeof st1Score === 'number' && typeof st1Total === 'number' && st1Score > st1Total
                        ? 'border-red-500 text-red-600 bg-red-50'
                        : bouncingInputId === 'st1'
                        ? 'animate-happy-bounce border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300'
                        : shakingInputId === 'st1'
                        ? 'animate-gentle-shake border-rose-400 bg-rose-50'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500'
                    } focus:outline-none`}
                  />
                  <span className="text-slate-400 font-black text-xs">/</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Total"
                    value={st1Total}
                    onChange={(e) => {
                      onScoresReset?.();
                      onSt1TotalChange(
                        e.target.value === '' ? '' : Math.max(1, parseFloat(e.target.value) || 0)
                      );
                    }}
                    className="w-14 text-center py-1.5 text-xs font-black rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-blue-500 focus:outline-none text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* ST2 */}
              <div className="p-2.5 bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                    Summative Test 2 (ST2)
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                    9%
                  </span>
                  <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">
                    ({st2WeightedVal.toFixed(2)} pts)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max={typeof st2Total === 'number' ? st2Total : 100}
                    placeholder="Score"
                    value={st2Score}
                    onChange={(e) => {
                      onScoresReset?.();
                      const val = e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0);
                      onSt2ScoreChange(val);
                      if (typeof val === 'number' && typeof st2Total === 'number') {
                        triggerInputFeedback('st2', val, st2Total);
                      }
                    }}
                    className={`w-14 text-center py-1.5 text-xs font-black rounded-xl border-2 transition-all ${
                      typeof st2Score === 'number' && typeof st2Total === 'number' && st2Score > st2Total
                        ? 'border-red-500 text-red-600 bg-red-50'
                        : bouncingInputId === 'st2'
                        ? 'animate-happy-bounce border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300'
                        : shakingInputId === 'st2'
                        ? 'animate-gentle-shake border-rose-400 bg-rose-50'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500'
                    } focus:outline-none`}
                  />
                  <span className="text-slate-400 font-black text-xs">/</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Total"
                    value={st2Total}
                    onChange={(e) => {
                      onScoresReset?.();
                      onSt2TotalChange(
                        e.target.value === '' ? '' : Math.max(1, parseFloat(e.target.value) || 0)
                      );
                    }}
                    className="w-14 text-center py-1.5 text-xs font-black rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-blue-500 focus:outline-none text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* TE */}
              <div className="p-2.5 bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                    Terminal Exam (TE)
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                    12%
                  </span>
                  <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">
                    ({teWeightedVal.toFixed(2)} pts)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max={typeof teTotal === 'number' ? teTotal : 100}
                    placeholder="Score"
                    value={teScore}
                    onChange={(e) => {
                      onScoresReset?.();
                      const val = e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0);
                      onTeScoreChange(val);
                      if (typeof val === 'number' && typeof teTotal === 'number') {
                        triggerInputFeedback('te', val, teTotal);
                      }
                    }}
                    className={`w-14 text-center py-1.5 text-xs font-black rounded-xl border-2 transition-all ${
                      typeof teScore === 'number' && typeof teTotal === 'number' && teScore > teTotal
                        ? 'border-red-500 text-red-600 bg-red-50'
                        : bouncingInputId === 'te'
                        ? 'animate-happy-bounce border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300'
                        : shakingInputId === 'te'
                        ? 'animate-gentle-shake border-rose-400 bg-rose-50'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500'
                    } focus:outline-none`}
                  />
                  <span className="text-slate-400 font-black text-xs">/</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Total"
                    value={teTotal}
                    onChange={(e) => {
                      onScoresReset?.();
                      onTeTotalChange(
                        e.target.value === '' ? '' : Math.max(1, parseFloat(e.target.value) || 0)
                      );
                    }}
                    className="w-14 text-center py-1.5 text-xs font-black rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-blue-500 focus:outline-none text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Chunky Animated XP Progress Bar & Score Gauge */}
          <div className="mt-4 pt-3.5 border-t border-blue-100 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Summative Mastery &amp; Weighted
              </span>
              <span className="font-mono font-black text-blue-700 dark:text-blue-400">
                {stTotalRaw} / {stTotalHigh} pts ({Math.round(stPct)}%)
              </span>
            </div>

            {/* Visual Chunky XP Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-700/80 h-3.5 rounded-full overflow-hidden p-0.5 border border-blue-200 dark:border-slate-600 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500 shadow-xs relative"
                style={{ width: `${Math.min(100, Math.max(0, stPct))}%` }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full h-1/2" />
              </div>
            </div>

            {/* Live Weighted Score Display for Exam */}
            <div className="flex items-center justify-between text-[11px] bg-blue-50 dark:bg-blue-950/40 p-2 rounded-xl border border-blue-200/80 dark:border-blue-800/60">
              <span className="font-bold text-blue-900 dark:text-blue-200">Summative Weighted Score:</span>
              <span className="font-mono font-black text-blue-800 dark:text-blue-300">
                {examWeightedVal.toFixed(2)} pts <span className="text-blue-600 dark:text-blue-400 font-medium">({termAssessmentWeightPct}% max)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Sum of Weighted Scores Component Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 dark:from-amber-950/30 dark:via-emerald-950/30 dark:to-blue-950/30 border-2 border-indigo-200 dark:border-indigo-800/70 rounded-3xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-100 font-display">
                Live Sum of Weighted Scores Breakdown
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Shows real-time weighted contributions of each component towards your 100-point initial grade.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 bg-white/90 dark:bg-slate-900/90 px-3.5 py-2 rounded-2xl border border-indigo-100 dark:border-slate-700 shadow-inner">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Sum:</span>
            <span className="text-sm font-black font-mono text-indigo-700 dark:text-indigo-300">
              {totalSumWeightedVal.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ 100 pts</span>
            </span>
          </div>
        </div>

        {/* Component Formula Display */}
        <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-amber-100/60 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800">
            <span className="block text-[10px] font-bold text-amber-800 dark:text-amber-300">WW ({wwWeightPct}%)</span>
            <span className="font-mono font-black text-amber-900 dark:text-amber-200 text-sm">+{wwWeightedVal.toFixed(2)}</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
            <span className="block text-[10px] font-bold text-emerald-800 dark:text-emerald-300">PT ({ptWeightPct}%)</span>
            <span className="font-mono font-black text-emerald-900 dark:text-emerald-200 text-sm">+{ptWeightedVal.toFixed(2)}</span>
          </div>
          <div className="p-2 rounded-xl bg-blue-100/60 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
            <span className="block text-[10px] font-bold text-blue-800 dark:text-blue-300">ST1 (9%)</span>
            <span className="font-mono font-black text-blue-900 dark:text-blue-200 text-sm">+{st1WeightedVal.toFixed(2)}</span>
          </div>
          <div className="p-2 rounded-xl bg-blue-100/60 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
            <span className="block text-[10px] font-bold text-blue-800 dark:text-blue-300">ST2 (9%)</span>
            <span className="font-mono font-black text-blue-900 dark:text-blue-200 text-sm">+{st2WeightedVal.toFixed(2)}</span>
          </div>
          <div className="p-2 rounded-xl bg-indigo-100/60 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 col-span-2 sm:col-span-1">
            <span className="block text-[10px] font-bold text-indigo-800 dark:text-indigo-300">TE (12%)</span>
            <span className="font-mono font-black text-indigo-900 dark:text-indigo-200 text-sm">+{teWeightedVal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
