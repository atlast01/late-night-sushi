import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollAnimate from "@/components/ScrollAnimate";
import menuSushi from "@/assets/menu-sushi.jpg";
import menuIzakaya from "@/assets/menu-izakaya.jpg";
import menuSake from "@/assets/menu-sake.jpg";
import menuRamen from "@/assets/menu-ramen.jpg";
import monthlySpecial from "@/assets/monthly-special.jpg";

const categories = [
  { id: "sushi", label: "🍣 Sushi & Sashimi" },
  { id: "izakaya", label: "🍢 Izakaya & Grill" },
  { id: "ramen", label: "🍜 Late Night Bowls" },
  { id: "drinks", label: "🍶 Sake & Drinks" },
];

interface MenuItem {
  name: string;
  nameJp?: string;
  description: string;
  price: string;
  image: string;
  badge?: string;
}

const menuData: Record<string, MenuItem[]> = {
  sushi: [
    { name: "Salmon Nigiri", nameJp: "サーモン握り", description: "แซลมอนสดนำเข้าจากนอร์เวย์ เสิร์ฟบนข้าวซูชิ", price: "฿120", image: menuSushi, badge: "Chef's Pick" },
    { name: "Otoro Nigiri", nameJp: "大トロ握り", description: "โอโทโร่ ส่วนท้องทูน่าครีบน้ำเงิน เกรดพรีเมียม", price: "฿590", image: monthlySpecial, badge: "Premium" },
    { name: "Ebi Tempura Roll", nameJp: "海老天ぷらロール", description: "โรลกุ้งเทมปุระ ราดซอสสไปซี่", price: "฿280", image: menuSushi },
    { name: "Assorted Sashimi", nameJp: "刺身盛り合わせ", description: "รวมซาชิมิ 5 ชนิด เสิร์ฟบนน้ำแข็ง", price: "฿690", image: monthlySpecial, badge: "Best Seller" },
    { name: "Unagi Nigiri", nameJp: "うなぎ握り", description: "ปลาไหลย่างเคลือบซอสคาบายากิ", price: "฿220", image: menuSushi },
    { name: "Dragon Roll", nameJp: "ドラゴンロール", description: "โรลปลาไหลย่างท็อปอะโวคาโด", price: "฿380", image: menuSushi, badge: "Spicy" },
  ],
  izakaya: [
    { name: "Yakitori Set", nameJp: "焼き鳥セット", description: "ไก่ย่างเสียบไม้สไตล์ญี่ปุ่น 5 ไม้", price: "฿250", image: menuIzakaya, badge: "Best Seller" },
    { name: "Gyoza", nameJp: "餃子", description: "เกี๊ยวซ่าทอดกรอบ ไส้หมูและผัก", price: "฿180", image: menuIzakaya },
    { name: "Edamame", nameJp: "枝豆", description: "ถั่วแระญี่ปุ่นเกลือ", price: "฿90", image: menuIzakaya },
    { name: "Karaage", nameJp: "唐揚げ", description: "ไก่ทอดคาราอาเกะ เสิร์ฟพร้อมมายองเนส", price: "฿190", image: menuIzakaya, badge: "Chef's Pick" },
  ],
  ramen: [
    { name: "Tonkotsu Ramen", nameJp: "豚骨ラーメン", description: "ราเมงน้ำซุปกระดูกหมูเข้มข้น ต้ม 18 ชั่วโมง", price: "฿290", image: menuRamen, badge: "Best Seller" },
    { name: "Miso Ramen", nameJp: "味噌ラーメン", description: "ราเมงมิโสะ หอมกลมกล่อม", price: "฿270", image: menuRamen },
    { name: "Spicy Tantanmen", nameJp: "担々麺", description: "ราเมงทันทันเม็น เผ็ดร้อน ซุปงาขาว", price: "฿310", image: menuRamen, badge: "Spicy" },
  ],
  drinks: [
    { name: "Junmai Daiginjo", nameJp: "純米大吟醸", description: "สาเกพรีเมียม หอมผลไม้ รสนุ่มละมุน", price: "฿490", image: menuSake, badge: "Premium" },
    { name: "Asahi Draft", nameJp: "アサヒ生ビール", description: "เบียร์สดอาซาฮี เย็นฉ่ำ", price: "฿190", image: menuSake },
    { name: "Yuzu Highball", nameJp: "ゆずハイボール", description: "ไฮบอลยูสุ สดชื่น หอมส้มยูสุ", price: "฿250", image: menuSake },
    { name: "Matcha Sake", nameJp: "抹茶酒", description: "สาเกผสมมัทฉะ รสชาติไม่เหมือนใคร", price: "฿350", image: menuSake, badge: "New" },
  ],
};

const MenuPage = () => {
  const [activeTab, setActiveTab] = useState("sushi");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="container mx-auto px-4 text-center">
          <p className="font-body text-primary text-sm tracking-[0.3em] uppercase mb-4">
            Curated with Care
          </p>
          <h1 className="font-heading text-4xl md:text-6xl text-foreground tracking-wider mb-4">
            Our Menu
          </h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            วัตถุดิบสดใหม่ทุกวัน นำเข้าจากตลาดปลาโทโยสุ โตเกียว
          </p>
        </div>
      </section>

      {/* Tabs */}
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

      {/* Menu Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {menuData[activeTab]?.map((item, i) => (
              <ScrollAnimate key={item.name} delay={i * 100}>
                <div className="group bg-card border border-border rounded-sm overflow-hidden hover:border-primary/40 transition-all duration-500">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {item.badge && (
                      <span className="absolute top-3 right-3 px-3 py-1 bg-primary/90 text-primary-foreground font-body text-[10px] tracking-[0.15em] uppercase rounded-sm backdrop-blur-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-heading text-lg text-foreground">{item.name}</h3>
                        {item.nameJp && (
                          <p className="font-body text-muted-foreground text-xs mt-0.5">{item.nameJp}</p>
                        )}
                      </div>
                      <span className="font-heading text-lg text-primary">{item.price}</span>
                    </div>
                    <p className="font-body text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </div>
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MenuPage;
