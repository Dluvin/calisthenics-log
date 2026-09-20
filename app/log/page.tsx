import { WorkoutEditor } from "@/components/WorkoutEditor";

export default function LogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Log a workout</h2>
        <p className="mt-1 text-sm text-emerald-200/70">
          Set the date and time, add movements, then record each set.
        </p>
      </div>
      <WorkoutEditor />
    </div>
  );
}
