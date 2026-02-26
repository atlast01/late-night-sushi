import { Link } from "react-router-dom";
import ScrollAnimate from "./ScrollAnimate";
import menuSushi from "@/assets/menu-sushi.jpg";
import menuIzakaya from "@/assets/menu-izakaya.jpg";
import menuSake from "@/assets/menu-sake.jpg";

const highlights = [
  {
    image: menuSushi,
    title: "Sushi & Sashimi",
    description: "ซูชิและซาชิมิจากปลาสดใหม่ นำเข้าทุกวัน",
    tag: "Chef's Pick",
  },
  {
    image: menuIzakaya,
    title: "Izakaya & Grill",
    description: "ของย่างเสียบไม้สไตล์อิซากายะ เหมาะกับการดื่มสังสรรค์",
    tag: "Best Seller",
  },
  {
    image: menuSake,
    title: "Sake & Drinks",
    description: "สาเกนำเข้าจากญี่ปุ่นและเครื่องดื่มคราฟท์พิเศษ",
    tag: "Premium",
  },
];

const MenuHighlights = () => {
  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <ScrollAnimate>
          <div className="text-center mb-16">
            <p className="font-body text-primary text-sm tracking-[0.3em] uppercase mb-4">
              Curated Selection
            </p>
            <h2 className="font-heading text-3xl md:text-5xl text-foreground tracking-wider">
              Our Menu
            </h2>
          </div>
        </ScrollAnimate>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {highlights.map((item, i) => (
            <ScrollAnimate key={item.title} delay={i * 150}>
              <div className="group relative bg-card rounded-sm overflow-hidden border border-border hover:border-primary/50 transition-all duration-500">
                <div className="overflow-hidden aspect-square">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                </div>

                {/* Tag */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-primary/90 text-primary-foreground font-body text-[10px] tracking-[0.2em] uppercase rounded-sm backdrop-blur-sm">
                    {item.tag}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="font-heading text-xl text-foreground tracking-wide mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </ScrollAnimate>
          ))}
        </div>

        <ScrollAnimate delay={500}>
          <div className="text-center mt-12">
            <Link
              to="/menu"
              className="inline-flex px-10 py-3.5 border border-primary text-primary font-body text-sm tracking-[0.2em] uppercase rounded-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              See Full Menu
            </Link>
          </div>
        </ScrollAnimate>
      </div>
    </section>
  );
};

export default MenuHighlights;
