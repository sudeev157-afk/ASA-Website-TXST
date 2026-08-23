import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/* Every public page wears the same chrome. Grouping them under (site) keeps
   the Header/Footer in one place without adding a segment to any URL. */
export default function SiteLayout({
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
