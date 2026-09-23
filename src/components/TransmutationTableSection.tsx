import React, { useState, useMemo } from 'react';
import {
  TRANSMUTATION_TABLE_2026_2027,
  findTransmutationRow,
  DESCRIPTORS_CONFIG,
  TransmutationRow
} from '../data/depedGrading';
import { DescriptorLevel } from '../types';
import { playPop, playCelebrationChime } from '../utils/audio';
import {
  Search,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Info,
  ArrowRight,
  Calculator,
  SlidersHorizontal,
  Flame,
  Star
} from 'lucide-react';

interface TransmutationTableSectionProps {
  currentInitialGrade?: number;
  onSelectInitialGrade?: (grade: number) => void;
}

export const TransmutationTableSection: React.FC<TransmutationTableSectionProps> = ({
  currentInitialGrade,
  onSelectInitialGrade
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(
    typeof currentInitialGrade === 'number' && !isNaN(currentInitialGrade)
      ? currentInitialGrade.toFixed(1)
      : ''
  );
  const [selectedFilter, setSelectedFilter] = useState<'All' | DescriptorLevel>('All');

  // Interactive Score Finder lookup
  const parsedSearch = parseFloat(searchQuery);
  const matchedRow = useMemo(() => {
    if (!isNaN(parsedSearch) && parsedSearch >= 0 && parsedSearch <= 100) {
      return findTransmutationRow(parsedSearch);
    }
    return null;
  }, [parsedSearch]);

  const filteredRows = useMemo(() => {
    if (selectedFilter === 'All') {
      return TRANSMUTATION_TABLE_2026_2027;
    }
    return TRANSMUTATION_TABLE_2026_2027.filter((row) => row.descriptor === selectedFilter);
  }, [selectedFilter]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border-2 border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-2xl font-bold shadow-xs">
            📊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-display">
                Transmutation Table (SY 2026–2027)
              </h3>
              <span className="hidden sm:inline-block px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase rounded-full">
                60-Based Transitional
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Official DepEd conversion of Initial Raw Scores to Transmuted Term Grades.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="btn-3d px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl transition-all border-b-3 border-slate-300 dark:border-slate-600 flex items-center gap-1.5 cursor-pointer select-none"
            title="Print or save PDF of transmutation table"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Table</span>
          </button>
        </div>
      </div>

      {/* WHY THIS TRANSITIONAL TABLE EXPLAINER CARD */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50/60 to-blue-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-blue-950/30 rounded-2xl p-4 sm:p-5 border-2 border-emerald-200 dark:border-emerald-800 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <h4 className="text-sm font-black text-slate-900 dark:text-white font-display">
            About the SY 2026–2027 Transitional Transmutation Table
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900">
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400 block mb-0.5">
              🎯 75 Passing Mark (Connecting)
            </span>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              An initial score of <strong>70.00%</strong> gives a transmuted grade of <strong>75</strong>.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900">
            <span className="font-extrabold text-blue-700 dark:text-blue-400 block mb-0.5">
              🛡️ 60-Based Transmutation
            </span>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              The lowest grade is 60 instead of 0, helping students transition smoothly under the 3-term calendar.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900">
            <span className="font-extrabold text-amber-700 dark:text-amber-400 block mb-0.5">
              📘 Official for SY 2026–2027
            </span>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Used this school year across all Elementary and Secondary learning areas.
            </p>
          </div>
        </div>
      </div>

      {/* QUICK SCORE LOOKUP TOOL */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
            <Search className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Quick Score Finder</span>
          </label>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Type any initial score (0 to 100) to find the transmuted grade immediately
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. 78.5, 60.0, 92.4"
              className="w-full px-4 py-2.5 text-sm font-bold bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:border-emerald-500 focus:outline-none text-slate-900 dark:text-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[60, 75, 80, 85, 90, 95].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  playPop();
                  setSearchQuery(val.toString());
                }}
                className="btn-3d px-2.5 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border-b-2 border-slate-300 dark:border-slate-700 hover:border-emerald-400 cursor-pointer select-none"
              >
                {val}%
              </button>
            ))}
          </div>
        </div>

        {/* Live Lookup Result Banner */}
        {matchedRow && (
          <div
            className="p-3.5 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in"
            style={{
              backgroundColor: DESCRIPTORS_CONFIG[matchedRow.descriptor].bgColor,
              borderColor: DESCRIPTORS_CONFIG[matchedRow.descriptor].borderColor
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{DESCRIPTORS_CONFIG[matchedRow.descriptor].icon}</span>
              <div>
                <span className="text-xs font-black uppercase tracking-wider block" style={{ color: DESCRIPTORS_CONFIG[matchedRow.descriptor].textColor }}>
                  Initial Score: {parsedSearch.toFixed(2)}% (Range: {matchedRow.initialRange})
                </span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Descriptor: {matchedRow.descriptor}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 shadow-xs border border-black/10 text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Transmuted Grade</span>
                <span className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">
                  {matchedRow.transmutedGrade}
                </span>
              </div>

              {matchedRow.isPassingThreshold && (
                <span className="px-2.5 py-1 bg-amber-400 text-amber-950 rounded-lg text-xs font-black">
                  Passing Mark! ✓
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
          <SlidersHorizontal className="w-3 h-3" /> Filter:
        </span>
        {(['All', 'Advancing', 'Benchmarking', 'Connecting', 'Developing', 'Emerging'] as const).map((filter) => {
          const isSelected = selectedFilter === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => {
                playPop();
                setSelectedFilter(filter);
              }}
              className={`btn-3d px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer border-b-2 select-none ${
                isSelected
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-950 dark:border-slate-300 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              {filter}
              {filter === 'Developing' && ' (Passing)'}
            </button>
          );
        })}
      </div>

      {/* THE OFFICIAL TRANSMUTATION TABLE */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
              <th className="py-3 px-3">IG (Min)</th>
              <th className="py-3 px-3">IG (Max)</th>
              <th className="py-3 px-3 text-center font-black">Transmuted / Numerical Grade</th>
              <th className="py-3 px-3">Descriptor</th>
              <th className="py-3 px-4">General Description</th>
              <th className="py-3 px-3 text-right">Academic Standing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
            {filteredRows.map((row) => {
              const isMatched = matchedRow?.transmutedGrade === row.transmutedGrade;
              const desc = DESCRIPTORS_CONFIG[row.descriptor];

              return (
                <tr
                  key={row.transmutedGrade}
                  className={`transition-colors ${
                    row.isPassingThreshold
                      ? 'bg-amber-50/80 dark:bg-amber-950/40 font-bold border-y-2 border-amber-400'
                      : isMatched
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900/30'
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {row.minInitial.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {row.maxInitial.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-block font-mono text-base font-black px-2.5 py-0.5 rounded-lg ${
                        row.isPassingThreshold
                          ? 'bg-amber-400 text-amber-950 shadow-xs'
                          : row.transmutedGrade >= 90
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : row.transmutedGrade >= 75
                          ? 'text-slate-900 dark:text-white'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {row.transmutedGrade}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: desc.bgColor,
                        color: desc.textColor,
                        borderColor: desc.borderColor
                      }}
                    >
                      <span>{desc.icon}</span>
                      <span>{row.descriptor}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed max-w-xs">
                    {/* Show primary definition on landmark grades */}
                    {row.transmutedGrade === 100 && 'Consistently demonstrates skills and understanding that meet or exceed standards with independence, flexibility, and depth.'}
                    {row.transmutedGrade === 89 && 'Demonstrates expected grade-level skills and understanding competently and independently.'}
                    {row.transmutedGrade === 79 && 'Demonstrates sufficient understanding and application of grade-level standards with occasional guidance and support.'}
                    {row.transmutedGrade === 74 && 'Demonstrates partial understanding and inconsistent application of skills, requires targeted support and scaffolding.'}
                    {row.transmutedGrade === 64 && 'Does not yet demonstrate foundational skills and understanding; requires intensive support.'}
                    {![100, 89, 79, 74, 64].includes(row.transmutedGrade) && (
                      <span className="text-slate-400 dark:text-slate-500 italic">
                        {row.descriptor} range
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    {row.isPassingThreshold ? (
                      <span className="inline-flex items-center gap-1 text-xs font-black text-amber-800 dark:text-amber-300">
                        <span>⭐ Passing Threshold (75)</span>
                      </span>
                    ) : row.transmutedGrade >= 98 ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        ★ With Highest Honors
                      </span>
                    ) : row.transmutedGrade >= 95 ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        ★ With High Honors
                      </span>
                    ) : row.transmutedGrade >= 90 ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        ★ With Honors
                      </span>
                    ) : row.transmutedGrade >= 80 ? (
                      <span className="text-blue-600 dark:text-blue-400 font-bold">
                        ✓ Honors Baseline
                      </span>
                    ) : row.transmutedGrade >= 75 ? (
                      <span className="text-slate-600 dark:text-slate-400">
                        ✓ Passed
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 font-bold">
                        ! Learning Support
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Helpful summary footer */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            Initial Grade is computed as: (WW% × WW Weight) + (PT% × PT Weight) + (Summative% × Exam Weight).
          </span>
        </div>
        <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0">
          Transmuted using DepEd SY 2026–2027 60-Based Standards
        </span>
      </div>
    </div>
  );
};
