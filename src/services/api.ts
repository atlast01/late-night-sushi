/**
 * API Service Layer for Rako Sushi
 * 
 * ใช้ Mock Data ตอนนี้ — เมื่อ Backend (FastAPI) พร้อม
 * เพียงเปลี่ยน API_BASE_URL และเอา mock functions ออก
 * ระบบจะเชื่อมต่อ API จริงได้ทันที
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// ============ Types ============

export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin";
  phone?: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface MenuItem {
  id: string;
  name: string;
  name_jp?: string;
  description: string;
  price: number;
  image_url: string;
  category: "sushi" | "izakaya" | "ramen" | "drinks";
  badge?: string;
  is_available: boolean;
  is_monthly_special: boolean;
  created_at: string;
}

export interface MonthlySpecial {
  id: string;
  menu_item: MenuItem;
  month: string; // "2026-02"
  description_long: string;
  price_display: string;
}

export interface Reservation {
  id: string;
  user_id?: string;
  name: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  seating: "bar" | "table" | "private";
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  admin_reply?: string;
  is_approved: boolean;
  created_at: string;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: Record<number, number>;
}

// ============ Mock Data ============

const MOCK_USERS: User[] = [
  { id: "1", email: "admin@rakosushi.com", name: "Rako Admin", role: "admin", created_at: "2026-01-01" },
  { id: "2", email: "tanaka@example.com", name: "Tanaka Yuki", role: "customer", phone: "081-234-5678", created_at: "2026-01-15" },
];

const MOCK_REVIEWS: Review[] = [
  {
    id: "r1", user_id: "2", user_name: "Tanaka Y.", rating: 5,
    comment: "ซูชิสดมากกก โอโทโร่ละลายในปาก ร้านบรรยากาศดีมากครับ จะกลับมาอีกแน่นอน",
    admin_reply: "ขอบคุณมากครับ ยินดีต้อนรับทุกครั้งเลยครับ 🙏",
    is_approved: true, created_at: "2026-02-20T23:30:00",
  },
  {
    id: "r2", user_id: "3", user_name: "Lisa M.", rating: 4,
    comment: "อาหารอร่อยมาก สาเกก็ดี แต่ต้องรอนานนิดนึงเพราะคนเยอะ",
    admin_reply: "ขออภัยเรื่องเวลารอครับ 🙇 แนะนำให้จองโต๊ะล่วงหน้าได้เลยครับ",
    is_approved: true, created_at: "2026-02-18T01:15:00",
  },
  {
    id: "r3", user_id: "4", user_name: "สมชาย ก.", rating: 5,
    comment: "มาทุกอาทิตย์เลยครับ ราเมงร้อนๆ ตอนตี 2 นี่คือสุดยอด!",
    is_approved: true, created_at: "2026-02-15T02:00:00",
  },
  {
    id: "r4", user_id: "5", user_name: "Mika S.", rating: 5,
    comment: "Best late-night sushi in Bangkok! The omakase is a must-try.",
    admin_reply: "Thank you so much Mika! See you again soon 🍣",
    is_approved: true, created_at: "2026-02-10T00:45:00",
  },
  {
    id: "r5", user_id: "6", user_name: "พิชญา ว.", rating: 3,
    comment: "อาหารอร่อย แต่ราคาค่อนข้างสูงเมื่อเทียบกับปริมาณ",
    is_approved: true, created_at: "2026-02-05T22:00:00",
  },
];

const MOCK_RESERVATIONS: Reservation[] = [];

// ============ Helper ============

let mockToken: string | null = localStorage.getItem("rako_token");
let mockCurrentUser: User | null = mockToken ? JSON.parse(localStorage.getItem("rako_user") || "null") : null;

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // When API_BASE_URL is set, use real API
  if (API_BASE_URL) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(mockToken ? { Authorization: `Bearer ${mockToken}` } : {}),
        ...options?.headers,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || "API Error");
    }
    return res.json();
  }

  // Mock delay
  await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
  throw new Error("MOCK_FALLTHROUGH");
}

// ============ Auth API ============

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      return await apiFetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    } catch {
      // Mock login
      await new Promise((r) => setTimeout(r, 600));
      const user = MOCK_USERS.find((u) => u.email === email);
      if (!user) {
        // Create mock user on login for demo
      const newUser: User = {
          id: crypto.randomUUID(),
          email,
          name: email.split("@")[0],
          role: "customer",
          created_at: new Date().toISOString(),
        };
        const token = "mock_token_" + newUser.id;
        mockToken = token;
        mockCurrentUser = newUser;
        localStorage.setItem("rako_token", token);
        localStorage.setItem("rako_user", JSON.stringify(newUser));
        return { user: newUser, token };
      }
      const token = "mock_token_" + user.id;
      mockToken = token;
      mockCurrentUser = user;
      localStorage.setItem("rako_token", token);
      localStorage.setItem("rako_user", JSON.stringify(user));
      return { user, token };
    }
  },

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      return await apiFetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      });
    } catch {
      await new Promise((r) => setTimeout(r, 600));
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        name,
        role: "customer",
        created_at: new Date().toISOString(),
      };
      const token = "mock_token_" + newUser.id;
      mockToken = token;
      mockCurrentUser = newUser;
      localStorage.setItem("rako_token", token);
      localStorage.setItem("rako_user", JSON.stringify(newUser));
      return { user: newUser, token };
    }
  },

  logout() {
    mockToken = null;
    mockCurrentUser = null;
    localStorage.removeItem("rako_token");
    localStorage.removeItem("rako_user");
  },

  getCurrentUser(): User | null {
    return mockCurrentUser;
  },
};

// ============ Menu API ============

export const menuApi = {
  async getMenuItems(category?: string): Promise<MenuItem[]> {
    try {
      const q = category ? `?category=${category}` : "";
      return await apiFetch<MenuItem[]>(`/api/menus${q}`);
    } catch {
      // Return empty — hardcoded data stays in MenuPage for now
      return [];
    }
  },

  async getMonthlySpecial(): Promise<MonthlySpecial | null> {
    try {
      return await apiFetch<MonthlySpecial>("/api/menus/monthly-special");
    } catch {
      return null;
    }
  },
};

// ============ Reservation API ============

export const reservationApi = {
  async create(data: Omit<Reservation, "id" | "status" | "created_at" | "user_id">): Promise<Reservation> {
    try {
      return await apiFetch<Reservation>("/api/reservations", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch {
      await new Promise((r) => setTimeout(r, 600));
      const reservation: Reservation = {
        ...data,
        id: crypto.randomUUID(),
        user_id: mockCurrentUser?.id,
        status: "pending",
        created_at: new Date().toISOString(),
      };
      MOCK_RESERVATIONS.push(reservation);
      return reservation;
    }
  },

  async getMyReservations(): Promise<Reservation[]> {
    try {
      return await apiFetch<Reservation[]>("/api/reservations/me");
    } catch {
      return MOCK_RESERVATIONS.filter((r) => r.user_id === mockCurrentUser?.id);
    }
  },
};

// ============ Review API ============

export const reviewApi = {
  async getReviews(): Promise<Review[]> {
    try {
      return await apiFetch<Review[]>("/api/reviews");
    } catch {
      return MOCK_REVIEWS.filter((r) => r.is_approved);
    }
  },

  async getStats(): Promise<ReviewStats> {
    try {
      return await apiFetch<ReviewStats>("/api/reviews/stats");
    } catch {
      const approved = MOCK_REVIEWS.filter((r) => r.is_approved);
      const total = approved.length;
      const avg = approved.reduce((s, r) => s + r.rating, 0) / total;
      const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      approved.forEach((r) => dist[r.rating]++);
      return { average_rating: Math.round(avg * 10) / 10, total_reviews: total, rating_distribution: dist };
    }
  },

  async createReview(data: { rating: number; comment: string }): Promise<Review> {
    try {
      return await apiFetch<Review>("/api/reviews", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch {
      await new Promise((r) => setTimeout(r, 600));
      if (!mockCurrentUser) throw new Error("กรุณาเข้าสู่ระบบก่อนเขียนรีวิว");
      const review: Review = {
        id: crypto.randomUUID(),
        user_id: mockCurrentUser.id,
        user_name: mockCurrentUser.name,
        rating: data.rating,
        comment: data.comment,
        is_approved: true, // auto-approve in mock
        created_at: new Date().toISOString(),
      };
      MOCK_REVIEWS.unshift(review);
      return review;
    }
  },
};
