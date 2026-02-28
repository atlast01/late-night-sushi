import { useState, useEffect } from "react";
import { UtensilsCrossed, MessageSquare, CalendarDays, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ menus: 0, reviews: 0, reservations: 0, avgRating: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [menusRes, reviewsRes, reservationsRes] = await Promise.all([
        supabase.from("menus").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("rating").eq("status", "approved"),
        supabase.from("reservations").select("id", { count: "exact", head: true }),
      ]);

      const ratings = reviewsRes.data || [];
      const avg = ratings.length > 0
        ? Math.round((ratings.reduce((s, r) => s + r.rating, 0) / ratings.length) * 10) / 10
        : 0;

      setStats({
        menus: menusRes.count || 0,
        reviews: ratings.length,
        reservations: reservationsRes.count || 0,
        avgRating: avg,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Menus", value: stats.menus, icon: UtensilsCrossed, color: "text-primary" },
    { label: "Approved Reviews", value: stats.reviews, icon: MessageSquare, color: "text-primary" },
    { label: "Reservations", value: stats.reservations, icon: CalendarDays, color: "text-primary" },
    { label: "Avg Rating", value: stats.avgRating, icon: Star, color: "text-gold" },
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl text-foreground tracking-wider mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <card.icon size={24} className={card.color} />
            </div>
            <p className="font-heading text-3xl text-foreground">{card.value}</p>
            <p className="font-body text-sm text-muted-foreground mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
