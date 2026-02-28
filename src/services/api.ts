/**
 * API Service Layer for Rako Sushi
 * SECURITY AUDIT: All data access goes through Supabase with RLS policies.
 * No direct SQL — all queries use the Supabase JS client.
 */
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import DOMPurify from "dompurify";

// ============ Types (re-export from generated) ============
export type MenuItem = Tables<"menus">;
export type Review = Tables<"reviews"> & { user_name?: string };
export type Reservation = Tables<"reservations">;
export type Profile = Tables<"profiles">;

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: Record<number, number>;
}

// ============ Sanitization Helper ============
// SECURITY AUDIT: Sanitize all user-generated text to prevent XSS
function sanitizeText(text: string): string {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] }).trim();
}

// ============ Menu API ============
export const menuApi = {
  async getMenuItems(category?: string): Promise<MenuItem[]> {
    let query = supabase
      .from("menus")
      .select("*")
      .eq("is_available", true)
      .order("sort_order", { ascending: true });

    if (category) {
      query = query.eq("category", category as MenuItem["category"]);
    }

    const { data, error } = await query;
    // SECURITY AUDIT: Never expose raw DB errors to client
    if (error) throw new Error("ไม่สามารถโหลดเมนูได้");
    return data || [];
  },

  async getMonthlySpecial(): Promise<MenuItem | null> {
    const { data, error } = await supabase
      .from("menus")
      .select("*")
      .eq("is_monthly_special", true)
      .eq("is_available", true)
      .limit(1)
      .maybeSingle();

    if (error) return null;
    return data;
  },

  // SECURITY AUDIT: Admin-only operations protected by RLS
  async createMenuItem(item: TablesInsert<"menus">): Promise<MenuItem> {
    const { data, error } = await supabase
      .from("menus")
      .insert(item)
      .select()
      .single();
    if (error) throw new Error("ไม่สามารถเพิ่มเมนูได้");
    return data;
  },

  async updateMenuItem(id: string, updates: Partial<TablesInsert<"menus">>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from("menus")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error("ไม่สามารถอัพเดทเมนูได้");
    return data;
  },

  async deleteMenuItem(id: string): Promise<void> {
    const { error } = await supabase.from("menus").delete().eq("id", id);
    if (error) throw new Error("ไม่สามารถลบเมนูได้");
  },
};

// ============ Review API ============
export const reviewApi = {
  async getApprovedReviews(): Promise<Review[]> {
    const { data, error } = await supabase
      .from("reviews")
      .select("*, profiles!inner(display_name)")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw new Error("ไม่สามารถโหลดรีวิวได้");
    return (data || []).map((r: any) => ({
      ...r,
      user_name: r.profiles?.display_name || "Anonymous",
    }));
  },

  async getStats(): Promise<ReviewStats> {
    const { data, error } = await supabase
      .from("reviews")
      .select("rating")
      .eq("status", "approved");

    if (error || !data) {
      return { average_rating: 0, total_reviews: 0, rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    }

    const total = data.length;
    const avg = total > 0 ? data.reduce((s, r) => s + r.rating, 0) / total : 0;
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    data.forEach((r) => dist[r.rating]++);
    return { average_rating: Math.round(avg * 10) / 10, total_reviews: total, rating_distribution: dist };
  },

  // SECURITY AUDIT: user_id set from auth.uid() via RLS, comment sanitized
  async createReview(data: { rating: number; comment: string }): Promise<Review> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("กรุณาเข้าสู่ระบบก่อนเขียนรีวิว");

    const sanitizedComment = sanitizeText(data.comment);

    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        rating: data.rating,
        comment: sanitizedComment,
      })
      .select()
      .single();

    if (error) throw new Error("ส่งรีวิวไม่สำเร็จ กรุณาลองใหม่");
    return review;
  },

  // Admin functions
  async getAllReviews(): Promise<Review[]> {
    const { data, error } = await supabase
      .from("reviews")
      .select("*, profiles!inner(display_name)")
      .order("created_at", { ascending: false });

    if (error) throw new Error("ไม่สามารถโหลดรีวิวได้");
    return (data || []).map((r: any) => ({
      ...r,
      user_name: r.profiles?.display_name || "Anonymous",
    }));
  },

  async updateReviewStatus(id: string, status: "approved" | "hidden" | "pending"): Promise<void> {
    const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
    if (error) throw new Error("อัพเดทสถานะไม่สำเร็จ");
  },

  async replyToReview(id: string, reply: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    const sanitizedReply = sanitizeText(reply);
    const { error } = await supabase.from("reviews").update({
      admin_reply: sanitizedReply,
      admin_reply_at: new Date().toISOString(),
      admin_reply_by: user?.id,
    }).eq("id", id);
    if (error) throw new Error("ตอบกลับไม่สำเร็จ");
  },
};

// ============ Reservation API ============
export const reservationApi = {
  async create(data: {
    name: string;
    phone: string;
    guests: number;
    date: string;
    time: string;
    seating: "bar" | "table" | "private";
  }): Promise<Reservation> {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: reservation, error } = await supabase
      .from("reservations")
      .insert({
        ...data,
        user_id: user?.id || null,
        name: sanitizeText(data.name),
        phone: sanitizeText(data.phone),
      })
      .select()
      .single();

    if (error) throw new Error("จองโต๊ะไม่สำเร็จ กรุณาลองใหม่");
    return reservation;
  },

  async getMyReservations(): Promise<Reservation[]> {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("date", { ascending: false });

    if (error) return [];
    return data || [];
  },

  async getAllReservations(): Promise<Reservation[]> {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw new Error("ไม่สามารถโหลดการจองได้");
    return data || [];
  },

  async updateStatus(id: string, status: "confirmed" | "cancelled" | "completed"): Promise<void> {
    const { error } = await supabase.from("reservations").update({ status }).eq("id", id);
    if (error) throw new Error("อัพเดทสถานะไม่สำเร็จ");
  },
};
