"use client";

import { motion } from "framer-motion";

const DAYS = [
  { name: "Lun", num: 2 },
  { name: "Mar", num: 3, today: true },
  { name: "Mié", num: 4 },
  { name: "Jue", num: 5 },
  { name: "Vie", num: 6 },
  { name: "Sáb", num: 7 },
  { name: "Dom", num: 8 },
];

export default function Semana() {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-7">
        <p className="text-[11px] text-muted-rose uppercase tracking-widest mb-1">Semana del 3 al 9 de marzo</p>
        <h1 className="font-playfair italic text-deep-rose text-3xl leading-tight mb-1">Esta semana 📅</h1>
        <p className="text-[12px] text-muted-rose">Un vistazo a tus días</p>
      </div>

      <div className="card mb-4">
        <h2 className="font-playfair text-deep-rose text-sm font-semibold mb-4 flex items-center gap-2">
          <span>📅</span> Vista semanal
        </h2>
        <div className="flex gap-2 flex-wrap">
          {DAYS.map((d) => (
            <div
              key={d.num}
              className={`
                flex-1 min-w-[60px] bg-white/70 rounded-2xl p-3 text-center
                ${d.today ? "border-2 border-accent-pink" : "border border-accent-pink/20"}
              `}
            >
              <p className="text-[10px] text-muted-rose mb-1">{d.name}</p>
              <p className={`font-playfair text-xl ${d.today ? "text-deep-rose" : "text-soft"}`}>{d.num}</p>
              <p className="text-lg mt-1">{d.today ? "🌸" : "—"}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card opacity-70">
        <h2 className="font-playfair text-deep-rose text-sm font-semibold mb-2 flex items-center gap-2">
          <span>📊</span> Resumen semanal
        </h2>
        <p className="text-[13px] text-muted-rose italic">
          Completa los días para ver tu resumen aquí ✨
        </p>
      </div>
    </motion.div>
  );
}