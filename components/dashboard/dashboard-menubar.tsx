"use client";

import { FolderKanban, Settings2 } from "lucide-react";

import type { DashboardSection } from "@/lib/admin-dashboard";

const menuItems: Array<{
  key: DashboardSection;
  label: string;
  icon: typeof FolderKanban;
}> = [
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "account", label: "Account Settings", icon: Settings2 },
];

export default function DashboardMenubar({
  activeSection,
  onChange,
}: {
  activeSection: DashboardSection;
  onChange: (section: DashboardSection) => void;
}) {
  return (
    <nav className="sticky top-3 z-30 rounded-sm border border-slate-200/80 bg-white/90 p-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex flex-wrap gap-2">
        {menuItems.map(({ key, label, icon: Icon }) => {
          const isActive = activeSection === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
