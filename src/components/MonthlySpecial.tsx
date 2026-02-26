import { Link } from "react-router-dom";
import ScrollAnimate from "./ScrollAnimate";
import monthlyImg from "@/assets/monthly-special.jpg";

const MonthlySpecial = () => {
  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Decorative line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-primary/50" />

      <div className="container mx-auto px-4">
        <ScrollAnimate>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-primary text-primary-foreground font-body text-xs tracking-[0.3em] uppercase rounded-sm mb-4">
              ★ Monthly Exclusive
            </span>
            <h2 className="font-heading text-3xl md:text-5xl text-foreground tracking-wider">
              Menu of the Month
            </h2>
          </div>
        </ScrollAnimate>

        <ScrollAnimate delay={200}>
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center max-w-5xl mx-auto">
            {/* Image */}
            <div className="relative group">
              <div className="overflow-hidden rounded-sm">
                <img
                  src={monthlyImg}
                  alt="Monthly special - Otoro Gold Leaf"
                  className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 w-full h-full border border-primary/30 rounded-sm -z-10" />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-body text-primary text-sm tracking-[0.2em] uppercase mb-2">
                  February 2026
                </p>
                <h3 className="font-heading text-2xl md:text-4xl text-foreground tracking-wide mb-4">
                  Otoro Gold Leaf Nigiri
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  ส่วนท้องทูน่า (โอโทโร่) เกรดพรีเมียม ตัดจากปลาทูน่าครีบน้ำเงิน
                  นำเข้าจากตลาดโทโยสุ โตเกียว ตกแต่งด้วยแผ่นทองคำเปลว
                  เสิร์ฟบนข้าวซูชิอุ่นๆ หอมกรุ่น
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-heading text-3xl text-primary">฿890</span>
                <span className="font-body text-muted-foreground text-sm">per piece</span>
              </div>

              <Link
                to="/menu"
                className="inline-flex w-fit px-8 py-3 bg-primary text-primary-foreground font-body text-sm tracking-[0.2em] uppercase rounded-sm hover:bg-brand-red-glow transition-colors duration-300"
              >
                Try This Month
              </Link>
            </div>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  );
};

export default MonthlySpecial;
