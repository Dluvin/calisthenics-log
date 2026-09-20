"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loadState, saveState } from "@/lib/storage";
import type { AppState, ExerciseType, Goal, Workout } from "@/lib/types";

type Store = AppState & {
  ready: boolean;
  upsertExercise: (exercise: ExerciseType) => void;
  deleteExercise: (id: string) => void;
  saveWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  upsertGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  const upsertExercise = useCallback((exercise: ExerciseType) => {
    setState((prev) => {
      if (!prev) return prev;
      const exists = prev.exercises.some((item) => item.id === exercise.id);
      return {
        ...prev,
        exercises: exists
          ? prev.exercises.map((item) => (item.id === exercise.id ? exercise : item))
          : [...prev.exercises, exercise],
      };
    });
  }, []);

  const deleteExercise = useCallback((id: string) => {
    setState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: prev.exercises.filter((item) => item.id !== id),
        goals: prev.goals.filter((goal) => goal.exerciseId !== id),
        workouts: prev.workouts.map((workout) => ({
          ...workout,
          entries: workout.entries.filter((entry) => entry.exerciseId !== id),
        })),
      };
    });
  }, []);

  const saveWorkout = useCallback((workout: Workout) => {
    setState((prev) => {
      if (!prev) return prev;
      const exists = prev.workouts.some((item) => item.id === workout.id);
      const workouts = exists
        ? prev.workouts.map((item) => (item.id === workout.id ? workout : item))
        : [workout, ...prev.workouts];
      workouts.sort(
        (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
      );
      return { ...prev, workouts };
    });
  }, []);

  const deleteWorkout = useCallback((id: string) => {
    setState((prev) =>
      prev ? { ...prev, workouts: prev.workouts.filter((item) => item.id !== id) } : prev,
    );
  }, []);

  const upsertGoal = useCallback((goal: Goal) => {
    setState((prev) => {
      if (!prev) return prev;
      const exists = prev.goals.some((item) => item.id === goal.id);
      return {
        ...prev,
        goals: exists
          ? prev.goals.map((item) => (item.id === goal.id ? goal : item))
          : [...prev.goals, goal],
      };
    });
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setState((prev) =>
      prev ? { ...prev, goals: prev.goals.filter((item) => item.id !== id) } : prev,
    );
  }, []);

  const value = useMemo<Store | null>(() => {
    if (!state) return null;
    return {
      ...state,
      ready: true,
      upsertExercise,
      deleteExercise,
      saveWorkout,
      deleteWorkout,
      upsertGoal,
      deleteGoal,
    };
  }, [state, upsertExercise, deleteExercise, saveWorkout, deleteWorkout, upsertGoal, deleteGoal]);

  if (!value) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
        Loading log…
      </div>
    );
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
