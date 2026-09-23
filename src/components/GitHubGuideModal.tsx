import React from 'react';
import { X, ExternalLink, Globe, BarChart3, Database, ShieldCheck, CheckCircle2, Code2, Download } from 'lucide-react';

interface GitHubGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubGuideModal: React.FC<GitHubGuideModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await fetch('/tala-updated-project.zip');
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'tala-updated-project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch {
      window.open('/tala-updated-project.zip', '_blank');
    } finally {
      setDownloading(false);
    }
  };

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
                Push to GitHub (elibelleza11/TALA-3-Term-Grade-Calculator)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All latest changes, HTML builds, and the interactive climbing Tali are packaged and ready to push!
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

        {/* Quick Push Instructions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-500" />
              <span>How to update your GitHub repository</span>
            </h4>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="btn-3d px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Preparing ZIP...' : 'Download Updated ZIP (366 KB)'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed space-y-3">
            <p>
              GitHub requires authentication (either your GitHub password token or an authenticated browser session) before changes can appear on <strong><code>github.com/elibelleza11/TALA-3-Term-Grade-Calculator</code></strong>. Here are the 2 easiest ways to update it right now:
            </p>

            <div className="bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900 space-y-2">
              <span className="font-extrabold text-indigo-900 dark:text-indigo-200 block text-xs">
                Option 1: Fastest via GitHub Web (No Terminal Needed)
              </span>
              <ol className="list-decimal pl-5 space-y-1 text-slate-600 dark:text-slate-300">
                <li>
                  Click the green <strong>"Download Updated ZIP"</strong> button above to download <code>tala-updated-project.zip</code>.
                </li>
                <li>
                  Extract the zip file on your computer.
                </li>
                <li>
                  Open your repository at <a href="https://github.com/elibelleza11/TALA-3-Term-Grade-Calculator" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-bold">github.com/elibelleza11/TALA-3-Term-Grade-Calculator</a>.
                </li>
                <li>
                  Click <strong>"Add file" ➔ "Upload files"</strong>, drag and drop the extracted files (especially the <code>docs/</code> folder and <code>index.html</code>), and click <strong>"Commit changes"</strong>!
                </li>
              </ol>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900 space-y-2">
              <span className="font-extrabold text-indigo-900 dark:text-indigo-200 block text-xs">
                Option 2: Push via Command Line with Personal Access Token (PAT)
              </span>
              <p className="text-slate-600 dark:text-slate-300">
                Because GitHub discontinued password authentication for git operations, generate a token at <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 underline">GitHub Settings ➔ Developer Settings ➔ Tokens</a> (with <code>repo</code> scope), then run:
              </p>
              <div className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto">
                git push https://&lt;YOUR_TOKEN&gt;@github.com/elibelleza11/TALA-3-Term-Grade-Calculator.git main --force
              </div>
              <p className="text-[11px] text-slate-500">
                💡 Tip: If you prefer, you can also paste your GitHub Personal Access Token directly to me in the prompt and I will immediately push all commits directly to your GitHub repo on your behalf!
              </p>
            </div>
          </div>
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
