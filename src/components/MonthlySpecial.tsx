import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ScrollAnimate from "./ScrollAnimate";
import { menuApi, type MenuItem } from "@/services/api";
import monthlyImg from "@/assets/monthly-special.jpg";

const MonthlySpecial = () => {
  const [special, setSpecial] = useState<MenuItem | null>(null);

  useEffect(() => {
    menuApi.getMonthlySpecial().then(setSpecial);
  }, []);

  // Fallback to static content if no DB data yet
  const name = special?.name || "Otoro Gold Leaf Nigiri";
  const desc = special?.description || "ส่วนท้องทูน่า (โอโทโร่) เกรดพรีเมียม ตัดจากปลาทูน่าครีบน้ำเงิน นำเข้าจากตลาดโทโยสุ โตเกียว ตกแต่งด้วยแผ่นทองคำเปลว เสิร์ฟบนข้าวซูชิอุ่นๆ หอมกรุ่น";
  const price = special?.price || 890;
  const month = special?.monthly_special_month || "February 2026";
  const image = special?.image_url || monthlyImg;

  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-primary/50" />
      <div className="container mx-auto px-4">
        <ScrollAnimate>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-primary text-primary-foreground font-body text-xs tracking-[0.3em] uppercase rounded-sm mb-4">★ Monthly Exclusive</span>
            <h2 className="font-heading text-3xl md:text-5xl text-foreground tracking-wider">Menu of the Month</h2>
          </div>
        </ScrollAnimate>

        <ScrollAnimate delay={200}>
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center max-w-5xl mx-auto">
            <div className="relative group">
              <div className="overflow-hidden rounded-sm">
                <img src={image} alt={name} className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="absolute -bottom-3 -right-3 w-full h-full border border-primary/30 rounded-sm -z-10" />
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <p className="font-body text-primary text-sm tracking-[0.2em] uppercase mb-2">{month}</p>
                <h3 className="font-heading text-2xl md:text-4xl text-foreground tracking-wide mb-4">{name}</h3>
                <p className="font-body text-muted-foreground leading-relaxed">{desc}</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-3xl text-primary">฿{price}</span>
                <span className="font-body text-muted-foreground text-sm">per piece</span>
              </div>
              <Link to="/menu" className="inline-flex w-fit px-8 py-3 bg-primary text-primary-foreground font-body text-sm tracking-[0.2em] uppercase rounded-sm hover:bg-brand-red-glow transition-colors duration-300">Try This Month</Link>
            </div>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  );
};

export default MonthlySpecial;
