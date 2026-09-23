/**
 * DepEd Types for 3-Term Grade Calculator
 * Compliant with DepEd Order No. 15, s. 2026 and MATATAG Curriculum
 */

export type AcademicTerm = 'Term 1' | 'Term 2' | 'Term 3';

export type DescriptorLevel =
  | 'Advancing'
  | 'Benchmarking'
  | 'Connecting'
  | 'Developing'
  | 'Emerging';

export interface DescriptorInfo {
  level: DescriptorLevel;
  code: string;
  minGrade: number;
  maxGrade: number;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeBg: string;
  textColor: string;
  icon: string;
  title: string;
  summary: string;
  studentAdvice: string;
  parentAdvice: string;
}

export interface LearningAreaConfig {
  id: string;
  name: string;
  shortName: string;
  iconName: string;
  weights: {
    writtenWork: number; // e.g. 0.30
    performanceTask: number; // e.g. 0.50
    termAssessment: number; // e.g. 0.20
  };
  description: string;
}

export interface GradeLevelConfig {
  level: string; // 'Grade 1', 'Grade 7', etc.
  keyStage: string; // 'Key Stage 1 (Grades 1-3)', etc.
  learningAreas: LearningAreaConfig[];
}

export interface ScoreItem {
  id: string;
  name: string;
  score: number | '';
  highestScore: number | '';
}

export interface CalculatorState {
  studentName: string;
  gradeLevel: string;
  section: string;
  schoolName: string;
  term: AcademicTerm;
  learningAreaId: string;
  
  // Written works
  writtenWorks: ScoreItem[];
  
  // Performance tasks
  performanceTasks: ScoreItem[];
  
  // Summative assessments
  st1Score: number | '';
  st1Total: number | '';
  st2Score: number | '';
  st2Total: number | '';
  teScore: number | '';
  teTotal: number | '';
}

export interface CalculationResult {
  id: string;
  timestamp: number;
  studentName: string;
  gradeLevel: string;
  section: string;
  schoolName: string;
  term: AcademicTerm;
  learningAreaName: string;
  
  // Raw and weighted
  wwRawTotal: number;
  wwHighestTotal: number;
  wwPercentage: number;
  wwWeighted: number;
  
  ptRawTotal: number;
  ptHighestTotal: number;
  ptPercentage: number;
  ptWeighted: number;
  
  termAssessmentRawTotal: number;
  termAssessmentHighestTotal: number;
  termAssessmentPercentage: number;
  termAssessmentWeighted: number;
  
  initialGrade: number;
  transmutedGrade: number;
  descriptor: DescriptorInfo;
  weights?: {
    writtenWork: number;
    performanceTask: number;
    termAssessment: number;
  };
}

export interface LogEntry {
  id: string;
  timestamp: number;
  formattedTime: string;
  gradeLevel: string;
  section: string;
  term: AcademicTerm;
  learningArea: string;
  studentName: string; // Blurred in view
  schoolName: string; // Blurred in view
  ipAddress: string; // Blurred in view
  transmutedGrade: number;
  descriptor: DescriptorLevel;
}

export interface SubjectGradeRecord {
  id: string;
  name: string;
  code: string;
  isMapehSub?: boolean; // Music & Arts or PE & Health
  mapehParent?: boolean; // MAPEH composite
  term1: number | '';
  term2: number | '';
  term3: number | '';
  finalGrade?: number;
}

export interface HonorAwardResult {
  term1Gwa?: number;
  term2Gwa?: number;
  term3Gwa?: number;
  finalGwa: number;
  awardTitle: 'With Highest Honors' | 'With High Honors' | 'With Honors' | 'Academic Achiever' | 'Passed' | 'Needs Intervention';
  isHonorEligible: boolean;
  disqualificationReason?: string;
  lowestGrade: number;
  lowestGradeSubject?: string;
  passedAll: boolean;
}

export interface TargetScorePlan {
  targetTransmuted: number;
  targetDescriptor: DescriptorLevel;
  requiredInitialGrade: number;
  currentWwWeighted: number;
  currentPtWeighted: number;
  currentAssessedWeighted: number;
  neededAssessmentWeighted: number;
  neededAssessmentPct: number;
  isFeasible: boolean;
  recommendation: string;
}
