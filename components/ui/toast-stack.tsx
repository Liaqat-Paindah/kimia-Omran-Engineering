"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle2, Trash2, X } from "lucide-react";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "error" | "warning";
  actionLabel?: string;
  onAction?: () => void | Promise<void>;
  persistent?: boolean;
};

const variantClasses: Record<
  NonNullable<ToastItem["variant"]>,
  {
    card: string;
    icon: typeof CheckCircle2;
    iconClass: string;
    actionClass: string;
  }
> = {
  success: {
    card: "border-emerald-200 bg-white/95 text-slate-900 dark:border-emerald-900/60 dark:bg-slate-900/95 dark:text-slate-100",
    icon: CheckCircle2,
    iconClass: "text-emerald-600 dark:text-emerald-400",
    actionClass:
      "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400",
  },
  error: {
    card: "border-rose-200 bg-white/95 text-slate-900 dark:border-rose-900/60 dark:bg-slate-900/95 dark:text-slate-100",
    icon: AlertCircle,
    iconClass: "text-rose-600 dark:text-rose-400",
    actionClass:
      "bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-400",
  },
  warning: {
    card: "border-amber-200 bg-white/95 text-slate-900 dark:border-amber-900/60 dark:bg-slate-900/95 dark:text-slate-100",
    icon: Trash2,
    iconClass: "text-amber-600 dark:text-amber-400",
    actionClass:
      "bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400",
  },
};

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const config = variantClasses[toast.variant ?? "success"];
  const Icon = config.icon;

  useEffect(() => {
    if (toast.persistent) {
      return;
    }

    const timeoutId = window.setTimeout(() => onDismiss(toast.id), 4000);

    return () => window.clearTimeout(timeoutId);
  }, [onDismiss, toast.id, toast.persistent]);

  return (
    <div
      className={`pointer-events-auto w-full max-w-sm rounded-sm border p-4 shadow-[0_20px_40px_rgba(15,23,42,0.18)] backdrop-blur ${config.card}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.iconClass}`} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.description ? (
            <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
              {toast.description}
            </p>
          ) : null}
          {toast.actionLabel && toast.onAction ? (
            <button
              type="button"
              onClick={async () => {
                await toast.onAction?.();
                onDismiss(toast.id);
              }}
              className={`mt-3 inline-flex rounded-sm px-3 py-2 text-xs font-semibold transition ${config.actionClass}`}
            >
              {toast.actionLabel}
            </button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="rounded-sm p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[80] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
