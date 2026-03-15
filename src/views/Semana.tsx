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
        <p className="text-[11px] uppercase tracking-[0.3em] mb-2" style={{ color:"var(--color-soft-text)" }}>Semana del 3 al 9 de marzo</p>
        <h1 className="font-playfair italic text-[#e11d74] text-4xl leading-tight mb-2">Esta semana 📅</h1>
        <p className="text-[12px] opacity-60" style={{ color:"var(--color-soft-text)" }}>Un vistazo a tus días</p>
      </div>

      <div className="card-premium p-8 mb-6">
        <h2 className="font-playfair text-[#e11d74] text-xl font-semibold mb-6 flex items-center gap-3">
          <span>📅</span> Vista semanal
        </h2>
        <div className="flex gap-3 flex-wrap">
          {DAYS.map((d) => (
            <div
              key={d.num}
              className={`
                flex-1 min-w-[70px] rounded-3xl p-4 text-center transition-all
                bg-white/60 backdrop-blur-md journal-shadow
                ${d.today ? "border-2 border-[#e11d74]" : "border border-white/40"}
              `}
            >
              <p className="text-[10px] font-black uppercase tracking-widest mb-1.5 opacity-60" style={{ color:"var(--color-soft-text)" }}>{d.name}</p>
              <p className={`font-playfair text-2xl font-bold ${d.today ? "text-[#e11d74]" : "text-[#1d1d1f]"}`}>{d.num}</p>
              <p className="text-xl mt-2">{d.today ? "🌸" : "—"}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card-premium p-8 opacity-80">
        <h2 className="font-playfair text-[#e11d74] text-xl font-semibold mb-3 flex items-center gap-3">
          <span>📊</span> Resumen semanal
        </h2>
        <p className="text-sm italic opacity-60" style={{ color:"var(--color-soft-text)" }}>
          Completa los días para ver tu resumen aquí ✨
        </p>
      </div>
    </motion.div>
  );
}