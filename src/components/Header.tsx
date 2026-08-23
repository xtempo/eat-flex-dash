import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, LayoutDashboard, Package, Mountain } from "lucide-react";
import CartDrawer from "./CartDrawer";
import CurrencySelector from "./CurrencySelector";

const Header = () => {
  const { user, signOut, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-tibetan-gold/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-warm rounded-full flex items-center justify-center">
            <Mountain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary tracking-wide">DE CHUTAY RANTAK</span>
            <span className="text-xs text-muted-foreground tracking-widest uppercase">Tibetan & Ladakhi</span>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link to="/menu" className="text-sm font-medium hover:text-primary transition-colors">Menu</Link>
          
          <CurrencySelector />
          
          {/* Cart is now visible to everyone */}
          <CartDrawer />
          
          {user ? (
            <>
              <Link to="/orders">
                <Button variant="ghost" size="sm">
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="bg-gradient-warm hover:opacity-90">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
