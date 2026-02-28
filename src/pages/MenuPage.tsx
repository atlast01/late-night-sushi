import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollAnimate from "@/components/ScrollAnimate";
import { menuApi, type MenuItem } from "@/services/api";

const categories = [
  { id: "all", label: "🍽️ All" },
  { id: "sushi", label: "🍣 Sushi & Sashimi" },
  { id: "izakaya", label: "🍢 Izakaya & Grill" },
  { id: "ramen", label: "🍜 Late Night Bowls" },
  { id: "drinks", label: "🍶 Sake & Drinks" },
];

const MenuPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      try {
        const data = await menuApi.getMenuItems(activeTab === "all" ? undefined : activeTab);
        setMenus(data);
      } catch { /* handled */ }
      setLoading(false);
    };
    fetchMenus();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="container mx-auto px-4 text-center">
          <p className="font-body text-primary text-sm tracking-[0.3em] uppercase mb-4">Curated with Care</p>
          <h1 className="font-heading text-4xl md:text-6xl text-foreground tracking-wider mb-4">Our Menu</h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">วัตถุดิบสดใหม่ทุกวัน นำเข้าจากตลาดปลาโทโยสุ โตเกียว</p>
        </div>
      </section>

      <div className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`whitespace-nowrap px-5 py-2.5 font-body text-sm tracking-wider rounded-sm transition-all duration-300 ${
                  activeTab === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-muted-foreground font-body py-12">Loading menu...</p>
          ) : menus.length === 0 ? (
            <p className="text-center text-muted-foreground font-body py-12">ยังไม่มีเมนูในหมวดนี้</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {menus.map((item, i) => (
                <ScrollAnimate key={item.id} delay={i * 100}>
                  <div className="group bg-card border border-border rounded-sm overflow-hidden hover:border-primary/40 transition-all duration-500">
                    {item.image_url && (
                      <div className="relative overflow-hidden aspect-[4/3]">
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        {item.badge && (
                          <span className="absolute top-3 right-3 px-3 py-1 bg-primary/90 text-primary-foreground font-body text-[10px] tracking-[0.15em] uppercase rounded-sm backdrop-blur-sm">{item.badge}</span>
                        )}
                        {item.is_monthly_special && (
                          <span className="absolute top-3 left-3 px-3 py-1 bg-gold/90 text-background font-body text-[10px] tracking-[0.15em] uppercase rounded-sm backdrop-blur-sm">★ Monthly Special</span>
                        )}
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-heading text-lg text-foreground">{item.name}</h3>
                          {item.name_jp && <p className="font-body text-muted-foreground text-xs mt-0.5">{item.name_jp}</p>}
                        </div>
                        <span className="font-heading text-lg text-primary">฿{item.price}</span>
                      </div>
                      {item.description && <p className="font-body text-muted-foreground text-sm">{item.description}</p>}
                    </div>
                  </div>
                </ScrollAnimate>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MenuPage;
