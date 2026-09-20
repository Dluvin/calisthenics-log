"use client";

import { useState } from "react";
import { useStore } from "@/components/StoreProvider";
import { formatValue, goalProgress, unitLabel } from "@/lib/stats";
import type { Goal, GoalPeriod } from "@/lib/types";

export default function GoalsPage() {
  const { exercises, goals, workouts, upsertGoal, deleteGoal } = useStore();
  const [exerciseId, setExerciseId] = useState(exercises[0]?.id ?? "");
  const [period, setPeriod] = useState<GoalPeriod>("day");
  const [target, setTarget] = useState(50);
  const [editingId, setEditingId] = useState<string | null>(null);

  const selected = exercises.find((item) => item.id === exerciseId);

  function save() {
    if (!exerciseId || target <= 0) return;
    const goal: Goal = {
      id: editingId ?? crypto.randomUUID(),
      exerciseId,
      period,
      target,
    };
    upsertGoal(goal);
    setEditingId(null);
    setTarget(50);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Goals</h2>
        <p className="mt-1 text-sm text-emerald-200/70">
          Daily or weekly targets. Progress comes from logged workouts.
        </p>
      </div>

      <form
        className="grid gap-3 rounded-2xl border border-emerald-900 bg-emerald-950/30 p-4 sm:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <label className="space-y-1.5 sm:col-span-3">
          <span className="text-sm font-medium text-emerald-100/80">Exercise</span>
          <select
            value={exerciseId}
            onChange={(e) => setExerciseId(e.target.value)}
            className="w-full rounded-xl border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-emerald-50 outline-none focus:border-emerald-400"
          >
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-emerald-100/80">Period</span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as GoalPeriod)}
            className="w-full rounded-xl border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-emerald-50 outline-none focus:border-emerald-400"
          >
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-emerald-100/80">
            Target ({unitLabel(selected)})
          </span>
          <input
            type="number"
            min={1}
            value={target}
            onChange={(e) => setTarget(Number(e.target.value) || 0)}
            className="w-full rounded-xl border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-emerald-50 outline-none focus:border-emerald-400"
          />
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-400 px-4 py-2 font-semibold text-emerald-950 hover:bg-emerald-300"
          >
            {editingId ? "Save goal" : "Add goal"}
          </button>
        </div>
      </form>

      {goals.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-emerald-800 px-4 py-8 text-sm text-emerald-200/70">
          Set a goal like 50 push-ups a day or 3 minutes of plank each week.
        </p>
      ) : (
        <ul className="space-y-3">
          {goals.map((goal) => {
            const exercise = exercises.find((item) => item.id === goal.exerciseId);
            const progress = goalProgress(workouts, goal);
            return (
              <li
                key={goal.id}
                className="rounded-2xl border border-emerald-900 bg-emerald-950/30 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-emerald-50">
                      {exercise?.name ?? "Exercise removed"}
                    </p>
                    <p className="text-sm text-emerald-200/70">
                      {goal.period === "day" ? "Daily" : "Weekly"} ·{" "}
                      {formatValue(exercise, progress.current)} of{" "}
                      {formatValue(exercise, progress.target)} ({progress.percent}%)
                    </p>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(goal.id);
                        setExerciseId(goal.exerciseId);
                        setPeriod(goal.period);
                        setTarget(goal.target);
                      }}
                      className="text-emerald-300 hover:text-emerald-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-300/80 hover:text-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-950">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
