import React, { useState } from 'react';
import {
  X,
  Globe,
  BarChart3,
  ShieldCheck,
  Check,
  RefreshCw,
  ExternalLink,
  Lock,
  Users
} from 'lucide-react';
import {
  getAnalyticsConfig,
  saveAnalyticsConfig,
  fetchLiveVisitorCount,
  AnalyticsConfig
} from '../services/analytics';
import { playPop } from '../utils/audio';

interface CloudSyncSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVisitorCountUpdated?: (count: number, isLive: boolean) => void;
}

export const CloudSyncSettingsModal: React.FC<CloudSyncSettingsModalProps> = ({
  isOpen,
  onClose,
  onVisitorCountUpdated
}) => {
  if (!isOpen) return null;

  // GoatCounter & GA4 State
  const [analyticsCfg, setAnalyticsCfg] = useState<AnalyticsConfig>(() => getAnalyticsConfig());
  const [isTestingAnalytics, setIsTestingAnalytics] = useState(false);
  const [analyticsTestResult, setAnalyticsTestResult] = useState<string | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Test GoatCounter connection
  const handleTestGoatCounter = async () => {
    setIsTestingAnalytics(true);
    setAnalyticsTestResult(null);
    try {
      const res = await fetchLiveVisitorCount(analyticsCfg.goatCounterCode);
      if (res.isLive) {
        setAnalyticsTestResult(`✓ Connected to GoatCounter (${analyticsCfg.goatCounterCode})! Live visitors: ${res.count.toLocaleString()}`);
        onVisitorCountUpdated?.(res.count, true);
      } else {
        setAnalyticsTestResult(`ℹ️ Using local counter (${res.count.toLocaleString()}). Once published to GitHub Pages, GoatCounter serves worldwide view counts.`);
        onVisitorCountUpdated?.(res.count, false);
      }
    } catch {
      setAnalyticsTestResult('⚠️ Could not connect to GoatCounter endpoint. Verify your code.');
    } finally {
      setIsTestingAnalytics(false);
    }
  };

  // Save analytics settings
  const handleSaveAnalytics = () => {
    playPop();
    saveAnalyticsConfig(analyticsCfg);
    setSaveSuccessMessage('Analytics settings saved!');
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-xl w-full border-2 border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-white font-display">
                Visitor Analytics &amp; Privacy Architecture
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                GoatCounter Analytics · Google Analytics · Zero-Database Privacy
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {saveSuccessMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{saveSuccessMessage}</span>
            </div>
          )}

          {/* Privacy Guarantee Card */}
          <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>How 100% Privacy &amp; Multi-User Isolation Works</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              Because this website is hosted on <strong>GitHub Pages</strong> without any shared backend database, every student who visits gets their own completely isolated browser session.
            </p>
            <ul className="text-[11px] list-disc pl-4 space-y-1 opacity-90">
              <li><strong>Student A</strong> in Manila and <strong>Student B</strong> in Cebu can compute at the exact same time without ever seeing each other's grades.</li>
              <li>Calculations are saved strictly in each user's own <code>localStorage</code>.</li>
              <li>Only the <strong>total visitor count</strong> is tracked across the globe.</li>
            </ul>
          </div>

          {/* GoatCounter Domain Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              GoatCounter Code / Subdomain (Counts Worldwide Visitors):
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                  https://
                </span>
                <input
                  type="text"
                  value={analyticsCfg.goatCounterCode}
                  onChange={(e) =>
                    setAnalyticsCfg({ ...analyticsCfg, goatCounterCode: e.target.value.trim() })
                  }
                  placeholder="tala-deped"
                  className="w-full pl-18 pr-28 py-2 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                  .goatcounter.com
                </span>
              </div>
              <button
                type="button"
                onClick={handleTestGoatCounter}
                disabled={isTestingAnalytics}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingAnalytics ? 'animate-spin' : ''}`} />
                <span>Test API</span>
              </button>
            </div>
            {analyticsTestResult && (
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                {analyticsTestResult}
              </p>
            )}
          </div>

          {/* Google Analytics ID (Optional) */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Google Analytics 4 Measurement ID (Optional):
            </label>
            <input
              type="text"
              value={analyticsCfg.googleAnalyticsId}
              onChange={(e) =>
                setAnalyticsCfg({ ...analyticsCfg, googleAnalyticsId: e.target.value.trim() })
              }
              placeholder="e.g. G-XXXXXXXXXX"
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
            />
            <span className="text-[10px] text-slate-500 block">
              If provided, tracks pageviews anonymously without recording any student grades.
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
            <a
              href="https://www.goatcounter.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Get free GoatCounter code</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="button"
              onClick={handleSaveAnalytics}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
