import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Eye, EyeOff, LogIn } from "lucide-react";

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "เข้าสู่ระบบไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-20 pb-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl md:text-4xl text-foreground tracking-wider mb-2">
              Welcome Back
            </h1>
            <p className="font-body text-muted-foreground text-sm">
              เข้าสู่ระบบเพื่อจองโต๊ะและเขียนรีวิว
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-sm p-8 flex flex-col gap-5">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-sm px-4 py-3 text-sm text-destructive font-body">
                {error}
              </div>
            )}

            <div>
              <label className="font-body text-sm text-muted-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-secondary border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="font-body text-sm text-muted-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-secondary border border-border rounded-sm px-4 py-3 pr-12 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 px-8 py-4 bg-primary text-primary-foreground font-body text-sm tracking-[0.2em] uppercase rounded-sm hover:bg-brand-red-glow transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>

            <p className="text-center font-body text-sm text-muted-foreground">
              ยังไม่มีบัญชี?{" "}
              <Link to="/register" className="text-primary hover:underline">สมัครสมาชิก</Link>
            </p>

            <div className="border-t border-border pt-4 mt-1">
              <p className="text-center font-body text-xs text-muted-foreground">
                🧪 Demo: ใส่ email อะไรก็ได้เพื่อทดลองใช้งาน
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
