import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  RESERVED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  GUESTS_ADDED: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  PAYMENT_PENDING: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  CONFIRMED: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  CANCELLED: "bg-rose-100 text-rose-800 hover:bg-rose-100",
  EXPIRED: "bg-gray-200 text-gray-700 hover:bg-gray-200",
  ACTIVE: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  INACTIVE: "bg-gray-200 text-gray-700 hover:bg-gray-200",
};

export function StatusBadge({ status }: { status?: string | null }) {
  const key = (status || "UNKNOWN").toUpperCase();
  return <Badge className={cn("font-medium", styles[key] ?? "bg-muted text-foreground")}>{key.replace(/_/g, " ")}</Badge>;
}
