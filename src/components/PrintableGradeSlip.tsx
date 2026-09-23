import React from 'react';
import { CalculationResult } from '../types';
import { Printer, X, Download, Award, CheckCircle2 } from 'lucide-react';

interface PrintableGradeSlipProps {
  result: CalculationResult | null;
  onClose: () => void;
}

export const PrintableGradeSlip: React.FC<PrintableGradeSlipProps> = ({ result, onClose }) => {
  if (!result) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full border-2 border-slate-300 dark:border-slate-700 shadow-2xl overflow-hidden my-6">
        {/* Modal Toolbar (hidden in print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-sm text-slate-800 dark:text-white font-display">
              Learner's Term Progress Card Slip
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable DepEd Official Report Slip Area */}
        <div className="p-6 sm:p-8 space-y-6 printable-area bg-white text-slate-900">
          {/* Official DepEd Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4">
            <p className="text-[11px] uppercase tracking-widest font-semibold text-slate-600">
              Republic of the Philippines · Department of Education
            </p>
            <h2 className="text-lg sm:text-xl font-black font-display text-slate-900 tracking-tight mt-0.5">
              OFFICIAL LEARNER'S TERM GRADE SLIP
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              DepEd 3-Term School Calendar (SY 2026–2027)
            </p>
          </div>

          {/* Student metadata table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Learner Name</span>
              <span className="font-bold text-slate-800">{result.studentName || 'Not specified'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">School</span>
              <span className="font-bold text-slate-800">{result.schoolName || 'DepEd Public School'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Grade &amp; Section</span>
              <span className="font-bold text-slate-800">{result.gradeLevel} - {result.section}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Grading Term</span>
              <span className="font-bold text-emerald-700">{result.term} (3-Term Calendar)</span>
            </div>
          </div>

          {/* Learning Area and Final Grade Result */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 font-bold text-xs text-slate-700 flex justify-between">
              <span>LEARNING AREA / SUBJECT</span>
              <span>ASSESSMENT BREAKDOWN</span>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-base font-extrabold text-slate-900 font-display">
                  {result.learningAreaName}
                </span>
                <span className="text-xs font-mono text-slate-600">
                  Weight: WW {result.weights ? Math.round(result.weights.writtenWork * 100) : 30}% | PT {result.weights ? Math.round(result.weights.performanceTask * 100) : 50}% | TE {result.weights ? Math.round(result.weights.termAssessment * 100) : 20}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Written Works ({result.weights ? Math.round(result.weights.writtenWork * 100) : 30}%)</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">
                    {result.wwPercentage.toFixed(1)}% ({result.wwWeighted.toFixed(2)} pts)
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Performance Tasks ({result.weights ? Math.round(result.weights.performanceTask * 100) : 50}%)</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">
                    {result.ptPercentage.toFixed(1)}% ({result.ptWeighted.toFixed(2)} pts)
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Exams: ST1 (9%), ST2 (9%), TE (12%)</span>
                  <span className="font-mono font-bold text-slate-800 text-sm">
                    {result.termAssessmentPercentage.toFixed(1)}% ({result.termAssessmentWeighted.toFixed(2)} pts)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Final Composite Grades Box */}
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-slate-200 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Initial Raw Grade</span>
              <span className="font-mono text-2xl font-black text-slate-700">
                {result.initialGrade.toFixed(2)}%
              </span>
            </div>

            <div className="border-2 border-emerald-600 bg-emerald-50/50 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                Official Term Grade
              </span>
              <span className="font-mono text-3xl font-black text-emerald-700">
                {result.transmutedGrade}
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">
                Descriptor
              </span>
              <div className="mt-0.5">
                <span className="text-base font-extrabold text-slate-900 block font-display">
                  {result.descriptor.level}
                </span>
                <span className="text-[10px] text-slate-600 font-medium line-clamp-1">
                  {result.descriptor.summary}
                </span>
              </div>
            </div>
          </div>

          {/* Teacher and Parent Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-300 text-center text-xs">
            <div>
              <div className="border-b border-slate-800 pb-1 mx-6 font-semibold">
                &nbsp;
              </div>
              <span className="text-[10px] text-slate-600 block mt-1 uppercase font-bold">
                Subject Teacher's Signature Over Printed Name
              </span>
            </div>
            <div>
              <div className="border-b border-slate-800 pb-1 mx-6 font-semibold">
                &nbsp;
              </div>
              <span className="text-[10px] text-slate-600 block mt-1 uppercase font-bold">
                Parent / Guardian's Signature
              </span>
            </div>
          </div>

          {/* Byline / Platform stamp */}
          <div className="text-center pt-2 text-[10px] text-slate-400">
            Generated via TALA · DepEd 3-Term Calendar (SY 2026–2027)
          </div>
        </div>
      </div>
    </div>
  );
};
