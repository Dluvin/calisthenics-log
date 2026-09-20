"use client";

import { useParams, useRouter } from "next/navigation";
import { WorkoutEditor } from "@/components/WorkoutEditor";
import { useStore } from "@/components/StoreProvider";

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { workouts, deleteWorkout } = useStore();
  const workout = workouts.find((item) => item.id === id);

  if (!workout) {
    return <p className="text-sm text-emerald-200/70">Workout not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Edit workout</h2>
          <p className="mt-1 text-sm text-emerald-200/70">
            Change the date and time or update any set.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            deleteWorkout(workout.id);
            router.push("/history");
          }}
          className="text-sm text-red-300 hover:text-red-200"
        >
          Delete
        </button>
      </div>
      <WorkoutEditor
        key={workout.id}
        initial={workout}
        onSaved={() => router.push("/history")}
      />
    </div>
  );
}
