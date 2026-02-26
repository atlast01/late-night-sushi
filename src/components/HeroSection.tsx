import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Sushi bar atmosphere" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-primary/40 rounded-full mb-8 backdrop-blur-sm">
            <Clock size={14} className="text-primary" />
            <span className="text-xs font-body tracking-[0.3em] uppercase text-muted-foreground">
              Open Nightly: 6 PM – 4 AM
            </span>
          </div>
        </div>

        <h1
          className="font-heading text-5xl md:text-7xl lg:text-8xl tracking-wider text-foreground mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Midnight Sushi
          <span className="block text-primary">Authentic Vibe</span>
        </h1>

        <p
          className="font-body text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          เปิดประสบการณ์ซูชิต้นตำรับ สำหรับนักดื่มและคนนอนดึก โดยเฉพาะ
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <Link
            to="/menu"
            className="px-8 py-3.5 bg-primary text-primary-foreground font-body text-sm tracking-[0.2em] uppercase rounded-sm hover:bg-brand-red-glow transition-all duration-300 animate-glow-pulse"
          >
            Explore Our Menu
          </Link>
          <Link
            to="/booking"
            className="px-8 py-3.5 border border-foreground/30 text-foreground font-body text-sm tracking-[0.2em] uppercase rounded-sm hover:border-primary hover:text-primary transition-all duration-300"
          >
            Order Delivery
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
