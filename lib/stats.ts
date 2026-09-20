import type { ExerciseType, Goal, Workout } from "./types";

export function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function startOfWeek(date: Date) {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

export function entryTotal(workout: Workout, exerciseId: string) {
  return workout.entries
    .filter((entry) => entry.exerciseId === exerciseId)
    .reduce(
      (sum, entry) =>
        sum + entry.sets.reduce((setSum, set) => setSum + (set.value || 0), 0),
      0,
    );
}

export function totalInRange(
  workouts: Workout[],
  exerciseId: string,
  from: Date,
  to: Date,
) {
  return workouts
    .filter((workout) => {
      const when = new Date(workout.startedAt);
      return when >= from && when < to;
    })
    .reduce((sum, workout) => sum + entryTotal(workout, exerciseId), 0);
}

export function goalProgress(
  workouts: Workout[],
  goal: Goal,
  now = new Date(),
) {
  const from =
    goal.period === "day" ? startOfDay(now) : startOfWeek(now);
  const to = new Date(from);
  if (goal.period === "day") to.setDate(to.getDate() + 1);
  else to.setDate(to.getDate() + 7);
  const current = totalInRange(workouts, goal.exerciseId, from, to);
  return {
    current,
    target: goal.target,
    percent: goal.target <= 0 ? 0 : Math.min(100, Math.round((current / goal.target) * 100)),
  };
}

export function formatValue(exercise: ExerciseType | undefined, value: number) {
  if (!exercise) return String(value);
  return exercise.tracking === "seconds" ? `${value}s` : String(value);
}

export function unitLabel(exercise: ExerciseType | undefined) {
  return exercise?.tracking === "seconds" ? "seconds" : "reps";
}

export function toDateTimeLocal(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromDateTimeLocal(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
