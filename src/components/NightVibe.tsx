import ScrollAnimate from "./ScrollAnimate";
import vibe1 from "@/assets/vibe-1.jpg";
import vibe2 from "@/assets/vibe-2.jpg";
import vibe3 from "@/assets/vibe-3.jpg";

const NightVibe = () => {
  return (
    <section id="vibe" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <ScrollAnimate>
          <div className="text-center mb-16">
            <p className="font-body text-primary text-sm tracking-[0.3em] uppercase mb-4">
              After Hours
            </p>
            <h2 className="font-heading text-3xl md:text-5xl text-foreground tracking-wider mb-6">
              The Midnight Vibe
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              บรรยากาศสำหรับคนทำงานดึกและคนรักการสังสรรค์
              ที่นี่เราเปิดต้อนรับเมื่อเมืองเริ่มหลับใหล
            </p>
          </div>
        </ScrollAnimate>

        {/* Masonry-style grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
          <ScrollAnimate className="row-span-2" delay={0}>
            <div className="h-full overflow-hidden rounded-sm">
              <img
                src={vibe1}
                alt="Night bar atmosphere"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </ScrollAnimate>

          <ScrollAnimate delay={150}>
            <div className="overflow-hidden rounded-sm">
              <img
                src={vibe2}
                alt="Chef preparing sushi"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </ScrollAnimate>

          <ScrollAnimate delay={300}>
            <div className="overflow-hidden rounded-sm">
              <img
                src={vibe3}
                alt="Night alleyway"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </ScrollAnimate>

          <ScrollAnimate className="md:col-span-2" delay={400}>
            <div className="bg-card border border-border rounded-sm p-8 md:p-12 flex flex-col justify-center h-full">
              <p className="font-heading text-2xl md:text-3xl text-foreground tracking-wide leading-relaxed">
                "เมื่อเมืองหลับ<br />
                <span className="text-primary">ซูชิเราตื่น</span>"
              </p>
              <p className="font-body text-muted-foreground mt-4 text-sm">
                — Rako Sushi, Since 2024
              </p>
            </div>
          </ScrollAnimate>
        </div>
      </div>
    </section>
  );
};

export default NightVibe;
