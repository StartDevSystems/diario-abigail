"use client";
import React, { useState, useEffect, useRef } from "react";
import { useJournal } from "../context/JournalContext";
import { Plus, Check, Trash2, Edit2, Save, X, Flame, Star, TrendingUp, Calendar, Sparkles, Search } from "lucide-react";

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

/* ════════════════════════════════════════════════
   EMOJI PICKER — COMPLETO
════════════════════════════════════════════════ */
const EMOJI_CATEGORIES = [
  { label: "😀 Caras",    emojis: ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥸","😎","🤓","🧐","😕","😟","🙁","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖"] },
  { label: "👋 Gestos",   emojis: ["👋","🤚","🖐","✋","🖖","👌","🤌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏","✍️","💅","🤳","💪","🦾","🦵","🦶","👂","🦻","👃","🧠","👀","👁","👅","👄","💋"] },
  { label: "👩 Personas", emojis: ["👶","🧒","👦","👧","🧑","👱","👨","🧔","👩","🧓","👴","👵","🙍","🙎","🙅","🙆","💁","🙋","🧏","🙇","🤦","🤷","👮","🕵️","💂","🥷","👷","🤴","👸","👳","👲","🧕","🤵","👰","🤰","🤱","👼","🎅","🤶","🧙","🧝","🧛","🧟","🧞","🧜","🧚","👫","👬","👭","💏","💑","👪"] },
  { label: "🐶 Animales", emojis: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐔","🐧","🐦","🐤","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🦋","🐌","🐞","🐜","🐢","🐍","🦎","🐙","🦑","🐡","🐠","🐟","🐬","🐳","🐋","鲨","🦭","🐊","🐘","🦒","🦘","🐕","🐈","🐓","🦜","🐇","🦔","🦝","🦦","🐁","🐀","🐿"] },
  { label: "🌸 Naturaleza",emojis: ["🌸","🌺","🌻","🌹","🌷","💐","🌼","🪷","🪻","🌱","🌿","🍀","🍁","🍂","🍃","🪴","🌵","🎋","🍄","🌾","🌍","🌎","🌏","🌋","⛰","🏔","🏕","🏖","🏜","🏝","🌅","🌄","🌠","🌇","🌆","🌃","🌌","🌉","⭐","🌟","💫","✨","☀️","🌤","⛅","☁️","🌧","⛈","🌩","🌨","❄️","☃️","⛄","💨","💧","💦","☔","🌊","🌈"] },
  { label: "🍕 Comida",   emojis: ["🍇","🍈","🍉","🍊","🍋","🍌","🍍","🥭","🍎","🍏","🍐","🍑","🍒","🍓","🫐","🥝","🍅","🥥","🥑","🍆","🥕","🌽","🌶","🥦","🧄","🍞","🥐","🥖","🥨","🧀","🥚","🍳","🥞","🧇","🥓","🥩","🍗","🍖","🌭","🍔","🍟","🍕","🥙","🥗","🍱","🍜","🍝","🍣","🍤","🍦","🍧","🍨","🍩","🍪","🎂","🍰","🧁","🍫","🍬","🍭","☕","🫖","🍵","🧃","🥤","🧋","🍺","🥂","🍷","🍸","🍹","🧉","🍾"] },
  { label: "⚽ Deportes", emojis: ["⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🏓","🏸","🏒","⛳","🏹","🎣","🤿","🥊","🥋","🎽","🛹","🛷","⛸","🎿","⛷","🏂","🪂","🏋","🤸","⛹","🤺","🏇","🧘","🏄","🏊","🤽","🚣","🧗","🚵","🚴","🏆","🥇","🥈","🥉","🏅","🎖","🏵","🎗","🎪","🤹","🎭","🎨","🎬","🎤","🎧","🎵","🎶","🎷","🎸","🎹","🎺","🎻","🥁"] },
  { label: "✈️ Viajes",   emojis: ["🚗","🚕","🚙","🚌","🏎","🚓","🚑","🚒","🚐","🛻","🚚","🚛","🚜","🏍","🛵","🚲","🛴","⛵","🛶","🚤","🛳","🚢","✈️","🛩","🛫","🛬","💺","🚁","🚀","🛸","🏗","🏠","🏡","🏢","🏥","🏦","🏨","🏪","🏫","🏬","🏰","💒","🗼","🗽","⛪","🕌","⛩","🕋","🗺","🧭"] },
  { label: "💡 Objetos",  emojis: ["⌚","📱","💻","🖥","📷","📸","📹","🎥","📞","☎️","📺","📻","⏰","🕰","⌛","⏳","💡","🔦","🕯","💰","💳","💎","⚖️","🧰","🔧","🔩","⚙️","🔑","🗝","🔨","🪓","🛡","🔪","⚔️","🛠","🧲","🚪","🛋","🛁","🧴","🧹","🧺","🧻","🧼","🛒","📦","📫","📬","📭","📮","📝","📋","📌","📍","✂️","🗃","🗑","🔒","🔓","🖊","🖋","✒️","🖌","🖍","📏","📐","🔬","🔭","🩺","💊","🩹","🩼","🧬","🦯","🦽","🦼"] },
  { label: "💖 Símbolos", emojis: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝","💟","☮️","✝️","☪️","🕉","✡️","☯️","☦️","🛐","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","♻️","✅","❌","⭕","🛑","⛔","📛","🚫","💯","❗","❕","❓","❔","‼️","⁉️","🔱","⚜️","🔰","🌀","💤","🏧","♿","🎦","🔞","🔃","🔄","🔙","🔚","🔛","🔜","🔝"] },
];

interface EmojiPickerProps { selected: string; onSelect: (e: string) => void; }

const EmojiPicker: React.FC<EmojiPickerProps> = ({ selected, onSelect }) => {
  const [open,   setOpen]   = useState(false);
  const [cat,    setCat]    = useState(0);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inp = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inp.current?.focus(), 50);
  }, [open]);

  const allEmojis = EMOJI_CATEGORIES.flatMap(c => c.emojis);
  const displayed = search.trim()
    ? allEmojis.filter(e => e.includes(search.trim()))
    : EMOJI_CATEGORIES[cat].emojis;

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      {/* trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        title="Elegir emoji"
        className="transition-all"
        style={{
          width: "56px", height: "56px", borderRadius: "16px",
          border: open ? "2px solid var(--color-theme-primary)" : "1px solid var(--color-theme-border)",
          background: "var(--color-theme-pastel)", fontSize: "1.75rem", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: open ? "0 0 0 3px rgba(225, 29, 116, 0.12)" : "none",
        }}
      >
        {selected}
      </button>

      {open && (
        <div
          className="absolute z-50"
          style={{
            top: "64px", left: 0,
            background: "#fff", borderRadius: "20px",
            border: "1px solid var(--color-theme-border)",
            boxShadow: "0 12px 40px rgba(225, 29, 116, 0.18)",
            width: "320px", overflow: "hidden",
          }}
        >
          {/* búsqueda */}
          <div style={{ padding: "12px 12px 8px", borderBottom: "1px solid var(--color-theme-light)" }}>
            <div style={{ position: "relative" }}>
              <Search size={13} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-theme-muted)" }} />
              <input
                ref={inp} value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar emoji..."
                className="w-full outline-none text-sm"
                style={{
                  padding: "8px 30px 8px 30px", borderRadius: "12px",
                  border: "1px solid var(--color-theme-border)", background: "var(--color-theme-light)",
                  color: "var(--color-soft-text)", fontFamily: "inherit",
                }}
              />
              {search && (
                <button type="button" onClick={() => setSearch("")}
                  style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-theme-muted)", display: "flex" }}>
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* tabs categorías */}
          {!search && (
            <div style={{ display: "flex", overflowX: "auto", padding: "8px 10px 6px", gap: "5px", scrollbarWidth: "none", borderBottom: "1px solid var(--color-theme-light)" }}>
              {EMOJI_CATEGORIES.map((c, i) => (
                <button key={i} type="button" onClick={() => setCat(i)}
                  style={{
                    flexShrink: 0, padding: "4px 10px", borderRadius: "99px",
                    border: "none", fontSize: "11px", fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.12s",
                    background: cat === i ? "var(--color-theme-primary)" : "var(--color-theme-pastel)",
                    color: cat === i ? "white" : "var(--color-theme-muted)",
                  }}>
                  {c.label.split(" ")[0]}
                </button>
              ))}
            </div>
          )}

          {search && displayed.length === 0 && (
            <div style={{ padding: "24px", textAlign: "center", color: "var(--color-theme-muted)", fontSize: "13px" }}>
              No encontrado 🌸
            </div>
          )}

          {/* grid emojis */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: "2px", padding: "8px 10px 12px", maxHeight: "220px", overflowY: "auto" }}>
            {displayed.map((e, i) => (
              <button key={i} type="button" onClick={() => { onSelect(e); setOpen(false); setSearch(""); }}
                style={{
                  width: "34px", height: "34px", borderRadius: "8px", border: "none",
                  fontSize: "1.2rem", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: selected === e ? "var(--color-theme-border)" : "transparent",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e2 => { if (selected !== e) e2.currentTarget.style.background = "var(--color-theme-pastel)"; }}
                onMouseLeave={e2 => { e2.currentTarget.style.background = selected === e ? "var(--color-theme-border)" : "transparent"; }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════
   CONFETI
════════════════════════════════════════════════ */
interface Particle { id: number; x: number; y: number; color: string; size: number; speed: number; rotation: number; rotationSpeed: number; }
const COLORS = ["#ff6b9d","#e11d74","#ffb3d1","#ffd6e7","#9b4f82","#e9d5ff"];
const makeParticles = (n = 65): Particle[] =>
  Array.from({ length: n }, (_, i) => ({
    id: i, x: Math.random() * 100, y: -10, color: COLORS[i % COLORS.length],
    size: Math.random() * 8 + 4, speed: Math.random() * 2.5 + 1.2,
    rotation: Math.random() * 360, rotationSpeed: (Math.random() - 0.5) * 7,
  }));

const CelebrationOverlay = ({ onDone }: { onDone: () => void }) => {
  const [particles, setParticles] = useState<Particle[]>(makeParticles());
  const animRef = useRef<number | null>(null);
  const frame   = useRef(0);

  useEffect(() => {
    const tick = () => {
      frame.current++;
      setParticles(prev =>
        prev.map(p => ({
          ...p, y: p.y + p.speed,
          x: p.x + Math.sin((frame.current + p.id) * 0.04) * 0.5,
          rotation: p.rotation + p.rotationSpeed,
        })).filter(p => p.y < 115)
      );
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    const t = setTimeout(() => { if (animRef.current) cancelAnimationFrame(animRef.current); onDone(); }, 4000);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); clearTimeout(t); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <svg className="absolute inset-0 w-full h-full overflow-hidden">
        {particles.map(p => {
          const px = (p.x / 100) * (typeof window !== "undefined" ? window.innerWidth  : 400);
          const py = (p.y / 100) * (typeof window !== "undefined" ? window.innerHeight : 800);
          return <ellipse key={p.id} cx={px} cy={py} rx={p.size / 2} ry={p.size * 0.35} fill={p.color} opacity="0.88" transform={`rotate(${p.rotation} ${px} ${py})`} />;
        })}
      </svg>
      <div className="card-premium flex flex-col items-center gap-5 text-center"
        style={{ animation:"popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <div style={{ fontSize:"3.5rem" }}>🏆</div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-1" style={{ color:"var(--color-theme-muted)" }}>✦ ¡Logro desbloqueado! ✦</p>
          <h3 className="text-2xl font-serif italic font-bold" style={{ color:"var(--color-theme-primary)" }}>¡Día perfecto, Abigail!</h3>
          <p className="text-sm mt-1.5 font-medium" style={{ color:"var(--color-theme-muted)" }}>Completaste todos tus hábitos 🌸</p>
        </div>
        <button onClick={onDone} className="px-7 py-2.5 rounded-full text-white text-xs font-black uppercase tracking-widest"
          style={{ background:"var(--color-theme-primary)", boxShadow:"0 4px 14px rgba(225, 29, 116, 0.35)" }}>
          ¡Gracias! 🌸
        </button>
      </div>
      <style>{`@keyframes popIn { from{opacity:0;transform:scale(0.5) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }`}</style>
    </div>
  );
};

/* ════════════════════════════════════════════════
   RESUMEN SEMANAL
════════════════════════════════════════════════ */
const WeeklySummary = ({ habits, currentDayIdx }: { habits: any[]; currentDayIdx: number }) => {
  if (habits.length === 0) return null;
  const total     = habits.length * 7;
  const completed = habits.reduce((a, h) => a + (h.completedDays || []).filter(Boolean).length, 0);
  const avg       = total > 0 ? Math.round((completed / total) * 100) : 0;
  const longestStreak = habits.reduce((max, h) => {
    let s = 0, best = 0;
    for (let i = 0; i <= currentDayIdx; i++) { if (h.completedDays?.[i]) { s++; best = Math.max(best, s); } else s = 0; }
    return Math.max(max, best);
  }, 0);
  const dayScores  = DAYS.map((_, i) => habits.filter(h => h.completedDays?.[i]).length);
  const bestDayIdx = dayScores.indexOf(Math.max(...dayScores));
  const bestScore  = dayScores[bestDayIdx];

  const stats = [
    { icon: <TrendingUp size={16}/>, label:"Promedio semanal", value:`${avg}%`,      sub:"hábitos cumplidos",  color:"var(--color-theme-primary)", bg:"var(--color-theme-pastel)", border:"var(--color-theme-border)" },
    { icon: <Flame size={16}/>,      label:"Racha más larga",  value:`${longestStreak}d`, sub:longestStreak===1?"día consecutivo":"días consecutivos", color:"var(--color-theme-primary)", bg:"var(--color-theme-pastel)", border:"var(--color-theme-border)" },
    { icon: <Calendar size={16}/>,   label:"Mejor día",        value:bestScore>0?DAYS[bestDayIdx]:"—", sub:bestScore>0?`${bestScore} hábitos ese día`:"Sin datos aún", color:"var(--color-theme-muted)", bg:"var(--color-theme-light)", border:"var(--color-theme-border)" },
  ];

  return (
    <div className="card-premium">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4" style={{ color:"var(--color-theme-muted)" }}>🌸 Resumen de la semana</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center gap-3 p-4 rounded-2xl transition-transform hover:scale-[1.02] bg-white/60 backdrop-blur-md journal-shadow"
            style={{ border:`1px solid ${s.border}` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ color:s.color, background:s.bg, border:`1px solid ${s.border}` }}>{s.icon}</div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em]" style={{ color:s.color }}>{s.label}</p>
              <p className="text-2xl font-black leading-tight" style={{ color:s.color }}>{s.value}</p>
              <p className="text-[10px] font-medium" style={{ color:"var(--color-theme-muted)" }}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color:"var(--color-theme-muted)" }}>Progreso global</span>
          <span className="text-xs font-black" style={{ color:"var(--color-theme-primary)" }}>{completed}/{total}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background:"var(--color-theme-border)" }}>
          <div className="h-full rounded-full transition-all duration-700" style={{ width:`${avg}%`, background:"var(--color-theme-primary)" }} />
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════
   BURBUJA DE DÍA
════════════════════════════════════════════════ */
const DayBubble = ({ completed, isToday, dayLabel, size="md", onClick, disabled }: {
  completed:boolean; isToday:boolean; dayLabel:string;
  size?:"sm"|"md"|"lg"; onClick:()=>void; disabled?:boolean;
}) => {
  const dim  = size==="lg"?"w-14 h-14":size==="md"?"w-10 h-10":"w-9 h-9";
  const icon = size==="lg"?20:size==="md"?16:14;
  const lbl  = size==="lg"?"text-[11px]":"text-[9px]";
  return (
    <div className={`flex flex-col items-center gap-2 transition-all duration-200 ${!isToday&&!completed?"opacity-35":""}`}>
      <span className={`${lbl} font-black uppercase tracking-widest`} style={{ color:isToday?"var(--color-theme-primary)":"var(--color-theme-muted)" }}>
        {size==="lg"?dayLabel:dayLabel[0]}
      </span>
      <button onClick={onClick} disabled={disabled}
        style={completed
          ? { background:"var(--color-theme-primary)", boxShadow:"0 4px 14px rgba(225, 29, 116, 0.35)" }
          : isToday
          ? { background:"#fff", outline:"2px solid var(--color-theme-border)" }
          : { background:"#fafafa" }}
        className={`${dim} rounded-full flex items-center justify-center transition-all duration-200
          ${completed?"text-white scale-110":"text-transparent"}
          ${isToday&&!completed?"hover:scale-110 cursor-pointer":""}
          ${!isToday?"cursor-default":""}
        `}>
        <Check size={icon} strokeWidth={3.5}/>
      </button>
    </div>
  );
};

/* ════════════════════════════════════════════════
   CARD MÓVIL
════════════════════════════════════════════════ */
const MobileCard = ({ habit, currentDayIdx, onToggle, onDelete, onEdit }: {
  habit:any; currentDayIdx:number;
  onToggle:(id:string,idx:number)=>void; onDelete:(id:string)=>void; onEdit:(h:any)=>void;
}) => {
  const completedCount = (habit.completedDays||[]).filter(Boolean).length;
  let streak=0;
  for(let i=currentDayIdx;i>=0;i--){if(habit.completedDays?.[i])streak++;else break;}
  return (
    <div className="card-premium">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl w-11 h-11 flex items-center justify-center rounded-2xl flex-shrink-0"
            style={{ background:"var(--color-theme-pastel)", border:"1px solid var(--color-theme-border)" }}>{habit.emoji||"🌸"}</span>
          <div className="min-w-0">
            <p className="font-bold text-base tracking-tight break-words" style={{ color:"var(--color-soft-text)" }}>{habit.name}</p>
            {streak>0&&(
              <div className="flex items-center gap-1 mt-0.5">
                <Flame size={10} style={{ color:"var(--color-theme-primary)" }}/>
                <span className="text-[10px] font-black" style={{ color:"var(--color-theme-primary)" }}>{streak} días seguidos</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={()=>onEdit(habit)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-theme-pastel" style={{ color:"var(--color-theme-muted)" }}><Edit2 size={13}/></button>
          <button onClick={()=>onDelete(habit.id)} className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-theme-pastel" style={{ color:"var(--color-theme-muted)" }}><Trash2 size={13}/></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {(habit.completedDays||Array(7).fill(false)).map((c:boolean,i:number)=>(
          <DayBubble key={i} completed={c} isToday={i===currentDayIdx} dayLabel={DAYS[i]}
            size="sm" disabled={i!==currentDayIdx} onClick={()=>onToggle(habit.id,i)}/>
        ))}
      </div>
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color:"var(--color-theme-muted)" }}>Progreso semanal</span>
          <span className="text-[10px] font-black" style={{ color:"var(--color-theme-primary)" }}>{completedCount}/7</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background:"var(--color-theme-border)" }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width:`${(completedCount/7)*100}%`, background:"var(--color-theme-primary)" }}/>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════
   CARD DESKTOP
════════════════════════════════════════════════ */
const DesktopCard = ({ habit, currentDayIdx, onToggle, onDelete, isEditing, editName, editEmoji,
  onEditStart, onEditSave, onEditCancel, onEditNameChange, onEditEmojiChange }: {
  habit:any; currentDayIdx:number; onToggle:(id:string,idx:number)=>void; onDelete:(id:string)=>void;
  isEditing:boolean; editName:string; editEmoji:string;
  onEditStart:(h:any)=>void; onEditSave:()=>void; onEditCancel:()=>void;
  onEditNameChange:(v:string)=>void; onEditEmojiChange:(v:string)=>void;
}) => {
  const completedCount=(habit.completedDays||[]).filter(Boolean).length;
  const progress=Math.round((completedCount/7)*100);
  let streak=0;
  for(let i=currentDayIdx;i>=0;i--){if(habit.completedDays?.[i])streak++;else break;}
  return (
    <div className="card-premium group transition-all duration-300 hover:scale-[1.01] relative">
      <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {isEditing?(
          <>
            <button onClick={onEditSave} className="w-9 h-9 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform" style={{ background:"var(--color-theme-primary)" }}><Save size={14}/></button>
            <button onClick={onEditCancel} className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-theme-pastel" style={{ background:"#fafafa", color:"var(--color-theme-muted)" }}><X size={14}/></button>
          </>
        ):(
          <>
            <button onClick={()=>onEditStart(habit)} className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-theme-pastel" style={{ background:"#fafafa", color:"var(--color-theme-muted)" }}><Edit2 size={14}/></button>
            <button onClick={()=>onDelete(habit.id)} className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-theme-pastel" style={{ background:"#fafafa", color:"var(--color-theme-muted)" }}><Trash2 size={14}/></button>
          </>
        )}
      </div>
      <div className="flex items-center gap-5 mb-8">
        <span className="text-4xl w-16 h-16 flex items-center justify-center rounded-3xl flex-shrink-0"
          style={{ background:"var(--color-theme-pastel)", border:"1px solid var(--color-theme-border)" }}>
          {isEditing
            ? <input value={editEmoji} onChange={e=>onEditEmojiChange(e.target.value)} className="w-full text-center bg-transparent outline-none text-3xl" maxLength={2}/>
            : habit.emoji||"🌸"}
        </span>
        <div className="flex-1 min-w-0">
          {isEditing
            ? <input value={editName} onChange={e=>onEditNameChange(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onEditSave()} autoFocus className="text-2xl font-bold bg-transparent outline-none w-full pb-1" style={{ color:"var(--color-soft-text)", borderBottom:"2px solid var(--color-theme-primary)" }}/>
            : <h3 className="text-2xl font-bold tracking-tight break-words" style={{ color:"var(--color-soft-text)" }}>{habit.name}</h3>}
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            {streak>0&&(
              <div className="flex items-center gap-1.5">
                <Flame size={12} style={{ color:"var(--color-theme-primary)" }}/>
                <span className="text-xs font-black" style={{ color:"var(--color-theme-primary)" }}>{streak} días seguidos</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <TrendingUp size={12} style={{ color:"var(--color-theme-muted)" }}/>
              <span className="text-xs font-bold" style={{ color:"var(--color-theme-muted)" }}>{progress}% esta semana</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-3 mb-8">
        {(habit.completedDays||Array(7).fill(false)).map((c:boolean,i:number)=>(
          <DayBubble key={i} completed={c} isToday={i===currentDayIdx} dayLabel={DAYS[i]}
            size="lg" disabled={i!==currentDayIdx} onClick={()=>onToggle(habit.id,i)}/>
        ))}
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color:"var(--color-theme-muted)" }}>Progreso semanal</span>
          <span className="text-sm font-black" style={{ color:"var(--color-theme-primary)" }}>{completedCount} / 7 días</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background:"var(--color-theme-border)" }}>
          <div className="h-full rounded-full transition-all duration-700" style={{ width:`${progress}%`, background:"var(--color-theme-primary)" }}/>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════════════ */
const Habitos: React.FC = () => {
  const { state, toggleHabitDay, addHabit, deleteHabit, updateHabit } = useJournal();

  const [newHabitName,  setNewHabitName]  = useState("");
  const [newHabitEmoji, setNewHabitEmoji] = useState("🌸");
  const [editingId,     setEditingId]     = useState<string|null>(null);
  const [editName,      setEditName]      = useState("");
  const [editEmoji,     setEditEmoji]     = useState("");
  const [showAdd,       setShowAdd]       = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const prevAllDone = useRef(false);

  const currentDayIdx  = (new Date().getDay()+6)%7;
  const habits         = Array.isArray(state?.habits)?state.habits:[];
  const allDoneToday   = habits.length>0 && habits.every(h=>h.completedDays?.[currentDayIdx]);
  const completedToday = habits.filter(h=>h.completedDays?.[currentDayIdx]).length;

  useEffect(()=>{
    if(allDoneToday&&!prevAllDone.current) setShowCelebration(true);
    prevAllDone.current=allDoneToday;
  },[allDoneToday]);

  const handleAdd=()=>{
    if(!newHabitName.trim()) return;
    addHabit(newHabitName.trim(),newHabitEmoji);
    setNewHabitName(""); setNewHabitEmoji("🌸"); setShowAdd(false);
  };
  const startEditing=(h:any)=>{setEditingId(h.id);setEditName(h.name);setEditEmoji(h.emoji);};
  const saveEdit=()=>{ if(editingId&&editName.trim()){updateHabit(editingId,editName.trim(),editEmoji);setEditingId(null);} };

  return (
    <>
      {showCelebration&&<CelebrationOverlay onDone={()=>setShowCelebration(false)}/>}

      <div className="max-w-5xl mx-auto pb-24 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

        {/* HEADER */}
        <header className="pb-6 pt-3" style={{ borderBottom:"2px solid var(--color-theme-border)" }}>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-2" style={{ color:"var(--color-theme-muted)" }}>✦ Seguimiento de Disciplina ✦</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light italic mb-4" style={{ color:"var(--color-theme-primary)" }}>Mis Hábitos</h2>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
              style={{ background:"var(--color-theme-pastel)", border:"1px solid var(--color-theme-border)", color:"var(--color-theme-primary)" }}>
              {allDoneToday
                ?<><Sparkles size={12}/> ¡Día perfecto! 🌸</>
                :<><Star size={12} fill="var(--color-theme-primary)"/> {completedToday} de {habits.length} completados hoy</>}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
              style={{ background:"var(--color-theme-pastel)", border:"1px solid var(--color-theme-border)", color:"var(--color-theme-primary)" }}>
              🌸 {DAYS[currentDayIdx]} · semana activa
            </div>
          </div>
        </header>

        {/* RESUMEN */}
        <WeeklySummary habits={habits} currentDayIdx={currentDayIdx}/>

        {/* MÓVIL */}
        <div className="block md:hidden space-y-4">
          {habits.map(habit=>(
            <div key={habit.id}>
              {editingId===habit.id?(
                <div className="card-premium space-y-4" style={{ border:"2px solid var(--color-theme-primary)" }}>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em]" style={{ color:"var(--color-theme-primary)" }}>✦ Editando</p>
                  <div className="flex gap-2 items-center">
                    <EmojiPicker selected={editEmoji} onSelect={setEditEmoji}/>
                    <input value={editName} onChange={e=>setEditName(e.target.value)}
                      className="flex-1 rounded-2xl px-4 py-3 outline-none font-bold bg-white/60 backdrop-blur-md" style={{ color:"var(--color-soft-text)", border:"1px solid var(--color-theme-border)", fontSize: "inherit" }}/>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="flex-1 py-3 rounded-2xl font-bold text-white flex items-center justify-center gap-2"
                      style={{ background:"var(--color-theme-primary)", boxShadow:"0 4px 14px rgba(225, 29, 116, 0.3)" }}>
                      <Save size={15}/> Guardar
                    </button>
                    <button onClick={()=>setEditingId(null)} className="px-5 py-3 rounded-2xl font-bold bg-white/60 backdrop-blur-md" style={{ color:"var(--color-theme-muted)" }}><X size={16}/></button>
                  </div>
                </div>
              ):(
                <MobileCard habit={habit} currentDayIdx={currentDayIdx}
                  onToggle={toggleHabitDay} onDelete={deleteHabit} onEdit={startEditing}/>
              )}
            </div>
          ))}
        </div>

        {/* DESKTOP */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-5">
          {habits.map(habit=>(
            <div key={habit.id} className="relative">
              <DesktopCard habit={habit} currentDayIdx={currentDayIdx}
                onToggle={toggleHabitDay} onDelete={deleteHabit}
                isEditing={editingId===habit.id} editName={editName} editEmoji={editEmoji}
                onEditStart={startEditing} onEditSave={saveEdit} onEditCancel={()=>setEditingId(null)}
                onEditNameChange={setEditName} onEditEmojiChange={setEditEmoji}/>
            </div>
          ))}
        </div>

        {/* FORMULARIO AÑADIR */}
        {showAdd?(
          <div className="card-premium space-y-5">
            <p className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color:"var(--color-theme-primary)" }}>✦ Nuevo Hábito</p>
            <div className="flex gap-3 items-center flex-wrap">
              {/* EMOJI PICKER */}
              <EmojiPicker selected={newHabitEmoji} onSelect={setNewHabitEmoji}/>
              <input value={newHabitName} onChange={e=>setNewHabitName(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handleAdd()}
                placeholder="Nombre del hábito... 🌸"
                className="flex-1 min-w-[160px] h-14 px-5 rounded-2xl font-semibold outline-none transition-all bg-white/60 backdrop-blur-md"
                style={{ border:"1px solid var(--color-theme-border)", color:"var(--color-soft-text)", fontSize: "inherit" }}/>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAdd}
                className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                style={{ background:"var(--color-theme-primary)", boxShadow:"0 6px 18px -4px rgba(225, 29, 116, 0.4)" }}>
                <Save size={16}/> Guardar hábito
              </button>
              <button onClick={()=>setShowAdd(false)} className="px-6 py-3.5 rounded-2xl font-bold transition-colors bg-white/60 backdrop-blur-md" style={{ color:"var(--color-theme-muted)" }}>
                <X size={17}/>
              </button>
            </div>
          </div>
        ):(
          <button onClick={()=>setShowAdd(true)}
            className="group w-full flex items-center justify-center gap-4 py-6 rounded-[1.75rem] font-bold transition-all hover:scale-[1.01] active:scale-[0.99] card-premium"
            style={{ border:"2px dashed var(--color-theme-border)", color:"var(--color-theme-primary)", background:"rgba(255, 248, 251, 0.5)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform"
              style={{ background:"var(--color-theme-primary)", boxShadow:"0 4px 14px rgba(225, 29, 116, 0.35)" }}>
              <Plus size={20} strokeWidth={3}/>
            </div>
            <span className="text-base sm:text-lg">Añadir nuevo hábito</span>
          </button>
        )}
      </div>
    </>
  );
};

export default Habitos;
