import Header from "@/app/Components/Header";
import Footer from "@/app/Components/Footer";

export default function MembershipLayout({
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
