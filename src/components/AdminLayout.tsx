import { useEffect } from "react";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, UtensilsCrossed, MessageSquare, CalendarDays, LogOut, ChevronLeft } from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Menus", href: "/admin/menus", icon: UtensilsCrossed },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { label: "Reservations", href: "/admin/reservations", icon: CalendarDays },
];

const AdminLayout = () => {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // SECURITY AUDIT: Redirect non-admin users. Role is checked server-side via has_role()
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-body">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <h2 className="font-heading text-xl text-foreground tracking-wider">Rako Admin</h2>
          <p className="font-body text-xs text-muted-foreground mt-1">{user.email}</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm font-body text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border flex flex-col gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-muted-foreground font-body text-sm hover:text-foreground transition-colors"
          >
            <ChevronLeft size={16} /> Back to Site
          </Link>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="flex items-center gap-2 px-4 py-2 text-muted-foreground font-body text-sm hover:text-destructive transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
