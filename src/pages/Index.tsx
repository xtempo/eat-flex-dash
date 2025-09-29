import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MenuPreview from "@/components/MenuPreview";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <MenuPreview />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
