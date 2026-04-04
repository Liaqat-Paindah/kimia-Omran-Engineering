
import Footer from "@/components/navigation/footer";
import Header from "@/components/navigation/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex w-full flex-1">{children}</div>
      <Footer />
    </>
  );
}
