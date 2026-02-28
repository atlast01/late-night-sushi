import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollAnimate from "@/components/ScrollAnimate";
import { useAuth } from "@/contexts/AuthContext";
import { reservationApi, type Reservation } from "@/services/api";
import { User, CalendarDays, LogOut, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { user, profile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    reservationApi.getMyReservations().then(setReservations);
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-16 md:pt-36">
        <div className="container mx-auto px-4 max-w-2xl">
          <ScrollAnimate>
            <div className="bg-card border border-border rounded-sm p-8 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center">
                  <User size={24} className="text-primary" />
                </div>
                <div>
                  <h1 className="font-heading text-2xl text-foreground tracking-wider">{profile?.display_name || user.email}</h1>
                  <p className="font-body text-muted-foreground text-sm">{user.email}</p>
                </div>
                {isAdmin && (
                  <Link to="/admin" className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary font-body text-xs tracking-wider uppercase rounded-sm hover:bg-primary/30 transition-colors">
                    <Shield size={12} /> Admin Panel
                  </Link>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={handleLogout} className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-muted-foreground font-body text-sm rounded-sm hover:border-destructive hover:text-destructive transition-colors">
                  <LogOut size={14} /> ออกจากระบบ
                </button>
              </div>
            </div>
          </ScrollAnimate>

          <ScrollAnimate delay={200}>
            <div className="bg-card border border-border rounded-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <CalendarDays size={20} className="text-primary" />
                <h2 className="font-heading text-xl text-foreground tracking-wider">ประวัติการจอง</h2>
              </div>

              {reservations.length === 0 ? (
                <p className="font-body text-muted-foreground text-sm text-center py-8">ยังไม่มีประวัติการจองโต๊ะ</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {reservations.map((r) => (
                    <div key={r.id} className="flex items-center justify-between border border-border rounded-sm p-4">
                      <div>
                        <p className="font-body text-foreground text-sm font-medium">{r.date} • {r.time}</p>
                        <p className="font-body text-muted-foreground text-xs mt-1">
                          {r.guests} คน • {r.seating === "bar" ? "Bar Seating" : r.seating === "private" ? "Private Room" : "Table"}
                        </p>
                      </div>
                      <span className={`font-body text-xs tracking-wider uppercase px-3 py-1 rounded-sm ${
                        r.status === "confirmed" ? "bg-green-900/30 text-green-400" :
                        r.status === "cancelled" ? "bg-destructive/20 text-destructive" :
                        r.status === "completed" ? "bg-primary/20 text-primary" :
                        "bg-warm-amber/20 text-warm-amber"
                      }`}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollAnimate>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProfilePage;
