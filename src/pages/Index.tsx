import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MenuPreview from "@/components/MenuPreview";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      
      <section className="py-12 bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse our full menu and get your favorite dishes delivered right to your door.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/menu">
              <Button size="lg">
                Browse Menu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {!user && (
              <Link to="/auth">
                <Button size="lg" variant="outline">
                  Create Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
      
      <MenuPreview />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
