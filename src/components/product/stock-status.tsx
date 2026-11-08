import type { StockState } from "@/lib/catalog";

const tone: Record<StockState["status"], { dot: string; text: string }> = {
  in_stock: { dot: "bg-success", text: "text-ink" },
  low_stock: { dot: "bg-danger", text: "text-danger" },
  out_of_stock: { dot: "bg-subtle", text: "text-muted" },
};

export function StockStatus({ state }: { state: StockState }) {
  const { dot, text } = tone[state.status];
  return (
    <p className={`text-meta flex items-center gap-2 ${text}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-pill ${dot}`} />
      {state.label}
    </p>
  );
}
