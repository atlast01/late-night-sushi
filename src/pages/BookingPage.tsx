import { useState } from "react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollAnimate from "@/components/ScrollAnimate";
import { useAuth } from "@/contexts/AuthContext";
import { reservationApi } from "@/services/api";
import { MapPin, Clock, Phone, Check } from "lucide-react";
import { Link } from "react-router-dom";

const bookingSchema = z.object({
  name: z.string().trim().min(1, "กรุณาใส่ชื่อ").max(100),
  phone: z.string().trim().min(9, "เบอร์โทรไม่ถูกต้อง").max(20),
  guests: z.number().int().min(1).max(20),
  date: z.string().min(1, "กรุณาเลือกวันที่"),
  time: z.string().min(1, "กรุณาเลือกเวลา"),
  seating: z.enum(["bar", "table", "private"]),
});

const timeSlots = [
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
  "21:00", "21:30", "22:00", "22:30", "23:00", "23:30",
  "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00",
];

const BookingPage = () => {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", phone: "", guests: 2, date: "", time: "19:00", seating: "table" as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = bookingSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0]?.message || "ข้อมูลไม่ถูกต้อง");
      return;
    }

    const validData = result.data;

    if (!user) {
      setError("กรุณาเข้าสู่ระบบก่อนจองโต๊ะ");
      return;
    }

    setSubmitting(true);
    try {
      await reservationApi.create({
        name: result.data.name,
        phone: result.data.phone,
        guests: result.data.guests,
        date: result.data.date,
        time: result.data.time,
        seating: result.data.seating,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "จองโต๊ะไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container mx-auto px-4">
          <ScrollAnimate>
            <div className="text-center mb-12">
              <p className="font-body text-primary text-sm tracking-[0.3em] uppercase mb-4">Reservation</p>
              <h1 className="font-heading text-4xl md:text-6xl text-foreground tracking-wider mb-4">Book a Table</h1>
              <p className="font-body text-muted-foreground max-w-lg mx-auto">
                จองโต๊ะล่วงหน้าเพื่อรับประสบการณ์ที่ดีที่สุด เราเปิดให้บริการทุกคืน 18:00 – 04:00
              </p>
            </div>
          </ScrollAnimate>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <ScrollAnimate delay={200}>
              {!user ? (
                <div className="bg-card border border-border rounded-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <p className="font-body text-muted-foreground mb-6">กรุณาเข้าสู่ระบบก่อนจองโต๊ะ</p>
                  <Link to="/login" className="px-8 py-3 bg-primary text-primary-foreground font-body text-sm tracking-wider uppercase rounded-sm hover:bg-brand-red-glow transition-colors">เข้าสู่ระบบ</Link>
                </div>
              ) : submitted ? (
                <div className="bg-card border border-primary/30 rounded-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6"><Check size={32} className="text-primary" /></div>
                  <h3 className="font-heading text-2xl text-foreground tracking-wider mb-3">Confirmed!</h3>
                  <p className="font-body text-muted-foreground text-sm">ขอบคุณสำหรับการจอง เราจะติดต่อกลับเพื่อยืนยันอีกครั้งครับ</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-sm p-8 flex flex-col gap-5">
                  {error && <div className="bg-destructive/10 border border-destructive/30 rounded-sm px-4 py-3 text-sm text-destructive font-body">{error}</div>}

                  <div>
                    <label className="font-body text-sm text-muted-foreground mb-1.5 block">ชื่อ-นามสกุล</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name" className="w-full bg-secondary border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                  </div>

                  <div>
                    <label className="font-body text-sm text-muted-foreground mb-1.5 block">เบอร์โทรศัพท์</label>
                    <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="08X-XXX-XXXX" className="w-full bg-secondary border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-sm text-muted-foreground mb-1.5 block">จำนวนคน</label>
                      <select value={form.guests} onChange={(e) => setForm({ ...form, guests: parseInt(e.target.value) })} className="w-full bg-secondary border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors">
                        {[1,2,3,4,5,6,7,8,10,12,15,20].map(n => <option key={n} value={n}>{n} คน</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="font-body text-sm text-muted-foreground mb-1.5 block">วันที่</label>
                      <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-secondary border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="font-body text-sm text-muted-foreground mb-1.5 block">เวลา</label>
                    <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full bg-secondary border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors">
                      {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="font-body text-sm text-muted-foreground mb-1.5 block">โซนที่นั่ง</label>
                    <select value={form.seating} onChange={(e) => setForm({ ...form, seating: e.target.value as any })} className="w-full bg-secondary border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors">
                      <option value="bar">Bar Seating — ดูเชฟปั้นซูชิ</option>
                      <option value="table">Table — โต๊ะทั่วไป</option>
                      <option value="private">Private Room — ห้องส่วนตัว</option>
                    </select>
                  </div>

                  <button type="submit" disabled={submitting} className="w-full mt-2 px-8 py-4 bg-primary text-primary-foreground font-body text-sm tracking-[0.2em] uppercase rounded-sm hover:bg-brand-red-glow transition-colors duration-300 disabled:opacity-50">
                    {submitting ? "กำลังจอง..." : "Confirm Reservation"}
                  </button>
                </form>
              )}
            </ScrollAnimate>

            <ScrollAnimate delay={400}>
              <div className="flex flex-col gap-8">
                <div className="bg-card border border-border rounded-sm p-8">
                  <h3 className="font-heading text-xl text-foreground tracking-wider mb-6">Visit Us</h3>
                  <div className="flex flex-col gap-5">
                    <div className="flex items-start gap-4"><MapPin size={18} className="text-primary mt-0.5 shrink-0" /><div><p className="font-body text-foreground text-sm">123 Sukhumvit Soi 38</p><p className="font-body text-muted-foreground text-sm">Bangkok 10110, Thailand</p></div></div>
                    <div className="flex items-center gap-4"><Clock size={18} className="text-primary shrink-0" /><p className="font-body text-foreground text-sm">Open Nightly: 6 PM – 4 AM</p></div>
                    <div className="flex items-center gap-4"><Phone size={18} className="text-primary shrink-0" /><p className="font-body text-foreground text-sm">02-XXX-XXXX</p></div>
                  </div>
                </div>
              </div>
            </ScrollAnimate>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BookingPage;
