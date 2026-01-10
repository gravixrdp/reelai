type Status = "queued" | "processing" | "scheduled" | "ready";

const palette: Record<Status, string> = {
  queued: "bg-white/10 text-white",
  processing: "bg-[#A4B4FF]/20 text-[#A4B4FF]",
  scheduled: "bg-[#F6C177]/15 text-[#F6C177]",
  ready: "bg-white/10 text-white",
};

export function QueueTimeline({ items }: { items: { title: string; eta: string; status: Status }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-white/12 to-white/0" />
          <span className={`rounded-full px-3 py-1 text-[11px] ${palette[item.status]}`}>{item.status}</span>
          <div className="flex-1">
            <p className="text-sm text-white">{item.title}</p>
            <p className="text-xs text-white/50">ETA {item.eta}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
