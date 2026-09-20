"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Today" },
  { href: "/log", label: "Log" },
  { href: "/history", label: "History" },
  { href: "/exercises", label: "Exercises" },
  { href: "/goals", label: "Goals" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-emerald-950/60 bg-[#07140f]/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Bodyweight
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-emerald-50">
            Calisthenics Log
          </h1>
        </div>
        <nav className="flex flex-wrap gap-1">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-emerald-400 text-emerald-950"
                    : "text-emerald-100/80 hover:bg-emerald-900/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
