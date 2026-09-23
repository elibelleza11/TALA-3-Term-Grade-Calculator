import React, { useState, useMemo } from 'react';
import { GradeLevelConfig, LearningAreaConfig } from '../types';
import { getGradeConfig, calculateMapehAverage, calculateHonorAwards, getDescriptor } from '../data/depedGrading';
import { playPop, playSuccessChime } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  Trophy,
  Sparkles,
  BookOpen,
  RotateCcw,
  Printer,
  ChevronRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

interface GwaHonorsCalculatorProps {
  gradeLevel: string;
  onGradeLevelChange: (grade: string) => void;
  studentName: string;
  schoolName: string;
  learningAreas?: import('../types').LearningAreaConfig[];
}

interface SubjectRowState {
  id: string;
  name: string;
  isMapehSub?: boolean; // Music & Arts or PE & Health
  isMapehParent?: boolean;
  isCustom?: boolean;
  term1: number | '';
  term2: number | '';
  term3: number | '';
}

export const GwaHonorsCalculator: React.FC<GwaHonorsCalculatorProps> = ({
  gradeLevel,
  onGradeLevelChange,
  studentName,
  schoolName,
  learningAreas
}) => {
  const gradeConfig = getGradeConfig(gradeLevel);
  const activeAreas = learningAreas || gradeConfig.learningAreas;

  // Helper to build initial rows from activeAreas and automatically generate the composite MAPEH row
  const buildInitialRows = (areas: LearningAreaConfig[]): SubjectRowState[] => {
    const rowsList: SubjectRowState[] = [];
    let hasMusicOrArts = false;
    let hasPeOrHealth = false;

    areas.forEach((area) => {
      const isSub = area.id.includes('music_arts') || area.id.includes('pe_health');
      if (area.id.includes('music_arts')) hasMusicOrArts = true;
      if (area.id.includes('pe_health')) hasPeOrHealth = true;

      // Skip any standalone MAPEH row since MAPEH is now computed
      if (area.id.includes('_mapeh')) return;

      rowsList.push({
        id: area.id,
        name: area.name,
        isMapehSub: isSub,
        isMapehParent: false,
        isCustom: area.isCustom,
        term1: 90,
        term2: 92,
        term3: 91
      });
    });

    // If both Music & Arts and PE & Health exist, insert the composite MAPEH row!
    if (hasMusicOrArts && hasPeOrHealth) {
      rowsList.push({
        id: 'composite_mapeh',
        name: 'MAPEH',
        isMapehSub: false,
        isMapehParent: true,
        isCustom: false,
        term1: 90,
        term2: 92,
        term3: 91
      });
    }

    return rowsList;
  };

  const [rows, setRows] = useState<SubjectRowState[]>(() => buildInitialRows(activeAreas));

  // When grade level or learningAreas changes, reset rows
  React.useEffect(() => {
    setRows(buildInitialRows(activeAreas));
  }, [activeAreas]);

  // Keep MAPEH parent automatically updated if Music & Arts and PE & Health are present
  const updatedRowsWithMapeh = useMemo(() => {
    const cloned = [...rows];
    const musicRow = cloned.find((r) => r.id.includes('music_arts'));
    const peRow = cloned.find((r) => r.id.includes('pe_health'));
    const mapehRowIndex = cloned.findIndex((r) => r.isMapehParent);

    if (musicRow && peRow && mapehRowIndex !== -1) {
      const calcTerm = (tKey: 'term1' | 'term2' | 'term3') => {
        const m = musicRow[tKey];
        const p = peRow[tKey];
        if (typeof m === 'number' && typeof p === 'number') {
          return calculateMapehAverage(m, p);
        }
        if (typeof m === 'number') return m;
        if (typeof p === 'number') return p;
        return '';
      };

      cloned[mapehRowIndex] = {
        ...cloned[mapehRowIndex],
        term1: calcTerm('term1'),
        term2: calcTerm('term2'),
        term3: calcTerm('term3')
      };
    }

    return cloned;
  }, [rows]);

  const handleCellChange = (id: string, termKey: 'term1' | 'term2' | 'term3', val: string) => {
    const num = val === '' ? '' : Math.min(100, Math.max(0, parseInt(val, 10) || 0));
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [termKey]: num } : r))
    );
  };

  const handleResetBlank = () => {
    playPop();
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        term1: '',
        term2: '',
        term3: ''
      }))
    );
  };

  const handleLoadSample = (type: 'honor' | 'disqualified' | 'high_honors') => {
    playPop();
    setRows((prev) =>
      prev.map((r, idx) => {
        if (r.isMapehParent) {
          return { ...r, term1: '', term2: '', term3: '' };
        }
        let base = 91;
        if (type === 'high_honors') base = 96;
        if (type === 'disqualified') {
          // One subject with 78 to demonstrate the DepEd <80 disqualification rule
          if (idx === 1) return { ...r, term1: 78, term2: 88, term3: 90 };
          base = 92;
        }
        const jitter = (idx % 3);
        return {
          ...r,
          term1: Math.min(100, base + jitter),
          term2: Math.min(100, base + jitter + 1),
          term3: Math.min(100, base + jitter)
        };
      })
    );
  };

  // Compute awards
  const awardsResult = useMemo(() => {
    return calculateHonorAwards(
      updatedRowsWithMapeh.map((r) => ({
        id: r.id,
        name: r.name,
        term1: r.term1,
        term2: r.term2,
        term3: r.term3,
        isMapehSub: r.isMapehSub,
        mapehParent: r.isMapehParent
      }))
    );
  }, [updatedRowsWithMapeh]);

  const triggerHonorConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899']
      });
      playSuccessChime(true);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Explainer */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border-2 border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center text-2xl font-bold shadow-xs">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-display">
                  3-Term GWA &amp; Honors Calculator
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Check your term GWA and see if you qualify for academic honors!
              </p>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleResetBlank}
              className="px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Blank</span>
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('honor')}
              className="px-3 py-1.5 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl transition-colors border border-emerald-200 dark:border-emerald-700"
            >
              Sample: With Honors
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('disqualified')}
              className="px-3 py-1.5 text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded-xl transition-colors border border-amber-200 dark:border-amber-700"
              title="Demonstrates what happens when a student has GWA > 90 but one subject has a grade below 80"
            >
              Test: &lt;80 Rule
            </button>
          </div>
        </div>

        {/* DepEd Honor Criteria Rule Callout */}
        <div className="mt-4 p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              Honors Quick Guide:
            </p>
            <p className="text-[11px] leading-relaxed text-blue-900 dark:text-blue-300">
              <strong>• With Highest Honors:</strong> 98–100 · <strong>• With High Honors:</strong> 95–97.99 · <strong>• With Honors:</strong> 90–94.99
              <br />
              <strong className="text-amber-700 dark:text-amber-300">⭐ Golden Rule:</strong> To qualify, you must have <strong>no grade below 80</strong> in any subject or term!
            </p>
          </div>
        </div>
      </div>

      {/* Awards Showcase Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Term 1 GWA */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 border-slate-200 dark:border-slate-700 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Term 1 GWA
          </span>
          <div className="my-1 flex items-baseline gap-1">
            <span className="font-mono text-3xl font-black text-slate-800 dark:text-white">
              {awardsResult.term1Gwa !== null ? awardsResult.term1Gwa.toFixed(2) : '--'}
            </span>
            <span className="text-xs text-slate-400 font-bold">%</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Average of all learning areas</span>
        </div>

        {/* Term 2 GWA */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 border-slate-200 dark:border-slate-700 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Term 2 GWA
          </span>
          <div className="my-1 flex items-baseline gap-1">
            <span className="font-mono text-3xl font-black text-slate-800 dark:text-white">
              {awardsResult.term2Gwa !== null ? awardsResult.term2Gwa.toFixed(2) : '--'}
            </span>
            <span className="text-xs text-slate-400 font-bold">%</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Average of all learning areas</span>
        </div>

        {/* Term 3 GWA */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 border-slate-200 dark:border-slate-700 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Term 3 GWA
          </span>
          <div className="my-1 flex items-baseline gap-1">
            <span className="font-mono text-3xl font-black text-slate-800 dark:text-white">
              {awardsResult.term3Gwa !== null ? awardsResult.term3Gwa.toFixed(2) : '--'}
            </span>
            <span className="text-xs text-slate-400 font-bold">%</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Average of all learning areas</span>
        </div>

        {/* Final General Weighted Average (GWA) */}
        <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 text-white rounded-2xl p-4 border-2 border-emerald-400 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-100 block">
                Final Annual GWA
              </span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            </div>
            <div className="my-1 flex items-baseline gap-1">
              <span className="font-mono text-3xl sm:text-4xl font-black tracking-tight">
                {awardsResult.finalGwa > 0 ? awardsResult.finalGwa.toFixed(2) : '--'}
              </span>
              <span className="text-xs text-emerald-100 font-bold">%</span>
            </div>
          </div>
          <span className="text-[10px] text-emerald-100 font-medium">
            DepEd 3-Term Cumulative Rating
          </span>
        </div>
      </div>

      {/* Academic Award Status Banner */}
      <div
        className={`rounded-3xl p-5 sm:p-6 border-3 shadow-md transition-all ${
          awardsResult.isHonorEligible
            ? 'bg-gradient-to-r from-amber-50 to-amber-100/70 dark:from-amber-950/40 dark:to-yellow-950/30 border-amber-500 text-amber-950 dark:text-amber-200'
            : awardsResult.disqualificationReason
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-950 dark:text-rose-200'
            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="text-3xl sm:text-4xl shrink-0">
              {awardsResult.isHonorEligible ? '🎖️' : awardsResult.disqualificationReason ? '⚠️' : '📖'}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-80 block">
                Official DepEd Academic Standing
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight">
                {awardsResult.awardTitle}
              </h3>
              <p className="text-xs sm:text-sm font-medium mt-0.5 max-w-xl leading-relaxed">
                {awardsResult.isHonorEligible ? (
                  <span>
                    Congratulations! Qualified for DepEd Honors! Lowest grade recorded is{' '}
                    <strong>{awardsResult.lowestGrade}</strong> (meets &gt;= 80 criterion).
                  </span>
                ) : awardsResult.disqualificationReason ? (
                  <span className="text-rose-900 dark:text-rose-300 font-semibold">
                    {awardsResult.disqualificationReason}
                  </span>
                ) : (
                  <span>
                    Keep going! Minimum GWA for DepEd honors is <strong>90.00</strong> with no grade below <strong>80</strong>.
                  </span>
                )}
              </p>
            </div>
          </div>

          {awardsResult.isHonorEligible && (
            <button
              type="button"
              onClick={triggerHonorConfetti}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-900" />
              <span>Celebrate Honors 🎉</span>
            </button>
          )}
        </div>
      </div>

      {/* Grade Entry Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border-2 border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white font-display">
              Learning Areas Grade Matrix ({gradeLevel})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter the transmutated grade for each term. Notice how Music & Arts and PE & Health automatically calculate MAPEH.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-xs min-w-[560px]">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 text-[11px]">
              <tr>
                <th className="py-3 px-3.5">Learning Area</th>
                <th className="py-3 px-3 text-center">Term 1</th>
                <th className="py-3 px-3 text-center">Term 2</th>
                <th className="py-3 px-3 text-center">Term 3</th>
                <th className="py-3 px-3 text-center">Final Grade</th>
                <th className="py-3 px-3.5 text-right">Descriptor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
              {updatedRowsWithMapeh.map((row) => {
                const vals = [row.term1, row.term2, row.term3].filter((v) => typeof v === 'number') as number[];
                const finalSubj = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
                const desc = finalSubj ? getDescriptor(finalSubj) : null;

                const isMapehAuto = row.isMapehParent;
                const isSub = row.isMapehSub;

                // Check if any term is below 80
                const hasWarning = [row.term1, row.term2, row.term3].some(
                  (v) => typeof v === 'number' && v < 80
                );

                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors ${
                      isMapehAuto
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 font-bold'
                        : isSub
                        ? 'bg-slate-50/40 dark:bg-slate-900/20'
                        : ''
                    }`}
                  >
                    {/* Subject Name */}
                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center gap-2">
                        {isSub && <span className="text-slate-400 pl-2">↳</span>}
                        <div>
                          <span className={`font-semibold ${isMapehAuto ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-200'}`}>
                            {row.name}
                          </span>
                          {isMapehAuto && (
                            <span className="text-[10px] block text-emerald-700 dark:text-emerald-400 font-normal">
                              Automated average of Music & Arts + PE & Health
                            </span>
                          )}
                          {hasWarning && (
                            <span className="text-[10px] text-rose-600 dark:text-rose-400 block font-bold">
                              ⚠️ Grade below 80 disqualifies from honors
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Term 1 */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min="50"
                        max="100"
                        disabled={isMapehAuto}
                        value={row.term1}
                        onChange={(e) => handleCellChange(row.id, 'term1', e.target.value)}
                        placeholder="--"
                        className={`w-16 text-center font-mono font-bold text-xs py-1.5 px-1 rounded-lg border transition-all ${
                          typeof row.term1 === 'number' && row.term1 < 80
                            ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 text-rose-700 dark:text-rose-300'
                            : isMapehAuto
                            ? 'bg-emerald-100/60 dark:bg-emerald-900/50 border-emerald-300 text-emerald-800 dark:text-emerald-300 cursor-not-allowed'
                            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-emerald-500'
                        }`}
                      />
                    </td>

                    {/* Term 2 */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min="50"
                        max="100"
                        disabled={isMapehAuto}
                        value={row.term2}
                        onChange={(e) => handleCellChange(row.id, 'term2', e.target.value)}
                        placeholder="--"
                        className={`w-16 text-center font-mono font-bold text-xs py-1.5 px-1 rounded-lg border transition-all ${
                          typeof row.term2 === 'number' && row.term2 < 80
                            ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 text-rose-700 dark:text-rose-300'
                            : isMapehAuto
                            ? 'bg-emerald-100/60 dark:bg-emerald-900/50 border-emerald-300 text-emerald-800 dark:text-emerald-300 cursor-not-allowed'
                            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-emerald-500'
                        }`}
                      />
                    </td>

                    {/* Term 3 */}
                    <td className="py-2.5 px-2 text-center">
                      <input
                        type="number"
                        min="50"
                        max="100"
                        disabled={isMapehAuto}
                        value={row.term3}
                        onChange={(e) => handleCellChange(row.id, 'term3', e.target.value)}
                        placeholder="--"
                        className={`w-16 text-center font-mono font-bold text-xs py-1.5 px-1 rounded-lg border transition-all ${
                          typeof row.term3 === 'number' && row.term3 < 80
                            ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 text-rose-700 dark:text-rose-300'
                            : isMapehAuto
                            ? 'bg-emerald-100/60 dark:bg-emerald-900/50 border-emerald-300 text-emerald-800 dark:text-emerald-300 cursor-not-allowed'
                            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-emerald-500'
                        }`}
                      />
                    </td>

                    {/* Final Subject Grade */}
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                        {finalSubj !== null ? finalSubj : '--'}
                      </span>
                    </td>

                    {/* Descriptor */}
                    <td className="py-2.5 px-3.5 text-right">
                      {desc ? (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px]"
                          style={{
                            backgroundColor: desc.bgColor,
                            color: desc.color,
                            border: `1px solid ${desc.borderColor}`
                          }}
                        >
                          <span>{desc.icon}</span>
                          <span>{desc.level}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">--</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
