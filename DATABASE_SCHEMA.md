# 🗄️ Rako Sushi — Database Schema (FastAPI + PostgreSQL)

## ER Diagram Overview

```
Users ─┬─< Reservations
       ├─< Reviews ─< AdminReplies (embedded)
       └─< UserRoles

Menus ─── Categories (enum)
```

---

## 1. Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

## 2. User Roles Table (สำคัญ — แยกจาก Users เพื่อป้องกัน Privilege Escalation)

```sql
CREATE TYPE app_role AS ENUM ('customer', 'admin', 'manager');

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
```

## 3. Menu Categories

```sql
CREATE TYPE menu_category AS ENUM ('sushi', 'izakaya', 'ramen', 'drinks');
```

## 4. Menus Table

```sql
CREATE TABLE menus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    name_jp VARCHAR(100),
    name_th VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    category menu_category NOT NULL,
    badge VARCHAR(50),  -- 'Chef''s Pick', 'Best Seller', 'Spicy', 'New', 'Premium'
    is_available BOOLEAN DEFAULT TRUE,
    is_monthly_special BOOLEAN DEFAULT FALSE,
    monthly_special_month VARCHAR(7),  -- '2026-02' format
    monthly_special_description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_menus_category ON menus(category);
CREATE INDEX idx_menus_monthly_special ON menus(is_monthly_special) WHERE is_monthly_special = TRUE;
```

## 5. Reservations Table

```sql
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE seating_type AS ENUM ('bar', 'table', 'private');

CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    guests INTEGER NOT NULL CHECK (guests > 0 AND guests <= 20),
    date DATE NOT NULL,
    time TIME NOT NULL,
    seating seating_type NOT NULL DEFAULT 'table',
    status reservation_status NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reservations_date ON reservations(date);
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_status ON reservations(status);
```

## 6. Reviews Table

```sql
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'hidden', 'deleted');

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL CHECK (char_length(comment) <= 1000),
    admin_reply TEXT,
    admin_reply_at TIMESTAMP WITH TIME ZONE,
    admin_reply_by UUID REFERENCES users(id),
    status review_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

---

## 🔑 FastAPI Endpoints Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | สมัครสมาชิก |
| POST | `/api/auth/login` | ❌ | เข้าสู่ระบบ (JWT) |
| GET | `/api/auth/me` | ✅ | ดูข้อมูลผู้ใช้ |
| GET | `/api/menus` | ❌ | ดูเมนูทั้งหมด (?category=sushi) |
| GET | `/api/menus/monthly-special` | ❌ | ดูเมนูประจำเดือน |
| POST | `/api/menus` | 🔒 Admin | เพิ่มเมนู |
| PUT | `/api/menus/:id` | 🔒 Admin | แก้ไขเมนู |
| DELETE | `/api/menus/:id` | 🔒 Admin | ลบเมนู |
| POST | `/api/reservations` | ❌ | จองโต๊ะ |
| GET | `/api/reservations/me` | ✅ | ดูประวัติการจอง |
| GET | `/api/reservations` | 🔒 Admin | ดูการจองทั้งหมด |
| PATCH | `/api/reservations/:id` | 🔒 Admin | อัพเดทสถานะ |
| GET | `/api/reviews` | ❌ | ดูรีวิว (approved) |
| GET | `/api/reviews/stats` | ❌ | ดูคะแนนเฉลี่ย |
| POST | `/api/reviews` | ✅ | เขียนรีวิว |
| GET | `/api/admin/reviews` | 🔒 Admin | ดูรีวิวทั้งหมด |
| PATCH | `/api/admin/reviews/:id` | 🔒 Admin | ตอบกลับ/approve/hide |

---

## 🐍 FastAPI Pydantic Models (ตัวอย่าง)

```python
from pydantic import BaseModel, EmailStr
from datetime import date, time, datetime
from enum import Enum
from uuid import UUID

class MenuCategory(str, Enum):
    sushi = "sushi"
    izakaya = "izakaya"
    ramen = "ramen"
    drinks = "drinks"

class MenuCreate(BaseModel):
    name: str
    name_jp: str | None = None
    description: str | None = None
    price: float
    category: MenuCategory
    badge: str | None = None
    is_monthly_special: bool = False

class ReservationCreate(BaseModel):
    name: str
    phone: str
    guests: int
    date: date
    time: time
    seating: str = "table"

class ReviewCreate(BaseModel):
    rating: int  # 1-5
    comment: str  # max 1000 chars
```

---

## 🚀 Quick Start

```bash
# 1. Setup PostgreSQL
createdb rako_sushi

# 2. Run migrations
psql -d rako_sushi -f schema.sql

# 3. Start FastAPI
uvicorn main:app --reload --port 8000

# 4. Connect Frontend
# Set VITE_API_BASE_URL=http://localhost:8000 in .env
```
