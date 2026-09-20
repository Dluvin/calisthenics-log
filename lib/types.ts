export type TrackingMode = "reps" | "seconds";
export type GoalPeriod = "day" | "week";
export type ExerciseCategory =
  | "Push"
  | "Legs"
  | "Core"
  | "Full body"
  | "Custom";

export type ExerciseType = {
  id: string;
  name: string;
  category: ExerciseCategory;
  tracking: TrackingMode;
  notes: string;
};

export type WorkoutSet = {
  id: string;
  value: number;
};

export type WorkoutEntry = {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
};

export type Workout = {
  id: string;
  startedAt: string;
  notes: string;
  entries: WorkoutEntry[];
};

export type Goal = {
  id: string;
  exerciseId: string;
  period: GoalPeriod;
  target: number;
};

export type AppState = {
  exercises: ExerciseType[];
  workouts: Workout[];
  goals: Goal[];
};
