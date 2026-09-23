/**
 * TALA: Three-Term Academic Learning Analyzer
 * 3-Term Grade Calculator & Academic Progress Planner
 * Pursuant to DepEd Order No. 15, s. 2026 & DepEd Order No. 36, s. 2016
 * By Eli Belleza
 */

import React, { useState, useEffect } from 'react';
import {
  AcademicTerm,
  CalculationResult,
  LogEntry,
  ScoreItem,
  GradeLevelConfig,
  LearningAreaConfig
} from './types';
import {
  calculateTermGrade,
  GRADE_LEVELS_DATA,
  getGradeConfig,
  getLearningArea
} from './data/depedGrading';
import { TaliTarsierMascot } from './components/TaliTarsierMascot';
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
import { TransmutationTableSection } from './components/TransmutationTableSection';
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
  playPop,
  playCelebrationChime
} from './utils/audio';
import {
  getGamificationState,
  recordStreakCheck,
  addTalaPoints,
  GamificationState
} from './utils/gamification';
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
  Lock,
  Flame,
  Star,
  CheckCircle2,
  TrendingUp,
  Table,
  X
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

  // Gamification State (Planning Streak & Tala Points)
  const [gamification, setGamification] = useState<GamificationState>(() => getGamificationState());
  const [showStreakModal, setShowStreakModal] = useState<boolean>(false);
  const [showPointsModal, setShowPointsModal] = useState<boolean>(false);
  const [pointToast, setPointToast] = useState<string | null>(null);

  const awardTalaPoints = (points: number, reason: string) => {
    setGamification((prev) => addTalaPoints(prev, points));
    setPointToast(`+${points} TP: ${reason}`);
    setTimeout(() => {
      setPointToast((curr) => (curr?.includes(reason) ? null : curr));
    }, 2800);
  };

  // Streak verification on mount
  useEffect(() => {
    const { updatedState, streakIncreased } = recordStreakCheck(gamification);
    if (streakIncreased) {
      setGamification(updatedState);
      playCelebrationChime();
      awardTalaPoints(30, 'Streak Increased! 🔥');
    }
  }, []);

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
  const [activeTab, setActiveTab] = useState<'component' | 'gwa_honors' | 'goal_planner' | 'mapeh_quick' | 'transmutation_table'>('component');

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

  // Dynamic Grade Levels & Learning Areas State (persisted to localStorage)
  const [gradeConfigs, setGradeConfigs] = useState<GradeLevelConfig[]>(() => {
    try {
      const saved = localStorage.getItem('tala_grade_configs_v3');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load saved grade configs:', e);
    }
    return GRADE_LEVELS_DATA;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tala_grade_configs_v3', JSON.stringify(gradeConfigs));
    } catch (e) {
      console.error('Failed to save grade configs:', e);
    }
  }, [gradeConfigs]);

  // Current subject and grade config
  const currentGradeConfig =
    gradeConfigs.find((g) => g.level === gradeLevel) || gradeConfigs[6];
  const currentArea =
    currentGradeConfig.learningAreas.find((a) => a.id === learningAreaId) ||
    currentGradeConfig.learningAreas[0];

  // Helper when any score is adjusted: automatically reset the revealed state
  const handleScoreAdjustment = () => {
    if (isRevealed) {
      setIsRevealed(false);
    }
  };

  const handleAddLearningArea = (area: {
    name: string;
    shortName: string;
    description: string;
    weights: { writtenWork: number; performanceTask: number; termAssessment: number };
  }) => {
    const newId = `custom_${Date.now()}`;
    const newArea: LearningAreaConfig = {
      id: newId,
      name: area.name,
      shortName: area.shortName,
      iconName: 'BookMarked',
      description: area.description,
      weights: area.weights,
      isCustom: true
    };

    setGradeConfigs((prev) =>
      prev.map((lvl) => {
        if (lvl.level === gradeLevel) {
          return {
            ...lvl,
            learningAreas: [...lvl.learningAreas, newArea]
          };
        }
        return lvl;
      })
    );

    setLearningAreaId(newId);
    handleScoreAdjustment();
    awardTalaPoints(20, `Added subject "${area.shortName}"! 📚`);
  };

  const handleDeleteLearningArea = (areaId: string) => {
    setGradeConfigs((prev) =>
      prev.map((lvl) => {
        if (lvl.level === gradeLevel) {
          const remaining = lvl.learningAreas.filter((a) => a.id !== areaId);
          return {
            ...lvl,
            learningAreas: remaining.length > 0 ? remaining : lvl.learningAreas
          };
        }
        return lvl;
      })
    );

    if (learningAreaId === areaId) {
      const remaining = currentGradeConfig.learningAreas.filter((a) => a.id !== areaId);
      if (remaining.length > 0) {
        setLearningAreaId(remaining[0].id);
      }
    }
    handleScoreAdjustment();
  };

  const handleUpdateWeights = (
    areaId: string,
    weights: { writtenWork: number; performanceTask: number; termAssessment: number }
  ) => {
    setGradeConfigs((prev) =>
      prev.map((lvl) => {
        if (lvl.level === gradeLevel) {
          return {
            ...lvl,
            learningAreas: lvl.learningAreas.map((a) => {
              if (a.id === areaId) {
                return { ...a, weights };
              }
              return a;
            })
          };
        }
        return lvl;
      })
    );

    handleScoreAdjustment();
    awardTalaPoints(10, 'Customized grading weights! ⚙️');
  };

  const handleResetLearningAreas = () => {
    const defaultGrade = GRADE_LEVELS_DATA.find((g) => g.level === gradeLevel);
    if (!defaultGrade) return;

    setGradeConfigs((prev) =>
      prev.map((lvl) => {
        if (lvl.level === gradeLevel) {
          return { ...defaultGrade };
        }
        return lvl;
      })
    );

    if (defaultGrade.learningAreas.length > 0) {
      setLearningAreaId(defaultGrade.learningAreas[0].id);
    }
    handleScoreAdjustment();
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

  const isAllScoresBlank =
    writtenWorks.every((w) => w.score === '') &&
    performanceTasks.every((p) => p.score === '') &&
    st1Score === '' &&
    st2Score === '' &&
    teScore === '';

  // Mascot dynamic reaction (Tali the Tarsier)
  const getMascotMood = () => {
    if (isRevealed && calculationResult) {
      if (calculationResult.descriptor.level === 'Advancing') return 'celebrating';
      if (calculationResult.descriptor.level === 'Benchmarking') return 'excited';
      if (calculationResult.descriptor.level === 'Emerging') return 'determined';
      return 'encouraging';
    }
    return 'thinking';
  };

  const getMascotMessage = () => {
    if (isRevealed && calculationResult) {
      if (calculationResult.descriptor.level === 'Advancing') {
        return `🌟 WOOHOO! My eyes are spinning stars! Exemplary mastery (Advancing - ${calculationResult.transmutedGrade})! Holding my glowing Tala parol lantern high for you!`;
      }
      if (calculationResult.descriptor.level === 'Benchmarking') {
        return `👓 *Double-taps screen* Solid work, you're right on track (${calculationResult.transmutedGrade})! Pushing my glasses up with pride!`;
      }
      if (calculationResult.descriptor.level === 'Connecting') {
        return `👍 *Taps screen twice* "Solid work, you're right on track!" (${calculationResult.transmutedGrade}). Minimum honors baseline reached! Keep it up!`;
      }
      if (calculationResult.descriptor.level === 'Developing') {
        return `💪 Building foundational strength takes real effort! *wipes sweat* Let's head to the Goal Planner to strategize for your next assessment!`;
      }
      return `🔥 Growth mindset engaged! Red panyo tied tight! Let's not get discouraged—click the Target Goal Planner to find the exact score needed to pass!`;
    }
    if (isAllScoresBlank) {
      return `📓 Ready to check your grades? Tali is holding a blank notebook and blinking expectantly! Enter your scores to get started!`;
    }
    return `Kumusta! I'm Tali the Tarsier, your friendly study buddy! Enter your scores to see your term grade and descriptors in seconds!`;
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
      teTotal,
      currentArea.weights,
      currentArea.name
    );

    setCalculationResult(res);
    setIsRevealed(true);

    // Award Tala Points for calculating term grade
    awardTalaPoints(25, 'Calculated Term Grade ⭐');

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
          {/* Brand Wordmark & Tagline: TALA by Eli Belleza */}
          <div className="flex items-center gap-2.5">
            {/* Tali the Tarsier Avatar Icon with Academic Glasses & Star */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-700 text-white flex items-center justify-center font-black text-xl shadow-xs ring-2 ring-indigo-200 dark:ring-indigo-900 shrink-0">
              <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                {/* Ears */}
                <ellipse cx="9" cy="14" rx="5" ry="6" fill="#DDD6FE" stroke="#312E81" strokeWidth="1.2" />
                <ellipse cx="31" cy="14" rx="5" ry="6" fill="#DDD6FE" stroke="#312E81" strokeWidth="1.2" />
                {/* Face */}
                <circle cx="20" cy="20" r="13" fill="#EDE9FE" stroke="#312E81" strokeWidth="1.5" />
                {/* Giant Eyes */}
                <circle cx="15" cy="19" r="4.8" fill="#F59E0B" />
                <circle cx="25" cy="19" r="4.8" fill="#F59E0B" />
                <circle cx="15" cy="19" r="3" fill="#1E1B4B" />
                <circle cx="25" cy="19" r="3" fill="#1E1B4B" />
                <circle cx="14" cy="18" r="1.2" fill="#FFFFFF" />
                <circle cx="24" cy="18" r="1.2" fill="#FFFFFF" />
                {/* Academic Glasses */}
                <circle cx="15" cy="19" r="5.2" stroke="#312E81" strokeWidth="1.6" fill="none" />
                <circle cx="25" cy="19" r="5.2" stroke="#312E81" strokeWidth="1.6" fill="none" />
                <path d="M19.5 19 L20.5 19" stroke="#312E81" strokeWidth="1.6" />
                {/* Star on ear */}
                <polygon points="32,6 33.2,9.2 36.5,9.5 34,11.8 34.8,15 32,13.2 29.2,15 30,11.8 27.5,9.5 30.8,9.2" fill="#FBBF24" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <a
                  href="#"
                  className="font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl font-display tracking-tight hover:text-indigo-600 transition-colors"
                >
                  TALA
                </a>
                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 hidden sm:inline">
                  · Three-Term Academic Learning Analyzer
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 rounded-md border border-amber-300/80 dark:border-amber-700">
                  DO 15, s. 2026
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                3-Term Grade Calculator &amp; Academic Progress Planner · By <strong className="text-slate-700 dark:text-slate-300">Eli Belleza</strong>
              </p>
            </div>
          </div>

          {/* Gamification Badges: Streak & Tala Points */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                playCelebrationChime();
                setShowStreakModal(true);
              }}
              className="btn-3d px-2.5 sm:px-3 py-1.5 text-xs font-black bg-orange-500 hover:bg-orange-400 text-white rounded-xl border-b-4 border-orange-700 shadow-sm flex items-center gap-1.5 cursor-pointer select-none"
              title="Your Planning Streak! Click to view habits and rewards."
            >
              <Flame className="w-4 h-4 text-yellow-200 fill-yellow-300 animate-bounce-subtle shrink-0" />
              <span>{gamification.streak} <span className="hidden sm:inline">Day Streak</span></span>
            </button>

            <button
              type="button"
              onClick={() => {
                playPop();
                setShowPointsModal(true);
              }}
              className="btn-3d px-2.5 sm:px-3 py-1.5 text-xs font-black bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-xl border-b-4 border-amber-600 shadow-sm flex items-center gap-1.5 cursor-pointer select-none"
              title="Tala Points (TP)! Earn points by logging assessments and planning targets."
            >
              <Star className="w-4 h-4 text-amber-900 fill-amber-500 shrink-0" />
              <span>{gamification.talaPoints} <span className="hidden sm:inline">TP</span></span>
            </button>
          </div>

          {/* Nav Links / Tool Modes */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => {
                playPop();
                setActiveTab('component');
              }}
              className={`btn-3d px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border-b-2 select-none ${
                activeTab === 'component'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 border-emerald-500 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-slate-900 dark:hover:text-white'
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
              className={`btn-3d px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border-b-2 select-none ${
                activeTab === 'gwa_honors'
                  ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 border-amber-500 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-slate-900 dark:hover:text-white'
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
              className={`btn-3d px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border-b-2 select-none ${
                activeTab === 'goal_planner'
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 border-indigo-500 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-slate-900 dark:hover:text-white'
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
              className={`btn-3d px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border-b-2 select-none ${
                activeTab === 'mapeh_quick'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 border-teal-500 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>MAPEH Averager</span>
            </button>

            <button
              onClick={() => {
                playPop();
                setActiveTab('transmutation_table');
              }}
              className={`btn-3d px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border-b-2 select-none ${
                activeTab === 'transmutation_table'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 border-emerald-500 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Transmutation Table</span>
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
              className="btn-3d px-2.5 py-1.5 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 rounded-xl border-b-3 border-emerald-400 dark:border-emerald-700 transition-colors flex items-center gap-1 cursor-pointer select-none"
              title="GoatCounter & Visitor Traffic Counter"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Analytics</span>
            </button>

            {/* Reset for New Learner Button */}
            <button
              type="button"
              onClick={handleResetForNewLearner}
              className="btn-3d px-2.5 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-700 dark:text-slate-200 hover:text-rose-700 dark:hover:text-rose-300 rounded-xl border-b-3 border-slate-300 dark:border-slate-700 transition-colors flex items-center gap-1 cursor-pointer select-none"
              title="Reset all inputs for a new student"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="btn-3d p-2 rounded-xl border-b-3 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer select-none"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className={`btn-3d p-2 rounded-xl border-b-3 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer select-none ${
                muted
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-400 dark:border-emerald-700'
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
              className="btn-3d px-2.5 sm:px-3 py-1.5 text-xs font-bold bg-slate-900 dark:bg-white hover:bg-slate-800 text-white dark:text-slate-900 rounded-xl border-b-3 border-slate-950 dark:border-slate-300 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer select-none"
              title="GitHub Deployment & Multi-User Privacy Guide"
            >
              <Github className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
              <span className="hidden sm:inline">GitHub</span>
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
          className={`btn-3d px-3 py-1.5 rounded-xl shrink-0 border-b-3 select-none ${
            activeTab === 'component'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border-emerald-500 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 border-transparent'
          }`}
        >
          Term Component
        </button>
        <button
          onClick={() => {
            playPop();
            setActiveTab('gwa_honors');
          }}
          className={`btn-3d px-3 py-1.5 rounded-xl shrink-0 border-b-3 select-none ${
            activeTab === 'gwa_honors'
              ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 border-amber-500 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 border-transparent'
          }`}
        >
          3-Term GWA
        </button>
        <button
          onClick={() => {
            playPop();
            setActiveTab('goal_planner');
          }}
          className={`btn-3d px-3 py-1.5 rounded-xl shrink-0 border-b-3 select-none ${
            activeTab === 'goal_planner'
              ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 border-indigo-500 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 border-transparent'
          }`}
        >
          Goal Planner
        </button>
        <button
          onClick={() => {
            playPop();
            setActiveTab('mapeh_quick');
          }}
          className={`btn-3d px-3 py-1.5 rounded-xl shrink-0 border-b-3 select-none ${
            activeTab === 'mapeh_quick'
              ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-400 border-teal-500 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 border-transparent'
          }`}
        >
          MAPEH
        </button>
        <button
          onClick={() => {
            playPop();
            setActiveTab('transmutation_table');
          }}
          className={`btn-3d px-3 py-1.5 rounded-xl shrink-0 border-b-3 select-none ${
            activeTab === 'transmutation_table'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border-emerald-500 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 border-transparent'
          }`}
        >
          Transmutation Table
        </button>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* HERO / WELCOME BANNER */}
        <section className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 text-center md:text-left max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider text-indigo-100">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>DepEd 3-Term School Calendar · By Eli Belleza</span>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white leading-tight">
                    TALA: Three-Term Academic Learning Analyzer
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-amber-300 tracking-wide mt-0.5">
                    Quick, friendly grade calculator and goal planner
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed font-medium">
                  Easily calculate your term grades, descriptors, and honors under DepEd's 3-term calendar. Friendly, fast, and 100% private!
                </p>
              </div>

              {/* Quick Jump Callout */}
              <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center space-y-2">
                <div>
                  <span className="text-[11px] font-bold uppercase text-indigo-200 block">
                    School Year 2026–2027
                  </span>
                  <span className="text-base font-black font-display text-white block mt-0.5">
                    60-Based Transitional Table
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playPop();
                    setActiveTab('transmutation_table');
                    window.scrollTo({ top: 320, behavior: 'smooth' });
                  }}
                  className="btn-3d w-full px-3 py-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-xl border-b-2 border-amber-600 transition-all cursor-pointer shadow-xs select-none"
                >
                  View Table →
                </button>
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

        {/* INTERACTIVE TALI THE TARSIER MASCOT GUIDE */}
        <section>
          <TaliTarsierMascot
            mood={getMascotMood()}
            descriptorLevel={
              calculationResult?.descriptor.level ||
              (isAllScoresBlank ? 'Empty' : undefined)
            }
            message={getMascotMessage()}
            size="md"
            onGoalPlannerClick={() => {
              playPop();
              setActiveTab('goal_planner');
              window.scrollTo({ top: 320, behavior: 'smooth' });
            }}
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
                onGradeLevelChange={(newGrade) => {
                  setGradeLevel(newGrade);
                  const newGradeCfg = gradeConfigs.find((g) => g.level === newGrade);
                  if (newGradeCfg && newGradeCfg.learningAreas.length > 0) {
                    setLearningAreaId(newGradeCfg.learningAreas[0].id);
                  }
                  handleScoreAdjustment();
                }}
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
                learningAreas={currentGradeConfig.learningAreas}
                allGradeLevels={gradeConfigs}
                onAddLearningArea={handleAddLearningArea}
                onDeleteLearningArea={handleDeleteLearningArea}
                onUpdateWeights={handleUpdateWeights}
                onResetLearningAreas={handleResetLearningAreas}
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
                onAwardTalaPoints={awardTalaPoints}
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
                onNavigateToGoalPlanner={() => {
                  playPop();
                  setActiveTab('goal_planner');
                  window.scrollTo({ top: 320, behavior: 'smooth' });
                }}
                onViewTransmutation={() => {
                  playPop();
                  setActiveTab('transmutation_table');
                  window.scrollTo({ top: 320, behavior: 'smooth' });
                }}
              />
            </section>
          </div>
        )}

        {/* Duolingo Empty State: Tali peeking from the bottom of the screen holding a blank notebook */}
        {isAllScoresBlank && !isRevealed && activeTab === 'component' && (
          <aside
            className="fixed bottom-0 right-4 sm:right-10 z-40 translate-y-3 hover:translate-y-0 transition-transform duration-300 cursor-pointer animate-fadeIn"
            onClick={() => {
              playPop();
              const el = document.getElementById('calculator');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            title="Tali is blinking expectantly! Click to start entering scores."
            aria-label="New learner empty state coach"
          >
            <div className="flex flex-col items-center">
              <div className="bg-indigo-900/95 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg border border-indigo-400/40 mb-1 flex items-center gap-1.5 animate-bounce">
                <span>📓</span>
                <span>Open notebook &amp; let's calculate!</span>
              </div>
              <div className="w-24 h-24 sm:w-28 sm:h-28">
                <TaliTarsierMascot state="empty" compact size="md" />
              </div>
            </div>
          </aside>
        )}

        {/* TAB 2: 3-TERM GWA & HONORS CALCULATOR */}
        {activeTab === 'gwa_honors' && (
          <div className="animate-fade-in">
            <GwaHonorsCalculator
              gradeLevel={gradeLevel}
              onGradeLevelChange={setGradeLevel}
              studentName={studentName}
              schoolName={schoolName}
              learningAreas={currentGradeConfig.learningAreas}
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

        {/* TAB 5: TRANSMUTATION TABLE (SY 2026-2027) */}
        {activeTab === 'transmutation_table' && (
          <div className="animate-fade-in space-y-4">
            <TransmutationTableSection
              currentInitialGrade={calculationResult?.initialGrade}
            />
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
              TALA: Three-Term Academic Learning Analyzer
            </p>
            <p className="font-medium text-slate-600 dark:text-slate-300 mt-0.5">
              3-Term Grade Calculator &amp; Academic Progress Planner · By <strong>Eli Belleza</strong>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Compliant with DepEd Order No. 15, s. 2026 &amp; DO 36, s. 2016. Featuring Tali the Tarsier.
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
      {/* Floating Point Toast Notification */}
      {pointToast && (
        <div className="fixed top-20 right-5 z-50 animate-bounce-subtle bg-amber-400 text-amber-950 font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl border-2 border-amber-600 shadow-2xl flex items-center gap-2 select-none">
          <Star className="w-4 h-4 fill-amber-950 text-amber-950 animate-spin-slow shrink-0" />
          <span>{pointToast}</span>
        </div>
      )}

      {/* Streak Modal */}
      {showStreakModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-md w-full border-4 border-orange-400 dark:border-orange-600 shadow-2xl relative text-center space-y-4">
            <button
              onClick={() => setShowStreakModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 mx-auto">
              <TaliTarsierMascot state="advancing" compact size="sm" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 rounded-full text-xs font-black uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span>Academic Planning Streak</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display">
              {gamification.streak}-Day Planning Streak! 🔥
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Awesome work! Checking your 3-term DepEd progress regularly builds winning study habits. By tracking written works and performance tasks early, you eliminate exam panic and build continuous mastery.
            </p>

            {/* Streak Track visualization */}
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const isDone = idx < Math.min(7, gamification.streak);
                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-xl text-center border-2 transition-all ${
                      isDone
                        ? 'bg-orange-500 text-white border-orange-700 font-black shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 font-bold'
                    }`}
                  >
                    <span className="block text-[9px] uppercase">{day}</span>
                    <span className="text-xs">{isDone ? '🔥' : '○'}</span>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                playPop();
                setShowStreakModal(false);
              }}
              className="btn-3d w-full py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-black text-sm rounded-2xl border-b-4 border-orange-700 shadow-md cursor-pointer select-none"
            >
              Keep the Momentum Going! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Tala Points Modal */}
      {showPointsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-md w-full border-4 border-amber-400 dark:border-amber-600 shadow-2xl relative text-center space-y-4">
            <button
              onClick={() => setShowPointsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 mx-auto">
              <TaliTarsierMascot state="connecting" compact size="sm" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 rounded-full text-xs font-black uppercase tracking-wider">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Tala Points Rewards</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display">
              {gamification.talaPoints} Tala Points (TP) ⭐
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Tala Points reward the <em>act of academic planning</em>! Instead of stressing over raw percentages, celebrate proactive habit building!
            </p>

            {/* Rewards Breakdown */}
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span>📝</span> Add a Written Work item
                </span>
                <span className="font-mono text-amber-600 dark:text-amber-400">+10 TP</span>
              </div>
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span>🎨</span> Add a Performance Task item
                </span>
                <span className="font-mono text-amber-600 dark:text-amber-400">+15 TP</span>
              </div>
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span>🌟</span> Calculate &amp; Reveal Term Grade
                </span>
                <span className="font-mono text-amber-600 dark:text-amber-400">+25 TP</span>
              </div>
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span>🎯</span> Plan Target Exam in Goal Planner
                </span>
                <span className="font-mono text-amber-600 dark:text-amber-400">+20 TP</span>
              </div>
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span>🔥</span> Maintain Daily Planning Streak
                </span>
                <span className="font-mono text-amber-600 dark:text-amber-400">+30 TP</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playPop();
                setShowPointsModal(false);
              }}
              className="btn-3d w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm rounded-2xl border-b-4 border-amber-600 shadow-md cursor-pointer select-none"
            >
              Collect Points &amp; Keep Learning! 🌟
            </button>
          </div>
        </div>
      )}

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
