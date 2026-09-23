import React, { useState } from 'react';
import { AcademicTerm, GradeLevelConfig, LearningAreaConfig } from '../types';
import { playPop, playGentleBonk, playSuccessChime } from '../utils/audio';
import {
  GraduationCap,
  School,
  User,
  Sparkles,
  Layers,
  Calendar,
  BookMarked,
  Info,
  Plus,
  Trash2,
  Sliders,
  Check,
  X,
  RotateCcw,
  Sparkle
} from 'lucide-react';

interface StudentInfoFormProps {
  studentName: string;
  onStudentNameChange: (val: string) => void;
  gradeLevel: string;
  onGradeLevelChange: (val: string) => void;
  section: string;
  onSectionChange: (val: string) => void;
  schoolName: string;
  onSchoolNameChange: (val: string) => void;
  term: AcademicTerm;
  onTermChange: (term: AcademicTerm) => void;
  learningAreaId: string;
  onLearningAreaIdChange: (val: string) => void;
  learningAreas: LearningAreaConfig[];
  allGradeLevels: GradeLevelConfig[];
  onAddLearningArea: (area: {
    name: string;
    shortName: string;
    description: string;
    weights: { writtenWork: number; performanceTask: number; termAssessment: number };
  }) => void;
  onDeleteLearningArea: (areaId: string) => void;
  onUpdateWeights: (
    areaId: string,
    weights: { writtenWork: number; performanceTask: number; termAssessment: number }
  ) => void;
  onResetLearningAreas?: () => void;
}

export const StudentInfoForm: React.FC<StudentInfoFormProps> = ({
  studentName,
  onStudentNameChange,
  gradeLevel,
  onGradeLevelChange,
  section,
  onSectionChange,
  schoolName,
  onSchoolNameChange,
  term,
  onTermChange,
  learningAreaId,
  onLearningAreaIdChange,
  learningAreas,
  allGradeLevels,
  onAddLearningArea,
  onDeleteLearningArea,
  onUpdateWeights,
  onResetLearningAreas
}) => {
  const selectedArea =
    learningAreas.find((a) => a.id === learningAreaId) || learningAreas[0] || {
      id: 'default',
      name: 'General Subject',
      shortName: 'Subject',
      iconName: 'BookMarked',
      weights: { writtenWork: 0.2, performanceTask: 0.5, termAssessment: 0.3 },
      description: 'Standard subject'
    };

  // Modal / panel states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditWeightsOpen, setIsEditWeightsOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<LearningAreaConfig | null>(null);

  // Add Subject Form state
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaShortName, setNewAreaShortName] = useState('');
  const [newAreaDescription, setNewAreaDescription] = useState('');
  const [newWwPct, setNewWwPct] = useState(20);
  const [newPtPct, setNewPtPct] = useState(50);
  const [newExamPct, setNewExamPct] = useState(30);

  // Edit Weights Form state
  const [editWw, setEditWw] = useState(Math.round(selectedArea.weights.writtenWork * 100));
  const [editPt, setEditPt] = useState(Math.round(selectedArea.weights.performanceTask * 100));
  const [editExam, setEditExam] = useState(Math.round(selectedArea.weights.termAssessment * 100));

  // Sync edit weights when selected area changes
  React.useEffect(() => {
    setEditWw(Math.round(selectedArea.weights.writtenWork * 100));
    setEditPt(Math.round(selectedArea.weights.performanceTask * 100));
    setEditExam(Math.round(selectedArea.weights.termAssessment * 100));
  }, [selectedArea.id, selectedArea.weights.writtenWork, selectedArea.weights.performanceTask, selectedArea.weights.termAssessment]);

  const handleGradeChange = (newGrade: string) => {
    playPop();
    onGradeLevelChange(newGrade);
  };

  const terms: AcademicTerm[] = ['Term 1', 'Term 2', 'Term 3'];

  // Color mapping per subject
  const getSubjectColorStyles = (subjectName: string, isSelected: boolean) => {
    const name = subjectName.toLowerCase();

    if (name.includes('math') || name.includes('spstem') || name.includes('stem')) {
      return isSelected
        ? 'bg-orange-500 hover:bg-orange-400 text-white border-orange-700 shadow-md shadow-orange-500/25'
        : 'bg-orange-50 dark:bg-orange-950/50 text-orange-950 dark:text-orange-200 border-orange-300 dark:border-orange-700/80 hover:bg-orange-100 dark:hover:bg-orange-900/40';
    }
    if (name.includes('scien')) {
      return isSelected
        ? 'bg-emerald-500 hover:bg-emerald-400 text-white border-emerald-700 shadow-md shadow-emerald-500/25'
        : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/40';
    }
    if (name.includes('eng') || name.includes('spj') || name.includes('journalism')) {
      return isSelected
        ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-800 shadow-md shadow-blue-500/25'
        : 'bg-blue-50 dark:bg-blue-950/50 text-blue-950 dark:text-blue-200 border-blue-300 dark:border-blue-700/80 hover:bg-blue-100 dark:hover:bg-blue-900/40';
    }
    if (name.includes('fili') || name.includes('spfl') || name.includes('foreign') || name.includes('alive')) {
      return isSelected
        ? 'bg-amber-400 hover:bg-amber-300 text-amber-950 border-amber-600 shadow-md shadow-amber-400/25'
        : 'bg-amber-50 dark:bg-amber-950/50 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700/80 hover:bg-amber-100 dark:hover:bg-amber-900/40';
    }
    if (name.includes('makabansa') || name.includes('araling panlipunan') || name.includes('ap')) {
      return isSelected
        ? 'bg-rose-500 hover:bg-rose-400 text-white border-rose-700 shadow-md shadow-rose-500/25'
        : 'bg-rose-50 dark:bg-rose-950/50 text-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-700/80 hover:bg-rose-100 dark:hover:bg-rose-900/40';
    }
    if (name.includes('mapeh') || name.includes('spa') || name.includes('arts') || name.includes('music')) {
      return isSelected
        ? 'bg-purple-600 hover:bg-purple-500 text-white border-purple-800 shadow-md shadow-purple-500/25'
        : 'bg-purple-50 dark:bg-purple-950/50 text-purple-950 dark:text-purple-200 border-purple-300 dark:border-purple-700/80 hover:bg-purple-100 dark:hover:bg-purple-900/40';
    }
    if (name.includes('tle') || name.includes('epp') || name.includes('sps') || name.includes('sports')) {
      return isSelected
        ? 'bg-teal-500 hover:bg-teal-400 text-white border-teal-700 shadow-md shadow-teal-500/25'
        : 'bg-teal-50 dark:bg-teal-950/50 text-teal-950 dark:text-teal-200 border-teal-300 dark:border-teal-700/80 hover:bg-teal-100 dark:hover:bg-teal-900/40';
    }
    return isSelected
      ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-800 shadow-md shadow-indigo-500/25'
      : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700/80 hover:bg-indigo-100 dark:hover:bg-indigo-900/40';
  };

  // Special Program Presets
  const specialProgramPresets = [
    {
      name: 'Special Program in Journalism (SPJ)',
      shortName: 'SPJ',
      description: 'Campus news writing, editorial cartooning, broadcasting & layout',
      ww: 20,
      pt: 50,
      exam: 30
    },
    {
      name: 'Special Program in the Arts (SPA)',
      shortName: 'SPA',
      description: 'Visual arts, dance, music, theater arts & creative writing',
      ww: 20,
      pt: 60,
      exam: 20
    },
    {
      name: 'Special Program in STEM (SPSTEM / STE)',
      shortName: 'SPSTEM',
      description: 'Advanced research, robotics, biotechnology & advanced math',
      ww: 20,
      pt: 50,
      exam: 30
    },
    {
      name: 'Special Program in Foreign Language (SPFL)',
      shortName: 'SPFL',
      description: 'Spanish, Mandarin, French, German, or Japanese communication',
      ww: 20,
      pt: 50,
      exam: 30
    },
    {
      name: 'Special Program in Sports (SPS)',
      shortName: 'SPS',
      description: 'Athletics, competitive sports coaching & physical wellness',
      ww: 20,
      pt: 60,
      exam: 20
    },
    {
      name: 'ALIVE (Arabic Language & Islamic Values)',
      shortName: 'ALIVE',
      description: 'Arabic literacy, Quranic reading & Islamic ethical values',
      ww: 20,
      pt: 50,
      exam: 30
    }
  ];

  // Quick preset apply in Add Modal
  const applyAddPreset = (p: (typeof specialProgramPresets)[0]) => {
    playPop();
    setNewAreaName(p.name);
    setNewAreaShortName(p.shortName);
    setNewAreaDescription(p.description);
    setNewWwPct(p.ww);
    setNewPtPct(p.pt);
    setNewExamPct(p.exam);
  };

  const handleSaveNewLearningArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;

    const total = newWwPct + newPtPct + newExamPct;
    if (total !== 100) {
      playGentleBonk();
      alert(`The weights must sum to 100% (Current total: ${total}%)`);
      return;
    }

    onAddLearningArea({
      name: newAreaName.trim(),
      shortName: newAreaShortName.trim() || newAreaName.trim().slice(0, 8),
      description: newAreaDescription.trim() || 'Custom learning area',
      weights: {
        writtenWork: newWwPct / 100,
        performanceTask: newPtPct / 100,
        termAssessment: newExamPct / 100
      }
    });

    playSuccessChime(false);
    setIsAddModalOpen(false);
    setNewAreaName('');
    setNewAreaShortName('');
    setNewAreaDescription('');
  };

  // Save edited weights for selected area
  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    const total = editWw + editPt + editExam;
    if (total !== 100) {
      playGentleBonk();
      alert(`Weights must total 100% (Current total: ${total}%)`);
      return;
    }

    onUpdateWeights(selectedArea.id, {
      writtenWork: editWw / 100,
      performanceTask: editPt / 100,
      termAssessment: editExam / 100
    });

    playSuccessChime(false);
    setIsEditWeightsOpen(false);
  };

  const confirmDelete = () => {
    if (areaToDelete) {
      playPop();
      onDeleteLearningArea(areaToDelete.id);
      setAreaToDelete(null);
    }
  };

  const editTotal = editWw + editPt + editExam;
  const newTotal = newWwPct + newPtPct + newExamPct;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 border-2 border-slate-200/90 dark:border-slate-700 shadow-sm transition-all">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-400 shadow-inner">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white font-display">
              1. Student &amp; School Details
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalize your grade report slip
            </p>
          </div>
        </div>

        {/* 3-Term Academic Calendar Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 rounded-full border border-emerald-200/60 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>3-Term Calendar</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Student Name */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Learner Name</span>
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => onStudentNameChange(e.target.value)}
            placeholder="e.g. Maria Clara Santos"
            className="w-full px-3.5 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 text-slate-900 dark:text-white focus:outline-none transition-colors"
          />
        </div>

        {/* School Name */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            <School className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>School Name</span>
          </label>
          <input
            type="text"
            value={schoolName}
            onChange={(e) => onSchoolNameChange(e.target.value)}
            placeholder="e.g. Davao City National High School"
            className="w-full px-3.5 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 text-slate-900 dark:text-white focus:outline-none transition-colors"
          />
        </div>

        {/* Section */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Section / Class</span>
          </label>
          <input
            type="text"
            value={section}
            onChange={(e) => onSectionChange(e.target.value)}
            placeholder="e.g. 7 - Diamond"
            className="w-full px-3.5 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-purple-500 text-slate-900 dark:text-white focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Term Selector & Grade Level Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
        {/* Term Picker (3-Term Calendar) */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Select Grading Term</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {terms.map((t) => {
              const isActive = term === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    playPop();
                    onTermChange(t);
                  }}
                  className={`btn-3d py-2.5 px-3 text-xs sm:text-sm font-black rounded-2xl border-b-4 flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                    isActive
                      ? 'bg-emerald-500 text-white border-emerald-700 shadow-md shadow-emerald-500/30'
                      : 'bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <span>{t}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grade Level Selector */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Grade Level</span>
          </label>
          <div className="relative">
            <select
              value={gradeLevel}
              onChange={(e) => handleGradeChange(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-bold bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 text-slate-900 dark:text-white focus:outline-none transition-colors cursor-pointer appearance-none"
            >
              {allGradeLevels.map((lvl) => (
                <option key={lvl.level} value={lvl.level} className="bg-white dark:bg-slate-800">
                  {lvl.level} ({lvl.keyStage})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 dark:text-slate-400 font-bold">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Learning Area Selector with ADD & Weight Management */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <label className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            <BookMarked className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Learning Area / Subject ({gradeLevel})</span>
          </label>

          <div className="flex items-center gap-2">
            {/* ADD LEARNING AREA BUTTON */}
            <button
              type="button"
              onClick={() => {
                playPop();
                setIsAddModalOpen(true);
              }}
              className="btn-3d px-3 py-1.5 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl border-b-3 border-emerald-800 flex items-center gap-1.5 shadow-sm cursor-pointer select-none"
              title="Add a new learning area like SPJ, SPA, SPSTEM, or custom subject"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Learning Area</span>
            </button>

            {onResetLearningAreas && (
              <button
                type="button"
                onClick={() => {
                  playGentleBonk();
                  if (confirm('Reset learning areas and weights for this grade level to DepEd defaults?')) {
                    onResetLearningAreas();
                  }
                }}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Reset to default subjects and weights"
              >
                Reset Defaults
              </button>
            )}
          </div>
        </div>

        {/* Interactive subject pills */}
        <div className="flex flex-wrap gap-2">
          {learningAreas.map((area) => {
            const isSelected = area.id === learningAreaId;
            const colorClass = getSubjectColorStyles(area.name, isSelected);

            return (
              <div key={area.id} className="relative group inline-flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    playPop();
                    onLearningAreaIdChange(area.id);
                  }}
                  className={`btn-3d px-3.5 py-2 text-xs font-black rounded-2xl border-b-4 text-left flex items-center gap-2 cursor-pointer transition-all ${colorClass}`}
                >
                  <span>{area.name}</span>
                  {area.isCustom && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-white/30 rounded-md font-normal">
                      Special
                    </span>
                  )}
                  {isSelected && <span className="text-xs">✓</span>}
                </button>

                {/* Quick delete button for custom/added areas */}
                {area.isCustom && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAreaToDelete(area);
                    }}
                    className="ml-1 p-1 text-slate-400 hover:text-rose-600 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title={`Delete ${area.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Learning Area Callout with EDITABLE WEIGHTS */}
        <div className="mt-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl p-3.5 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-indigo-950 dark:text-indigo-200">
                  {selectedArea.name}:
                </span>{' '}
                <span className="text-indigo-800 dark:text-indigo-300 font-medium">{selectedArea.description}</span>
              </div>
            </div>

            {/* Weights Badges & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 font-mono font-bold">
              <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 rounded-xl border border-amber-300 dark:border-amber-700 shadow-2xs" title="Written Works Weight">
                WW: {Math.round(selectedArea.weights.writtenWork * 100)}%
              </span>
              <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 rounded-xl border border-emerald-300 dark:border-emerald-700 shadow-2xs" title="Performance Tasks Weight">
                PT: {Math.round(selectedArea.weights.performanceTask * 100)}%
              </span>
              <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 rounded-xl border border-blue-300 dark:border-blue-700 shadow-2xs" title="Term Summative Assessment (ST1, ST2, TE)">
                TE/ST: {Math.round(selectedArea.weights.termAssessment * 100)}%
              </span>

              {/* Edit Weights Button */}
              <button
                type="button"
                onClick={() => {
                  playPop();
                  setIsEditWeightsOpen(!isEditWeightsOpen);
                }}
                className={`btn-3d px-2.5 py-1 text-xs font-sans font-bold rounded-xl border-b-2 transition-all flex items-center gap-1 cursor-pointer select-none ${
                  isEditWeightsOpen
                    ? 'bg-indigo-600 text-white border-indigo-800 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-100'
                }`}
                title="Edit component weights for this subject"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isEditWeightsOpen ? 'Close Editor' : 'Edit Weights'}</span>
              </button>

              {/* Delete Area button if custom or user wants to remove */}
              {selectedArea.isCustom && (
                <button
                  type="button"
                  onClick={() => setAreaToDelete(selectedArea)}
                  className="btn-3d px-2 py-1 text-xs font-sans font-bold bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-b-2 border-rose-300 dark:border-rose-700 hover:bg-rose-100 rounded-xl flex items-center gap-1 cursor-pointer select-none"
                  title="Delete this learning area"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>

          {/* INLINE WEIGHTS EDITOR PANEL */}
          {isEditWeightsOpen && (
            <div className="pt-3 border-t border-indigo-200/80 dark:border-indigo-800/80 animate-fade-in space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Change weights for <strong>{selectedArea.name}</strong>:
                </span>

                {/* Quick DepEd Standard Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      playPop();
                      setEditWw(20);
                      setEditPt(50);
                      setEditExam(30);
                    }}
                    className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:border-indigo-500 cursor-pointer"
                  >
                    20% WW • 50% PT • 30% Exam (Core Academics)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playPop();
                      setEditWw(20);
                      setEditPt(60);
                      setEditExam(20);
                    }}
                    className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:border-indigo-500 cursor-pointer"
                  >
                    20% WW • 60% PT • 20% Exam (TVL / Arts / PE)
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveWeights} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                {/* WW */}
                <div>
                  <label className="block text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase mb-1">
                    Written Works (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editWw}
                    onChange={(e) => setEditWw(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-1.5 text-sm font-bold bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-amber-700 rounded-xl focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white"
                  />
                </div>

                {/* PT */}
                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase mb-1">
                    Performance Tasks (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editPt}
                    onChange={(e) => setEditPt(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-1.5 text-sm font-bold bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-emerald-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Exam */}
                <div>
                  <label className="block text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase mb-1">
                    Exam / Summative (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editExam}
                    onChange={(e) => setEditExam(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-1.5 text-sm font-bold bg-white dark:bg-slate-900 border-2 border-blue-300 dark:border-blue-700 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Save button & status */}
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={editTotal !== 100}
                    className={`btn-3d w-full py-2 px-3 text-xs font-black rounded-xl border-b-3 transition-all cursor-pointer select-none ${
                      editTotal === 100
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-800 shadow-sm'
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-500 border-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Save Weights
                  </button>
                </div>
              </form>

              {/* Total Check Indicator */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Total must equal 100%
                </span>
                <span
                  className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                    editTotal === 100
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  Sum: {editTotal}% {editTotal === 100 ? '✓ Ready' : '⚠️ Must be 100%'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADD LEARNING AREA (SPJ, SPA, SPSTEM, SPFL, OR CUSTOM) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-7 border-2 border-slate-200 dark:border-slate-700 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xl font-bold">
                  ➕
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display">
                    Add Learning Area
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add special programs or any custom school subject
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Presets for Special Programs */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                Quick Special Program Presets (1-Click):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {specialProgramPresets.map((preset) => (
                  <button
                    key={preset.shortName}
                    type="button"
                    onClick={() => applyAddPreset(preset)}
                    className="p-2.5 rounded-xl border-2 text-left transition-all hover:scale-102 cursor-pointer bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-emerald-500"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {preset.shortName}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {preset.ww}/{preset.pt}/{preset.exam}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {preset.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveNewLearningArea} className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Subject Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAreaName}
                    onChange={(e) => setNewAreaName(e.target.value)}
                    placeholder="e.g. Special Program in Journalism (SPJ)"
                    className="w-full px-3.5 py-2 text-sm font-medium bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Short Code */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Short Code
                  </label>
                  <input
                    type="text"
                    value={newAreaShortName}
                    onChange={(e) => setNewAreaShortName(e.target.value)}
                    placeholder="e.g. SPJ"
                    className="w-full px-3.5 py-2 text-sm font-medium bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Description / Topic Focus
                </label>
                <input
                  type="text"
                  value={newAreaDescription}
                  onChange={(e) => setNewAreaDescription(e.target.value)}
                  placeholder="e.g. News writing, layout, photography & broadcasting"
                  className="w-full px-3.5 py-2 text-sm font-medium bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Component Weights */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase">
                    Component Weights (Must Equal 100%)
                  </label>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                      newTotal === 100
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    Sum: {newTotal}% {newTotal === 100 ? '✓' : '⚠️'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block mb-1">
                      Written Works %
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newWwPct}
                      onChange={(e) => setNewWwPct(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 text-sm font-bold bg-white dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                      Performance %
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newPtPct}
                      onChange={(e) => setNewPtPct(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 text-sm font-bold bg-white dark:bg-slate-800 border-2 border-emerald-300 dark:border-emerald-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-blue-800 dark:text-blue-300 block mb-1">
                      Exam %
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newExamPct}
                      onChange={(e) => setNewExamPct(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 text-sm font-bold bg-white dark:bg-slate-800 border-2 border-blue-300 dark:border-blue-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={newTotal !== 100 || !newAreaName.trim()}
                  className={`btn-3d px-5 py-2.5 text-xs font-black rounded-xl border-b-3 transition-all cursor-pointer select-none ${
                    newTotal === 100 && newAreaName.trim()
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-800 shadow-sm'
                      : 'bg-slate-300 dark:bg-slate-700 text-slate-500 border-slate-400 cursor-not-allowed'
                  }`}
                >
                  Add Learning Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {areaToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-sm w-full p-6 border-2 border-slate-200 dark:border-slate-700 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Delete Learning Area?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to remove <strong>{areaToDelete.name}</strong> from {gradeLevel}?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAreaToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="btn-3d px-4 py-2 text-xs font-black bg-rose-600 hover:bg-rose-500 text-white rounded-xl border-b-3 border-rose-800 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
