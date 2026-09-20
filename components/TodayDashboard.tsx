"use client";

import { useStore } from "@/components/StoreProvider";
import { formatValue, goalProgress, startOfDay, startOfWeek, totalInRange } from "@/lib/stats";
import Link from "next/link";

export function TodayDashboard() {
  const { exercises, workouts, goals } = useStore();
  const now = new Date();
  const todayWorkouts = workouts.filter((workout) => {
    const when = new Date(workout.startedAt);
    return when >= startOfDay(now);
  });

  const weekPushups = totalInRange(
    workouts,
    "ex-push-up",
    startOfWeek(now),
    new Date(startOfWeek(now).getTime() + 7 * 24 * 60 * 60 * 1000),
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Sessions today"
          value={String(todayWorkouts.length)}
        />
        <Stat
          label="Workouts logged"
          value={String(workouts.length)}
        />
        <Stat
          label="Weekly push-ups"
          value={String(weekPushups)}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold text-emerald-50">Goals</h2>
          <Link href="/goals" className="text-sm text-emerald-300 hover:text-emerald-100">
            Manage
          </Link>
        </div>
        {goals.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-emerald-800 px-4 py-8 text-sm text-emerald-200/70">
            No goals yet. Set daily or weekly targets for any exercise.
          </p>
        ) : (
          <div className="space-y-3">
            {goals.map((goal) => {
              const exercise = exercises.find((item) => item.id === goal.exerciseId);
              const progress = goalProgress(workouts, goal, now);
              return (
                <div
                  key={goal.id}
                  className="rounded-2xl border border-emerald-900 bg-emerald-950/30 p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-emerald-50">
                        {exercise?.name ?? "Exercise removed"}
                      </p>
                      <p className="text-xs text-emerald-300/70">
                        {goal.period === "day" ? "Today" : "This week"} · target{" "}
                        {formatValue(exercise, goal.target)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-emerald-300">
                      {formatValue(exercise, progress.current)} /{" "}
                      {formatValue(exercise, progress.target)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-emerald-950">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold text-emerald-50">Today&apos;s sessions</h2>
          <Link href="/log" className="text-sm text-emerald-300 hover:text-emerald-100">
            Log a workout
          </Link>
        </div>
        {todayWorkouts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-emerald-800 px-4 py-8 text-sm text-emerald-200/70">
            Nothing logged today yet. No gym needed — just pick a few movements and go.
          </p>
        ) : (
          <ul className="space-y-2">
            {todayWorkouts.map((workout) => (
              <li
                key={workout.id}
                className="rounded-2xl border border-emerald-900 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-100"
              >
                <Link href={`/history/${workout.id}`} className="hover:text-emerald-300">
                  {new Date(workout.startedAt).toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                  {" · "}
                  {workout.entries.length} exercise
                  {workout.entries.length === 1 ? "" : "s"}
                  {workout.notes ? ` · ${workout.notes}` : ""}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-emerald-900 bg-emerald-950/40 px-4 py-5">
      <p className="text-xs uppercase tracking-wide text-emerald-400/80">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-emerald-50">{value}</p>
    </div>
  );
}
