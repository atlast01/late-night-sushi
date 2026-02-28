import { useState, useEffect } from "react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollAnimate from "@/components/ScrollAnimate";
import { useAuth } from "@/contexts/AuthContext";
import { reviewApi, type Review, type ReviewStats } from "@/services/api";
import { Star, MessageCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";

const reviewSchema = z.object({
  rating: z.number().int().min(1, "กรุณาให้คะแนนอย่างน้อย 1 ดาว").max(5, "คะแนนสูงสุด 5 ดาว"),
  comment: z.string()
    .trim()
    .min(1, "กรุณาเขียนรีวิว")
    .max(1000, "รีวิวต้องไม่เกิน 1,000 ตัวอักษร"),
});

const StarRating = ({
  value,
  onChange,
  readonly = false,
  size = 20,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: number;
}) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        disabled={readonly}
        onClick={() => onChange?.(s)}
        className={`transition-colors ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
      >
        <Star
          size={size}
          className={s <= value ? "fill-gold text-gold" : "text-muted-foreground/30"}
        />
      </button>
    ))}
  </div>
);

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="bg-card border border-border rounded-sm p-6 hover:border-primary/30 transition-colors">
    <div className="flex items-start justify-between mb-3">
      <div>
        <p className="font-body text-foreground font-medium text-sm">{review.user_name}</p>
        <p className="font-body text-muted-foreground text-xs mt-0.5">
          {new Date(review.created_at).toLocaleDateString("th-TH", {
            year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </div>
      <StarRating value={review.rating} readonly size={14} />
    </div>
    <p className="font-body text-foreground/90 text-sm leading-relaxed">{review.comment}</p>
    {review.admin_reply && (
      <div className="mt-4 pl-4 border-l-2 border-primary/40">
        <p className="font-body text-xs text-primary tracking-wider uppercase mb-1">
          Rako Sushi ตอบกลับ
        </p>
        <p className="font-body text-muted-foreground text-sm italic">{review.admin_reply}</p>
      </div>
    )}
  </div>
);

const ReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    reviewApi.getReviews().then(setReviews);
    reviewApi.getStats().then(setStats);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const result = reviewSchema.safeParse({ rating, comment: comment.trim() });
    if (!result.success) {
      setFormError(result.error.errors[0]?.message || "ข้อมูลไม่ถูกต้อง");
      return;
    }

    setSubmitting(true);
    try {
      await reviewApi.createReview({ rating: result.data.rating, comment: result.data.comment });
      setComment("");
      setRating(5);
      setShowForm(false);
      setFormError("");
      const [r, s] = await Promise.all([reviewApi.getReviews(), reviewApi.getStats()]);
      setReviews(r);
      setStats(s);
    } catch (err: any) {
      setFormError(err.message || "ส่งรีวิวไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-16 md:pt-36">
        <div className="container mx-auto px-4 max-w-3xl">
          <ScrollAnimate>
            <div className="text-center mb-12">
              <p className="font-body text-primary text-sm tracking-[0.3em] uppercase mb-4">
                Customer Reviews
              </p>
              <h1 className="font-heading text-4xl md:text-5xl text-foreground tracking-wider mb-6">
                What They Say
              </h1>

              {/* Stats */}
              {stats && (
                <div className="flex flex-col items-center gap-3 mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-5xl text-foreground">{stats.average_rating}</span>
                    <span className="font-body text-muted-foreground text-sm">/ 5</span>
                  </div>
                  <StarRating value={Math.round(stats.average_rating)} readonly size={24} />
                  <p className="font-body text-muted-foreground text-sm">
                    จาก {stats.total_reviews} รีวิว
                  </p>
                </div>
              )}

              {/* CTA */}
              {user ? (
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-body text-sm tracking-[0.2em] uppercase rounded-sm hover:bg-brand-red-glow transition-colors"
                >
                  <MessageCircle size={16} />
                  {showForm ? "ยกเลิก" : "เขียนรีวิว"}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-3 border border-primary text-primary font-body text-sm tracking-[0.2em] uppercase rounded-sm hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  เข้าสู่ระบบเพื่อเขียนรีวิว
                </Link>
              )}
            </div>
          </ScrollAnimate>

          {/* Write Review Form */}
          {showForm && user && (
            <ScrollAnimate>
              <form onSubmit={handleSubmit} className="bg-card border border-primary/30 rounded-sm p-6 mb-10">
                {formError && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-sm px-4 py-3 text-sm text-destructive font-body mb-4">
                    {formError}
                  </div>
                )}
                <div className="flex items-center gap-4 mb-4">
                  <p className="font-body text-sm text-muted-foreground">ให้คะแนน:</p>
                  <StarRating value={rating} onChange={setRating} size={28} />
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="เล่าประสบการณ์ของคุณ..."
                  rows={4}
                  required
                  maxLength={1000}
                  className="w-full bg-secondary border border-border rounded-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none mb-1"
                />
                <p className="font-body text-xs text-muted-foreground mb-4 text-right">
                  {comment.length}/1,000
                </p>
                <button
                  type="submit"
                  disabled={submitting || !comment.trim()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body text-sm tracking-[0.15em] uppercase rounded-sm hover:bg-brand-red-glow transition-colors disabled:opacity-50"
                >
                  <Send size={14} />
                  {submitting ? "กำลังส่ง..." : "ส่งรีวิว"}
                </button>
              </form>
            </ScrollAnimate>
          )}

          {/* Reviews Feed */}
          <div className="flex flex-col gap-4">
            {reviews.map((r, i) => (
              <ScrollAnimate key={r.id} delay={i * 80}>
                <ReviewCard review={r} />
              </ScrollAnimate>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ReviewsPage;
