/**
 * DepEd Grading Logic, Transmutation Table & Curricular Weighting
 * Based on DepEd Order No. 15, s. 2026 (Updated 3-Term Assessment Policy)
 */

import {
  DescriptorInfo,
  DescriptorLevel,
  GradeLevelConfig,
  LearningAreaConfig,
  ScoreItem,
  CalculationResult,
  AcademicTerm
} from '../types';

/**
 * Official Descriptors per DepEd Order No. 15, s. 2026:
 * Advancing (90-100)
 * Benchmarking (80-89)
 * Connecting (75-79)
 * Developing (65-74)
 * Emerging (60-64)
 */
export const DESCRIPTORS_CONFIG: Record<DescriptorLevel, DescriptorInfo> = {
  Advancing: {
    level: 'Advancing',
    code: 'A',
    minGrade: 90,
    maxGrade: 100,
    color: '#059669', // Emerald
    bgColor: '#ECFDF5',
    borderColor: '#10B981',
    badgeBg: '#10B981',
    textColor: '#064E3B',
    icon: '🌟',
    title: 'Advancing',
    summary: 'Consistently demonstrates skills and understanding that meet or exceed standards with independence, flexibility, and depth.',
    studentAdvice: 'Superstar effort! Keep challenging yourself and have fun learning!',
    parentAdvice: 'Wonderful job! Celebrate your child’s hard work, curiosity, and creativity.'
  },
  Benchmarking: {
    level: 'Benchmarking',
    code: 'B',
    minGrade: 80,
    maxGrade: 89,
    color: '#0284C7', // Azure
    bgColor: '#F0F9FF',
    borderColor: '#0EA5E9',
    badgeBg: '#0EA5E9',
    textColor: '#0C4A6E',
    icon: '🎯',
    title: 'Benchmarking',
    summary: 'Demonstrates expected grade-level skills and understanding competently and independently.',
    studentAdvice: 'Great job! A little extra review on tricky questions will lift you to Advancing!',
    parentAdvice: 'Your child is doing well on all standard lessons. Keep up the supportive study routine!'
  },
  Connecting: {
    level: 'Connecting',
    code: 'C',
    minGrade: 75,
    maxGrade: 79,
    color: '#D97706', // Amber
    bgColor: '#FFFBEB',
    borderColor: '#F59E0B',
    badgeBg: '#F59E0B',
    textColor: '#78350F',
    icon: '💡',
    title: 'Connecting',
    summary: 'Demonstrates sufficient understanding and application of grade-level standards with occasional guidance and support.',
    studentAdvice: 'Good effort! Spending 15 minutes reviewing daily will help boost your scores!',
    parentAdvice: 'Steady progress! Checking homework together each day helps build confidence.'
  },
  Developing: {
    level: 'Developing',
    code: 'D',
    minGrade: 65,
    maxGrade: 74,
    color: '#EA580C', // Orange
    bgColor: '#FFF7ED',
    borderColor: '#FB923C',
    badgeBg: '#FB923C',
    textColor: '#7C2D12',
    icon: '🌱',
    title: 'Developing',
    summary: 'Demonstrates partial understanding and inconsistent application of skills, requires targeted support and scaffolding.',
    studentAdvice: 'Keep practicing! Review your quizzes and seatwork to climb even higher.',
    parentAdvice: 'Needs gentle guidance. Light, regular practice at home will strengthen the basics.'
  },
  Emerging: {
    level: 'Emerging',
    code: 'E',
    minGrade: 60,
    maxGrade: 64,
    color: '#E11D48', // Rose
    bgColor: '#FFF1F2',
    borderColor: '#F43F5E',
    badgeBg: '#F43F5E',
    textColor: '#881337',
    icon: '🧭',
    title: 'Emerging',
    summary: 'Does not yet demonstrate foundational skills and understanding; requires intensive support.',
    studentAdvice: 'Don’t worry! Practice makes progress. Ask your teacher or study buddy for tips!',
    parentAdvice: 'Needs extra encouragement. A chat with the teacher and extra practice sheets will help them catch up.'
  }
};

export interface TransmutationRow {
  minInitial: number;
  maxInitial: number;
  initialRange: string;
  transmutedGrade: number;
  descriptor: DescriptorLevel;
  generalDescription: string;
  isPassingThreshold?: boolean;
}

/**
 * Official DepEd Transmutation Table for SY 2026-2027
 * Passing mark: 70.00 - 71.17 Initial Grade = 75 Transmuted Grade (Connecting)
 */
export const TRANSMUTATION_TABLE_2026_2027: TransmutationRow[] = [
  { minInitial: 99.50, maxInitial: 100.0, initialRange: '99.50 – 100.00', transmutedGrade: 100, descriptor: 'Advancing', generalDescription: 'Consistently demonstrates skills and understanding that meet or exceed standards with independence, flexibility, and depth.' },
  { minInitial: 98.32, maxInitial: 99.49, initialRange: '98.32 – 99.49', transmutedGrade: 99, descriptor: 'Advancing', generalDescription: 'Consistently demonstrates skills and understanding that meet or exceed standards with independence, flexibility, and depth.' },
  { minInitial: 97.14, maxInitial: 98.31, initialRange: '97.14 – 98.31', transmutedGrade: 98, descriptor: 'Advancing', generalDescription: 'Consistently demonstrates skills and understanding that meet or exceed standards with independence, flexibility, and depth.' },
  { minInitial: 95.96, maxInitial: 97.13, initialRange: '95.96 – 97.13', transmutedGrade: 97, descriptor: 'Advancing', generalDescription: 'Consistently demonstrates skills and understanding that meet or exceed standards with independence, flexibility, and depth.' },
  { minInitial: 94.78, maxInitial: 95.95, initialRange: '94.78 – 95.95', transmutedGrade: 96, descriptor: 'Advancing', generalDescription: 'Consistently demonstrates skills and understanding that meet or exceed standards with independence, flexibility, and depth.' },
  { minInitial: 93.60, maxInitial: 94.77, initialRange: '93.60 – 94.77', transmutedGrade: 95, descriptor: 'Advancing', generalDescription: 'Consistently demonstrates skills and understanding that meet or exceed standards with independence, flexibility, and depth.' },
  { minInitial: 92.42, maxInitial: 93.59, initialRange: '92.42 – 93.59', transmutedGrade: 94, descriptor: 'Advancing', generalDescription: 'Consistently demonstrates skills and understanding that meet or exceed standards with independence, flexibility, and depth.' },
  { minInitial: 91.24, maxInitial: 92.41, initialRange: '91.24 – 92.41', transmutedGrade: 93, descriptor: 'Advancing', generalDescription: 'Consistently demonstrates skills and understanding that meet or exceed standards with independence, flexibility, and depth.' },
  { minInitial: 90.06, maxInitial: 91.23, initialRange: '90.06 – 91.23', transmutedGrade: 92, descriptor: 'Advancing', generalDescription: 'Consistently demonstrates skills and understanding that meet or exceed standards with independence, flexibility, and depth.' },
  { minInitial: 88.88, maxInitial: 90.05, initialRange: '88.88 – 90.05', transmutedGrade: 91, descriptor: 'Advancing', generalDescription: 'Consistently demonstrates skills and understanding that meet or exceed standards with independence, flexibility, and depth.' },
  { minInitial: 87.70, maxInitial: 88.87, initialRange: '87.70 – 88.87', transmutedGrade: 90, descriptor: 'Advancing', generalDescription: 'Consistently demonstrates skills and understanding that meet or exceed standards with independence, flexibility, and depth.' },

  { minInitial: 86.52, maxInitial: 87.69, initialRange: '86.52 – 87.69', transmutedGrade: 89, descriptor: 'Benchmarking', generalDescription: 'Demonstrates expected grade-level skills and understanding competently and independently.' },
  { minInitial: 85.34, maxInitial: 86.51, initialRange: '85.34 – 86.51', transmutedGrade: 88, descriptor: 'Benchmarking', generalDescription: 'Demonstrates expected grade-level skills and understanding competently and independently.' },
  { minInitial: 84.16, maxInitial: 85.33, initialRange: '84.16 – 85.33', transmutedGrade: 87, descriptor: 'Benchmarking', generalDescription: 'Demonstrates expected grade-level skills and understanding competently and independently.' },
  { minInitial: 82.98, maxInitial: 84.15, initialRange: '82.98 – 84.15', transmutedGrade: 86, descriptor: 'Benchmarking', generalDescription: 'Demonstrates expected grade-level skills and understanding competently and independently.' },
  { minInitial: 81.80, maxInitial: 82.97, initialRange: '81.80 – 82.97', transmutedGrade: 85, descriptor: 'Benchmarking', generalDescription: 'Demonstrates expected grade-level skills and understanding competently and independently.' },
  { minInitial: 80.62, maxInitial: 81.79, initialRange: '80.62 – 81.79', transmutedGrade: 84, descriptor: 'Benchmarking', generalDescription: 'Demonstrates expected grade-level skills and understanding competently and independently.' },
  { minInitial: 79.44, maxInitial: 80.61, initialRange: '79.44 – 80.61', transmutedGrade: 83, descriptor: 'Benchmarking', generalDescription: 'Demonstrates expected grade-level skills and understanding competently and independently.' },
  { minInitial: 78.26, maxInitial: 79.43, initialRange: '78.26 – 79.43', transmutedGrade: 82, descriptor: 'Benchmarking', generalDescription: 'Demonstrates expected grade-level skills and understanding competently and independently.' },
  { minInitial: 77.08, maxInitial: 78.25, initialRange: '77.08 – 78.25', transmutedGrade: 81, descriptor: 'Benchmarking', generalDescription: 'Demonstrates expected grade-level skills and understanding competently and independently.' },
  { minInitial: 75.90, maxInitial: 77.07, initialRange: '75.90 – 77.07', transmutedGrade: 80, descriptor: 'Benchmarking', generalDescription: 'Demonstrates expected grade-level skills and understanding competently and independently.' },

  { minInitial: 74.72, maxInitial: 75.89, initialRange: '74.72 – 75.89', transmutedGrade: 79, descriptor: 'Connecting', generalDescription: 'Demonstrates sufficient understanding and application of grade-level standards with occasional guidance and support.' },
  { minInitial: 73.54, maxInitial: 74.71, initialRange: '73.54 – 74.71', transmutedGrade: 78, descriptor: 'Connecting', generalDescription: 'Demonstrates sufficient understanding and application of grade-level standards with occasional guidance and support.' },
  { minInitial: 72.36, maxInitial: 73.53, initialRange: '72.36 – 73.53', transmutedGrade: 77, descriptor: 'Connecting', generalDescription: 'Demonstrates sufficient understanding and application of grade-level standards with occasional guidance and support.' },
  { minInitial: 71.18, maxInitial: 72.35, initialRange: '71.18 – 72.35', transmutedGrade: 76, descriptor: 'Connecting', generalDescription: 'Demonstrates sufficient understanding and application of grade-level standards with occasional guidance and support.' },
  { minInitial: 70.00, maxInitial: 71.17, initialRange: '70.00 – 71.17', transmutedGrade: 75, descriptor: 'Connecting', generalDescription: 'Demonstrates sufficient understanding and application of grade-level standards with occasional guidance and support.', isPassingThreshold: true },

  { minInitial: 65.34, maxInitial: 69.99, initialRange: '65.34 – 69.99', transmutedGrade: 74, descriptor: 'Developing', generalDescription: 'Demonstrates partial understanding and inconsistent application of skills, requires targeted support and scaffolding.' },
  { minInitial: 60.67, maxInitial: 65.33, initialRange: '60.67 – 65.33', transmutedGrade: 73, descriptor: 'Developing', generalDescription: 'Demonstrates partial understanding and inconsistent application of skills, requires targeted support and scaffolding.' },
  { minInitial: 56.01, maxInitial: 60.66, initialRange: '56.01 – 60.66', transmutedGrade: 72, descriptor: 'Developing', generalDescription: 'Demonstrates partial understanding and inconsistent application of skills, requires targeted support and scaffolding.' },
  { minInitial: 51.34, maxInitial: 56.00, initialRange: '51.34 – 56.00', transmutedGrade: 71, descriptor: 'Developing', generalDescription: 'Demonstrates partial understanding and inconsistent application of skills, requires targeted support and scaffolding.' },
  { minInitial: 46.67, maxInitial: 51.33, initialRange: '46.67 – 51.33', transmutedGrade: 70, descriptor: 'Developing', generalDescription: 'Demonstrates partial understanding and inconsistent application of skills, requires targeted support and scaffolding.' },
  { minInitial: 42.01, maxInitial: 46.66, initialRange: '42.01 – 46.66', transmutedGrade: 69, descriptor: 'Developing', generalDescription: 'Demonstrates partial understanding and inconsistent application of skills, requires targeted support and scaffolding.' },
  { minInitial: 37.34, maxInitial: 42.00, initialRange: '37.34 – 42.00', transmutedGrade: 68, descriptor: 'Developing', generalDescription: 'Demonstrates partial understanding and inconsistent application of skills, requires targeted support and scaffolding.' },
  { minInitial: 32.68, maxInitial: 37.33, initialRange: '32.68 – 37.33', transmutedGrade: 67, descriptor: 'Developing', generalDescription: 'Demonstrates partial understanding and inconsistent application of skills, requires targeted support and scaffolding.' },
  { minInitial: 28.01, maxInitial: 32.67, initialRange: '28.01 – 32.67', transmutedGrade: 66, descriptor: 'Developing', generalDescription: 'Demonstrates partial understanding and inconsistent application of skills, requires targeted support and scaffolding.' },
  { minInitial: 23.35, maxInitial: 28.00, initialRange: '23.35 – 28.00', transmutedGrade: 65, descriptor: 'Developing', generalDescription: 'Demonstrates partial understanding and inconsistent application of skills, requires targeted support and scaffolding.' },

  { minInitial: 18.68, maxInitial: 23.34, initialRange: '18.68 – 23.34', transmutedGrade: 64, descriptor: 'Emerging', generalDescription: 'Does not yet demonstrate foundational skills and understanding; requires intensive support.' },
  { minInitial: 14.01, maxInitial: 18.67, initialRange: '14.01 – 18.67', transmutedGrade: 63, descriptor: 'Emerging', generalDescription: 'Does not yet demonstrate foundational skills and understanding; requires intensive support.' },
  { minInitial: 9.35, maxInitial: 14.00, initialRange: '9.35 – 14.00', transmutedGrade: 62, descriptor: 'Emerging', generalDescription: 'Does not yet demonstrate foundational skills and understanding; requires intensive support.' },
  { minInitial: 4.68, maxInitial: 9.34, initialRange: '4.68 – 9.34', transmutedGrade: 61, descriptor: 'Emerging', generalDescription: 'Does not yet demonstrate foundational skills and understanding; requires intensive support.' },
  { minInitial: 0.00, maxInitial: 4.67, initialRange: '0.00 – 4.67', transmutedGrade: 60, descriptor: 'Emerging', generalDescription: 'Does not yet demonstrate foundational skills and understanding; requires intensive support.' }
];

export function findTransmutationRow(initialGrade: number): TransmutationRow {
  const g = Math.round(initialGrade * 100) / 100;
  for (const row of TRANSMUTATION_TABLE_2026_2027) {
    if (g >= row.minInitial && g <= row.maxInitial) {
      return row;
    }
  }
  if (g >= 99.50) return TRANSMUTATION_TABLE_2026_2027[0];
  return TRANSMUTATION_TABLE_2026_2027[TRANSMUTATION_TABLE_2026_2027.length - 1];
}

/**
 * Official DepEd Transmutation Table (Initial Grade to Transmuted Term Grade)
 */
export function transmuteGrade(initialGrade: number): number {
  const g = Math.round(initialGrade * 100) / 100;
  
  if (g >= 99.50) return 100;
  if (g >= 98.32) return 99;
  if (g >= 97.14) return 98;
  if (g >= 95.96) return 97;
  if (g >= 94.78) return 96;
  if (g >= 93.60) return 95;
  if (g >= 92.42) return 94;
  if (g >= 91.24) return 93;
  if (g >= 90.06) return 92;
  if (g >= 88.88) return 91;
  if (g >= 87.70) return 90;

  if (g >= 86.52) return 89;
  if (g >= 85.34) return 88;
  if (g >= 84.16) return 87;
  if (g >= 82.98) return 86;
  if (g >= 81.80) return 85;
  if (g >= 80.62) return 84;
  if (g >= 79.44) return 83;
  if (g >= 78.26) return 82;
  if (g >= 77.08) return 81;
  if (g >= 75.90) return 80;

  if (g >= 74.72) return 79;
  if (g >= 73.54) return 78;
  if (g >= 72.36) return 77;
  if (g >= 71.18) return 76;
  if (g >= 70.00) return 75;

  if (g >= 65.34) return 74;
  if (g >= 60.67) return 73;
  if (g >= 56.01) return 72;
  if (g >= 51.34) return 71;
  if (g >= 46.67) return 70;
  if (g >= 42.01) return 69;
  if (g >= 37.34) return 68;
  if (g >= 32.68) return 67;
  if (g >= 28.01) return 66;
  if (g >= 23.35) return 65;

  if (g >= 18.68) return 64;
  if (g >= 14.01) return 63;
  if (g >= 9.35) return 62;
  if (g >= 4.68) return 61;
  return 60;
}

export function getDescriptor(transmutedGrade: number): DescriptorInfo {
  if (transmutedGrade >= 90) return DESCRIPTORS_CONFIG.Advancing;
  if (transmutedGrade >= 80) return DESCRIPTORS_CONFIG.Benchmarking;
  if (transmutedGrade >= 75) return DESCRIPTORS_CONFIG.Connecting;
  if (transmutedGrade >= 65) return DESCRIPTORS_CONFIG.Developing;
  return DESCRIPTORS_CONFIG.Emerging;
}

// Learning Areas Component Weights (DepEd Standards & Fully Customizable)
// Under DepEd DO 15, s. 2026: Written Work: 20-30%, Performance Tasks: 50-40%, Term Assessment: 30% (ST1: 9%, ST2: 9%, TE: 12%)
export const WEIGHTS_MATH_SCI_LANG_AP = { writtenWork: 0.20, performanceTask: 0.50, termAssessment: 0.30 };

// Standard Weight preset: WW: 20%, PT: 50%, Exam: 30% (ST1: 9%, ST2: 9%, TE: 12%)
export const WEIGHTS_GMRC_EPP_TLE_MAPEH = { writtenWork: 0.20, performanceTask: 0.50, termAssessment: 0.30 };

// Special Program Presets (SPJ, SPA, SPSTEM, SPFL, SPS, ALIVE)
export interface SpecialProgramPreset {
  id: string;
  name: string;
  shortName: string;
  description: string;
  weights: { writtenWork: number; performanceTask: number; termAssessment: number };
  iconName: string;
}

export const SPECIAL_PROGRAMS_PRESETS: SpecialProgramPreset[] = [
  {
    id: 'spj',
    name: 'Special Program in Journalism (SPJ)',
    shortName: 'SPJ',
    description: 'News writing, feature, editorial, photojournalism, and broadcasting',
    weights: { writtenWork: 0.20, performanceTask: 0.50, termAssessment: 0.30 },
    iconName: 'FileText'
  },
  {
    id: 'spa',
    name: 'Special Program in the Arts (SPA)',
    shortName: 'SPA',
    description: 'Visual arts, creative writing, music, theater, and dance',
    weights: { writtenWork: 0.20, performanceTask: 0.50, termAssessment: 0.30 },
    iconName: 'Palette'
  },
  {
    id: 'spstem',
    name: 'Special Program in STEM (SPSTEM)',
    shortName: 'SPSTEM',
    description: 'Advanced science, technology, research, engineering, and mathematics',
    weights: { writtenWork: 0.20, performanceTask: 0.50, termAssessment: 0.30 },
    iconName: 'Binary'
  },
  {
    id: 'spfl',
    name: 'Special Program in Foreign Language (SPFL)',
    shortName: 'SPFL',
    description: 'Conversational foreign languages (Spanish, Japanese, Mandarin, French, German)',
    weights: { writtenWork: 0.20, performanceTask: 0.50, termAssessment: 0.30 },
    iconName: 'Languages'
  },
  {
    id: 'sps',
    name: 'Special Program in Sports (SPS)',
    shortName: 'SPS',
    description: 'Athletic disciplines, physical conditioning, tournament officiating',
    weights: { writtenWork: 0.20, performanceTask: 0.50, termAssessment: 0.30 },
    iconName: 'Activity'
  },
  {
    id: 'alive',
    name: 'Arabic Language and Islamic Values Education (ALIVE)',
    shortName: 'ALIVE',
    description: 'Arabic language literacy and Islamic cultural values education',
    weights: { writtenWork: 0.20, performanceTask: 0.50, termAssessment: 0.30 },
    iconName: 'BookOpen'
  }
];

export const GRADE_LEVELS_DATA: GradeLevelConfig[] = [
  {
    level: 'Grade 1',
    keyStage: 'Key Stage 1 (MATATAG)',
    learningAreas: [
      { id: 'g1_makabansa', name: 'Makabansa', shortName: 'Makabansa', iconName: 'Compass', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Culture, citizenship, and community integration' },
      { id: 'g1_read_lit', name: 'Reading and Literacy', shortName: 'Reading', iconName: 'BookOpen', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Foundational reading comprehension and phonics' },
      { id: 'g1_language', name: 'Language', shortName: 'Language', iconName: 'MessageSquare', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Expressive and receptive language acquisition' },
      { id: 'g1_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Numbers, shapes, patterns, and basic arithmetic' },
      { id: 'g1_gmrc', name: 'GMRC', shortName: 'GMRC', iconName: 'Heart', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Good Manners and Right Conduct' },
    ]
  },
  {
    level: 'Grade 2',
    keyStage: 'Key Stage 1 (MATATAG)',
    learningAreas: [
      { id: 'g2_makabansa', name: 'Makabansa', shortName: 'Makabansa', iconName: 'Compass', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'National identity and societal environment' },
      { id: 'g2_filipino', name: 'Filipino', shortName: 'Filipino', iconName: 'BookOpen', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Wika, pagbasa, at talasalitaan' },
      { id: 'g2_english', name: 'English', shortName: 'English', iconName: 'Languages', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Language fluency and early literature' },
      { id: 'g2_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Problem solving, fractions, and operations' },
      { id: 'g2_gmrc', name: 'GMRC', shortName: 'GMRC', iconName: 'Heart', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Character building and empathy' },
    ]
  },
  {
    level: 'Grade 3',
    keyStage: 'Key Stage 1 (MATATAG)',
    learningAreas: [
      { id: 'g3_science', name: 'Science', shortName: 'Science', iconName: 'FlaskConical', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Living things, physical materials, and earth' },
      { id: 'g3_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Multiplication, division, and measurement' },
      { id: 'g3_english', name: 'English', shortName: 'English', iconName: 'Languages', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Grammar, reading comprehension, and writing' },
      { id: 'g3_filipino', name: 'Filipino', shortName: 'Filipino', iconName: 'BookOpen', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Pagbasa at pagsulat sa sariling wika' },
      { id: 'g3_makabansa', name: 'Makabansa', shortName: 'Makabansa', iconName: 'Globe', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Kasaysayan ng komunidad at rehiyon' },
      { id: 'g3_gmrc', name: 'GMRC', shortName: 'GMRC', iconName: 'Heart', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Values and responsible actions' },
    ]
  },
  {
    level: 'Grade 4',
    keyStage: 'Key Stage 2 (Intermediate)',
    learningAreas: [
      { id: 'g4_science', name: 'Science', shortName: 'Science', iconName: 'FlaskConical', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Scientific inquiry and natural systems' },
      { id: 'g4_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Decimals, geometric reasoning, and statistics' },
      { id: 'g4_english', name: 'English', shortName: 'English', iconName: 'Languages', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Communicative competence and textual analysis' },
      { id: 'g4_filipino', name: 'Filipino', shortName: 'Filipino', iconName: 'BookOpen', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Wikang Pambansa at panitikan' },
      { id: 'g4_ap', name: 'Araling Panlipunan (AP)', shortName: 'AP', iconName: 'Globe', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Heograpiya at kultura ng Pilipinas' },
      { id: 'g4_epp', name: 'EPP', shortName: 'EPP', iconName: 'Briefcase', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Practical hands-on household and vocational skills' },
      { id: 'g4_music_arts', name: 'Music and Arts', shortName: 'Music & Arts', iconName: 'Palette', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Creative expression, traditional melodies, visual arts' },
      { id: 'g4_pe_health', name: 'PE and Health', shortName: 'PE & Health', iconName: 'Activity', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Physical fitness, games, safety, and personal wellness' },
      { id: 'g4_gmrc', name: 'GMRC', shortName: 'GMRC', iconName: 'Heart', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Moral discernment and active citizenship' },
    ]
  },
  {
    level: 'Grade 5',
    keyStage: 'Key Stage 2 (Intermediate)',
    learningAreas: [
      { id: 'g5_science', name: 'Science', shortName: 'Science', iconName: 'FlaskConical', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Matter, organ systems, and environmental changes' },
      { id: 'g5_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Ratios, fractions, percentage, and plane geometry' },
      { id: 'g5_english', name: 'English', shortName: 'English', iconName: 'Languages', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Informational texts and written compositions' },
      { id: 'g5_filipino', name: 'Filipino', shortName: 'Filipino', iconName: 'BookOpen', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Wika, sanaysay, at maikling kwento' },
      { id: 'g5_ap', name: 'Araling Panlipunan (AP)', shortName: 'AP', iconName: 'Globe', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Kolonyalismong Espanyol at pagkakakilanlan' },
      { id: 'g5_epp', name: 'EPP', shortName: 'EPP', iconName: 'Briefcase', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Agrikultura, ICT, at kabuhayan' },
      { id: 'g5_music_arts', name: 'Music and Arts', shortName: 'Music & Arts', iconName: 'Palette', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Philippine ethnic musical forms and regional arts' },
      { id: 'g5_pe_health', name: 'PE and Health', shortName: 'PE & Health', iconName: 'Activity', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Target games, gymnastics, emotional health and nutrition' },
      { id: 'g5_esp', name: 'Edukasyon sa Pagpapakatao (EsP)', shortName: 'EsP', iconName: 'Heart', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Pagpapahalaga sa katotohanan at kapwa' },
    ]
  },
  {
    level: 'Grade 6',
    keyStage: 'Key Stage 2 (Intermediate)',
    learningAreas: [
      { id: 'g6_science', name: 'Science', shortName: 'Science', iconName: 'FlaskConical', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Solutions, motion, energy, and planetary bodies' },
      { id: 'g6_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Algebraic equations, integers, and probability' },
      { id: 'g6_english', name: 'English', shortName: 'English', iconName: 'Languages', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Research skills, literature, and speech delivery' },
      { id: 'g6_filipino', name: 'Filipino', shortName: 'Filipino', iconName: 'BookOpen', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Mapanuring pag-iisip sa panitikan' },
      { id: 'g6_ap', name: 'Araling Panlipunan (AP)', shortName: 'AP', iconName: 'Globe', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Kasarinlan at kontemporaryong hamon sa bansa' },
      { id: 'g6_tle', name: 'TLE / EPP', shortName: 'TLE', iconName: 'Briefcase', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Industrial arts, entrepreneurship, and nutrition' },
      { id: 'g6_music_arts', name: 'Music and Arts', shortName: 'Music & Arts', iconName: 'Palette', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Musical forms, western art styles, and stage design' },
      { id: 'g6_pe_health', name: 'PE and Health', shortName: 'PE & Health', iconName: 'Activity', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Striking games, rhythmic routines, and community health' },
      { id: 'g6_esp', name: 'Edukasyon sa Pagpapakatao (EsP)', shortName: 'EsP', iconName: 'Heart', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Pangako, responsibilidad, at katarungan' },
    ]
  },
  {
    level: 'Grade 7',
    keyStage: 'Key Stage 3 (Junior High School)',
    learningAreas: [
      { id: 'g7_science', name: 'Science', shortName: 'Science', iconName: 'FlaskConical', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Integrated Science: Scientific processes, mixtures, and cells' },
      { id: 'g7_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Sets, real numbers, polynomials, and linear equations' },
      { id: 'g7_english', name: 'English', shortName: 'English', iconName: 'Languages', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Philippine Literature and communicative grammar' },
      { id: 'g7_filipino', name: 'Filipino', shortName: 'Filipino', iconName: 'BookOpen', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Ibong Adarna at Panitikang Rehiyonal' },
      { id: 'g7_ap', name: 'Araling Panlipunan (AP)', shortName: 'AP', iconName: 'Globe', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Heograpiya, sibilisasyon, at kultura ng Asya' },
      { id: 'g7_tle', name: 'TLE', shortName: 'TLE', iconName: 'Wrench', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Cookery, Carpentry, Technical Drafting, and ICT' },
      { id: 'g7_music_arts', name: 'Music and Arts', shortName: 'Music & Arts', iconName: 'Palette', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Folk music of Luzon, Lowland arts, traditional textiles' },
      { id: 'g7_pe_health', name: 'PE and Health', shortName: 'PE & Health', iconName: 'Activity', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Physical fitness components, holistic health, and dual sports' },
      { id: 'g7_esp', name: 'Edukasyon sa Pagpapakatao (EsP)', shortName: 'EsP', iconName: 'Heart', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Pagtuklas ng angking talento at pagpapahalaga' },
    ]
  },
  {
    level: 'Grade 8',
    keyStage: 'Key Stage 3 (Junior High School)',
    learningAreas: [
      { id: 'g8_science', name: 'Science', shortName: 'Science', iconName: 'FlaskConical', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Physics forces, earthquakes, digestion, and genetics' },
      { id: 'g8_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Factoring, rational expressions, and coordinate geometry' },
      { id: 'g8_english', name: 'English', shortName: 'English', iconName: 'Languages', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Afro-Asian Literature and persuasive rhetoric' },
      { id: 'g8_filipino', name: 'Filipino', shortName: 'Filipino', iconName: 'BookOpen', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Florante at Laura at Panitikang Tradisyunal' },
      { id: 'g8_ap', name: 'Araling Panlipunan (AP)', shortName: 'AP', iconName: 'Globe', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Kasaysayan ng Daigdig at Pandaigdigang Alyansa' },
      { id: 'g8_tle', name: 'TLE', shortName: 'TLE', iconName: 'Wrench', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Applied technical skills and entrepreneurship' },
      { id: 'g8_music_arts', name: 'Music and Arts', shortName: 'Music & Arts', iconName: 'Palette', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Southeast Asian music, fabric design, and sculpture' },
      { id: 'g8_pe_health', name: 'PE and Health', shortName: 'PE & Health', iconName: 'Activity', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Team sports, family health, wellness' },
      { id: 'g8_esp', name: 'Edukasyon sa Pagpapakatao (EsP)', shortName: 'EsP', iconName: 'Heart', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Pakikipagkapwa at katatagan ng pamilya' },
    ]
  },
  {
    level: 'Grade 9',
    keyStage: 'Key Stage 3 (Junior High School)',
    learningAreas: [
      { id: 'g9_science', name: 'Science', shortName: 'Science', iconName: 'FlaskConical', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Respiratory systems, chemical bonding, and volcanoes' },
      { id: 'g9_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Quadratic equations, variations, and trigonometry' },
      { id: 'g9_english', name: 'English', shortName: 'English', iconName: 'Languages', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Anglo-American Literature and critical analysis' },
      { id: 'g9_filipino', name: 'Filipino', shortName: 'Filipino', iconName: 'BookOpen', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Noli Me Tangere at Panitikang Asyano' },
      { id: 'g9_ap', name: 'Araling Panlipunan (AP)', shortName: 'AP', iconName: 'TrendingUp', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Maykro at Makroekonomiks, pambansang kaunlaran' },
      { id: 'g9_tle', name: 'TLE', shortName: 'TLE', iconName: 'Wrench', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Vocational specialization and lab hands-on' },
      { id: 'g9_music_arts', name: 'Music and Arts', shortName: 'Music & Arts', iconName: 'Palette', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Medieval to Classical European music and Renaissance arts' },
      { id: 'g9_pe_health', name: 'PE and Health', shortName: 'PE & Health', iconName: 'Activity', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Festival dances, environmental health, and injury prevention' },
      { id: 'g9_esp', name: 'Edukasyon sa Pagpapakatao (EsP)', shortName: 'EsP', iconName: 'Heart', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Katarungang panlipunan at kabutihang panlahat' },
    ]
  },
  {
    level: 'Grade 10',
    keyStage: 'Key Stage 3 (Junior High School)',
    learningAreas: [
      { id: 'g10_science', name: 'Science', shortName: 'Science', iconName: 'FlaskConical', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Plate tectonics, electromagnetism, and biomolecules' },
      { id: 'g10_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Sequences, polynomial functions, and circle theorems' },
      { id: 'g10_english', name: 'English', shortName: 'English', iconName: 'Languages', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'World Literature and argumentation' },
      { id: 'g10_filipino', name: 'Filipino', shortName: 'Filipino', iconName: 'BookOpen', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'El Filibusterismo at Pandaigdigang Panitikan' },
      { id: 'g10_ap', name: 'Araling Panlipunan (AP)', shortName: 'AP', iconName: 'Globe', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Mga Kontemporaryong Isyu at karapatang pantao' },
      { id: 'g10_tle', name: 'TLE', shortName: 'TLE', iconName: 'Wrench', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'National Certificate (NC) competency preparation' },
      { id: 'g10_music_arts', name: 'Music and Arts', shortName: 'Music & Arts', iconName: 'Palette', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: '20th Century contemporary music, modern tech art and photography' },
      { id: 'g10_pe_health', name: 'PE and Health', shortName: 'PE & Health', iconName: 'Activity', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Street dance, hip-hop, active recreation and global health trends' },
      { id: 'g10_esp', name: 'Edukasyon sa Pagpapakatao (EsP)', shortName: 'EsP', iconName: 'Heart', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Paghahanda sa Senior High School at bokasyon' },
    ]
  },
  {
    level: 'Grade 11',
    keyStage: 'Key Stage 4 (Senior High School)',
    learningAreas: [
      { id: 'g11_core_oral', name: 'Oral Communication / Komunikasyon', shortName: 'Oral Comm', iconName: 'MessageSquare', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Core communication principles in English & Filipino' },
      { id: 'g11_core_genmath', name: 'General Mathematics / Statistics', shortName: 'Gen Math', iconName: 'Calculator', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Functions, business math, probability distributions' },
      { id: 'g11_core_earthsci', name: 'Earth & Life Science / Physical Science', shortName: 'Science', iconName: 'FlaskConical', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Geology, ecology, and chemical principles' },
      { id: 'g11_acad_stem', name: 'STEM Specialization', shortName: 'STEM Spec', iconName: 'Binary', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Advanced academic STEM subjects' },
      { id: 'g11_acad_humss_abm', name: 'ABM / HUMSS Applied Subject', shortName: 'ABM / HUMSS', iconName: 'Briefcase', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Organization, economics, creative writing' },
      { id: 'g11_tvl_spec', name: 'TVL Specialization Course', shortName: 'TVL Spec', iconName: 'Wrench', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Hands-on practical industry competency training' },
      { id: 'g11_pe_health', name: 'Physical Education and Health', shortName: 'PE & Health', iconName: 'Activity', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Physical wellness, dance, and recreational fitness' },
    ]
  },
  {
    level: 'Grade 12',
    keyStage: 'Key Stage 4 (Senior High School)',
    learningAreas: [
      { id: 'g12_practical_res', name: 'Practical Research 1 & 2', shortName: 'Research', iconName: 'FileText', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Qualitative and quantitative empirical research' },
      { id: 'g12_core_contemp', name: 'Contemporary Philippine Arts', shortName: 'Arts', iconName: 'Palette', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Modern regional art practices and techniques' },
      { id: 'g12_acad_calculus', name: 'Basic Calculus / Physics / Chemistry', shortName: 'Calculus/Phys', iconName: 'Cpu', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Limits, derivatives, Newtonian mechanics' },
      { id: 'g12_acad_applied', name: 'Inquiries, Investigations & Immersion', shortName: '3Is / Immersion', iconName: 'Compass', weights: WEIGHTS_MATH_SCI_LANG_AP, description: 'Culminating research synthesis and application' },
      { id: 'g12_tvl_immersion', name: 'TVL Work Immersion / Culminating', shortName: 'TVL Immersion', iconName: 'Wrench', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Industry on-the-job apprenticeship and assessment' },
      { id: 'g12_pe_health', name: 'Physical Education and Health 4', shortName: 'PE & Health', iconName: 'Activity', weights: WEIGHTS_GMRC_EPP_TLE_MAPEH, description: 'Lifelong fitness and leadership in sports' },
    ]
  }
];

export function getGradeConfig(gradeLevel: string): GradeLevelConfig {
  const found = GRADE_LEVELS_DATA.find(g => g.level === gradeLevel);
  return found || GRADE_LEVELS_DATA[6]; // default Grade 7
}

export function getLearningArea(gradeLevel: string, areaId: string): LearningAreaConfig {
  const gConfig = getGradeConfig(gradeLevel);
  const found = gConfig.learningAreas.find(a => a.id === areaId);
  return found || gConfig.learningAreas[0];
}

/**
 * Calculates raw scores, weighted percentages, transmuted grade, and descriptor
 */
export function calculateTermGrade(
  studentName: string,
  gradeLevel: string,
  section: string,
  schoolName: string,
  term: AcademicTerm,
  learningAreaId: string,
  writtenWorks: ScoreItem[],
  performanceTasks: ScoreItem[],
  st1Score: number | '',
  st1Total: number | '',
  st2Score: number | '',
  st2Total: number | '',
  teScore: number | '',
  teTotal: number | '',
  customWeights?: { writtenWork: number; performanceTask: number; termAssessment: number },
  customLearningAreaName?: string
): CalculationResult {
  const defaultArea = getLearningArea(gradeLevel, learningAreaId);
  const weights = customWeights || defaultArea.weights;
  const learningAreaName = customLearningAreaName || defaultArea.name;
  
  // 1. Written Works total
  let wwRaw = 0;
  let wwHigh = 0;
  writtenWorks.forEach(item => {
    const s = typeof item.score === 'number' ? Math.max(0, item.score) : 0;
    const h = typeof item.highestScore === 'number' ? Math.max(1, item.highestScore) : 0;
    wwRaw += s;
    wwHigh += h;
  });
  const wwPct = wwHigh > 0 ? (wwRaw / wwHigh) * 100 : 0;
  const wwWeighted = wwPct * weights.writtenWork;

  // 2. Performance Tasks total
  let ptRaw = 0;
  let ptHigh = 0;
  performanceTasks.forEach(item => {
    const s = typeof item.score === 'number' ? Math.max(0, item.score) : 0;
    const h = typeof item.highestScore === 'number' ? Math.max(1, item.highestScore) : 0;
    ptRaw += s;
    ptHigh += h;
  });
  const ptPct = ptHigh > 0 ? (ptRaw / ptHigh) * 100 : 0;
  const ptWeighted = ptPct * weights.performanceTask;

  // 3. Summative Assessments (ST1, ST2, TE)
  // DepEd DO 15, s. 2026: ST1 is 9%, ST2 is 9%, and TE is 12% of the total grade (summing to 30% exam component)
  const st1_s = typeof st1Score === 'number' ? Math.max(0, st1Score) : 0;
  const st1_h = typeof st1Total === 'number' ? Math.max(1, st1Total) : 0;
  const st2_s = typeof st2Score === 'number' ? Math.max(0, st2Score) : 0;
  const st2_h = typeof st2Total === 'number' ? Math.max(1, st2Total) : 0;
  const te_s = typeof teScore === 'number' ? Math.max(0, teScore) : 0;
  const te_h = typeof teTotal === 'number' ? Math.max(1, teTotal) : 0;

  const st1Pct = st1_h > 0 ? (st1_s / st1_h) * 100 : 0;
  const st2Pct = st2_h > 0 ? (st2_s / st2_h) * 100 : 0;
  const tePct = te_h > 0 ? (te_s / te_h) * 100 : 0;

  // Relative distribution: ST1 is 9%, ST2 is 9%, TE is 12% when exam weight is 30%
  const examTotalWeight = weights.termAssessment;
  const st1Factor = examTotalWeight === 0.30 ? 0.09 : examTotalWeight * (9 / 30);
  const st2Factor = examTotalWeight === 0.30 ? 0.09 : examTotalWeight * (9 / 30);
  const teFactor = examTotalWeight === 0.30 ? 0.12 : examTotalWeight * (12 / 30);

  const st1Weighted = st1Pct * st1Factor;
  const st2Weighted = st2Pct * st2Factor;
  const teWeighted = tePct * teFactor;

  const termAssessmentRaw = st1_s + st2_s + te_s;
  const termAssessmentHigh = st1_h + st2_h + te_h;
  const termAssessmentWeighted = st1Weighted + st2Weighted + teWeighted;
  const termAssessmentPct = examTotalWeight > 0 ? (termAssessmentWeighted / examTotalWeight) : 0;

  // Initial Grade (Sum of weighted scores)
  const initialGrade = Math.round((wwWeighted + ptWeighted + termAssessmentWeighted) * 100) / 100;
  
  // Transmuted Term Grade
  const transmutedGrade = transmuteGrade(initialGrade);
  
  // Descriptor
  const descriptor = getDescriptor(transmutedGrade);

  return {
    id: `calc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    studentName: studentName.trim() || 'Student Learner',
    gradeLevel,
    section: section.trim() || 'Section 1',
    schoolName: schoolName.trim() || 'DepEd Public School',
    term,
    learningAreaName,
    wwRawTotal: wwRaw,
    wwHighestTotal: wwHigh,
    wwPercentage: Math.round(wwPct * 100) / 100,
    wwWeighted: Math.round(wwWeighted * 100) / 100,
    ptRawTotal: ptRaw,
    ptHighestTotal: ptHigh,
    ptPercentage: Math.round(ptPct * 100) / 100,
    ptWeighted: Math.round(ptWeighted * 100) / 100,
    termAssessmentRawTotal: termAssessmentRaw,
    termAssessmentHighestTotal: termAssessmentHigh,
    termAssessmentPercentage: Math.round(termAssessmentPct * 100) / 100,
    termAssessmentWeighted: Math.round(termAssessmentWeighted * 100) / 100,
    st1Score: st1_s,
    st1Total: st1_h,
    st1Percentage: Math.round(st1Pct * 100) / 100,
    st1Weighted: Math.round(st1Weighted * 100) / 100,
    st2Score: st2_s,
    st2Total: st2_h,
    st2Percentage: Math.round(st2Pct * 100) / 100,
    st2Weighted: Math.round(st2Weighted * 100) / 100,
    teScore: te_s,
    teTotal: te_h,
    tePercentage: Math.round(tePct * 100) / 100,
    teWeighted: Math.round(teWeighted * 100) / 100,
    initialGrade,
    transmutedGrade,
    descriptor,
    weights
  };
}

/**
 * MAPEH Average Calculator
 * DepEd Rule: The rating for MAPEH is the average of Music & Arts and PE & Health
 */
export function calculateMapehAverage(musicAndArts: number, peAndHealth: number): number {
  return Math.round((musicAndArts + peAndHealth) / 2);
}

/**
 * DepEd Academic Excellence Awards Calculator (DO 36, s. 2016 & DO 15, s. 2026)
 * Criteria:
 * - With Highest Honors: GWA 98.00 - 100.00
 * - With High Honors: GWA 95.00 - 97.99
 * - With Honors: GWA 90.00 - 94.99
 *
 * CRITICAL RULE:
 * "Candidates for honors must NOT have a grade lower than 80 in any learning area
 * in ANY term (Term 1, Term 2, Term 3)."
 */
export function calculateHonorAwards(
  subjectRecords: Array<{
    id: string;
    name: string;
    term1: number | '';
    term2: number | '';
    term3: number | '';
    isMapehSub?: boolean; // If true, only its parent MAPEH is counted in GWA
    mapehParent?: boolean;
  }>
): {
  term1Gwa: number | null;
  term2Gwa: number | null;
  term3Gwa: number | null;
  finalGwa: number;
  awardTitle: 'With Highest Honors' | 'With High Honors' | 'With Honors' | 'Academic Achiever' | 'Passed' | 'Needs Intervention';
  isHonorEligible: boolean;
  disqualificationReason?: string;
  lowestGrade: number;
  lowestGradeSubject?: string;
  passedAll: boolean;
  subjectAverages: Array<{ id: string; name: string; finalSubjectGrade: number; descriptor: DescriptorInfo }>;
} {
  // Filter out subcomponents (Music & Arts and PE & Health) from direct GWA addition
  // if MAPEH parent is present, because MAPEH is the counted subject in Form 137 / SF9.
  // BUT all subcomponents and subjects must STILL satisfy the >= 80 rule!
  const hasMapehParent = subjectRecords.some(s => s.mapehParent);
  const subjectsForGwa = subjectRecords.filter(s => {
    if (hasMapehParent && s.isMapehSub) return false;
    return true;
  });

  let lowestGrade = 100;
  let lowestGradeSubject = '';
  let failedAny = false;
  let hasBelow80 = false;
  let below80Subject = '';
  let below80Term = '';

  // Check every subject and every entered term grade against the 80 threshold
  subjectRecords.forEach(subj => {
    const terms = [
      { t: 'Term 1', val: subj.term1 },
      { t: 'Term 2', val: subj.term2 },
      { t: 'Term 3', val: subj.term3 },
    ];

    terms.forEach(tItem => {
      if (typeof tItem.val === 'number') {
        if (tItem.val < lowestGrade) {
          lowestGrade = tItem.val;
          lowestGradeSubject = subj.name;
        }
        if (tItem.val < 75) {
          failedAny = true;
        }
        if (tItem.val < 80) {
          hasBelow80 = true;
          if (!below80Subject) {
            below80Subject = subj.name;
            below80Term = tItem.t;
          }
        }
      }
    });
  });

  // Calculate subject final averages
  const subjectAverages = subjectsForGwa.map(subj => {
    const vals = [subj.term1, subj.term2, subj.term3].filter(v => typeof v === 'number') as number[];
    const avg = vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    return {
      id: subj.id,
      name: subj.name,
      finalSubjectGrade: avg,
      descriptor: getDescriptor(avg)
    };
  });

  // Helper for Term GWA
  const computeTermGwa = (termKey: 'term1' | 'term2' | 'term3') => {
    const termVals = subjectsForGwa
      .map(s => s[termKey])
      .filter(v => typeof v === 'number') as number[];
    if (termVals.length === 0) return null;
    const sum = termVals.reduce((a, b) => a + b, 0);
    return Math.round((sum / termVals.length) * 100) / 100;
  };

  const t1Gwa = computeTermGwa('term1');
  const t2Gwa = computeTermGwa('term2');
  const t3Gwa = computeTermGwa('term3');

  // Overall Final GWA
  const validSubjectAvgs = subjectAverages.filter(s => s.finalSubjectGrade > 0);
  const finalGwa = validSubjectAvgs.length > 0
    ? Math.round((validSubjectAvgs.reduce((a, b) => a + b.finalSubjectGrade, 0) / validSubjectAvgs.length) * 100) / 100
    : 0;

  // Award evaluation
  let awardTitle: 'With Highest Honors' | 'With High Honors' | 'With Honors' | 'Academic Achiever' | 'Passed' | 'Needs Intervention' = 'Passed';
  let isHonorEligible = false;
  let disqualificationReason: string | undefined = undefined;

  if (failedAny || lowestGrade < 75) {
    awardTitle = 'Needs Intervention';
  } else if (finalGwa >= 90) {
    if (hasBelow80) {
      isHonorEligible = false;
      awardTitle = 'Academic Achiever';
      disqualificationReason = `Ineligible for DepEd Academic Honors: Got ${lowestGrade} in ${below80Subject} (${below80Term}). DepEd Order No. 36, s. 2016 and DO 15, s. 2026 mandate no grade lower than 80 in any learning area at any term.`;
    } else {
      isHonorEligible = true;
      if (finalGwa >= 98) {
        awardTitle = 'With Highest Honors';
      } else if (finalGwa >= 95) {
        awardTitle = 'With High Honors';
      } else {
        awardTitle = 'With Honors';
      }
    }
  } else {
    awardTitle = 'Passed';
  }

  return {
    term1Gwa: t1Gwa,
    term2Gwa: t2Gwa,
    term3Gwa: t3Gwa,
    finalGwa,
    awardTitle,
    isHonorEligible,
    disqualificationReason,
    lowestGrade,
    lowestGradeSubject,
    passedAll: !failedAny && lowestGrade >= 75,
    subjectAverages
  };
}

/**
 * Goal Planner Calculator
 * Computes how much score a student needs on their Term Assessment (ST1, ST2, TE)
 * or on their 3rd Term to pass or achieve an academic honor descriptor!
 */
export function calculateGoalAssessmentTarget(
  targetTransmuted: number,
  areaWeights: { writtenWork: number; performanceTask: number; termAssessment: number },
  currentWwPct: number,
  currentPtPct: number,
  totalAssessmentPoints: number = 110 // e.g. ST1 (30) + ST2 (30) + TE (50)
): {
  targetInitialGrade: number;
  currentWwWeighted: number;
  currentPtWeighted: number;
  currentAccumulatedWeighted: number;
  neededAssessmentWeighted: number;
  neededAssessmentPct: number;
  neededRawPoints: number;
  isFeasible: boolean;
  message: string;
} {
  // Find minimum initial grade required for this transmuted grade
  let targetInitial = 60.0;
  for (let g = 0; g <= 100; g += 0.05) {
    if (transmuteGrade(g) >= targetTransmuted) {
      targetInitial = Math.round(g * 100) / 100;
      break;
    }
  }

  const wwWeighted = currentWwPct * areaWeights.writtenWork;
  const ptWeighted = currentPtPct * areaWeights.performanceTask;
  const accumulated = wwWeighted + ptWeighted;

  const neededAssessmentWeighted = Math.max(0, targetInitial - accumulated);
  const neededAssessmentPct = areaWeights.termAssessment > 0
    ? (neededAssessmentWeighted / areaWeights.termAssessment)
    : 0;

  const neededRawPoints = Math.ceil((neededAssessmentPct / 100) * totalAssessmentPoints);
  const isFeasible = neededAssessmentPct <= 100;

  let message = '';
  if (neededAssessmentPct <= 0) {
    message = 'You already have enough weighted points from WW and PT to secure this target grade!';
  } else if (isFeasible) {
    message = `You need at least ${neededRawPoints} out of ${totalAssessmentPoints} total points (${neededAssessmentPct.toFixed(1)}%) on your Summative Tests & Term Exam to reach ${targetTransmuted}!`;
  } else {
    const maxPossibleInitial = accumulated + (100 * areaWeights.termAssessment);
    const maxPossibleTransmuted = transmuteGrade(maxPossibleInitial);
    message = `Target ${targetTransmuted} is mathematically unreachable this term even with 100% on exams (Max achievable: ${maxPossibleTransmuted}). Aim for ${maxPossibleTransmuted} instead!`;
  }

  return {
    targetInitialGrade: targetInitial,
    currentWwWeighted: Math.round(wwWeighted * 100) / 100,
    currentPtWeighted: Math.round(ptWeighted * 100) / 100,
    currentAccumulatedWeighted: Math.round(accumulated * 100) / 100,
    neededAssessmentWeighted: Math.round(neededAssessmentWeighted * 100) / 100,
    neededAssessmentPct: Math.round(neededAssessmentPct * 10) / 10,
    neededRawPoints,
    isFeasible,
    message
  };
}
