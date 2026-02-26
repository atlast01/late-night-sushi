import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MonthlySpecial from "@/components/MonthlySpecial";
import MenuHighlights from "@/components/MenuHighlights";
import NightVibe from "@/components/NightVibe";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <MonthlySpecial />
      <MenuHighlights />
      <NightVibe />
      <Footer />
    </div>
  );
};

export default Index;
