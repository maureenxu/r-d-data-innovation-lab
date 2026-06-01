import { InsightCard as InsightCardType, InsightType } from "@/lib/types";

const TYPE_STYLES: Record<InsightType, { badge: string; border: string }> = {
  pain_point:  { badge: "bg-red-100 text-red-700",    border: "border-red-200" },
  unmet_need:  { badge: "bg-green-100 text-green-700", border: "border-green-200" },
  constraint:  { badge: "bg-amber-100 text-amber-700", border: "border-amber-200" },
  opportunity: { badge: "bg-purple-100 text-purple-700", border: "border-purple-200" },
};

const TYPE_LABELS: Record<InsightType, string> = {
  pain_point:  "Pain point",
  unmet_need:  "Unmet need",
  constraint:  "Constraint",
  opportunity: "Opportunity",
};

interface InsightCardProps {
  card: InsightCardType;
}

export default function InsightCard({ card }: InsightCardProps) {
  const styles = TYPE_STYLES[card.type] ?? TYPE_STYLES.pain_point;
  return (
    <div className={`bg-white rounded-xl border ${styles.border} p-4 flex flex-col gap-2 shadow-sm`}>
      <span className={`self-start px-2 py-0.5 rounded-full text-xs font-semibold ${styles.badge}`}>
        {TYPE_LABELS[card.type] ?? card.type}
      </span>
      <h3 className="text-sm font-semibold text-gray-900 leading-snug">{card.title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{card.body}</p>
    </div>
  );
}
