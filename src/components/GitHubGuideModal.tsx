import React from 'react';
import { X, ExternalLink, Globe, BarChart3, Database, ShieldCheck, CheckCircle2, Code2 } from 'lucide-react';

interface GitHubGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubGuideModal: React.FC<GitHubGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
              <Globe className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">
                Publishing TALA on GitHub Pages &amp; Tracking Visitors
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Architectural advice on embedded demo data vs. blank slate &amp; visitor analytics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question 1: Embedded Demo Data vs Blank */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>1. Embedded Demo Data vs. Blank Slate on GitHub</span>
          </h4>
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed space-y-2">
            <p>
              <strong>Best Practice Recommendation:</strong> When deploying to GitHub for public students, teachers, and parents:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Start with Clean Blanks:</strong> The user should open the calculator with empty fields so they can immediately type their actual name, section, and raw test scores without having to delete placeholder numbers.
              </li>
              <li>
                <strong>Provide an Instant "Load Demo Data" Button:</strong> We have included a prominent <em>"Load Sample Scores"</em> and <em>"Start Blank"</em> button right on top of the calculator. This lets first-time visitors explore sample computations with one click, while keeping real usage friction-free!
              </li>
            </ul>
          </div>
        </div>

        {/* Question 2: How to Avoid the Blank White Page on GitHub Pages */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            <span>2. Publishing to GitHub Pages (Fixing the "Blank White Page")</span>
          </h4>
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed space-y-3">
            <p>
              <strong>Why a white page happens:</strong> The raw <code>index.html</code> at the root is a template that references TypeScript source code (<code>/src/main.tsx</code>). Browsers cannot run raw TypeScript directly without Vite compiling it into static JavaScript!
            </p>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-indigo-100 dark:border-slate-700 space-y-1.5 text-slate-700 dark:text-slate-300">
              <p className="font-bold text-indigo-700 dark:text-indigo-400">
                ✨ Option A: GitHub Actions (Recommended · 1-Click Setup)
              </p>
              <p className="text-[11px]">
                We added <code>.github/workflows/deploy.yml</code> to your repository.
                Go to GitHub repository → <strong>Settings</strong> → <strong>Pages</strong> → set <strong>Source</strong> to <strong>"GitHub Actions"</strong>. GitHub will automatically build and publish the live site on every push!
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-indigo-100 dark:border-slate-700 space-y-1.5 text-slate-700 dark:text-slate-300">
              <p className="font-bold text-emerald-700 dark:text-emerald-400">
                🚀 Option B: Deploy from the /docs Folder (Pre-built &amp; Ready)
              </p>
              <p className="text-[11px]">
                We generated the pre-compiled <strong><code>docs/index.html</code></strong> and <strong><code>docs/assets/</code></strong> inside this repository.
                Go to GitHub repository → <strong>Settings</strong> → <strong>Pages</strong> → set <strong>Source</strong> to <strong>"Deploy from a branch"</strong> → select <strong>main</strong> branch and folder <strong>/docs</strong> → click <strong>Save</strong>!
              </p>
            </div>
          </div>
        </div>

        {/* Question 3: How to Track Visitors on GitHub Pages */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <span>3. How to Track Visitors on GitHub Pages (Zero-Leakage Privacy)</span>
          </h4>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-3">
            <p>
              Because GitHub Pages hosts <strong>static client-side websites</strong> (no custom Node.js backend server), here are the 3 best ways to monitor visitors:
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-slate-900 dark:text-white">
                  A. Built-in GitHub Repository Insights (Zero Setup!)
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Go to your GitHub repository → click the <strong>Insights</strong> tab → <strong>Traffic</strong>. GitHub automatically displays total views, unique daily visitors, and top referral websites for the past 14 days without modifying any code.
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-slate-900 dark:text-white">
                  B. TALA Built-in LocalStorage Activity Tracker
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  The app automatically logs every grade calculation with timestamp, grade level, section, and blurred credentials into <code>localStorage</code>. It maintains local visit counts and active learner indicators without sending personal student data to external servers.
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-slate-900 dark:text-white">
                  C. Free Privacy-First Analytics (e.g. GoatCounter or Google Analytics)
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  If you want cross-device live visitor counters for free, you can add a single line script from <em>GoatCounter (goatcounter.com)</em> or <em>Google Analytics</em> into <code>index.html</code>. No credit card or backend is required!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl shadow hover:bg-slate-800 transition-colors"
          >
            Understood, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
