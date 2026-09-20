"use client";

import Link from "next/link";
import { useStore } from "@/components/StoreProvider";
import { formatWhen } from "@/lib/stats";

export default function HistoryPage() {
  const { workouts, exercises } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">History</h2>
        <p className="mt-1 text-sm text-emerald-200/70">
          Open a session to edit date, time, and sets.
        </p>
      </div>
      {workouts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-emerald-800 px-4 py-8 text-sm text-emerald-200/70">
          No workouts yet. Log your first session from the Log tab.
        </p>
      ) : (
        <ul className="space-y-3">
          {workouts.map((workout) => (
            <li key={workout.id}>
              <Link
                href={`/history/edit?id=${workout.id}`}
                className="block rounded-2xl border border-emerald-900 bg-emerald-950/30 px-4 py-4 hover:border-emerald-600"
              >
                <p className="font-medium text-emerald-50">{formatWhen(workout.startedAt)}</p>
                <p className="mt-1 text-sm text-emerald-200/70">
                  {workout.entries
                    .map((entry) => {
                      const exercise = exercises.find((item) => item.id === entry.exerciseId);
                      const total = entry.sets.reduce((sum, set) => sum + set.value, 0);
                      return `${exercise?.name ?? "Exercise"} ${total}`;
                    })
                    .join(" · ") || "Empty session"}
                </p>
                {workout.notes && (
                  <p className="mt-1 text-sm text-emerald-300/80">{workout.notes}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
