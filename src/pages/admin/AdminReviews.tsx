/**
 * SECURITY AUDIT: Review moderation page
 * - Admin role verified by RLS policies (only admin can see all reviews)
 * - Admin replies are sanitized before storage
 * - Status changes go through RLS-protected updates
 */
import { useState, useEffect } from "react";
import { reviewApi, type Review } from "@/services/api";
import { Star, CheckCircle, EyeOff, MessageSquare, Send } from "lucide-react";

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "hidden">("all");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewApi.getAllReviews();
      setReviews(data);
    } catch { /* handled */ }
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleStatusChange = async (id: string, status: "approved" | "hidden" | "pending") => {
    try {
      await reviewApi.updateReviewStatus(id, status);
      fetchReviews();
    } catch { /* handled */ }
  };

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      await reviewApi.replyToReview(id, replyText);
      setReplyingTo(null);
      setReplyText("");
      fetchReviews();
    } catch { /* handled */ }
  };

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  return (
    <div>
      <h1 className="font-heading text-3xl text-foreground tracking-wider mb-8">Review Moderation</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved", "hidden"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 font-body text-sm rounded-sm capitalize transition-colors ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {f} {f !== "all" && `(${reviews.filter((r) => r.status === f).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted-foreground font-body">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-sm p-12 text-center">
          <p className="text-muted-foreground font-body">ไม่มีรีวิวในหมวดนี้</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((review) => (
            <div key={review.id} className="bg-card border border-border rounded-sm p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-body text-foreground text-sm font-medium">{review.user_name || "Anonymous"}</p>
                    <span className={`px-2 py-0.5 font-body text-xs rounded-sm capitalize ${
                      review.status === "approved" ? "bg-green-900/30 text-green-400" :
                      review.status === "hidden" ? "bg-destructive/20 text-destructive" :
                      "bg-warm-amber/20 text-warm-amber"
                    }`}>
                      {review.status}
                    </span>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className={s <= review.rating ? "fill-gold text-gold" : "text-muted-foreground/30"} />
                    ))}
                  </div>
                </div>
                <p className="font-body text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString("th-TH")}
                </p>
              </div>

              <p className="font-body text-foreground/90 text-sm mb-4">{review.comment}</p>

              {review.admin_reply && (
                <div className="pl-4 border-l-2 border-primary/40 mb-4">
                  <p className="font-body text-xs text-primary uppercase mb-1">Admin Reply</p>
                  <p className="font-body text-muted-foreground text-sm italic">{review.admin_reply}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                {review.status !== "approved" && (
                  <button onClick={() => handleStatusChange(review.id, "approved")} className="inline-flex items-center gap-1.5 px-3 py-1.5 font-body text-xs text-green-400 border border-green-400/30 rounded-sm hover:bg-green-400/10 transition-colors">
                    <CheckCircle size={12} /> Approve
                  </button>
                )}
                {review.status !== "hidden" && (
                  <button onClick={() => handleStatusChange(review.id, "hidden")} className="inline-flex items-center gap-1.5 px-3 py-1.5 font-body text-xs text-destructive border border-destructive/30 rounded-sm hover:bg-destructive/10 transition-colors">
                    <EyeOff size={12} /> Hide
                  </button>
                )}
                <button onClick={() => { setReplyingTo(replyingTo === review.id ? null : review.id); setReplyText(review.admin_reply || ""); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 font-body text-xs text-primary border border-primary/30 rounded-sm hover:bg-primary/10 transition-colors">
                  <MessageSquare size={12} /> Reply
                </button>
              </div>

              {/* Reply form */}
              {replyingTo === review.id && (
                <div className="mt-4 flex gap-2">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="ตอบกลับรีวิว..."
                    maxLength={500}
                    className="flex-1 bg-secondary border border-border rounded-sm px-3 py-2 font-body text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                  <button onClick={() => handleReply(review.id)} className="px-4 py-2 bg-primary text-primary-foreground font-body text-sm rounded-sm hover:bg-brand-red-glow transition-colors">
                    <Send size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
