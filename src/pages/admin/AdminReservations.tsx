import { useState, useEffect } from "react";
import { reservationApi, type Reservation } from "@/services/api";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const AdminReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await reservationApi.getAllReservations();
      setReservations(data);
    } catch { /* handled */ }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatus = async (id: string, status: "confirmed" | "cancelled" | "completed") => {
    try {
      await reservationApi.updateStatus(id, status);
      fetchData();
    } catch { /* handled */ }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "confirmed": return "bg-green-900/30 text-green-400";
      case "cancelled": return "bg-destructive/20 text-destructive";
      case "completed": return "bg-primary/20 text-primary";
      default: return "bg-warm-amber/20 text-warm-amber";
    }
  };

  return (
    <div>
      <h1 className="font-heading text-3xl text-foreground tracking-wider mb-8">Reservations</h1>

      {loading ? (
        <p className="text-muted-foreground font-body">Loading...</p>
      ) : reservations.length === 0 ? (
        <div className="bg-card border border-border rounded-sm p-12 text-center">
          <p className="text-muted-foreground font-body">ยังไม่มีการจอง</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider">Phone</th>
                  <th className="text-left px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider">Date & Time</th>
                  <th className="text-left px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider">Guests</th>
                  <th className="text-left px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider">Seating</th>
                  <th className="text-left px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 font-body text-xs text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-3 font-body text-sm text-foreground">{r.name}</td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground">{r.phone}</td>
                    <td className="px-4 py-3 font-body text-sm text-foreground">{r.date} • {r.time}</td>
                    <td className="px-4 py-3 font-body text-sm text-foreground">{r.guests}</td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground capitalize">{r.seating}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 font-body text-xs rounded-sm capitalize ${statusColor(r.status)}`}>{r.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {r.status === "pending" && (
                          <>
                            <button onClick={() => handleStatus(r.id, "confirmed")} className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-sm" title="Confirm"><CheckCircle size={14} /></button>
                            <button onClick={() => handleStatus(r.id, "cancelled")} className="p-1.5 text-destructive hover:bg-destructive/10 rounded-sm" title="Cancel"><XCircle size={14} /></button>
                          </>
                        )}
                        {r.status === "confirmed" && (
                          <button onClick={() => handleStatus(r.id, "completed")} className="p-1.5 text-primary hover:bg-primary/10 rounded-sm" title="Complete"><Clock size={14} /></button>
                        )}
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

export default AdminReservations;
