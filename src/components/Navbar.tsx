import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import rakoLogo from "@/assets/rako-logo.jfif";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Reviews", href: "/reviews" },
  { label: "The Vibe", href: "/#vibe" },
  { label: "Contact", href: "/booking" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-lg" : ""
      } bg-nav`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={rakoLogo} alt="Rako Sushi" className="h-10 md:h-14 w-auto object-contain" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-nav-foreground font-body text-sm tracking-widest uppercase hover:text-primary transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-4 py-2 text-nav-foreground font-body text-sm tracking-wider hover:text-primary transition-colors"
            >
              <User size={16} />
              {user.name}
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 text-nav-foreground font-body text-sm tracking-wider hover:text-primary transition-colors"
            >
              <LogIn size={16} />
              Login
            </Link>
          )}
          <Link
            to="/booking"
            className="inline-flex items-center px-6 py-2.5 bg-primary text-primary-foreground font-body text-sm tracking-wider uppercase rounded-sm hover:bg-brand-red-glow transition-colors duration-300"
          >
            Book a Table
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden text-nav-foreground"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-nav border-t border-border animate-fade-in">
          <div className="flex flex-col px-4 py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-nav-foreground font-body text-sm tracking-widest uppercase py-2"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 text-nav-foreground font-body text-sm tracking-widest uppercase py-2"
              >
                <User size={16} />
                {user.name}
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-nav-foreground font-body text-sm tracking-widest uppercase py-2"
              >
                <LogIn size={16} />
                Login
              </Link>
            )}

            <Link
              to="/booking"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-body text-sm tracking-wider uppercase rounded-sm"
            >
              Book a Table
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
