import React from 'react';
import { ScoreItem } from '../types';
import { playPop, playGentleBonk } from '../utils/audio';
import {
  FileText,
  Activity,
  Award,
  Plus,
  Trash2,
  HelpCircle,
  Sparkles,
  RotateCcw
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
  onScoresReset
}) => {
  // Helpers for Written Works
  const handleAddWW = () => {
    playPop();
    onScoresReset?.();
    const nextNum = writtenWorks.length + 1;
    onWrittenWorksChange([
      ...writtenWorks,
      { id: `ww_${Date.now()}`, name: `WW ${nextNum}`, score: '', highestScore: 20 }
    ]);
  };

  const handleUpdateWW = (id: string, field: 'score' | 'highestScore', val: string) => {
    onScoresReset?.();
    const num = val === '' ? '' : Math.max(0, parseFloat(val) || 0);
    onWrittenWorksChange(
      writtenWorks.map((item) => (item.id === id ? { ...item, [field]: num } : item))
    );
  };

  const handleRemoveWW = (id: string) => {
    if (writtenWorks.length <= 1) return;
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
  };

  const handleUpdatePT = (id: string, field: 'score' | 'highestScore', val: string) => {
    onScoresReset?.();
    const num = val === '' ? '' : Math.max(0, parseFloat(val) || 0);
    onPerformanceTasksChange(
      performanceTasks.map((item) => (item.id === id ? { ...item, [field]: num } : item))
    );
  };

  const handleRemovePT = (id: string) => {
    if (performanceTasks.length <= 1) return;
    playPop();
    onScoresReset?.();
    onPerformanceTasksChange(performanceTasks.filter((item) => item.id !== id));
  };

  // WW totals
  let wwRaw = 0;
  let wwHigh = 0;
  writtenWorks.forEach((w) => {
    wwRaw += typeof w.score === 'number' ? w.score : 0;
    wwHigh += typeof w.highestScore === 'number' ? w.highestScore : 0;
  });
  const wwPct = wwHigh > 0 ? (wwRaw / wwHigh) * 100 : 0;

  // PT totals
  let ptRaw = 0;
  let ptHigh = 0;
  performanceTasks.forEach((p) => {
    ptRaw += typeof p.score === 'number' ? p.score : 0;
    ptHigh += typeof p.highestScore === 'number' ? p.highestScore : 0;
  });
  const ptPct = ptHigh > 0 ? (ptRaw / ptHigh) * 100 : 0;

  // Summative & TE totals
  const s1 = typeof st1Score === 'number' ? st1Score : 0;
  const h1 = typeof st1Total === 'number' ? st1Total : 0;
  const s2 = typeof st2Score === 'number' ? st2Score : 0;
  const h2 = typeof st2Total === 'number' ? st2Total : 0;
  const ste = typeof teScore === 'number' ? teScore : 0;
  const hte = typeof teTotal === 'number' ? teTotal : 0;

  const stTotalRaw = s1 + s2 + ste;
  const stTotalHigh = h1 + h2 + hte;
  const stPct = stTotalHigh > 0 ? (stTotalRaw / stTotalHigh) * 100 : 0;

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
      {/* Quick Demo Assist bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 rounded-2xl px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 dark:text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Quick Sample Presets (or Start Blank for GitHub Deployment):</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => loadSampleScores('advancing')}
            className="px-2.5 py-1 text-xs font-bold bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            🌟 Advancing Sample (90+)
          </button>
          <button
            type="button"
            onClick={() => loadSampleScores('benchmarking')}
            className="px-2.5 py-1 text-xs font-bold bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            🎯 Benchmarking Sample (85+)
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="px-2.5 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg border border-slate-300 dark:border-slate-600 flex items-center gap-1 cursor-pointer transition-colors"
            title="Clear all scores to blank"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear to Blank</span>
          </button>
        </div>
      </div>

      {/* Grid of 3 Assessment Components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* COMPONENT 1: Written Works (WW) */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border-2 border-amber-200/90 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  WW
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white font-display">
                    Written Works (WW)
                  </h3>
                  <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                    Weight: {wwWeightPct}%
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddWW}
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-lg transition-colors border border-amber-300 dark:border-amber-700 cursor-pointer"
                title="Add another quiz or written task"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Quizzes, unit tests, essays, seatworks, and journals
            </p>

            {/* Score Items list */}
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {writtenWorks.map((item) => {
                const isOver =
                  typeof item.score === 'number' &&
                  typeof item.highestScore === 'number' &&
                  item.score > item.highestScore;

                return (
                  <div
                    key={item.id}
                    className="p-2.5 bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2"
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
                      className="w-24 text-xs font-medium bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white"
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
                          className={`w-14 text-center py-1 text-xs font-bold rounded-lg border-2 ${
                            isOver
                              ? 'border-red-500 text-red-600 bg-red-50 dark:bg-red-950/50'
                              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-amber-500'
                          } focus:outline-none`}
                        />
                        <span className="text-slate-400 font-bold text-xs">/</span>
                        <input
                          type="number"
                          min="1"
                          placeholder="Total"
                          value={item.highestScore}
                          onChange={(e) =>
                            handleUpdateWW(item.id, 'highestScore', e.target.value)
                          }
                          className="w-14 text-center py-1 text-xs font-semibold rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-amber-500 focus:outline-none text-slate-700 dark:text-slate-200"
                        />
                      </div>

                      {writtenWorks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveWW(item.id)}
                          className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subtotal Banner */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">WW Total Raw</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {wwRaw} / {wwHigh}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">WW Percentage</span>
              <span className="font-mono font-bold text-amber-700 dark:text-amber-400 text-sm">
                {Math.round(wwPct * 10) / 10}%
              </span>
            </div>
          </div>
        </div>

        {/* COMPONENT 2: Performance Tasks (PT) */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border-2 border-emerald-200/90 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  PT
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white font-display">
                    Performance Tasks (PT)
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    Weight: {ptWeightPct}%
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddPT}
                className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-lg transition-colors border border-emerald-300 dark:border-emerald-700 cursor-pointer"
                title="Add another hands-on task or project"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Projects, portfolios, experiments, roleplays, speeches &amp; skills
            </p>

            {/* Score Items list */}
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {performanceTasks.map((item) => {
                const isOver =
                  typeof item.score === 'number' &&
                  typeof item.highestScore === 'number' &&
                  item.score > item.highestScore;

                return (
                  <div
                    key={item.id}
                    className="p-2.5 bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2"
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
                      className="w-24 text-xs font-medium bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
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
                          className={`w-14 text-center py-1 text-xs font-bold rounded-lg border-2 ${
                            isOver
                              ? 'border-red-500 text-red-600 bg-red-50 dark:bg-red-950/50'
                              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-emerald-500'
                          } focus:outline-none`}
                        />
                        <span className="text-slate-400 font-bold text-xs">/</span>
                        <input
                          type="number"
                          min="1"
                          placeholder="Total"
                          value={item.highestScore}
                          onChange={(e) =>
                            handleUpdatePT(item.id, 'highestScore', e.target.value)
                          }
                          className="w-14 text-center py-1 text-xs font-semibold rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-emerald-500 focus:outline-none text-slate-700 dark:text-slate-200"
                        />
                      </div>

                      {performanceTasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePT(item.id)}
                          className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subtotal Banner */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">PT Total Raw</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {ptRaw} / {ptHigh}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">PT Percentage</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                {Math.round(ptPct * 10) / 10}%
              </span>
            </div>
          </div>
        </div>

        {/* COMPONENT 3: ST1, ST2, and TE (Summative Tests & Term Exam) */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border-2 border-blue-200/90 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  ST/TE
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white font-display">
                    ST1, ST2 &amp; Term Exam
                  </h3>
                  <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                    Weight: {termAssessmentWeightPct}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>Summative</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Summative Test 1, Summative Test 2, and Terminal Examination
            </p>

            <div className="space-y-3">
              {/* ST1: Summative Test 1 */}
              <div className="p-2.5 bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Summative Test 1 (ST1)
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Mid-term review quiz</span>
                </div>

                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    placeholder="Score"
                    value={st1Score}
                    onChange={(e) => {
                      onScoresReset?.();
                      onSt1ScoreChange(
                        e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0)
                      );
                    }}
                    className="w-14 text-center py-1 text-xs font-bold rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  />
                  <span className="text-slate-400 font-bold text-xs">/</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Total"
                    value={st1Total}
                    onChange={(e) => {
                      onScoresReset?.();
                      onSt1TotalChange(
                        e.target.value === '' ? '' : Math.max(1, parseFloat(e.target.value) || 1)
                      );
                    }}
                    className="w-14 text-center py-1 text-xs font-semibold rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-blue-500 focus:outline-none text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* ST2: Summative Test 2 */}
              <div className="p-2.5 bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Summative Test 2 (ST2)
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Post-unit summative test</span>
                </div>

                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    placeholder="Score"
                    value={st2Score}
                    onChange={(e) => {
                      onScoresReset?.();
                      onSt2ScoreChange(
                        e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0)
                      );
                    }}
                    className="w-14 text-center py-1 text-xs font-bold rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  />
                  <span className="text-slate-400 font-bold text-xs">/</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Total"
                    value={st2Total}
                    onChange={(e) => {
                      onScoresReset?.();
                      onSt2TotalChange(
                        e.target.value === '' ? '' : Math.max(1, parseFloat(e.target.value) || 1)
                      );
                    }}
                    className="w-14 text-center py-1 text-xs font-semibold rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-blue-500 focus:outline-none text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* TE: Term Exam */}
              <div className="p-2.5 bg-blue-50/50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-950 dark:text-blue-200 block">
                    Term Exam (TE)
                  </span>
                  <span className="text-[10px] text-blue-700 dark:text-blue-400">Official 3-Term Examination</span>
                </div>

                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    placeholder="Score"
                    value={teScore}
                    onChange={(e) => {
                      onScoresReset?.();
                      onTeScoreChange(
                        e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0)
                      );
                    }}
                    className="w-14 text-center py-1 text-xs font-bold rounded-lg border-2 border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
                  />
                  <span className="text-slate-400 font-bold text-xs">/</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Total"
                    value={teTotal}
                    onChange={(e) => {
                      onScoresReset?.();
                      onTeTotalChange(
                        e.target.value === '' ? '' : Math.max(1, parseFloat(e.target.value) || 1)
                      );
                    }}
                    className="w-14 text-center py-1 text-xs font-semibold rounded-lg border-2 border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 focus:border-blue-600 focus:outline-none text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subtotal Banner */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Combined ST/TE Raw</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {stTotalRaw} / {stTotalHigh}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">ST/TE Percentage</span>
              <span className="font-mono font-bold text-blue-700 dark:text-blue-400 text-sm">
                {Math.round(stPct * 10) / 10}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
