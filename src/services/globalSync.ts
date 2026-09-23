/**
 * TALA: Private Local Storage & Activity Log Service
 * Pursuant to DepEd Data Privacy:
 * All student inputs, grades, and calculation records are stored 100% locally
 * on the user's device (browser localStorage).
 * 
 * MULTI-USER ISOLATION GUARANTEE:
 * When 1,000 students access this website at the same time across different
 * phones, tablets, or laptops, each user has their own completely isolated
 * browser storage. Students NEVER see or override each other's data.
 * by Eli Belleza
 */

import { LogEntry } from '../types';

const STORAGE_KEY_LOGS = 'tala_student_private_logs';
const STORAGE_KEY_TOTAL_CALC = 'tala_student_total_calc';

// Get student's private log history from localStorage
export function getStoredLogs(): LogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read private logs from localStorage', e);
  }
  return [];
}

// Save student's private logs to localStorage
export function saveLogsToStorage(logs: LogEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs.slice(0, 50)));
  } catch (e) {
    console.error('Failed to save private logs to localStorage', e);
  }
}

// Record a new calculation into the user's private log
export function recordNewActivity(newEntry: LogEntry): LogEntry[] {
  const existing = getStoredLogs();
  const updated = [newEntry, ...existing];
  saveLogsToStorage(updated);
  return updated;
}

// Clear all private logs on this device
export function clearAllPrivateLogs(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_LOGS);
  } catch (e) {
    console.error('Failed to clear private logs', e);
  }
}

// Export student's private calculation history as a JSON file
export function exportLogsAsJson(logs: LogEntry[]): void {
  try {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tala_my_grade_records_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Export failed', err);
  }
}

// Get and increment calculation count on this device
export function getLocalCalculationCount(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TOTAL_CALC);
    if (raw) return parseInt(raw, 10);
  } catch {
    // fallback
  }
  return 0;
}

export function incrementLocalCalculationCount(): number {
  const count = getLocalCalculationCount() + 1;
  try {
    localStorage.setItem(STORAGE_KEY_TOTAL_CALC, count.toString());
  } catch {
    // ignore
  }
  return count;
}
