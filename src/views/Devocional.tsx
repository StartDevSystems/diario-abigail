"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useJournal } from "../context/JournalContext";
import { BookOpen, Clock, FileText, HelpCircle, Heart, PenLine, X, Search, ChevronRight, Eye, Loader2, Copy, Check, Share2 } from "lucide-react";

// ════════════════════════════════════════════════════════
//  BIBLE DATA & MAPPING (RVR1960)
// ════════════════════════════════════════════════════════

const BIBLE_BOOKS = [
  { name: "Génesis", id: "genesis", test: "AT", chaps: 50 }, { name: "Éxodo", id: "exodo", test: "AT", chaps: 40 },
  { name: "Levítico", id: "levitico", test: "AT", chaps: 27 }, { name: "Números", id: "numeros", test: "AT", chaps: 36 },
  { name: "Deuteronomio", id: "deuteronomio", test: "AT", chaps: 34 }, { name: "Josué", id: "josue", test: "AT", chaps: 24 },
  { name: "Jueces", id: "jueces", test: "AT", chaps: 21 }, { name: "Rut", id: "rut", test: "AT", chaps: 4 },
  { name: "1 Samuel", id: "1samuel", test: "AT", chaps: 31 }, { name: "2 Samuel", id: "2samuel", test: "AT", chaps: 24 },
  { name: "1 Reyes", id: "1reyes", test: "AT", chaps: 22 }, { name: "2 Reyes", id: "2reyes", test: "AT", chaps: 25 },
  { name: "1 Crónicas", id: "1cronicas", test: "AT", chaps: 29 }, { name: "2 Crónicas", id: "2cronicas", test: "AT", chaps: 36 },
  { name: "Esdras", id: "esdras", test: "AT", chaps: 10 }, { name: "Nehemías", id: "nehemias", test: "AT", chaps: 13 },
  { name: "Ester", id: "ester", test: "AT", chaps: 10 }, { name: "Job", id: "job", test: "AT", chaps: 42 },
  { name: "Salmos", id: "salmos", test: "AT", chaps: 150 }, { name: "Proverbios", id: "proverbios", test: "AT", chaps: 31 },
  { name: "Eclesiastés", id: "eclesiastes", test: "AT", chaps: 12 }, { name: "Cantares", id: "cantares", test: "AT", chaps: 8 },
  { name: "Isaías", id: "isaias", test: "AT", chaps: 66 }, { name: "Jeremías", id: "jeremias", test: "AT", chaps: 52 },
  { name: "Lamentaciones", id: "lamentaciones", test: "AT", chaps: 5 }, { name: "Ezequiel", id: "ezequiel", test: "AT", chaps: 48 },
  { name: "Daniel", id: "daniel", test: "AT", chaps: 12 }, { name: "Oseas", id: "oseas", test: "AT", chaps: 14 },
  { name: "Joel", id: "joel", test: "AT", chaps: 3 }, { name: "Amós", id: "amos", test: "AT", chaps: 9 },
  { name: "Abdías", id: "abdias", test: "AT", chaps: 1 }, { name: "Jonás", id: "jonas", test: "AT", chaps: 4 },
  { name: "Miqueas", id: "miqueas", test: "AT", chaps: 7 }, { name: "Nahúm", id: "nahum", test: "AT", chaps: 3 },
  { name: "Habacuc", id: "habacuc", test: "AT", chaps: 3 }, { name: "Sofonías", id: "sofonias", test: "AT", chaps: 3 },
  { name: "Hageo", id: "hageo", test: "AT", chaps: 2 }, { name: "Zacarías", id: "zacarias", test: "AT", chaps: 14 },
  { name: "Malaquías", id: "malaquias", test: "AT", chaps: 4 },
  { name: "Mateo", id: "mateo", test: "NT", chaps: 28 }, { name: "Marcos", id: "marcos", test: "NT", chaps: 16 },
  { name: "Lucas", id: "lucas", test: "NT", chaps: 24 }, { name: "Juan", id: "juan", test: "NT", chaps: 21 },
  { name: "Hechos", id: "hechos", test: "NT", chaps: 28 }, { name: "Romanos", id: "romanos", test: "NT", chaps: 16 },
  { name: "1 Corintios", id: "1corintios", test: "NT", chaps: 16 }, { name: "2 Corintios", id: "2corintios", test: "NT", chaps: 13 },
  { name: "Gálatas", id: "galatas", test: "NT", chaps: 6 }, { name: "Efesios", id: "efesios", test: "NT", chaps: 6 },
  { name: "Filipenses", id: "filipenses", test: "NT", chaps: 4 }, { name: "Colosenses", id: "colosenses", test: "NT", chaps: 4 },
  { name: "1 Tesalonicenses", id: "1tesalonicenses", test: "NT", chaps: 5 }, { name: "2 Tesalonicenses", id: "2tesalonicenses", test: "NT", chaps: 3 },
  { name: "1 Timoteo", id: "1timoteo", test: "NT", chaps: 6 }, { name: "2 Timoteo", id: "2timoteo", test: "NT", chaps: 4 },
  { name: "Tito", id: "tito", test: "NT", chaps: 3 }, { name: "Filemón", id: "filemon", test: "NT", chaps: 1 },
  { name: "Hebreos", id: "hebreos", test: "NT", chaps: 13 }, { name: "Santiago", id: "santiago", test: "NT", chaps: 5 },
  { name: "1 Pedro", id: "1pedro", test: "NT", chaps: 5 }, { name: "2 Pedro", id: "2pedro", test: "NT", chaps: 3 },
  { name: "1 Juan", id: "1juan", test: "NT", chaps: 5 }, { name: "2 Juan", id: "2juan", test: "NT", chaps: 1 },
  { name: "3 Juan", id: "3juan", test: "NT", chaps: 1 }, { name: "Judas", id: "judas", test: "NT", chaps: 1 },
  { name: "Apocalipsis", id: "apocalipsis", test: "NT", chaps: 22 },
];

// ════════════════════════════════════════════════════════
//  SMALL HELPERS
// ════════════════════════════════════════════════════════

const Spiral = () => (
  <span style={{ width:22, height:22, borderRadius:"50%", background:"var(--color-theme-border)", border:"2.5px solid var(--color-theme-border)", display:"block", flexShrink:0 }}/>
);
const Ring = () => (
  <span style={{ width:18, height:18, borderRadius:"50%", border:"2.5px solid var(--color-theme-primary)", background:"transparent", display:"block", flexShrink:0 }}/>
);
const GoldDot = () => (
  <span style={{ width:8, height:8, borderRadius:"50%", background:"#c49a3c", display:"inline-block", flexShrink:0 }}/>
);
const GoldRing = () => (
  <span style={{ width:18, height:18, borderRadius:"50%", border:"2px solid #c49a3c", display:"inline-block", opacity:.5 }}/>
);
const BsSpiral = () => (
  <span style={{ width:14, height:14, borderRadius:"50%", background:"rgba(255,255,255,.25)", border:"2px solid rgba(255,255,255,.4)", display:"block" }}/>
);
const SectionLabel = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div style={{ display:"flex", alignItems:"center", gap:".4rem", fontSize:".7rem", fontWeight:900, letterSpacing:".1em", textTransform:"uppercase" as const, color:"var(--color-theme-primary)", marginBottom:".85rem", fontFamily:"'DM Sans',sans-serif" }}>
    {icon}{children}
  </div>
);
const StyledTextarea = ({ value, onChange, placeholder, rows=5 }: { value:string; onChange:(v:string)=>void; placeholder:string; rows?:number }) => (
  <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{ width:"100%", background:"transparent", border:"none", outline:"none", resize:"none", fontFamily:"'DM Sans',sans-serif", fontSize:"inherit", color:"var(--color-soft-text)", lineHeight:1.7, fontStyle:"italic", wordBreak: "break-word" }}
  />
);

// ════════════════════════════════════════════════════════
//  BIBLE SELECTOR (FIXED API MAPPING)
// ════════════════════════════════════════════════════════

interface BibleSelectorProps {
  onConfirm: (text: string, ref: string) => void;
  onClose: () => void;
}

const BibleSelector: React.FC<BibleSelectorProps> = ({ onConfirm, onClose }) => {
  const [step, setStep]           = useState<1|2|3>(1);
  const [testament, setTestament] = useState<"AT"|"NT">("AT");
  const [search, setSearch]       = useState("");
  const [selBook, setSelBook]     = useState<{name:string, id:string, chaps:number} | null>(null);
  const [selChap, setSelChap]     = useState(0);
  const [vFrom, setVFrom]         = useState(1);
  const [vTo, setVTo]             = useState(1);
  const [verses, setVerses]       = useState<{number:number, text:string}[]>([]);
  const [loading, setLoading]     = useState(false);

  const filtered = useMemo(() => {
    const list = BIBLE_BOOKS.filter(b => b.test === testament);
    return search ? list.filter(b => b.name.toLowerCase().includes(search.toLowerCase())) : list;
  }, [testament, search]);

  const previewText = useMemo(() => {
    if (loading) return "Buscando en las Escrituras... 🌸";
    if (verses.length === 0) return "Selecciona un capítulo.";
    
    return verses
      .filter(v => v.number >= vFrom && v.number <= vTo)
      .map(v => v.text)
      .join(" ");
  }, [verses, vFrom, vTo, loading]);

  const reference = selBook && selChap ? `${selBook.name} ${selChap}:${vFrom}${vFrom !== vTo ? `–${vTo}` : ""}` : "";

  // Carga de versículos arreglada (campo v.verse de la API)
  useEffect(() => {
    if (selBook && selChap > 0) {
      setLoading(true);
      fetch(`https://bible-api.deno.dev/api/read/rv1960/${selBook.id}/${selChap}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.vers) {
            // NORMALIZACIÓN: La API usa v.verse para el texto y v.number para el número
            const cleanVerses = data.vers.map((v: any) => ({
              number: v.number,
              text: v.verse.replace(/<[^>]*>?/gm, '') // Limpiar HTML
            }));
            setVerses(cleanVerses);
            setVFrom(1);
            setVTo(1);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [selBook, selChap]);

  const pickBook = (b: any) => {
    setSelBook(b);
    setTimeout(() => setStep(2), 150);
  };
  const pickChap = (c: number) => {
    setSelChap(c);
    setTimeout(() => setStep(3), 150);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(45,10,30,.5)", backdropFilter:"blur(5px)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"1rem", animation:"bsOvIn .2s ease" }}
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="card-premium w-full max-w-[560px] max-h-[90vh] flex flex-col overflow-hidden relative animation-bsMdIn"
        style={{ animation:"bsMdIn .32s cubic-bezier(.34,1.56,.64,1)" }}>

        <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:0, borderRadius:"2.5rem",
          backgroundImage:"repeating-linear-gradient(transparent,transparent 27px,rgba(225,29,116,.035) 27px,rgba(225,29,116,.035) 28px)" }}/>

        <div style={{ position:"relative", zIndex:1, background:"var(--color-theme-primary)", padding:"1.3rem 1.6rem 1.1rem", borderRadius:"2.5rem 2.5rem 0 0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ position:"absolute", left:14, top:0, bottom:0, display:"flex", flexDirection:"column", justifyContent:"center", gap:10 }}>
            <BsSpiral/><BsSpiral/><BsSpiral/>
          </div>
          <div style={{ flex:1, textAlign:"center" }}>
            <div style={{ fontFamily:"'Great Vibes',cursive", fontSize:"2.2rem", color:"white", lineHeight:1, textShadow:"0 2px 8px rgba(45,10,30,.2)" }}>Palabra de Dios</div>
            <div style={{ fontSize:".67rem", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase" as const, color:"rgba(255,255,255,.75)", marginTop:".1rem" }}>Reina-Valera 1960</div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.2)", border:"none", borderRadius:"50%", width:34, height:34, cursor:"pointer", color:"white", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <X size={16}/>
          </button>
        </div>

        <div style={{ position:"relative", zIndex:1, borderBottom:"1px solid rgba(0,0,0,0.05)", padding:".75rem 1.4rem", display:"flex", gap:".5rem", alignItems:"center" }} className="bg-white/60 backdrop-blur-md">
          {([1,2,3] as const).map((n, i) => (
            <React.Fragment key={n}>
              <div style={{ display:"flex", alignItems:"center", gap:".4rem", fontSize:".7rem", fontWeight:700, letterSpacing:".06em", textTransform:"uppercase" as const, padding:".35rem .9rem", borderRadius:999, transition:"all .2s",
                background: step===n ? "var(--color-theme-primary)" : step>n ? "var(--color-theme-border)" : "transparent",
                color:       step===n ? "white"   : step>n ? "var(--color-theme-primary)" : "var(--color-theme-muted)",
                border:      `1.5px solid ${step===n ? "var(--color-theme-primary)" : "var(--color-theme-border)"}`,
                boxShadow:   step===n ? "0 2px 10px rgba(225, 29, 116, 0.3)" : "none",
              }}>
                {n} {["Libro","Capítulo","Versículo"][i]}
              </div>
              {i < 2 && <span style={{ color:"var(--color-theme-border)", fontSize:".85rem" }}>›</span>}
            </React.Fragment>
          ))}
        </div>

        <div style={{ position:"relative", zIndex:1, overflowY:"auto", flex:1, padding:"1.4rem 1.6rem", display:"flex", flexDirection:"column", gap:"1rem" }}>

          {step === 1 && (
            <div style={{ animation:"spIn .25s ease" }}>
              <div style={{ fontSize:".68rem", fontWeight:900, letterSpacing:".12em", textTransform:"uppercase" as const, color:"var(--color-theme-primary)", display:"flex", alignItems:"center", gap:".4rem", marginBottom:".75rem" }}>
                <GoldDot/> Elige un libro de la Biblia
              </div>
              <div style={{ position:"relative", marginBottom:".9rem" }}>
                <Search size={14} color="var(--color-theme-primary)" style={{ position:"absolute", left:".75rem", top:"50%", transform:"translateY(-50%)" }}/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar libro..."
                  style={{ width:"100%", background:"white", border:"1.5px solid var(--color-theme-border)", borderRadius:".9rem", padding:".6rem 1rem .6rem 2.4rem", fontFamily:"'DM Sans',sans-serif", fontSize:".88rem", color:"var(--color-soft-text)", outline:"none" }}/>
              </div>
              <div style={{ display:"flex", gap:".5rem", marginBottom:".9rem" }}>
                {(["AT","NT"] as const).map(t => (
                  <button key={t} onClick={()=>{ setTestament(t); setSearch(""); }}
                    style={{ flex:1, padding:".5rem", borderRadius:".8rem", border:`1.5px solid ${testament===t?"var(--color-theme-primary)":"var(--color-theme-border)"}`, background:testament===t?"var(--color-theme-border)":"white", color:testament===t?"var(--color-theme-primary)":"var(--color-theme-muted)", fontFamily:"'DM Sans',sans-serif", fontSize:".78rem", fontWeight:700, cursor:"pointer", transition:"all .18s" }}>
                    {t==="AT" ? "Antiguo Testamento" : "Nuevo Testamento"}
                  </button>
                ))}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:".5rem" }}>
                {filtered.map(b => (
                  <button key={b.id} onClick={()=>pickBook(b)}
                    style={{ padding:".5rem .4rem", borderRadius:".9rem", border:`1.5px solid ${b.id===selBook?.id?"var(--color-theme-primary)":"var(--color-theme-border)"}`, background:b.id===selBook?.id?"var(--color-theme-primary)":"white", color:b.id===selBook?.id?"white":"var(--color-soft-text)", fontFamily:"'DM Sans',sans-serif", fontSize:".75rem", fontWeight:600, cursor:"pointer", transition:"all .18s", textAlign:"center", lineHeight:1.2,
                      boxShadow: b.id===selBook?.id?"0 3px 10px rgba(225, 29, 116, 0.3)":"none" }}>
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ animation:"spIn .25s ease" }}>
              <div style={{ fontSize:".72rem", color:"var(--color-theme-muted)", fontWeight:600, display:"flex", alignItems:"center", gap:".35rem", marginBottom:".8rem", flexWrap:"wrap" as const }}>
                <span style={{ color:"var(--color-theme-primary)", cursor:"pointer", textDecoration:"underline" }} onClick={()=>setStep(1)}>Libros</span>
                <ChevronRight size={12} color="var(--color-theme-border)"/>
                <strong style={{ color:"var(--color-soft-text)" }}>{selBook?.name}</strong>
              </div>
              <div style={{ fontSize:".68rem", fontWeight:900, letterSpacing:".12em", textTransform:"uppercase" as const, color:"var(--color-theme-primary)", display:"flex", alignItems:"center", gap:".4rem", marginBottom:".75rem" }}>
                <GoldDot/> Elige el capítulo
              </div>
              <div style={{ display:"flex", flexWrap:"wrap" as const, gap:".45rem" }}>
                {Array.from({length: selBook?.chaps || 0},(_,i)=>i+1).map(c => (
                  <button key={c} onClick={()=>pickChap(c)}
                    style={{ width:38, height:38, borderRadius:"50%", border:`1.5px solid ${c===selChap?"var(--color-theme-primary)":"var(--color-theme-border)"}`, background:c===selChap?"var(--color-theme-primary)":"white", color:c===selChap?"white":"var(--color-soft-text)", fontFamily:"'DM Sans',sans-serif", fontSize:".78rem", fontWeight:700, cursor:"pointer", transition:"all .18s", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                      boxShadow: c===selChap?"0 3px 10px rgba(225, 29, 116, 0.3)":"none" }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ animation:"spIn .25s ease" }}>
              <div style={{ fontSize:".72rem", color:"var(--color-theme-muted)", fontWeight:600, display:"flex", alignItems:"center", gap:".35rem", marginBottom:".8rem", flexWrap:"wrap" as const }}>
                <span style={{ color:"var(--color-theme-primary)", cursor:"pointer", textDecoration:"underline" }} onClick={()=>setStep(1)}>Libros</span>
                <ChevronRight size={12} color="var(--color-theme-border)"/>
                <span style={{ color:"var(--color-theme-primary)", cursor:"pointer", textDecoration:"underline" }} onClick={()=>setStep(2)}>{selBook?.name}</span>
                <ChevronRight size={12} color="var(--color-theme-border)"/>
                <strong style={{ color:"var(--color-soft-text)" }}>Cap. {selChap}</strong>
              </div>
              <div style={{ fontSize:".68rem", fontWeight:900, letterSpacing:".12em", textTransform:"uppercase" as const, color:"var(--color-theme-primary)", display:"flex", alignItems:"center", gap:".4rem", marginBottom:".75rem" }}>
                <GoldDot/> Elige el rango de versículos
              </div>

              <div style={{ display:"flex", alignItems:"flex-end", gap:".8rem", marginBottom: "1rem" }}>
                <div style={{ flex:1, display:"flex", flexDirection:"column", gap:".3rem" }}>
                  <label style={{ fontSize:".65rem", fontWeight:700, letterSpacing:".09em", textTransform:"uppercase" as const, color:"var(--color-theme-muted)" }}>DESDE</label>
                  <select value={vFrom} onChange={e=>setVFrom(+e.target.value)}
                    style={{ width:"100%", background:"white", border:"1.5px solid var(--color-theme-border)", borderRadius:".8rem", padding:".55rem .9rem", fontFamily:"'DM Sans',sans-serif", fontSize:".88rem", color:"var(--color-soft-text)", outline:"none", cursor:"pointer" }}>
                    {verses.length > 0 ? (
                      verses.map(v => <option key={v.number} value={v.number}>{v.number}</option>)
                    ) : (
                      <option value="1">1</option>
                    )}
                  </select>
                </div>
                <div style={{ flex:1, display:"flex", flexDirection:"column", gap:".3rem" }}>
                  <label style={{ fontSize:".65rem", fontWeight:700, letterSpacing:".09em", textTransform:"uppercase" as const, color:"var(--color-theme-muted)" }}>HASTA</label>
                  <select value={vTo} onChange={e=>setVTo(+e.target.value)}
                    style={{ width:"100%", background:"white", border:"1.5px solid var(--color-theme-border)", borderRadius:".8rem", padding:".55rem .9rem", fontFamily:"'DM Sans',sans-serif", fontSize:".88rem", color:"var(--color-soft-text)", outline:"none", cursor:"pointer" }}>
                    {verses.length > 0 ? (
                      verses.filter(v => v.number >= vFrom).map(v => <option key={v.number} value={v.number}>{v.number}</option>)
                    ) : (
                      <option value="1">1</option>
                    )}
                  </select>
                </div>
              </div>

              <div style={{ background:"white", border:"1.5px solid #f5e9c8", borderRadius:"1.5rem", padding:"1.3rem 1.5rem", position:"relative", overflow:"hidden", boxShadow:"0 2px 16px rgba(196,154,60,.1)", marginTop:".8rem" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#f5e9c8,#c49a3c,#f5e9c8)" }}/>
                <div style={{ fontSize:".65rem", fontWeight:900, letterSpacing:".12em", textTransform:"uppercase" as const, color:"#c49a3c", display:"flex", alignItems:"center", gap:".35rem", marginBottom:".8rem" }}>
                  <Eye size={13}/> Vista Previa del Mensaje de Dios
                </div>
                {loading ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#c49a3c", fontStyle: "italic" }}>
                    <Loader2 size={16} className="animate-spin" /> Buscando en las Escrituras...
                  </div>
                ) : (
                  <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.02rem", fontStyle:"italic", color:"var(--color-soft-text)", lineHeight:1.75, marginBottom:".7rem" }}>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"2.5rem", lineHeight:0, verticalAlign:"-.3rem", marginRight:".1rem", color:"var(--color-theme-border)" }}>"</span>
                    {previewText}
                  </p>
                )}
                <div style={{ fontSize:".7rem", fontWeight:900, letterSpacing:".12em", textTransform:"uppercase" as const, color:"var(--color-theme-muted)", textAlign:"right" }}>— {reference}</div>
              </div>
            </div>
          )}

        </div>

        <div style={{ position:"relative", zIndex:1, background:"white", borderTop:"1.5px solid var(--color-theme-border)", padding:"1rem 1.6rem", display:"flex", gap:".7rem", alignItems:"center" }}>
          <div style={{ display:"flex", gap:".35rem", marginRight:"auto" }}>
            <GoldRing/><GoldRing/><GoldRing/>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"1.5px solid var(--color-theme-border)", borderRadius:999, color:"var(--color-theme-muted)", fontFamily:"'DM Sans',sans-serif", fontSize:".82rem", fontWeight:700, padding:".55rem 1.3rem", cursor:"pointer" }}>
            Cancelar
          </button>
          {step === 3 && (
            <button onClick={() => onConfirm(previewText, reference)} disabled={loading || verses.length === 0}
              style={{ background:"var(--color-theme-primary)", border:"none", borderRadius:999, color:"white", fontFamily:"'DM Sans',sans-serif", fontSize:".82rem", fontWeight:900, padding:".55rem 1.6rem", cursor:"pointer", boxShadow:"0 4px 16px rgba(225, 29, 116, 0.35)", opacity: (loading || verses.length === 0) ? .5 : 1 }}>
              Confirmar Palabra 🌸
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════
//  DEVOCIONAL (componente principal)
// ════════════════════════════════════════════════════════

const Devocional: React.FC = () => {
  const { state, updateToday } = useJournal();
  const { today } = state;
  const [showBible, setShowBible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!today.devocionalVerse) return;
    const text = `"${today.devocionalVerse}" — ${today.devocionalRef}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!today.devocionalVerse) return;
    const text = `✨ "${today.devocionalVerse}" — ${today.devocionalRef} ✨\n\n📖 Enviado desde mi Diario de Abigail`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const fechaHoy = new Date().toLocaleDateString("es-ES", {
    weekday:"long", day:"numeric", month:"long", year:"numeric",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
        .dev-fade > * { animation: devUp .45s ease both; }
        @keyframes devUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bsOvIn{from{opacity:0}to{opacity:1}}
        @keyframes bsMdIn{from{opacity:0;transform:translateY(40px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes spIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .dev-tape::before,.dev-tape::after{content:'';position:absolute;top:4px;width:6px;height:6px;background:rgba(255,255,255,.5);border-radius:50%}
        textarea::placeholder{color:var(--color-theme-border)}
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media(max-width:540px){
          .dev-grid{grid-template-columns:1fr !important}
          .dev-jesus{font-size:2.8rem !important}
          .dev-verse-text{font-size:inherit}
          .dev-header-top{flex-direction:column !important; align-items:center !important; text-align:center}
          .dev-header-top .dev-cross-section{align-items:center !important}
        }
      `}</style>

      {showBible && (
        <BibleSelector
          onConfirm={(text, ref) => {
            updateToday({ devocionalVerse: text, devocionalRef: ref });
            setShowBible(false);
          }}
          onClose={() => setShowBible(false)}
        />
      )}

      <div className="dev-fade" style={{ maxWidth:680, margin:"0 auto", display:"flex", flexDirection:"column", gap:"1.5rem", paddingBottom:"3rem", fontFamily:"'DM Sans',sans-serif", color:"var(--color-soft-text)" }}>

        <div className="dev-header-top" style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"1rem", flexWrap:"wrap" }}>
          <div style={{ display:"flex", flexDirection:"column", gap:".35rem", flexShrink:0 }}>
            <span style={{ background:"var(--color-theme-primary)", color:"white", fontWeight:900, fontSize:".85rem", letterSpacing:".04em", padding:".4rem 1.1rem", borderRadius:999, display:"inline-block" }}>Devocional</span>
            <span style={{ background:"white", color:"var(--color-theme-primary)", border:"2px solid var(--color-theme-border)", fontWeight:700, fontSize:".85rem", padding:".35rem 1.1rem", borderRadius:999, display:"inline-block", marginLeft:".6rem" }}>Diario</span>
          </div>
          <div style={{ textAlign:"center", flex:1, minWidth:120 }}>
            <span className="dev-jesus" style={{ fontFamily:"'Great Vibes',cursive", fontSize:"5.2rem", color:"var(--color-soft-text)", lineHeight:1, opacity:.88, display:"block" }}>Jesús</span>
          </div>
          <div className="dev-cross-section" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:".4rem", flexShrink:0 }}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <line x1="26" y1="4" x2="26" y2="28" stroke="var(--color-soft-text)" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="14" y1="13" x2="38" y2="13" stroke="var(--color-soft-text)" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M14 28 C14 21 26 19 26 26 C26 19 38 21 38 28 C38 37 26 44 26 44 C26 44 14 37 14 28Z" fill="var(--color-theme-primary)" opacity=".85"/>
              <circle cx="38" cy="14" r="4" fill="var(--color-theme-border)"/>
            </svg>
            <div style={{ fontSize:".65rem", fontWeight:700, color:"var(--color-theme-muted)", textTransform:"uppercase", letterSpacing:".07em", textAlign:"center" }}>{fechaHoy}</div>
            <div style={{ width:110, height:1, background:"var(--color-theme-border)" }}/>
          </div>
        </div>

        <div className="card-premium overflow-hidden relative">
          <div style={{ height:4, background:"linear-gradient(90deg,var(--color-theme-border),var(--color-theme-primary),var(--color-theme-primary))" }}/>
          <div style={{ position:"absolute", top:18, left:"50%", transform:"translateX(-50%)", width:44, height:44, background:"var(--color-theme-primary)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(225, 29, 116, 0.35)", zIndex:2 }}>
            <BookOpen size={20} color="white"/>
          </div>
          <div style={{ padding:"3.8rem 2.5rem 1.8rem", display:"flex", flexDirection:"column", alignItems:"center", gap:".9rem", textAlign:"center" }}>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"5rem", lineHeight:.5, color:"var(--color-theme-border)", userSelect:"none" as const }}>"</span>
            <p className="dev-verse-text" style={{ fontFamily:"'Playfair Display',serif", fontSize:"inherit", fontStyle:"italic", color:"var(--color-soft-text)", lineHeight:1.75, maxWidth:500, wordBreak: "break-word" }}>
              {today.devocionalVerse || "Aún no has elegido tu versículo de hoy..."}
            </p>
            {today.devocionalRef && (
              <span style={{ fontSize:".72rem", fontWeight:900, letterSpacing:".14em", textTransform:"uppercase" as const, color:"var(--color-theme-muted)" }}>
                — {today.devocionalRef}
              </span>
            )}

            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", justifyContent: "center", marginTop: ".8rem" }}>
              <button className="dev-btn-change" onClick={() => setShowBible(true)}
                style={{ display:"inline-flex", alignItems:"center", gap:".4rem", background:"var(--color-theme-pastel)", color:"var(--color-theme-primary)", border:"1.5px solid var(--color-theme-border)", borderRadius:999, fontFamily:"'DM Sans',sans-serif", fontSize:".74rem", fontWeight:700, padding:".45rem 1.1rem", cursor:"pointer", transition:"background .18s,border-color .18s" }}>
                <PenLine size={12}/>
                {today.devocionalVerse ? "Cambiar versículo" : "Elegir versículo 🌸"}
              </button>

              {today.devocionalVerse && (
                <>
                  <button onClick={handleCopy}
                    style={{ display:"inline-flex", alignItems:"center", gap:".4rem", background:"var(--color-theme-pastel)", color:copied ? "#10b981" : "var(--color-theme-primary)", border:`1.5px solid ${copied ? "#10b981" : "var(--color-theme-border)"}`, borderRadius:999, fontFamily:"'DM Sans',sans-serif", fontSize:".74rem", fontWeight:700, padding:".45rem 1.1rem", cursor:"pointer", transition:"all .18s" }}>
                    {copied ? <Check size={12}/> : <Copy size={12}/>}
                    {copied ? "¡Copiado!" : "Copiar"}
                  </button>

                  <button onClick={handleWhatsApp}
                    style={{ display:"inline-flex", alignItems:"center", gap:".4rem", background:"#25D366", color:"white", border:"none", borderRadius:999, fontFamily:"'DM Sans',sans-serif", fontSize:".74rem", fontWeight:900, padding:".45rem 1.1rem", cursor:"pointer", transition:"opacity .18s" }}>
                    <Share2 size={12}/>
                    WhatsApp
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="dev-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.2rem" }}>
          <div className="card-premium relative overflow-hidden">
            <div className="dev-tape" style={{ position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)", width:60, height:22, background:"var(--color-theme-primary)", borderRadius:4, opacity:.7 }}/>
            <div style={{ position:"absolute", top:".9rem", right:"1rem", fontSize:"1.1rem" }}>⭐⭐</div>
            <div style={{ marginTop:".4rem" }}>
              <SectionLabel icon={<Clock size={14} color="var(--color-theme-primary)"/>}>Meditar y Memorizar</SectionLabel>
              <StyledTextarea value={today.devocionalReflection ?? ""} onChange={v=>updateToday({devocionalReflection:v})} placeholder="Versículo para memorizar esta semana..." rows={6}/>
            </div>
          </div>
          <div className="card-premium overflow-hidden relative">
            <div style={{ background:"white", borderBottom:"1px solid rgba(0,0,0,0.05)", padding:".55rem 1.2rem", display:"flex", gap:".5rem", alignItems:"center" }} className="bg-white/60 backdrop-blur-md">
              {[0,1,2,3,4,5].map(i=><Ring key={i}/>)}
            </div>
            <div style={{ padding:"1rem 1.3rem 2.8rem", position:"relative" }}>
              <SectionLabel icon={<FileText size={14} color="var(--color-theme-primary)"/>}>Lectura del día</SectionLabel>
              <StyledTextarea value={today.prayerAsk ?? ""} onChange={v=>updateToday({prayerAsk:v})} placeholder={"¿Qué leíste hoy?\nPasaje, libro, capítulo..."} rows={6}/>
              <span style={{ position:"absolute", bottom:".8rem", right:"1rem", fontSize:"2rem", filter:"drop-shadow(0 2px 6px rgba(225, 29, 116, 0.3))" }}>🩷</span>
            </div>
          </div>
        </div>

        <div className="dev-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.2rem" }}>
          <div className="card-premium relative">
            <div style={{ position:"absolute", left:-13, top:"1.2rem", display:"flex", flexDirection:"column", gap:".9rem" }}>
              {[0,1,2,3].map(i=><Spiral key={i}/>)}
            </div>
            <div style={{ padding:"1.4rem 1.4rem 1.4rem 1.2rem" }}>
              <SectionLabel icon={<Heart size={14} color="var(--color-theme-primary)"/>}>Reflexión</SectionLabel>
              <StyledTextarea value={today.prayerThanks ?? ""} onChange={v=>updateToday({prayerThanks:v})} placeholder="¿Qué aprendiste hoy?" rows={6}/>
            </div>
          </div>
          <div className="card-premium">
            <div style={{ display:"flex", gap:".5rem", alignItems:"center", marginBottom:".6rem" }}>
              {[0,1,2,3,4,5,6,7].map(i=><Ring key={i}/>)}
            </div>
            <SectionLabel icon={<HelpCircle size={14} color="var(--color-theme-primary)"/>}>Preguntas</SectionLabel>
            <div style={{ display:"flex", flexDirection:"column", gap:".7rem", marginBottom:".5rem" }}>
              {[0,1,2,3].map(i=><div key={i} style={{ height:1, background:"var(--color-theme-border)", borderRadius:1 }}/>)}
            </div>
            <StyledTextarea value={today.prayerDecree ?? ""} onChange={v=>updateToday({prayerDecree:v})} placeholder="¿Qué preguntas surgieron?" rows={5}/>
          </div>
        </div>

        <div className="card-premium">
          <SectionLabel icon={<span style={{ width:32, height:32, background:"var(--color-theme-primary)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><Heart size={15} color="white" fill="white"/></span>}>
            Mi Oración de Hoy
          </SectionLabel>
          <StyledTextarea value={today.prayerAsk ?? ""} onChange={v=>updateToday({prayerAsk:v})} placeholder="Habla con Dios libremente... Él te escucha 🌸" rows={4}/>
          <div style={{ fontSize:"1.2rem", marginTop: ".8rem" }}>⭐⭐</div>
        </div>

      </div>
    </>
  );
};

export default Devocional;
