/**
 * TALA: Term Assessment & Learning Analytics
 * DepEd 3-Term Academic Calendar & Honors Calculator
 * Pursuant to DepEd Order No. 15, s. 2026 & DepEd Order No. 36, s. 2016
 * By Eli Belleza
 */

import React, { useState, useEffect } from 'react';
import {
  AcademicTerm,
  CalculationResult,
  LogEntry,
  ScoreItem
} from './types';
import {
  calculateTermGrade,
  getGradeConfig,
  getLearningArea
} from './data/depedGrading';
import { CarabaoTalaMascot } from './components/CarabaoTalaMascot';
import { StudentInfoForm } from './components/StudentInfoForm';
import { ScoreInputSection } from './components/ScoreInputSection';
import { GradeRevealCard } from './components/GradeRevealCard';
import { DescriptorsLegend } from './components/DescriptorsLegend';
import { LogReportSection } from './components/LogReportSection';
import { TrafficStatsBanner } from './components/TrafficStatsBanner';
import { PrintableGradeSlip } from './components/PrintableGradeSlip';
import { GwaHonorsCalculator } from './components/GwaHonorsCalculator';
import { GoalPlannerSection } from './components/GoalPlannerSection';
import { MapehAveragingCard } from './components/MapehAveragingCard';
import { GitHubGuideModal } from './components/GitHubGuideModal';
import { CloudSyncSettingsModal } from './components/CloudSyncSettingsModal';
import {
  applyAnalyticsScripts,
  fetchLiveVisitorCount,
  incrementLocalVisitCount,
  getLocalVisitCount,
  trackEvent
} from './services/analytics';
import {
  getStoredLogs,
  saveLogsToStorage,
  recordNewActivity,
  clearAllPrivateLogs,
  exportLogsAsJson,
  getLocalCalculationCount,
  incrementLocalCalculationCount
} from './services/globalSync';
import {
  isSoundMuted,
  setSoundMuted,
  playPop
} from './utils/audio';
import {
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  Github,
  Award,
  Layers,
  Info,
  ExternalLink,
  ChevronDown,
  RotateCcw,
  Sun,
  Moon,
  Calculator,
  Target,
  Music,
  BookOpen,
  Globe,
  Lock
} from 'lucide-react';

export default function App() {
  // Dark Mode State
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('tala_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tala_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tala_theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    playPop();
    setIsDark((prev) => !prev);
  };

  // Sound toggle state
  const [muted, setMuted] = useState<boolean>(() => isSoundMuted());

  // Active Tool Tab
  const [activeTab, setActiveTab] = useState<'component' | 'gwa_honors' | 'goal_planner' | 'mapeh_quick'>('component');

  // Student Profile State
  const [studentName, setStudentName] = useState<string>('Juan Dela Cruz');
  const [gradeLevel, setGradeLevel] = useState<string>('Grade 7');
  const [section, setSection] = useState<string>('Diamond');
  const [schoolName, setSchoolName] = useState<string>('Manila Science High School');
  const [term, setTerm] = useState<AcademicTerm>('Term 1');
  const [learningAreaId, setLearningAreaId] = useState<string>('g7_science');

  // Score Components State
  const [writtenWorks, setWrittenWorks] = useState<ScoreItem[]>([
    { id: 'ww_1', name: 'WW 1 (Quiz)', score: 18, highestScore: 20 },
    { id: 'ww_2', name: 'WW 2 (Journal)', score: 23, highestScore: 25 },
    { id: 'ww_3', name: 'WW 3 (Seatwork)', score: 19, highestScore: 20 }
  ]);

  const [performanceTasks, setPerformanceTasks] = useState<ScoreItem[]>([
    { id: 'pt_1', name: 'PT 1 (Lab Experiment)', score: 46, highestScore: 50 },
    { id: 'pt_2', name: 'PT 2 (Concept Poster)', score: 48, highestScore: 50 }
  ]);

  const [st1Score, setSt1Score] = useState<number | ''>(26);
  const [st1Total, setSt1Total] = useState<number | ''>(30);
  const [st2Score, setSt2Score] = useState<number | ''>(28);
  const [st2Total, setSt2Total] = useState<number | ''>(30);
  const [teScore, setTeScore] = useState<number | ''>(44);
  const [teTotal, setTeTotal] = useState<number | ''>(50);

  // Reveal State
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  // Modals
  const [showPrintSlip, setShowPrintSlip] = useState<boolean>(false);
  const [showGithubGuide, setShowGithubGuide] = useState<boolean>(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState<boolean>(false);

  // Activity Logs (100% private to this device via LocalStorage)
  const [logs, setLogs] = useState<LogEntry[]>(() => getStoredLogs());

  // Traffic Stats & GoatCounter Live status
  const [totalVisits, setTotalVisits] = useState<number>(() => getLocalVisitCount());
  const [isLiveGoatCounter, setIsLiveGoatCounter] = useState<boolean>(false);
  const [totalCalculations, setTotalCalculations] = useState<number>(() => getLocalCalculationCount());

  // Track page visit on mount via GoatCounter / GA4
  useEffect(() => {
    // 1. Inject analytics scripts
    applyAnalyticsScripts();

    // 2. Fetch live visitor count from GoatCounter API
    fetchLiveVisitorCount().then(({ count, isLive }) => {
      setTotalVisits(count);
      setIsLiveGoatCounter(isLive);
    }).catch(() => {
      const updated = incrementLocalVisitCount();
      setTotalVisits(updated);
    });
  }, []);

  // Sync logs state changes to localStorage
  useEffect(() => {
    saveLogsToStorage(logs);
  }, [logs]);

  // Current subject config
  const currentArea = getLearningArea(gradeLevel, learningAreaId);

  // Helper when any score is adjusted: automatically reset the revealed state
  const handleScoreAdjustment = () => {
    if (isRevealed) {
      setIsRevealed(false);
    }
  };

  // Reset all fields for a brand new learner
  const handleResetForNewLearner = () => {
    playPop();
    setStudentName('');
    setSection('');
    setSchoolName('');
    setWrittenWorks([
      { id: 'ww_1', name: 'WW 1', score: '', highestScore: 20 },
      { id: 'ww_2', name: 'WW 2', score: '', highestScore: 25 }
    ]);
    setPerformanceTasks([
      { id: 'pt_1', name: 'PT 1', score: '', highestScore: 50 }
    ]);
    setSt1Score('');
    setSt1Total(30);
    setSt2Score('');
    setSt2Total(30);
    teScore !== '' && setTeScore('');
    setTeTotal(50);
    setIsRevealed(false);
    setCalculationResult(null);
  };

  // Mascot dynamic reaction
  const getMascotMood = () => {
    if (isRevealed && calculationResult) {
      if (calculationResult.descriptor.level === 'Advancing') return 'celebrating';
      if (calculationResult.descriptor.level === 'Benchmarking') return 'excited';
      return 'encouraging';
    }
    return 'thinking';
  };

  const getMascotMessage = () => {
    if (isRevealed && calculationResult) {
      if (calculationResult.descriptor.level === 'Advancing') {
        return `Napakagaling! You achieved ADVANCING (${calculationResult.transmutedGrade}) in ${calculationResult.learningAreaName}! Reaching honors status! ⭐`;
      }
      if (calculationResult.descriptor.level === 'Benchmarking') {
        return `Magaling! You reached BENCHMARKING (${calculationResult.transmutedGrade}) in ${calculationResult.learningAreaName}! Solid mastery of competencies!`;
      }
      if (calculationResult.descriptor.level === 'Connecting') {
        return `Good job! You earned CONNECTING (${calculationResult.transmutedGrade})! You meet the minimum honor baseline!`;
      }
      if (calculationResult.descriptor.level === 'Developing') {
        return `You passed! DEVELOPING (${calculationResult.transmutedGrade}). Keep working hard for even higher marks!`;
      }
      return `EMERGING standing (${calculationResult.transmutedGrade}). Don't give up! Teacher consultation and practice will help you bounce back!`;
    }
    return `Mabuhay! I am Tala, your DepEd grade assistant. Your inputs and grades are 100% private to this device. Multiple students can use this site at the same time without interfering!`;
  };

  // Compute grade and save to private local storage
  const handleComputeAndReveal = () => {
    const res = calculateTermGrade(
      studentName,
      gradeLevel,
      section,
      schoolName,
      term,
      learningAreaId,
      writtenWorks,
      performanceTasks,
      st1Score,
      st1Total,
      st2Score,
      st2Total,
      teScore,
      teTotal
    );

    setCalculationResult(res);
    setIsRevealed(true);

    // Track analytics event via GoatCounter / Google Analytics
    trackEvent('grade_calculated', {
      gradeLevel: res.gradeLevel,
      term: res.term,
      subject: res.learningAreaName,
      descriptor: res.descriptor.level,
      transmutedGrade: res.transmutedGrade
    });

    // Increment private calculation counter
    const newCount = incrementLocalCalculationCount();
    setTotalCalculations(newCount);

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLog: LogEntry = {
      id: `log_${Date.now()}`,
      timestamp: Date.now(),
      formattedTime,
      gradeLevel: res.gradeLevel,
      section: res.section || 'Class Section',
      term: res.term,
      learningArea: res.learningAreaName,
      studentName: res.studentName || 'Learner',
      schoolName: res.schoolName || 'Public School',
      ipAddress: 'Local Device',
      transmutedGrade: res.transmutedGrade,
      descriptor: res.descriptor.level
    };

    // Save strictly to private LocalStorage
    const updated = recordNewActivity(newLog);
    setLogs(updated);
  };

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setSoundMuted(next);
    if (!next) playPop();
  };

  // Calculate current WW and PT percentages for the goal planner
  const currentWwRaw = writtenWorks.reduce((acc, curr) => acc + (typeof curr.score === 'number' ? curr.score : 0), 0);
  const currentWwHigh = writtenWorks.reduce((acc, curr) => acc + (typeof curr.highestScore === 'number' ? curr.highestScore : 0), 0);
  const currentWwPct = currentWwHigh > 0 ? (currentWwRaw / currentWwHigh) * 100 : 85;

  const currentPtRaw = performanceTasks.reduce((acc, curr) => acc + (typeof curr.score === 'number' ? curr.score : 0), 0);
  const currentPtHigh = performanceTasks.reduce((acc, curr) => acc + (typeof curr.highestScore === 'number' ? curr.highestScore : 0), 0);
  const currentPtPct = currentPtHigh > 0 ? (currentPtRaw / currentPtHigh) * 100 : 88;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col selection:bg-amber-300 selection:text-amber-950 transition-colors">
      {/* 1. TOP BAR */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Wordmark & Tagline */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-amber-950 flex items-center justify-center font-black text-xl shadow-xs">
              🐃
            </div>
            <div>
              <div className="flex items-center gap-2">
                <a
                  href="#"
                  className="font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl font-display tracking-tight hover:text-emerald-600 transition-colors"
                >
                  TALA
                </a>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 rounded-md border border-amber-300/80 dark:border-amber-700">
                  DO 15, s. 2026
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                by <strong className="text-slate-700 dark:text-slate-300">Eli Belleza</strong>
              </p>
            </div>
          </div>

          {/* Nav Links / Tool Modes */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => {
                playPop();
                setActiveTab('component');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'component'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Term Component Calc</span>
            </button>

            <button
              onClick={() => {
                playPop();
                setActiveTab('gwa_honors');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'gwa_honors'
                  ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>3-Term GWA &amp; Honors</span>
            </button>

            <button
              onClick={() => {
                playPop();
                setActiveTab('goal_planner');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'goal_planner'
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Goal Planner</span>
            </button>

            <button
              onClick={() => {
                playPop();
                setActiveTab('mapeh_quick');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'mapeh_quick'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>MAPEH Averager</span>
            </button>
          </nav>

          {/* Right Action Controls: Visitor Analytics, Reset, Dark Mode, Audio, GitHub */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Visitor Analytics Settings Modal Button */}
            <button
              type="button"
              onClick={() => {
                playPop();
                setShowAnalyticsModal(true);
              }}
              className="px-2.5 py-1.5 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-300 dark:border-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
              title="GoatCounter & Visitor Traffic Counter"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Visitor Analytics</span>
            </button>

            {/* Reset for New Learner Button */}
            <button
              type="button"
              onClick={handleResetForNewLearner}
              className="px-2.5 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-700 dark:text-slate-200 hover:text-rose-700 dark:hover:text-rose-300 rounded-xl border border-slate-300 dark:border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset all inputs for a new student"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Learner</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                muted
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700'
              }`}
              title={muted ? 'Unmute sounds' : 'Mute sounds'}
              aria-label="Toggle sound effects"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            </button>

            {/* GitHub Info Modal trigger */}
            <button
              type="button"
              onClick={() => {
                playPop();
                setShowGithubGuide(true);
              }}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-bold bg-slate-900 dark:bg-white hover:bg-slate-800 text-white dark:text-slate-900 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="GitHub Deployment & Multi-User Privacy Guide"
            >
              <Github className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
              <span className="hidden sm:inline">GitHub Guide</span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE TAB BAR */}
      <div className="md:hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-2 overflow-x-auto flex gap-1.5 text-xs font-bold">
        <button
          onClick={() => {
            playPop();
            setActiveTab('component');
          }}
          className={`px-3 py-1.5 rounded-lg shrink-0 ${
            activeTab === 'component'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Term Component Calc
        </button>
        <button
          onClick={() => {
            playPop();
            setActiveTab('gwa_honors');
          }}
          className={`px-3 py-1.5 rounded-lg shrink-0 ${
            activeTab === 'gwa_honors'
              ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          3-Term GWA &amp; Honors
        </button>
        <button
          onClick={() => {
            playPop();
            setActiveTab('goal_planner');
          }}
          className={`px-3 py-1.5 rounded-lg shrink-0 ${
            activeTab === 'goal_planner'
              ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Goal Planner
        </button>
        <button
          onClick={() => {
            playPop();
            setActiveTab('mapeh_quick');
          }}
          className={`px-3 py-1.5 rounded-lg shrink-0 ${
            activeTab === 'mapeh_quick'
              ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          MAPEH Averager
        </button>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* HERO / WELCOME BANNER */}
        <section className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 text-center md:text-left max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider text-emerald-100">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>DepEd 3-Term School Calendar (DO 15, s. 2026) · by Eli Belleza</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white leading-tight">
                  TALA: Term Assessment &amp; Learning Analytics
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
                  The student- and parent-friendly grade computation portal for Philippine public schools. Computes Initial Grades, Transmuted Term Grades, and updated DO 15, s. 2026 Descriptors (<strong>Advancing</strong>, <strong>Benchmarking</strong>, <strong>Connecting</strong>, <strong>Developing</strong>, <strong>Emerging</strong>), plus 3-Term Academic Honors eligibility!
                </p>
              </div>

              {/* Quick Jump Callout */}
              <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center">
                <span className="text-[11px] font-bold uppercase text-emerald-200 block">
                  Curriculum Standard
                </span>
                <span className="text-lg font-black font-display text-white block mt-0.5">
                  DO 15, s. 2026
                </span>
                <span className="text-[10px] text-emerald-100 block">
                  100% Private · Zero Overrides
                </span>
              </div>
            </div>
          </div>

          {/* Traffic and Usage Stats Counter Banner */}
          <TrafficStatsBanner
            totalVisits={totalVisits}
            totalCalculations={totalCalculations}
            isLiveGoatCounter={isLiveGoatCounter}
            onOpenSettings={() => setShowAnalyticsModal(true)}
          />
        </section>

        {/* INTERACTIVE CARABAO TALA MASCOT GUIDE */}
        <section>
          <CarabaoTalaMascot
            mood={getMascotMood()}
            message={getMascotMessage()}
            size="md"
          />
        </section>

        {/* TAB 1: SINGLE SUBJECT COMPONENT CALCULATOR */}
        {activeTab === 'component' && (
          <div className="space-y-8 animate-fade-in">
            {/* STEP 1: STUDENT AND SCHOOL PROFILE */}
            <section id="calculator">
              <StudentInfoForm
                studentName={studentName}
                onStudentNameChange={setStudentName}
                gradeLevel={gradeLevel}
                onGradeLevelChange={setGradeLevel}
                section={section}
                onSectionChange={setSection}
                schoolName={schoolName}
                onSchoolNameChange={setSchoolName}
                term={term}
                onTermChange={(t) => {
                  setTerm(t);
                  handleScoreAdjustment();
                }}
                learningAreaId={learningAreaId}
                onLearningAreaIdChange={(id) => {
                  setLearningAreaId(id);
                  handleScoreAdjustment();
                }}
              />
            </section>

            {/* STEP 2: RAW SCORES INPUT (WW, PT, ST1, ST2, TE) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
                    2
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white font-display">
                      Input Assessment Scores ({currentArea.name})
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Enter your raw scores and totals. Modifying scores will reset the reveal state for re-computation.
                    </p>
                  </div>
                </div>
              </div>

              <ScoreInputSection
                writtenWorks={writtenWorks}
                onWrittenWorksChange={(items) => {
                  setWrittenWorks(items);
                  handleScoreAdjustment();
                }}
                performanceTasks={performanceTasks}
                onPerformanceTasksChange={(items) => {
                  setPerformanceTasks(items);
                  handleScoreAdjustment();
                }}
                st1Score={st1Score}
                onSt1ScoreChange={(val) => {
                  setSt1Score(val);
                  handleScoreAdjustment();
                }}
                st1Total={st1Total}
                onSt1TotalChange={(val) => {
                  setSt1Total(val);
                  handleScoreAdjustment();
                }}
                st2Score={st2Score}
                onSt2ScoreChange={(val) => {
                  setSt2Score(val);
                  handleScoreAdjustment();
                }}
                st2Total={st2Total}
                onSt2TotalChange={(val) => {
                  setSt2Total(val);
                  handleScoreAdjustment();
                }}
                teScore={teScore}
                onTeScoreChange={(val) => {
                  setTeScore(val);
                  handleScoreAdjustment();
                }}
                teTotal={teTotal}
                onTeTotalChange={(val) => {
                  setTeTotal(val);
                  handleScoreAdjustment();
                }}
                wwWeightPct={Math.round(currentArea.weights.writtenWork * 100)}
                ptWeightPct={Math.round(currentArea.weights.performanceTask * 100)}
                termAssessmentWeightPct={Math.round(currentArea.weights.termAssessment * 100)}
                onScoresReset={handleScoreAdjustment}
              />
            </section>

            {/* STEP 3: REVEAL MY GRADES BUTTON & REVEAL CARD */}
            <section className="space-y-4 pt-2">
              <GradeRevealCard
                isRevealed={isRevealed}
                onRevealClick={handleComputeAndReveal}
                result={calculationResult}
                onPrintClick={() => setShowPrintSlip(true)}
                onRecalculateClick={() => {
                  setIsRevealed(false);
                }}
              />
            </section>
          </div>
        )}

        {/* TAB 2: 3-TERM GWA & HONORS CALCULATOR */}
        {activeTab === 'gwa_honors' && (
          <div className="animate-fade-in">
            <GwaHonorsCalculator
              gradeLevel={gradeLevel}
              onGradeLevelChange={setGradeLevel}
              studentName={studentName}
              schoolName={schoolName}
            />
          </div>
        )}

        {/* TAB 3: GOAL PLANNER & TARGET SCORE SIMULATOR */}
        {activeTab === 'goal_planner' && (
          <div className="animate-fade-in">
            <GoalPlannerSection
              currentWwPct={currentWwPct}
              currentPtPct={currentPtPct}
              learningAreaName={currentArea.name}
              weights={currentArea.weights}
            />
          </div>
        )}

        {/* TAB 4: MAPEH QUICK AVERAGING CARD */}
        {activeTab === 'mapeh_quick' && (
          <div className="animate-fade-in space-y-4">
            <MapehAveragingCard currentTerm={term} />
          </div>
        )}

        {/* STEP 4: OFFICIAL DESCRIPTORS & INDICATORS LEGEND */}
        <section id="descriptors">
          <DescriptorsLegend
            currentLevel={calculationResult?.descriptor.level}
          />
        </section>

        {/* STEP 5: PRIVATE ACTIVITY LOG ON THIS DEVICE */}
        <section id="activity-log">
          <LogReportSection
            logs={logs}
            totalVisits={totalVisits}
            totalCalculations={totalCalculations}
            onClearLogs={() => {
              clearAllPrivateLogs();
              setLogs([]);
            }}
            onExportLogs={() => exportLogsAsJson(logs)}
          />
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <p className="font-extrabold text-slate-800 dark:text-white font-display text-sm">
              TALA: Term Assessment &amp; Learning Analytics
            </p>
            <p className="mt-0.5">
              Developed by <strong>Eli Belleza</strong> for Philippine DepEd Teachers, Students &amp; Parents.
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Compliant with DepEd Order No. 15, s. 2026 &amp; DO 36, s. 2016.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs flex-wrap">
            <button
              onClick={() => setShowAnalyticsModal(true)}
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Visitor Analytics</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              onClick={() => setShowGithubGuide(true)}
              className="text-slate-600 dark:text-slate-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Deployment Guide</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" />
              100% Client-Side Private
            </span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {showPrintSlip && (
        <PrintableGradeSlip
          result={calculationResult}
          onClose={() => setShowPrintSlip(false)}
        />
      )}

      {showGithubGuide && (
        <GitHubGuideModal
          isOpen={showGithubGuide}
          onClose={() => setShowGithubGuide(false)}
        />
      )}

      {showAnalyticsModal && (
        <CloudSyncSettingsModal
          isOpen={showAnalyticsModal}
          onClose={() => setShowAnalyticsModal(false)}
          onVisitorCountUpdated={(count, isLive) => {
            setTotalVisits(count);
            setIsLiveGoatCounter(isLive);
          }}
        />
      )}
    </div>
  );
}
