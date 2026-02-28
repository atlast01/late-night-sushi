import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Eye, EyeOff, UserPlus } from "lucide-react";

const RegisterPage = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
    if (password !== confirmPw) return setError("รหัสผ่านไม่ตรงกัน");
    try {
      await register(email, password, name);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "สมัครสมาชิกไม่สำเร็จ");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20 pb-12 px-4">
          <div className="bg-card border border-border rounded-sm p-12 text-center max-w-md">
            <h2 className="font-heading text-2xl text-foreground tracking-wider mb-4">ตรวจสอบอีเมลของคุณ</h2>
            <p className="font-body text-muted-foreground text-sm mb-6">
              เราได้ส่งลิงก์ยืนยันไปยัง <strong className="text-foreground">{email}</strong> กรุณาคลิกลิงก์เพื่อเปิดใช้งานบัญชี
            </p>
            <Link to="/login" className="text-primary font-body text-sm hover:underline">กลับไปหน้าเข้าสู่ระบบ</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-20 pb-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl md:text-4xl text-foreground tracking-wider mb-2">
              Create Account
            </h1>
            <p className="font-body text-muted-foreground text-sm">
              สมัครสมาชิกเพื่อรับสิทธิพิเศษ
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-sm p-8 flex flex-col gap-5">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-sm px-4 py-3 text-sm text-destructive font-body">
                {error}
              </div>
            )}

            <div>
              <label className="font-body text-sm text-muted-foreground mb-1.5 block">ชื่อ</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="ชื่อที่ต้องการแสดง" className="w-full bg-secondary border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
            </div>

            <div>
              <label className="font-body text-sm text-muted-foreground mb-1.5 block">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full bg-secondary border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
            </div>

            <div>
              <label className="font-body text-sm text-muted-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="อย่างน้อย 6 ตัวอักษร" className="w-full bg-secondary border border-border rounded-sm px-4 py-3 pr-12 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="font-body text-sm text-muted-foreground mb-1.5 block">ยืนยัน Password</label>
              <input type="password" required value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="ยืนยันรหัสผ่าน" className="w-full bg-secondary border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" />
            </div>

            <button type="submit" disabled={isLoading} className="w-full mt-2 px-8 py-4 bg-primary text-primary-foreground font-body text-sm tracking-[0.2em] uppercase rounded-sm hover:bg-brand-red-glow transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
              <UserPlus size={16} />
              {isLoading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
            </button>

            <p className="text-center font-body text-sm text-muted-foreground">
              มีบัญชีอยู่แล้ว?{" "}
              <Link to="/login" className="text-primary hover:underline">เข้าสู่ระบบ</Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
