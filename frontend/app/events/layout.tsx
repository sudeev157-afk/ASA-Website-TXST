import Header from "@/app/Components/Header";
import Footer from "@/app/Components/Footer";

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
