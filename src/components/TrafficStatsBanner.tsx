import React from 'react';
import { Eye, Calculator, Lock, School, Globe, CheckCircle2 } from 'lucide-react';

interface TrafficStatsBannerProps {
  totalVisits: number;
  totalCalculations: number;
  isLiveGoatCounter?: boolean;
  onOpenSettings?: () => void;
}

export const TrafficStatsBanner: React.FC<TrafficStatsBannerProps> = ({
  totalVisits,
  totalCalculations,
  isLiveGoatCounter = false,
  onOpenSettings
}) => {
  return (
    <div className="space-y-2 select-none">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Total Site Visitors (Worldwide Pageviews via GoatCounter) */}
        <div
          onClick={onOpenSettings}
          className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 sm:p-4 border-2 border-slate-200/90 dark:border-slate-700 shadow-2xs flex items-center gap-3 cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500 transition-all group"
          title="Click to view Visitor Analytics settings"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Site Visitors
              </span>
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  isLiveGoatCounter ? 'bg-emerald-500 animate-pulse' : 'bg-blue-400'
                }`}
                title={isLiveGoatCounter ? 'Live GoatCounter connected' : 'Anonymous pageview count'}
              />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-xl sm:text-2xl font-black text-slate-800 dark:text-white tabular-nums">
                {totalVisits.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                {isLiveGoatCounter ? 'live' : 'views'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Grades Computed on this Device */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 sm:p-4 border-2 border-slate-200/90 dark:border-slate-700 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              My Calculations
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
                {totalCalculations.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">saved</span>
            </div>
          </div>
        </div>

        {/* 3. Privacy & Concurrent Multi-User Isolation */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 sm:p-4 border-2 border-slate-200/90 dark:border-slate-700 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              100% Private
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-sm font-extrabold text-amber-900 dark:text-amber-200">
                Zero Overrides
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">isolated</span>
            </div>
          </div>
        </div>

        {/* 4. Public DepEd Calendar Compliance */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 sm:p-4 border-2 border-slate-200/90 dark:border-slate-700 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center shrink-0">
            <School className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Curriculum Standard
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-sm font-extrabold text-purple-950 dark:text-purple-300">
                DO 15, s. 2026
              </span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">3-Term</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Info Strip */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Independent sessions: Multiple users can compute simultaneously without seeing each other's grades.</span>
        </div>
        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold cursor-pointer"
          >
            Visitor Analytics Settings →
          </button>
        )}
      </div>
    </div>
  );
};
