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
 * Benchmarking (85-89)
 * Connecting (80-84)
 * Developing (75-79)
 * Emerging (Below 75)
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
    title: 'Advancing (Exemplary Mastery)',
    summary: 'Demonstrates exemplary understanding and applies knowledge independently across complex situations.',
    studentAdvice: 'Outstanding work! Keep pursuing your curiosity, challenge yourself with advanced problem solving, and mentor your classmates!',
    parentAdvice: 'Your child has shown exceptional proficiency and independence. Encourage continued reading, creative projects, and celebrating this wonderful academic achievement.'
  },
  Benchmarking: {
    level: 'Benchmarking',
    code: 'B',
    minGrade: 85,
    maxGrade: 89,
    color: '#0284C7', // Azure
    bgColor: '#F0F9FF',
    borderColor: '#0EA5E9',
    badgeBg: '#0EA5E9',
    textColor: '#0C4A6E',
    icon: '🎯',
    title: 'Benchmarking (Solid Proficiency)',
    summary: 'Consistently meets and demonstrates expected standards and core learning competencies.',
    studentAdvice: 'Great job! You have solid mastery. Reviewing a few challenging test items and staying consistent in performance tasks will lift you to Advancing!',
    parentAdvice: 'Your child is reliably meeting the required DepEd competencies. Continue maintaining good study routines and providing positive reinforcement.'
  },
  Connecting: {
    level: 'Connecting',
    code: 'C',
    minGrade: 80,
    maxGrade: 84,
    color: '#D97706', // Amber
    bgColor: '#FFFBEB',
    borderColor: '#F59E0B',
    badgeBg: '#F59E0B',
    textColor: '#78350F',
    icon: '💡',
    title: 'Connecting (Sufficient Progress)',
    summary: 'Developing core linkages and showing sufficient understanding of fundamental ideas.',
    studentAdvice: 'Good effort! You are connecting key concepts. Set aside 20 extra minutes for daily review and ask questions whenever a lesson feels tricky.',
    parentAdvice: 'Your learner has acquired fundamental skills and is progressing well. Daily homework checking and guided review will help boost test scores.'
  },
  Developing: {
    level: 'Developing',
    code: 'D',
    minGrade: 75,
    maxGrade: 79,
    color: '#EA580C', // Orange
    bgColor: '#FFF7ED',
    borderColor: '#FB923C',
    badgeBg: '#FB923C',
    textColor: '#7C2D12',
    icon: '🌱',
    title: 'Developing (Approaching Standards)',
    summary: 'Possesses foundational knowledge but requires occasional assistance in complex tasks.',
    studentAdvice: 'You passed the term! You are growing step by step. Focus closely on written works and summative reviews to build steady confidence.',
    parentAdvice: 'Your learner has met the passing threshold. Collaborative support with teachers and reviewing previous quizzes will strengthen foundational concepts.'
  },
  Emerging: {
    level: 'Emerging',
    code: 'E',
    minGrade: 60,
    maxGrade: 74,
    color: '#E11D48', // Rose
    bgColor: '#FFF1F2',
    borderColor: '#F43F5E',
    badgeBg: '#F43F5E',
    textColor: '#881337',
    icon: '🧭',
    title: 'Emerging (Needs Targeted Intervention)',
    summary: 'Foundational learning competencies are emerging and require remedial guidance and support.',
    studentAdvice: 'Do not be discouraged! Every great journey begins with practice. Talk to your teacher about remedial learning activities and extra practice sheets.',
    parentAdvice: 'Your child needs targeted intervention and encouragement. Please consult with the subject teacher for learning action plans and schedule dedicated practice at home.'
  }
};

/**
 * Official DepEd Transmutation Table (Initial Grade to Transmuted Term Grade)
 */
export function transmuteGrade(initialGrade: number): number {
  const g = Math.round(initialGrade * 100) / 100;
  
  if (g >= 100) return 100;
  if (g >= 98.40) return 99;
  if (g >= 96.80) return 98;
  if (g >= 95.20) return 97;
  if (g >= 93.60) return 96;
  if (g >= 92.00) return 95;
  if (g >= 90.40) return 94;
  if (g >= 88.80) return 93;
  if (g >= 87.20) return 92;
  if (g >= 85.60) return 91;
  if (g >= 84.00) return 90;
  if (g >= 82.40) return 89;
  if (g >= 80.80) return 88;
  if (g >= 79.20) return 87;
  if (g >= 77.60) return 86;
  if (g >= 76.00) return 85;
  if (g >= 74.40) return 84;
  if (g >= 72.80) return 83;
  if (g >= 71.20) return 82;
  if (g >= 69.60) return 81;
  if (g >= 68.00) return 80;
  if (g >= 66.40) return 79;
  if (g >= 64.80) return 78;
  if (g >= 63.20) return 77;
  if (g >= 61.60) return 76;
  if (g >= 60.00) return 75;
  if (g >= 56.00) return 74;
  if (g >= 52.00) return 73;
  if (g >= 48.00) return 72;
  if (g >= 44.00) return 71;
  if (g >= 40.00) return 70;
  if (g >= 36.00) return 69;
  if (g >= 32.00) return 68;
  if (g >= 28.00) return 67;
  if (g >= 24.00) return 66;
  if (g >= 20.00) return 65;
  if (g >= 16.00) return 64;
  if (g >= 12.00) return 63;
  if (g >= 8.00) return 62;
  if (g >= 4.00) return 61;
  return 60;
}

export function getDescriptor(transmutedGrade: number): DescriptorInfo {
  if (transmutedGrade >= 90) return DESCRIPTORS_CONFIG.Advancing;
  if (transmutedGrade >= 85) return DESCRIPTORS_CONFIG.Benchmarking;
  if (transmutedGrade >= 80) return DESCRIPTORS_CONFIG.Connecting;
  if (transmutedGrade >= 75) return DESCRIPTORS_CONFIG.Developing;
  return DESCRIPTORS_CONFIG.Emerging;
}

// Learning Areas Configuration per Grade Level (Learning Area Aware)
const WEIGHTS_LANG_AP_ESP = { writtenWork: 0.30, performanceTask: 0.50, termAssessment: 0.20 };
const WEIGHTS_SCI_MATH = { writtenWork: 0.40, performanceTask: 0.40, termAssessment: 0.20 };
const WEIGHTS_MAPEH_EPP_TLE = { writtenWork: 0.20, performanceTask: 0.60, termAssessment: 0.20 };

// Senior High School weights
const WEIGHTS_SHS_CORE = { writtenWork: 0.25, performanceTask: 0.50, termAssessment: 0.25 };
const WEIGHTS_SHS_ACAD_SCI = { writtenWork: 0.35, performanceTask: 0.40, termAssessment: 0.25 };
const WEIGHTS_SHS_TVL = { writtenWork: 0.20, performanceTask: 0.60, termAssessment: 0.20 };

export const GRADE_LEVELS_DATA: GradeLevelConfig[] = [
  {
    level: 'Grade 1',
    keyStage: 'Key Stage 1 (MATATAG)',
    learningAreas: [
      { id: 'g1_makabansa', name: 'Makabansa', shortName: 'Makabansa', iconName: 'Compass', weights: WEIGHTS_LANG_AP_ESP, description: 'Culture, citizenship, and community integration' },
      { id: 'g1_read_lit', name: 'Reading and Literacy', shortName: 'Reading', iconName: 'BookOpen', weights: WEIGHTS_LANG_AP_ESP, description: 'Foundational reading comprehension and phonics' },
      { id: 'g1_language', name: 'Language', shortName: 'Language', iconName: 'MessageSquare', weights: WEIGHTS_LANG_AP_ESP, description: 'Expressive and receptive language acquisition' },
      { id: 'g1_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_SCI_MATH, description: 'Numbers, shapes, patterns, and basic arithmetic' },
      { id: 'g1_gmrc', name: 'GMRC (Values Education)', shortName: 'GMRC', iconName: 'Heart', weights: WEIGHTS_LANG_AP_ESP, description: 'Good Manners and Right Conduct' },
    ]
  },
  {
    level: 'Grade 2',
    keyStage: 'Key Stage 1 (MATATAG)',
    learningAreas: [
      { id: 'g2_makabansa', name: 'Makabansa', shortName: 'Makabansa', iconName: 'Compass', weights: WEIGHTS_LANG_AP_ESP, description: 'National identity and societal environment' },
      { id: 'g2_filipino', name: 'Filipino', shortName: 'Filipino', iconName: 'BookOpen', weights: WEIGHTS_LANG_AP_ESP, description: 'Wika, pagbasa, at talasalitaan' },
      { id: 'g2_english', name: 'English', shortName: 'English', iconName: 'Languages', weights: WEIGHTS_LANG_AP_ESP, description: 'Language fluency and early literature' },
      { id: 'g2_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_SCI_MATH, description: 'Problem solving, fractions, and operations' },
      { id: 'g2_gmrc', name: 'GMRC', shortName: 'GMRC', iconName: 'Heart', weights: WEIGHTS_LANG_AP_ESP, description: 'Character building and empathy' },
    ]
  },
  {
    level: 'Grade 3',
    keyStage: 'Key Stage 1 (MATATAG)',
    learningAreas: [
      { id: 'g3_science', name: 'Science', shortName: 'Science', iconName: 'FlaskConical', weights: WEIGHTS_SCI_MATH, description: 'Living things, physical materials, and earth' },
      { id: 'g3_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_SCI_MATH, description: 'Multiplication, division, and measurement' },
      { id: 'g3_english', name: 'English', shortName: 'English', iconName: 'Languages', weights: WEIGHTS_LANG_AP_ESP, description: 'Grammar, reading comprehension, and writing' },
      { id: 'g3_filipino', name: 'Filipino', shortName: 'Filipino', iconName: 'BookOpen', weights: WEIGHTS_LANG_AP_ESP, description: 'Pagbasa at pagsulat sa sariling wika' },
      { id: 'g3_makabansa', name: 'Makabansa (Araling Panlipunan)', shortName: 'AP', iconName: 'Globe', weights: WEIGHTS_LANG_AP_ESP, description: 'Kasaysayan ng komunidad at rehiyon' },
      { id: 'g3_gmrc', name: 'GMRC', shortName: 'GMRC', iconName: 'Heart', weights: WEIGHTS_LANG_AP_ESP, description: 'Values and responsible actions' },
    ]
  },
  {
    level: 'Grade 4',
    keyStage: 'Key Stage 2 (Intermediate)',
    learningAreas: [
      { id: 'g4_science', name: 'Science', shortName: 'Science', iconName: 'FlaskConical', weights: WEIGHTS_SCI_MATH, description: 'Scientific inquiry and natural systems' },
      { id: 'g4_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_SCI_MATH, description: 'Decimals, geometric reasoning, and statistics' },
      { id: 'g4_english', name: 'English', shortName: 'English', iconName: 'Languages', weights: WEIGHTS_LANG_AP_ESP, description: 'Communicative competence and textual analysis' },
      { id: 'g4_filipino', name: 'Filipino', shortName: 'Filipino', iconName: 'BookOpen', weights: WEIGHTS_LANG_AP_ESP, description: 'Wikang Pambansa at panitikan' },
      { id: 'g4_ap', name: 'Araling Panlipunan (AP)', shortName: 'AP', iconName: 'Globe', weights: WEIGHTS_LANG_AP_ESP, description: 'Heograpiya at kultura ng Pilipinas' },
      { id: 'g4_epp', name: 'EPP (Home Economics & Livelihood)', shortName: 'EPP', iconName: 'Briefcase', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Practical hands-on household and vocational skills' },
      { id: 'g4_music_arts', name: 'Music and Arts', shortName: 'Music & Arts', iconName: 'Palette', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Creative expression, traditional melodies, visual arts' },
      { id: 'g4_pe_health', name: 'PE and Health', shortName: 'PE & Health', iconName: 'Activity', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Physical fitness, games, safety, and personal wellness' },
      { id: 'g4_mapeh', name: 'MAPEH (Average of Music & Arts + PE & Health)', shortName: 'MAPEH', iconName: 'Award', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Official composite of Music & Arts and PE & Health' },
      { id: 'g4_gmrc', name: 'GMRC / Values Education', shortName: 'GMRC', iconName: 'Heart', weights: WEIGHTS_LANG_AP_ESP, description: 'Moral discernment and active citizenship' },
    ]
  },
  {
    level: 'Grade 5',
    keyStage: 'Key Stage 2 (Intermediate)',
    learningAreas: [
      { id: 'g5_science', name: 'Science', shortName: 'Science', iconName: 'FlaskConical', weights: WEIGHTS_SCI_MATH, description: 'Matter, organ systems, and environmental changes' },
      { id: 'g5_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_SCI_MATH, description: 'Ratios, fractions, percentage, and plane geometry' },
      { id: 'g5_english', name: 'English', shortName: 'English', iconName: 'Languages', weights: WEIGHTS_LANG_AP_ESP, description: 'Informational texts and written compositions' },
      { id: 'g5_filipino', name: 'Filipino', shortName: 'Filipino', iconName: 'BookOpen', weights: WEIGHTS_LANG_AP_ESP, description: 'Wika, sanaysay, at maikling kwento' },
      { id: 'g5_ap', name: 'Araling Panlipunan (AP)', shortName: 'AP', iconName: 'Globe', weights: WEIGHTS_LANG_AP_ESP, description: 'Kolonyalismong Espanyol at pagkakakilanlan' },
      { id: 'g5_epp', name: 'EPP', shortName: 'EPP', iconName: 'Briefcase', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Agrikultura, ICT, at kabuhayan' },
      { id: 'g5_music_arts', name: 'Music and Arts', shortName: 'Music & Arts', iconName: 'Palette', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Philippine ethnic musical forms and regional arts' },
      { id: 'g5_pe_health', name: 'PE and Health', shortName: 'PE & Health', iconName: 'Activity', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Target games, gymnastics, emotional health and nutrition' },
      { id: 'g5_mapeh', name: 'MAPEH (Average of Music & Arts + PE & Health)', shortName: 'MAPEH', iconName: 'Award', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Official composite of Music & Arts and PE & Health' },
      { id: 'g5_esp', name: 'Edukasyon sa Pagpapakatao (EsP)', shortName: 'EsP', iconName: 'Heart', weights: WEIGHTS_LANG_AP_ESP, description: 'Pagpapahalaga sa katotohanan at kapwa' },
    ]
  },
  {
    level: 'Grade 6',
    keyStage: 'Key Stage 2 (Intermediate)',
    learningAreas: [
      { id: 'g6_science', name: 'Science', shortName: 'Science', iconName: 'FlaskConical', weights: WEIGHTS_SCI_MATH, description: 'Solutions, motion, energy, and planetary bodies' },
      { id: 'g6_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_SCI_MATH, description: 'Algebraic equations, integers, and probability' },
      { id: 'g6_english', name: 'English', shortName: 'English', iconName: 'Languages', weights: WEIGHTS_LANG_AP_ESP, description: 'Research skills, literature, and speech delivery' },
      { id: 'g6_filipino', name: 'Filipino', shortName: 'Filipino', iconName: 'BookOpen', weights: WEIGHTS_LANG_AP_ESP, description: 'Mapanuring pag-iisip sa panitikan' },
      { id: 'g6_ap', name: 'Araling Panlipunan (AP)', shortName: 'AP', iconName: 'Globe', weights: WEIGHTS_LANG_AP_ESP, description: 'Kasarinlan at kontemporaryong hamon sa bansa' },
      { id: 'g6_tle', name: 'TLE / EPP', shortName: 'TLE', iconName: 'Briefcase', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Industrial arts, entrepreneurship, and nutrition' },
      { id: 'g6_music_arts', name: 'Music and Arts', shortName: 'Music & Arts', iconName: 'Palette', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Musical forms, western art styles, and stage design' },
      { id: 'g6_pe_health', name: 'PE and Health', shortName: 'PE & Health', iconName: 'Activity', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Striking games, rhythmic routines, and community health' },
      { id: 'g6_mapeh', name: 'MAPEH (Average of Music & Arts + PE & Health)', shortName: 'MAPEH', iconName: 'Award', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Official composite of Music & Arts and PE & Health' },
      { id: 'g6_esp', name: 'Edukasyon sa Pagpapakatao (EsP)', shortName: 'EsP', iconName: 'Heart', weights: WEIGHTS_LANG_AP_ESP, description: 'Pangako, responsibilidad, at katarungan' },
    ]
  },
  {
    level: 'Grade 7',
    keyStage: 'Key Stage 3 (Junior High School)',
    learningAreas: [
      { id: 'g7_science', name: 'Science', shortName: 'Science', iconName: 'FlaskConical', weights: WEIGHTS_SCI_MATH, description: 'Integrated Science: Scientific processes, mixtures, and cells' },
      { id: 'g7_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_SCI_MATH, description: 'Sets, real numbers, polynomials, and linear equations' },
      { id: 'g7_english', name: 'English', shortName: 'English', iconName: 'Languages', weights: WEIGHTS_LANG_AP_ESP, description: 'Philippine Literature and communicative grammar' },
      { id: 'g7_filipino', name: 'Filipino', shortName: 'Filipino', iconName: 'BookOpen', weights: WEIGHTS_LANG_AP_ESP, description: 'Ibong Adarna at Panitikang Rehiyonal' },
      { id: 'g7_ap', name: 'Araling Panlipunan (Asya)', shortName: 'AP', iconName: 'Globe', weights: WEIGHTS_LANG_AP_ESP, description: 'Heograpiya, sibilisasyon, at kultura ng Asya' },
      { id: 'g7_tle', name: 'TLE (Exploratory)', shortName: 'TLE', iconName: 'Wrench', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Cookery, Carpentry, Technical Drafting, and ICT' },
      { id: 'g7_music_arts', name: 'Music and Arts', shortName: 'Music & Arts', iconName: 'Palette', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Folk music of Luzon, Lowland arts, traditional textiles' },
      { id: 'g7_pe_health', name: 'PE and Health', shortName: 'PE & Health', iconName: 'Activity', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Physical fitness components, holistic health, and dual sports' },
      { id: 'g7_mapeh', name: 'MAPEH (Average of Music & Arts + PE & Health)', shortName: 'MAPEH', iconName: 'Award', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Official composite of Music & Arts and PE & Health' },
      { id: 'g7_esp', name: 'Edukasyon sa Pagpapakatao (EsP)', shortName: 'EsP', iconName: 'Heart', weights: WEIGHTS_LANG_AP_ESP, description: 'Pagtuklas ng angking talento at pagpapahalaga' },
    ]
  },
  {
    level: 'Grade 8',
    keyStage: 'Key Stage 3 (Junior High School)',
    learningAreas: [
      { id: 'g8_science', name: 'Science', shortName: 'Science', iconName: 'FlaskConical', weights: WEIGHTS_SCI_MATH, description: 'Physics forces, earthquakes, digestion, and genetics' },
      { id: 'g8_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_SCI_MATH, description: 'Factoring, rational expressions, and coordinate geometry' },
      { id: 'g8_english', name: 'English', shortName: 'English', iconName: 'Languages', weights: WEIGHTS_LANG_AP_ESP, description: 'Afro-Asian Literature and persuasive rhetoric' },
      { id: 'g8_filipino', name: 'Filipino', shortName: 'Filipino', iconName: 'BookOpen', weights: WEIGHTS_LANG_AP_ESP, description: 'Florante at Laura at Panitikang Tradisyunal' },
      { id: 'g8_ap', name: 'Araling Panlipunan (Daigdig)', shortName: 'AP', iconName: 'Globe', weights: WEIGHTS_LANG_AP_ESP, description: 'Kasaysayan ng Daigdig at Pandaigdigang Alyansa' },
      { id: 'g8_tle', name: 'TLE (Specialization)', shortName: 'TLE', iconName: 'Wrench', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Applied technical skills and entrepreneurship' },
      { id: 'g8_music_arts', name: 'Music and Arts', shortName: 'Music & Arts', iconName: 'Palette', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Southeast Asian music, fabric design, and sculpture' },
      { id: 'g8_pe_health', name: 'PE and Health', shortName: 'PE & Health', iconName: 'Activity', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Team sports (basketball/volleyball), family health, wellness' },
      { id: 'g8_mapeh', name: 'MAPEH (Average of Music & Arts + PE & Health)', shortName: 'MAPEH', iconName: 'Award', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Official composite of Music & Arts and PE & Health' },
      { id: 'g8_esp', name: 'Edukasyon sa Pagpapakatao (EsP)', shortName: 'EsP', iconName: 'Heart', weights: WEIGHTS_LANG_AP_ESP, description: 'Pakikipagkapwa at katatagan ng pamilya' },
    ]
  },
  {
    level: 'Grade 9',
    keyStage: 'Key Stage 3 (Junior High School)',
    learningAreas: [
      { id: 'g9_science', name: 'Science', shortName: 'Science', iconName: 'FlaskConical', weights: WEIGHTS_SCI_MATH, description: 'Respiratory systems, chemical bonding, and volcanoes' },
      { id: 'g9_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_SCI_MATH, description: 'Quadratic equations, variations, and trigonometry' },
      { id: 'g9_english', name: 'English', shortName: 'English', iconName: 'Languages', weights: WEIGHTS_LANG_AP_ESP, description: 'Anglo-American Literature and critical analysis' },
      { id: 'g9_filipino', name: 'Filipino', shortName: 'Filipino', iconName: 'BookOpen', weights: WEIGHTS_LANG_AP_ESP, description: 'Noli Me Tangere at Panitikang Asyano' },
      { id: 'g9_ap', name: 'Araling Panlipunan (Ekonomiks)', shortName: 'Ekonomiks', iconName: 'TrendingUp', weights: WEIGHTS_LANG_AP_ESP, description: 'Maykro at Makroekonomiks, pambansang kaunlaran' },
      { id: 'g9_tle', name: 'TLE', shortName: 'TLE', iconName: 'Wrench', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Vocational specialization and lab hands-on' },
      { id: 'g9_music_arts', name: 'Music and Arts', shortName: 'Music & Arts', iconName: 'Palette', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Medieval to Classical European music and Renaissance arts' },
      { id: 'g9_pe_health', name: 'PE and Health', shortName: 'PE & Health', iconName: 'Activity', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Festival dances, environmental health, and injury prevention' },
      { id: 'g9_mapeh', name: 'MAPEH (Average of Music & Arts + PE & Health)', shortName: 'MAPEH', iconName: 'Award', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Official composite of Music & Arts and PE & Health' },
      { id: 'g9_esp', name: 'Edukasyon sa Pagpapakatao (EsP)', shortName: 'EsP', iconName: 'Heart', weights: WEIGHTS_LANG_AP_ESP, description: 'Katarungang panlipunan at kabutihang panlahat' },
    ]
  },
  {
    level: 'Grade 10',
    keyStage: 'Key Stage 3 (Junior High School)',
    learningAreas: [
      { id: 'g10_science', name: 'Science', shortName: 'Science', iconName: 'FlaskConical', weights: WEIGHTS_SCI_MATH, description: 'Plate tectonics, electromagnetism, and biomolecules' },
      { id: 'g10_math', name: 'Mathematics', shortName: 'Math', iconName: 'Calculator', weights: WEIGHTS_SCI_MATH, description: 'Sequences, polynomial functions, and circle theorems' },
      { id: 'g10_english', name: 'English', shortName: 'English', iconName: 'Languages', weights: WEIGHTS_LANG_AP_ESP, description: 'World Literature and argumentation' },
      { id: 'g10_filipino', name: 'Filipino', shortName: 'Filipino', iconName: 'BookOpen', weights: WEIGHTS_LANG_AP_ESP, description: 'El Filibusterismo at Pandaigdigang Panitikan' },
      { id: 'g10_ap', name: 'Araling Panlipunan (Kontemporaryo)', shortName: 'Kontemporaryo', iconName: 'Globe', weights: WEIGHTS_LANG_AP_ESP, description: 'Mga Kontemporaryong Isyu at karapatang pantao' },
      { id: 'g10_tle', name: 'TLE', shortName: 'TLE', iconName: 'Wrench', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'National Certificate (NC) competency preparation' },
      { id: 'g10_music_arts', name: 'Music and Arts', shortName: 'Music & Arts', iconName: 'Palette', weights: WEIGHTS_MAPEH_EPP_TLE, description: '20th Century contemporary music, modern tech art and photography' },
      { id: 'g10_pe_health', name: 'PE and Health', shortName: 'PE & Health', iconName: 'Activity', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Street dance, hip-hop, active recreation and global health trends' },
      { id: 'g10_mapeh', name: 'MAPEH (Average of Music & Arts + PE & Health)', shortName: 'MAPEH', iconName: 'Award', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Official composite of Music & Arts and PE & Health' },
      { id: 'g10_esp', name: 'Edukasyon sa Pagpapakatao (EsP)', shortName: 'EsP', iconName: 'Heart', weights: WEIGHTS_LANG_AP_ESP, description: 'Paghahanda sa Senior High School at bokasyon' },
    ]
  },
  {
    level: 'Grade 11',
    keyStage: 'Key Stage 4 (Senior High School)',
    learningAreas: [
      { id: 'g11_core_oral', name: 'Oral Communication / Komunikasyon', shortName: 'Oral Comm', iconName: 'MessageSquare', weights: WEIGHTS_SHS_CORE, description: 'Core communication principles in English & Filipino' },
      { id: 'g11_core_genmath', name: 'General Mathematics / Statistics', shortName: 'Gen Math', iconName: 'Calculator', weights: WEIGHTS_SHS_ACAD_SCI, description: 'Functions, business math, probability distributions' },
      { id: 'g11_core_earthsci', name: 'Earth & Life Science / Physical Science', shortName: 'Science', iconName: 'FlaskConical', weights: WEIGHTS_SHS_ACAD_SCI, description: 'Geology, ecology, and chemical principles' },
      { id: 'g11_acad_stem', name: 'STEM Specialization (Pre-Calculus / Bio / Chem)', shortName: 'STEM Spec', iconName: 'Binary', weights: WEIGHTS_SHS_ACAD_SCI, description: 'Advanced academic STEM subjects' },
      { id: 'g11_acad_humss_abm', name: 'ABM / HUMSS Applied Subject', shortName: 'ABM / HUMSS', iconName: 'Briefcase', weights: WEIGHTS_SHS_CORE, description: 'Organization, economics, creative writing' },
      { id: 'g11_tvl_spec', name: 'TVL Specialization Course', shortName: 'TVL Spec', iconName: 'Wrench', weights: WEIGHTS_SHS_TVL, description: 'Hands-on practical industry competency training' },
      { id: 'g11_pe_health', name: 'Physical Education and Health', shortName: 'PE & Health', iconName: 'Activity', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Physical wellness, dance, and recreational fitness' },
    ]
  },
  {
    level: 'Grade 12',
    keyStage: 'Key Stage 4 (Senior High School)',
    learningAreas: [
      { id: 'g12_practical_res', name: 'Practical Research 1 & 2', shortName: 'Research', iconName: 'FileText', weights: WEIGHTS_SHS_CORE, description: 'Qualitative and quantitative empirical research' },
      { id: 'g12_core_contemp', name: 'Contemporary Philippine Arts', shortName: 'Arts', iconName: 'Palette', weights: WEIGHTS_SHS_CORE, description: 'Modern regional art practices and techniques' },
      { id: 'g12_acad_calculus', name: 'Basic Calculus / Physics / Chemistry', shortName: 'Calculus/Phys', iconName: 'Cpu', weights: WEIGHTS_SHS_ACAD_SCI, description: 'Limits, derivatives, Newtonian mechanics' },
      { id: 'g12_acad_applied', name: 'Inquiries, Investigations & Immersion', shortName: '3Is / Immersion', iconName: 'Compass', weights: WEIGHTS_SHS_CORE, description: 'Culminating research synthesis and application' },
      { id: 'g12_tvl_immersion', name: 'TVL Work Immersion / Culminating', shortName: 'TVL Immersion', iconName: 'Wrench', weights: WEIGHTS_SHS_TVL, description: 'Industry on-the-job apprenticeship and assessment' },
      { id: 'g12_pe_health', name: 'Physical Education and Health 4', shortName: 'PE & Health', iconName: 'Activity', weights: WEIGHTS_MAPEH_EPP_TLE, description: 'Lifelong fitness and leadership in sports' },
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
  teTotal: number | ''
): CalculationResult {
  const area = getLearningArea(gradeLevel, learningAreaId);
  
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
  const wwWeighted = wwPct * area.weights.writtenWork;

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
  const ptWeighted = ptPct * area.weights.performanceTask;

  // 3. Summative Assessments (ST1, ST2, TE)
  const st1_s = typeof st1Score === 'number' ? Math.max(0, st1Score) : 0;
  const st1_h = typeof st1Total === 'number' ? Math.max(1, st1Total) : 0;
  const st2_s = typeof st2Score === 'number' ? Math.max(0, st2Score) : 0;
  const st2_h = typeof st2Total === 'number' ? Math.max(1, st2Total) : 0;
  const te_s = typeof teScore === 'number' ? Math.max(0, teScore) : 0;
  const te_h = typeof teTotal === 'number' ? Math.max(1, teTotal) : 0;

  const termAssessmentRaw = st1_s + st2_s + te_s;
  const termAssessmentHigh = st1_h + st2_h + te_h;
  const termAssessmentPct = termAssessmentHigh > 0 ? (termAssessmentRaw / termAssessmentHigh) * 100 : 0;
  const termAssessmentWeighted = termAssessmentPct * area.weights.termAssessment;

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
    learningAreaName: area.name,
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
    initialGrade,
    transmutedGrade,
    descriptor,
    weights: area.weights
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
