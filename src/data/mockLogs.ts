import { LogEntry } from '../types';

export const INITIAL_LOG_ENTRIES: LogEntry[] = [
  {
    id: 'log_seed_1',
    timestamp: Date.now() - 1000 * 60 * 4, // 4 mins ago
    formattedTime: '4 mins ago',
    gradeLevel: 'Grade 7',
    section: 'Diamond',
    term: 'Term 1',
    learningArea: 'Science',
    studentName: 'M**** S*****',
    schoolName: 'D**** City High School',
    ipAddress: '112.198.**.** · Region XI',
    transmutedGrade: 93,
    descriptor: 'Advancing'
  },
  {
    id: 'log_seed_2',
    timestamp: Date.now() - 1000 * 60 * 12, // 12 mins ago
    formattedTime: '12 mins ago',
    gradeLevel: 'Grade 4',
    section: 'Sampaguita',
    term: 'Term 1',
    learningArea: 'Mathematics',
    studentName: 'J*** P**** C***',
    schoolName: 'R**** Magsaysay Elem',
    ipAddress: '120.28.**.** · NCR Manila',
    transmutedGrade: 88,
    descriptor: 'Benchmarking'
  },
  {
    id: 'log_seed_3',
    timestamp: Date.now() - 1000 * 60 * 25, // 25 mins ago
    formattedTime: '25 mins ago',
    gradeLevel: 'Grade 10',
    section: 'Rizal',
    term: 'Term 1',
    learningArea: 'English',
    studentName: 'A**** G. D** R*****',
    schoolName: 'C*** National Science HS',
    ipAddress: '49.145.**.** · Region VII',
    transmutedGrade: 95,
    descriptor: 'Advancing'
  },
  {
    id: 'log_seed_4',
    timestamp: Date.now() - 1000 * 60 * 48, // 48 mins ago
    formattedTime: '48 mins ago',
    gradeLevel: 'Grade 8',
    section: 'Molave',
    term: 'Term 2',
    learningArea: 'Araling Panlipunan',
    studentName: 'K**** E. T*****',
    schoolName: 'P********* National HS',
    ipAddress: '124.106.**.** · Region I',
    transmutedGrade: 83,
    descriptor: 'Connecting'
  },
  {
    id: 'log_seed_5',
    timestamp: Date.now() - 1000 * 60 * 75, // 1h 15m ago
    formattedTime: '1 hour ago',
    gradeLevel: 'Grade 5',
    section: 'Mabini',
    term: 'Term 1',
    learningArea: 'EPP',
    studentName: 'D****** M. B******',
    schoolName: 'I***** Central Elem',
    ipAddress: '119.95.**.** · Region VI',
    transmutedGrade: 86,
    descriptor: 'Benchmarking'
  },
  {
    id: 'log_seed_6',
    timestamp: Date.now() - 1000 * 60 * 130, // 2h ago
    formattedTime: '2 hours ago',
    gradeLevel: 'Grade 9',
    section: 'Newton',
    term: 'Term 1',
    learningArea: 'Mathematics',
    studentName: 'R**** L. M******',
    schoolName: 'Q***** City Science HS',
    ipAddress: '175.176.**.** · NCR',
    transmutedGrade: 78,
    descriptor: 'Developing'
  }
];
