/**
 * SECURITY AUDIT: Admin login page
 * - Uses standard email/password auth (no hardcoded credentials)
 * - After login, checks admin role via server-side has_role() function
 * - Generic error messages prevent user enumeration
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Eye, EyeOff } from "lucide-react";

const AdminLoginPage = () => {
  const { user, isAdmin, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user && isAdmin) {
      navigate("/admin");
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      // SECURITY AUDIT: Wait briefly for role check to complete
      setTimeout(() => {
        // Role will be checked by AdminLayout
        navigate("/admin");
      }, 500);
    } catch (err: any) {
      // SECURITY AUDIT: Generic error - don't reveal if account exists
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือคุณไม่มีสิทธิ์เข้าถึง");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-primary" />
          </div>
          <h1 className="font-heading text-2xl text-foreground tracking-wider">Admin Access</h1>
          <p className="font-body text-muted-foreground text-sm mt-2">เข้าสู่ระบบด้วยบัญชีแอดมิน</p>
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
                className="w-full bg-secondary border border-border rounded-sm px-4 py-3 pr-12 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 px-8 py-4 bg-primary text-primary-foreground font-body text-sm tracking-[0.2em] uppercase rounded-sm hover:bg-brand-red-glow transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Shield size={16} />
            {submitting ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบแอดมิน"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
