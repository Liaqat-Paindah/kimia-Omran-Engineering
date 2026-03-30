import Footer from "@/components/navigation/footer";
import Header from "@/components/navigation/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex-1">
      <Header></Header>
      {children}
      <Footer></Footer>
    </div>
  );
}
