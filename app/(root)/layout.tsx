import { Suspense } from "react";
import Footer from "@/components/navigation/footer";
import Header from "@/components/navigation/header";

export default function RootLayout({
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
      <Footer />
    </>
  );
}
