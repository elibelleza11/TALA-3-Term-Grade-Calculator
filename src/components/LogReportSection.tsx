import React, { useState } from 'react';
import { LogEntry } from '../types';
import {
  ShieldCheck,
  Lock,
  Search,
  Filter,
  Trash2,
  Download,
  Calendar,
  BookOpen,
  Award,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { playPop } from '../utils/audio';

interface LogReportSectionProps {
  logs: LogEntry[];
  totalVisits: number;
  totalCalculations: number;
  onClearLogs?: () => void;
  onExportLogs?: () => void;
}

export const LogReportSection: React.FC<LogReportSectionProps> = ({
  logs,
  totalVisits,
  totalCalculations,
  onClearLogs,
  onExportLogs
}) => {
  const [filterTerm, setFilterTerm] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = logs.filter((entry) => {
    if (filterTerm !== 'all' && entry.term !== filterTerm) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchGrade = entry.gradeLevel.toLowerCase().includes(q);
      const matchSection = entry.section.toLowerCase().includes(q);
      const matchArea = entry.learningArea.toLowerCase().includes(q);
      const matchStudent = entry.studentName.toLowerCase().includes(q);
      if (!matchGrade && !matchSection && !matchArea && !matchStudent) return false;
    }
    return true;
  });

  const getDescriptorBadge = (descriptor: string) => {
    switch (descriptor) {
      case 'Advancing':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'Benchmarking':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'Connecting':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'Developing':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border-orange-300 dark:border-orange-700';
      default:
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-700';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border-2 border-slate-200/90 dark:border-slate-700 shadow-xs transition-all">
      {/* Header with privacy badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 dark:border-slate-700">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white font-display">
              My Calculation History &amp; Activity Log
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              {logs.length} saved
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            100% Private to your device. Multiple users can access this site at the same time worldwide without seeing or overriding each other's data.
          </p>
        </div>

        {/* Privacy Protection Notice Tag */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Private to Your Device Only</span>
          </div>

          {onExportLogs && logs.length > 0 && (
            <button
              type="button"
              onClick={() => {
                playPop();
                onExportLogs();
              }}
              className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-300 dark:border-slate-600 transition-colors cursor-pointer"
              title="Export my calculation records as JSON"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {onClearLogs && logs.length > 0 && (
            <button
              type="button"
              onClick={() => {
                playPop();
                if (window.confirm('Clear your private calculation history on this device?')) {
                  onClearLogs();
                }
              }}
              className="p-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
              title="Clear calculation history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject, section, student..."
            className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            {['all', 'Term 1', 'Term 2', 'Term 3'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  playPop();
                  setFilterTerm(t);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filterTerm === t
                    ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t === 'all' ? 'All Terms' : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Table */}
      {filteredLogs.length === 0 ? (
        <div className="py-12 px-4 text-center bg-slate-50/60 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
            No calculation records yet on this device
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            Fill in your assessment scores above and click <strong>🌟 REVEAL MY GRADES 🌟</strong>. Your computed term rating and indicator will be saved here privately!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 px-3.5">Time</th>
                <th className="py-3 px-3.5">Learner &amp; Section</th>
                <th className="py-3 px-3.5">Subject &amp; Term</th>
                <th className="py-3 px-3.5 text-center">Transmuted Grade</th>
                <th className="py-3 px-3.5 text-right">Descriptor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 font-medium">
              {filteredLogs.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <td className="py-3 px-3.5 text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {entry.formattedTime}
                  </td>
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{entry.studentName}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                      {entry.gradeLevel} · {entry.section}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      {entry.learningArea}
                    </span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                      {entry.term}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-center whitespace-nowrap">
                    <span className="font-mono text-base font-black text-slate-900 dark:text-white">
                      {entry.transmutedGrade}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${getDescriptorBadge(
                        entry.descriptor
                      )}`}
                    >
                      {entry.descriptor}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Explanation Banner */}
      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>DepEd Privacy &amp; Concurrency:</strong> Your scores and grade calculations never leave your browser. They are safely isolated from all other users accessing the site.
          </span>
        </div>
      </div>
    </div>
  );
};
