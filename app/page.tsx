import { TodayDashboard } from "@/components/TodayDashboard";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Today</h2>
        <p className="mt-1 text-sm text-emerald-200/70">
          Standard calisthenics, no gym equipment. Track sets, hold a line, and chase goals.
        </p>
      </div>
      <TodayDashboard />
    </div>
  );
}
