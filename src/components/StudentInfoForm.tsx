import React from 'react';
import {
  GRADE_LEVELS_DATA,
  getGradeConfig,
  getLearningArea
} from '../data/depedGrading';
import { AcademicTerm } from '../types';
import { playPop } from '../utils/audio';
import {
  GraduationCap,
  School,
  User,
  Sparkles,
  Layers,
  Calendar,
  BookMarked,
  Info
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
  onLearningAreaIdChange
}) => {
  const currentGradeConfig = getGradeConfig(gradeLevel);
  const selectedArea = getLearningArea(gradeLevel, learningAreaId);

  const handleGradeChange = (newGrade: string) => {
    playPop();
    onGradeLevelChange(newGrade);
    const newConfig = getGradeConfig(newGrade);
    if (newConfig.learningAreas.length > 0) {
      onLearningAreaIdChange(newConfig.learningAreas[0].id);
    }
  };

  const terms: AcademicTerm[] = ['Term 1', 'Term 2', 'Term 3'];

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
              Provide student profile to personalize your grade computation
            </p>
          </div>
        </div>

        {/* 3-Term Academic Calendar Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 rounded-full border border-emerald-200/60 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>DepEd 3-Term Calendar</span>
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
                  className={`py-2 px-2 text-xs sm:text-sm font-bold rounded-xl transition-all border-b-4 flex items-center justify-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-white border-emerald-700 shadow-sm translate-y-0.5'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
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
              {GRADE_LEVELS_DATA.map((lvl) => (
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

      {/* Learning Area Aware Selector */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <BookMarked className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Learning Area / Subject ({gradeLevel})</span>
          </label>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Automatically applies DepEd Order No. 15, s. 2026 weights
          </span>
        </div>

        {/* Interactive subject pills */}
        <div className="flex flex-wrap gap-2">
          {currentGradeConfig.learningAreas.map((area) => {
            const isSelected = area.id === learningAreaId;
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => {
                  playPop();
                  onLearningAreaIdChange(area.id);
                }}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition-all border-b-2 text-left flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-800 shadow-sm scale-102'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <span>{area.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Learning Area Weight Breakdown Callout */}
        <div className="mt-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-indigo-950 dark:text-indigo-200">
                {selectedArea.name}:
              </span>{' '}
              <span className="text-indigo-800 dark:text-indigo-300">{selectedArea.description}</span>
            </div>
          </div>

          {/* DepEd Component Weights Pills */}
          <div className="flex items-center gap-2 shrink-0 font-mono font-bold">
            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-700" title="Written Works Weight">
              WW: {Math.round(selectedArea.weights.writtenWork * 100)}%
            </span>
            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-700" title="Performance Tasks Weight">
              PT: {Math.round(selectedArea.weights.performanceTask * 100)}%
            </span>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-700" title="Term Summative Assessment (ST1, ST2, TE)">
              TE/ST: {Math.round(selectedArea.weights.termAssessment * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
