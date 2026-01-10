import { motion } from "framer-motion";

export function ReelCard({ title, duration, status, gradient }: { title: string; duration: string; status: string; gradient: string }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A0D12]"
    >
      <div className="aspect-[9/16]" style={{ backgroundImage: gradient }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-90" />
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1">
        <p className="text-sm font-semibold text-white">{title}</p>
        <div className="flex items-center justify-between text-xs text-white/65">
          <span>{duration}</span>
          <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[11px]">{status}</span>
        </div>
      </div>
    </motion.div>
  );
}
