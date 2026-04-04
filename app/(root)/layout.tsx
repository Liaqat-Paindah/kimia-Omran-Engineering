
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
      <div className="w-full">{children}</div>
      <Footer />
    </>
  );
}
