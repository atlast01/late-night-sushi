/**
 * SECURITY AUDIT: Menu management page
 * - All CRUD operations go through Supabase with RLS policies
 * - Only users with 'admin' role can INSERT/UPDATE/DELETE menus
 * - Input sanitized before submission
 */
import { useState, useEffect } from "react";
import { z } from "zod";
import { menuApi, type MenuItem } from "@/services/api";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";

const menuSchema = z.object({
  name: z.string().trim().min(1, "กรุณาใส่ชื่อเมนู").max(100),
  name_jp: z.string().trim().max(100).optional().or(z.literal("")),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  price: z.number().positive("ราคาต้องมากกว่า 0"),
  category: z.enum(["sushi", "izakaya", "ramen", "drinks"]),
  badge: z.string().trim().max(50).optional().or(z.literal("")),
  image_url: z.string().trim().max(500).optional().or(z.literal("")),
  is_monthly_special: z.boolean().optional(),
  monthly_special_month: z.string().optional().or(z.literal("")),
  monthly_special_description: z.string().trim().max(500).optional().or(z.literal("")),
});

type MenuForm = z.infer<typeof menuSchema>;

const emptyForm: MenuForm = {
  name: "", name_jp: "", description: "", price: 0, category: "sushi",
  badge: "", image_url: "", is_monthly_special: false,
  monthly_special_month: "", monthly_special_description: "",
};

const AdminMenus = () => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<MenuForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const data = await menuApi.getMenuItems();
      setMenus(data);
    } catch { /* handled */ }
    setLoading(false);
  };

  useEffect(() => { fetchMenus(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditId(item.id);
    setForm({
      name: item.name,
      name_jp: item.name_jp || "",
      description: item.description || "",
      price: item.price,
      category: item.category,
      badge: item.badge || "",
      image_url: item.image_url || "",
      is_monthly_special: item.is_monthly_special,
      monthly_special_month: item.monthly_special_month || "",
      monthly_special_description: item.monthly_special_description || "",
    });
    setFormError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const result = menuSchema.safeParse(form);
    if (!result.success) {
      setFormError(result.error.errors[0]?.message || "ข้อมูลไม่ถูกต้อง");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...result.data,
        name_jp: result.data.name_jp || null,
        description: result.data.description || null,
        badge: result.data.badge || null,
        image_url: result.data.image_url || null,
        monthly_special_month: result.data.monthly_special_month || null,
        monthly_special_description: result.data.monthly_special_description || null,
      };

      if (editId) {
        await menuApi.updateMenuItem(editId, payload);
      } else {
        await menuApi.createMenuItem(payload as any);
      }
      setShowForm(false);
      fetchMenus();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบเมนูนี้?")) return;
    try {
      await menuApi.deleteMenuItem(id);
      fetchMenus();
    } catch { /* handled */ }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl text-foreground tracking-wider">Menu Management</h1>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-body text-sm rounded-sm hover:bg-brand-red-glow transition-colors"
        >
          <Plus size={16} /> Add Menu
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-sm p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl text-foreground">{editId ? "Edit Menu" : "Add Menu"}</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>

            {formError && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-sm px-4 py-3 text-sm text-destructive font-body mb-4">{formError}</div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-1 block">Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full bg-secondary border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-1 block">Name (JP)</label>
                  <input value={form.name_jp} onChange={(e) => setForm({ ...form, name_jp: e.target.value })} className="w-full bg-secondary border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:border-primary focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="font-body text-sm text-muted-foreground mb-1 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full bg-secondary border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:border-primary focus:outline-none resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-1 block">Price (฿) *</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} required className="w-full bg-secondary border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-1 block">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })} className="w-full bg-secondary border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:border-primary focus:outline-none">
                    <option value="sushi">Sushi</option>
                    <option value="izakaya">Izakaya</option>
                    <option value="ramen">Ramen</option>
                    <option value="drinks">Drinks</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-1 block">Badge</label>
                  <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. Chef's Pick" className="w-full bg-secondary border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-1 block">Image URL</label>
                  <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full bg-secondary border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:border-primary focus:outline-none" />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_monthly_special} onChange={(e) => setForm({ ...form, is_monthly_special: e.target.checked })} className="accent-primary" />
                  <span className="font-body text-sm text-foreground flex items-center gap-1"><Star size={14} className="text-gold" /> Monthly Special</span>
                </label>
              </div>

              {form.is_monthly_special && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-sm text-muted-foreground mb-1 block">Month (YYYY-MM)</label>
                    <input value={form.monthly_special_month} onChange={(e) => setForm({ ...form, monthly_special_month: e.target.value })} placeholder="2026-03" className="w-full bg-secondary border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="font-body text-sm text-muted-foreground mb-1 block">Special Description</label>
                    <input value={form.monthly_special_description} onChange={(e) => setForm({ ...form, monthly_special_description: e.target.value })} className="w-full bg-secondary border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:border-primary focus:outline-none" />
                  </div>
                </div>
              )}

              <button type="submit" disabled={submitting} className="w-full mt-2 px-6 py-3 bg-primary text-primary-foreground font-body text-sm tracking-wider uppercase rounded-sm hover:bg-brand-red-glow transition-colors disabled:opacity-50">
                {submitting ? "กำลังบันทึก..." : editId ? "Update Menu" : "Add Menu"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Menu Table */}
      {loading ? (
        <p className="text-muted-foreground font-body">Loading...</p>
      ) : menus.length === 0 ? (
        <div className="bg-card border border-border rounded-sm p-12 text-center">
          <p className="text-muted-foreground font-body">ยังไม่มีเมนู กดปุ่ม Add Menu เพื่อเริ่มต้น</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider">Badge</th>
                  <th className="text-left px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider">Special</th>
                  <th className="text-right px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menus.map((item) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-body text-sm text-foreground">{item.name}</p>
                      {item.name_jp && <p className="font-body text-xs text-muted-foreground">{item.name_jp}</p>}
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground capitalize">{item.category}</td>
                    <td className="px-4 py-3 font-body text-sm text-foreground">฿{item.price}</td>
                    <td className="px-4 py-3">
                      {item.badge && <span className="px-2 py-0.5 bg-primary/20 text-primary font-body text-xs rounded-sm">{item.badge}</span>}
                    </td>
                    <td className="px-4 py-3">
                      {item.is_monthly_special && <Star size={16} className="text-gold" />}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(item)} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMenus;
