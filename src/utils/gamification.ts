export interface GamificationState {
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  talaPoints: number;
  streakFrozenToday?: boolean;
}

const STORAGE_KEY = 'tala_gamification_v1';

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getGamificationState(): GamificationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.streak === 'number' && typeof parsed.talaPoints === 'number') {
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  // Encouraging starter state with welcome bonus
  const today = getTodayDateString();
  const initial: GamificationState = {
    streak: 3, // Starter streak momentum
    lastActiveDate: today,
    talaPoints: 80 // Welcome learner points
  };
  saveGamificationState(initial);
  return initial;
}

export function saveGamificationState(state: GamificationState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // fallback
  }
}

export function recordStreakCheck(currentState: GamificationState): {
  updatedState: GamificationState;
  streakIncreased: boolean;
} {
  const today = getTodayDateString();
  if (currentState.lastActiveDate === today) {
    return { updatedState: currentState, streakIncreased: false };
  }

  const last = new Date(currentState.lastActiveDate);
  const now = new Date(today);
  const diffTime = now.getTime() - last.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let newStreak = currentState.streak;
  let streakIncreased = false;

  if (diffDays === 1) {
    newStreak += 1;
    streakIncreased = true;
  } else if (diffDays > 2) {
    newStreak = 1;
  }

  const updatedState: GamificationState = {
    ...currentState,
    streak: newStreak,
    lastActiveDate: today
  };

  saveGamificationState(updatedState);
  return { updatedState, streakIncreased };
}

export function addTalaPoints(
  currentState: GamificationState,
  points: number
): GamificationState {
  const updated: GamificationState = {
    ...currentState,
    talaPoints: Math.max(0, currentState.talaPoints + points),
    lastActiveDate: getTodayDateString()
  };
  saveGamificationState(updated);
  return updated;
}
