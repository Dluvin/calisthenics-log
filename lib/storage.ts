import { DEFAULT_EXERCISES } from "./defaults";
import type { AppState } from "./types";

const STORAGE_KEY = "calisthenics-log:v1";

export const emptyState = (): AppState => ({
  exercises: DEFAULT_EXERCISES,
  workouts: [],
  goals: [],
});

export function loadState(): AppState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      exercises:
        Array.isArray(parsed.exercises) && parsed.exercises.length > 0
          ? parsed.exercises
          : DEFAULT_EXERCISES,
      workouts: Array.isArray(parsed.workouts) ? parsed.workouts : [],
      goals: Array.isArray(parsed.goals) ? parsed.goals : [],
    };
  } catch {
    return emptyState();
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
