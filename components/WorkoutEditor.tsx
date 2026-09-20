"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/components/StoreProvider";
import {
  formatValue,
  fromDateTimeLocal,
  toDateTimeLocal,
  unitLabel,
} from "@/lib/stats";
import type { Workout, WorkoutEntry } from "@/lib/types";

function newId() {
  return crypto.randomUUID();
}

function blankWorkout(): Workout {
  return {
    id: newId(),
    startedAt: new Date().toISOString(),
    notes: "",
    entries: [],
  };
}

export function WorkoutEditor({
  initial,
  onSaved,
}: {
  initial?: Workout;
  onSaved?: () => void;
}) {
  const { exercises, saveWorkout } = useStore();
  const [workout, setWorkout] = useState<Workout>(initial ?? blankWorkout());
  const [pickedId, setPickedId] = useState(exercises[0]?.id ?? "");
  const [savedMsg, setSavedMsg] = useState("");

  const sorted = useMemo(
    () =>
      [...exercises].sort((a, b) =>
        a.category === b.category
          ? a.name.localeCompare(b.name)
          : a.category.localeCompare(b.category),
      ),
    [exercises],
  );

  function addExercise() {
    if (!pickedId) return;
    if (workout.entries.some((entry) => entry.exerciseId === pickedId)) return;
    const entry: WorkoutEntry = {
      id: newId(),
      exerciseId: pickedId,
      sets: [{ id: newId(), value: 0 }],
    };
    setWorkout((prev) => ({ ...prev, entries: [...prev.entries, entry] }));
  }

  function updateSet(entryId: string, setId: string, value: number) {
    setWorkout((prev) => ({
      ...prev,
      entries: prev.entries.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              sets: entry.sets.map((set) =>
                set.id === setId ? { ...set, value } : set,
              ),
            }
          : entry,
      ),
    }));
  }

  function addSet(entryId: string) {
    setWorkout((prev) => ({
      ...prev,
      entries: prev.entries.map((entry) =>
        entry.id === entryId
          ? { ...entry, sets: [...entry.sets, { id: newId(), value: 0 }] }
          : entry,
      ),
    }));
  }

  function removeSet(entryId: string, setId: string) {
    setWorkout((prev) => ({
      ...prev,
      entries: prev.entries.map((entry) =>
        entry.id === entryId
          ? { ...entry, sets: entry.sets.filter((set) => set.id !== setId) }
          : entry,
      ),
    }));
  }

  function removeEntry(entryId: string) {
    setWorkout((prev) => ({
      ...prev,
      entries: prev.entries.filter((entry) => entry.id !== entryId),
    }));
  }

  function save() {
    const cleaned: Workout = {
      ...workout,
      entries: workout.entries
        .map((entry) => ({
          ...entry,
          sets: entry.sets.filter((set) => set.value > 0),
        }))
        .filter((entry) => entry.sets.length > 0),
    };
    saveWorkout(cleaned);
    setSavedMsg("Workout saved.");
    if (!initial) setWorkout(blankWorkout());
    onSaved?.();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-emerald-100/80">Date and time</span>
          <input
            type="datetime-local"
            value={toDateTimeLocal(workout.startedAt)}
            onChange={(e) =>
              setWorkout((prev) => ({
                ...prev,
                startedAt: fromDateTimeLocal(e.target.value),
              }))
            }
            className="w-full rounded-xl border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-emerald-50 outline-none focus:border-emerald-400"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-emerald-100/80">Session notes</span>
          <input
            value={workout.notes}
            onChange={(e) =>
              setWorkout((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="How did it feel?"
            className="w-full rounded-xl border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-emerald-50 outline-none focus:border-emerald-400"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          value={pickedId}
          onChange={(e) => setPickedId(e.target.value)}
          className="flex-1 rounded-xl border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-emerald-50 outline-none focus:border-emerald-400"
        >
          {sorted.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.category} — {exercise.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addExercise}
          className="rounded-xl bg-emerald-400 px-4 py-2 font-semibold text-emerald-950 hover:bg-emerald-300"
        >
          Add exercise
        </button>
      </div>

      {workout.entries.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-emerald-800 px-4 py-8 text-center text-sm text-emerald-200/70">
          Add an exercise, then enter reps, hold seconds, or minutes for each set.
        </p>
      ) : (
        <div className="space-y-4">
          {workout.entries.map((entry) => {
            const exercise = exercises.find((item) => item.id === entry.exerciseId);
            const unit = unitLabel(exercise);
            return (
              <section
                key={entry.id}
                className="rounded-2xl border border-emerald-900 bg-emerald-950/30 p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-emerald-50">{exercise?.name ?? "Unknown"}</h3>
                    <p className="text-xs text-emerald-300/70">
                      {exercise?.category} · tracked in {unit}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.id)}
                    className="text-sm text-emerald-300/70 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-2">
                  {entry.sets.map((set, index) => (
                    <div key={set.id} className="flex items-center gap-2">
                      <span className="w-16 text-xs uppercase tracking-wide text-emerald-400/80">
                        Set {index + 1}
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={set.value || ""}
                        onChange={(e) =>
                          updateSet(entry.id, set.id, Number(e.target.value) || 0)
                        }
                        className="w-28 rounded-lg border border-emerald-800 bg-emerald-950/60 px-3 py-1.5 text-emerald-50 outline-none focus:border-emerald-400"
                      />
                      <span className="text-sm text-emerald-200/70">{unit}</span>
                      {entry.sets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSet(entry.id, set.id)}
                          className="text-xs text-emerald-400/70 hover:text-red-300"
                        >
                          Drop set
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addSet(entry.id)}
                  className="mt-3 text-sm font-medium text-emerald-300 hover:text-emerald-100"
                >
                  + Add set
                </button>
                <p className="mt-2 text-sm text-emerald-200/80">
                  Total{" "}
                  {formatValue(
                    exercise,
                    entry.sets.reduce((sum, set) => sum + (set.value || 0), 0),
                  )}
                </p>
              </section>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          className="rounded-xl bg-emerald-400 px-5 py-2.5 font-semibold text-emerald-950 hover:bg-emerald-300"
        >
          Save workout
        </button>
        {savedMsg && <span className="text-sm text-emerald-300">{savedMsg}</span>}
      </div>
    </div>
  );
}
