"use client";

import { useState } from "react";
import { useStore } from "@/components/StoreProvider";
import type { ExerciseCategory, ExerciseType, TrackingMode } from "@/lib/types";

const CATEGORIES: ExerciseCategory[] = ["Push", "Legs", "Core", "Full body", "Custom"];

const emptyForm = (): Omit<ExerciseType, "id"> => ({
  name: "",
  category: "Custom",
  tracking: "reps",
  notes: "",
});

export default function ExercisesPage() {
  const { exercises, upsertExercise, deleteExercise } = useStore();
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);

  function startEdit(exercise: ExerciseType) {
    setEditingId(exercise.id);
    setForm({
      name: exercise.name,
      category: exercise.category,
      tracking: exercise.tracking,
      notes: exercise.notes,
    });
  }

  function save() {
    const name = form.name.trim();
    if (!name) return;
    upsertExercise({
      id: editingId ?? crypto.randomUUID(),
      ...form,
      name,
    });
    setEditingId(null);
    setForm(emptyForm());
  }

  const grouped = CATEGORIES.map((category) => ({
    category,
    items: exercises.filter((exercise) => exercise.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Exercises</h2>
        <p className="mt-1 text-sm text-emerald-200/70">
          Built-in bodyweight movements, plus any custom types you add.
        </p>
      </div>

      <form
        className="grid gap-3 rounded-2xl border border-emerald-900 bg-emerald-950/30 p-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-sm font-medium text-emerald-100/80">Name</span>
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Hindu push-up"
            className="w-full rounded-xl border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-emerald-50 outline-none focus:border-emerald-400"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-emerald-100/80">Category</span>
          <select
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, category: e.target.value as ExerciseCategory }))
            }
            className="w-full rounded-xl border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-emerald-50 outline-none focus:border-emerald-400"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-emerald-100/80">Track</span>
          <select
            value={form.tracking}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, tracking: e.target.value as TrackingMode }))
            }
            className="w-full rounded-xl border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-emerald-50 outline-none focus:border-emerald-400"
          >
            <option value="reps">Reps</option>
            <option value="seconds">Seconds (holds)</option>
          </select>
        </label>
        <label className="space-y-1.5 sm:col-span-2">
          <span className="text-sm font-medium text-emerald-100/80">Notes</span>
          <input
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Cue or variation"
            className="w-full rounded-xl border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-emerald-50 outline-none focus:border-emerald-400"
          />
        </label>
        <div className="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            className="rounded-xl bg-emerald-400 px-4 py-2 font-semibold text-emerald-950 hover:bg-emerald-300"
          >
            {editingId ? "Save changes" : "Add exercise"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm());
              }}
              className="rounded-xl px-4 py-2 text-sm text-emerald-200 hover:text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {grouped.map((group) => (
        <section key={group.category} className="space-y-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-400">
            {group.category}
          </h3>
          <ul className="space-y-2">
            {group.items.map((exercise) => (
              <li
                key={exercise.id}
                className="flex flex-col gap-2 rounded-2xl border border-emerald-900 bg-emerald-950/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-emerald-50">{exercise.name}</p>
                  <p className="text-sm text-emerald-200/70">
                    {exercise.tracking === "seconds" ? "Hold time" : "Reps"}
                    {exercise.notes ? ` · ${exercise.notes}` : ""}
                  </p>
                </div>
                <div className="flex gap-3 text-sm">
                  <button
                    type="button"
                    onClick={() => startEdit(exercise)}
                    className="text-emerald-300 hover:text-emerald-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteExercise(exercise.id)}
                    className="text-red-300/80 hover:text-red-200"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
