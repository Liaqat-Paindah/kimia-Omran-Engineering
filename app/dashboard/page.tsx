import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SignOutButton from "@/components/sign-out-button";

const colors = {
  primary: "#033a6d",
  quinary: "#00b3aa",
  gradient:
    "linear-gradient(135deg, #033a6d 0%, #005c75 25%, #007c8f 50%, #009996 75%, #00b3aa 100%)",
};

const quickStats = [
  {
    label: "Account Status",
    value: "Active",
    description: "Your admin session is valid and ready to use.",
  },
  {
    label: "Access Level",
    value: "Dashboard",
    description: "Protected content is now available from this session.",
  },
  {
    label: "Security",
    value: "JWT Session",
    description: "Use sign out at any time to clear the current login.",
  },
];

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=%2Fdashboard");
  }

  const fullName =
    [session.user.firstName, session.user.lastName].filter(Boolean).join(" ") ||
    session.user.name ||
    "Kimia User";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-28 sm:px-6 lg:px-8">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,179,170,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,179,170,0.03)_1px,transparent_1px)] bg-size-[36px_36px]" />
        <div
          className="absolute top-12 left-8 h-72 w-72 rounded-full blur-3xl"
          style={{ background: `${colors.primary}20` }}
        />
        <div
          className="absolute right-8 bottom-12 h-72 w-72 rounded-full blur-3xl"
          style={{ background: `${colors.quinary}20` }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <section
          className="overflow-hidden rounded-[2rem] border bg-white/90 p-8 shadow-2xl backdrop-blur dark:bg-[#011b2b]/90 md:p-10"
          style={{ borderColor: `${colors.quinary}20` }}
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]"
                style={{
                  background: `${colors.quinary}12`,
                  color: colors.quinary,
                }}
              >
                Protected Dashboard
              </div>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white md:text-4xl">
                Welcome, {fullName}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Your login is active and this page is protected by Auth.js.
                Anyone without a valid session will be redirected to the login
                page before this dashboard renders.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950 px-5 py-4 text-white shadow-xl">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-semibold"
                style={{ background: colors.gradient }}
              >
                {initials || "KU"}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{fullName}</p>
                <p className="text-xs text-slate-300">{session.user.email}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {session.user.role}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {quickStats.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-slate-950/40"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
                  {item.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.75rem] border border-slate-200/70 bg-white/90 p-6 dark:border-white/10 dark:bg-slate-950/30">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Session Details
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    First Name
                  </p>
                  <p className="mt-2 text-sm text-slate-900 dark:text-white">
                    {session.user.firstName || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Last Name
                  </p>
                  <p className="mt-2 text-sm text-slate-900 dark:text-white">
                    {session.user.lastName || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Email
                  </p>
                  <p className="mt-2 text-sm text-slate-900 dark:text-white">
                    {session.user.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Role
                  </p>
                  <p className="mt-2 text-sm capitalize text-slate-900 dark:text-white">
                    {session.user.role}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200/70 bg-slate-950 p-6 text-white dark:border-white/10">
              <h2 className="text-lg font-semibold">Session Controls</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Use the sign-out action below to end your session and return to
                the login screen.
              </p>
              <SignOutButton
                className="mt-6 inline-flex rounded-full bg-[#00b3aa] px-5 py-2.5 text-sm font-semibold text-slate-950 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                label="Sign Out"
                pendingLabel="Signing out..."
                redirectTo="/login"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
