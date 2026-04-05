import { Suspense } from "react";
import Header from "@/components/navigation/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <div className="w-full">{children}</div>
    </>
  );
}
