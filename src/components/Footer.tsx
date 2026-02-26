import { Link } from "react-router-dom";
import { MapPin, Clock, Phone } from "lucide-react";
import rakoLogo from "@/assets/rako-logo.jfif";

const Footer = () => {
  return (
    <footer>
      {/* CTA Band */}
      <div className="bg-primary py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl text-primary-foreground tracking-wider mb-4">
            Ready for Midnight?
          </h2>
          <p className="font-body text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            จองโต๊ะล่วงหน้าเพื่อรับประสบการณ์ที่ดีที่สุด
          </p>
          <Link
            to="/booking"
            className="inline-flex px-10 py-3.5 bg-background text-foreground font-body text-sm tracking-[0.2em] uppercase rounded-sm hover:bg-card transition-colors duration-300"
          >
            Reserve Now
          </Link>
        </div>
      </div>

      {/* Footer content */}
      <div className="bg-background border-t border-primary/20 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Logo & Description */}
            <div>
              <div className="bg-nav inline-block p-2 rounded-sm mb-4">
                <img src={rakoLogo} alt="Rako Sushi" className="h-10 w-auto" />
              </div>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">
                Authentic Japanese late-night sushi bar.
                ซูชิต้นตำรับสำหรับคนนอนดึก
              </p>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4">
              <h4 className="font-heading text-lg text-foreground tracking-wider">Visit Us</h4>
              <div className="flex items-start gap-3 text-muted-foreground font-body text-sm">
                <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                <span>123 Sukhumvit Soi 38, Bangkok 10110</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground font-body text-sm">
                <Clock size={16} className="text-primary shrink-0" />
                <span>Open Nightly: 6 PM – 4 AM</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground font-body text-sm">
                <Phone size={16} className="text-primary shrink-0" />
                <span>02-XXX-XXXX</span>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-heading text-lg text-foreground tracking-wider mb-4">Stay Updated</h4>
              <p className="font-body text-muted-foreground text-sm mb-4">
                รับข่าวสารเมนูพิเศษประจำเดือน
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-secondary border border-border rounded-sm px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-primary text-primary-foreground font-body text-sm rounded-sm hover:bg-brand-red-glow transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="font-body text-muted-foreground text-xs tracking-wider">
              © 2026 Rako Sushi. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
