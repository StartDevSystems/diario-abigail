"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useJournal } from "../context/JournalContext";
import { BookOpen, Clock, FileText, HelpCircle, Heart, PenLine, X, Search, ChevronRight, Eye, Loader2, Copy, Check, Share2, BookMarked } from "lucide-react";

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

// ════════════════════════════════════════════════════════
//  ABI-07: PLAN DE LECTURA BIBLICA ANUAL (365 dias)
// ════════════════════════════════════════════════════════

const READING_PLAN: { day: number; ref: string; passage: string }[] = (() => {
  const plan: { day: number; ref: string; passage: string }[] = [];
  const readings = [
    { ref: 'Genesis 1-3', passage: 'La creacion y la caida' },
    { ref: 'Genesis 4-7', passage: 'Cain, Abel y el diluvio' },
    { ref: 'Genesis 8-11', passage: 'El pacto con Noe' },
    { ref: 'Genesis 12-15', passage: 'El llamado de Abraham' },
    { ref: 'Genesis 16-19', passage: 'Ismael y Sodoma' },
    { ref: 'Genesis 20-23', passage: 'Isaac y Sara' },
    { ref: 'Genesis 24-26', passage: 'Rebeca y Esau' },
    { ref: 'Genesis 27-29', passage: 'La bendicion de Jacob' },
    { ref: 'Genesis 30-32', passage: 'Jacob y Laban' },
    { ref: 'Genesis 33-36', passage: 'Reconciliacion' },
    { ref: 'Genesis 37-39', passage: 'Jose vendido' },
    { ref: 'Genesis 40-42', passage: 'Jose en Egipto' },
    { ref: 'Genesis 43-46', passage: 'Reunion familiar' },
    { ref: 'Genesis 47-50', passage: 'Bendiciones de Jacob' },
    { ref: 'Exodo 1-4', passage: 'Moises y la zarza' },
    { ref: 'Exodo 5-8', passage: 'Las plagas comienzan' },
    { ref: 'Exodo 9-12', passage: 'La Pascua' },
    { ref: 'Exodo 13-16', passage: 'Cruce del Mar Rojo' },
    { ref: 'Exodo 17-20', passage: 'Los Diez Mandamientos' },
    { ref: 'Exodo 21-24', passage: 'Leyes del pacto' },
    { ref: 'Exodo 25-28', passage: 'El tabernaculo' },
    { ref: 'Exodo 29-32', passage: 'El becerro de oro' },
    { ref: 'Exodo 33-36', passage: 'Gloria de Dios' },
    { ref: 'Exodo 37-40', passage: 'Construccion completa' },
    { ref: 'Salmos 1-8', passage: 'Bienaventurado el varon' },
    { ref: 'Salmos 9-16', passage: 'Refugio en Dios' },
    { ref: 'Salmos 17-22', passage: 'El buen pastor' },
    { ref: 'Salmos 23-30', passage: 'Jehova es mi pastor' },
    { ref: 'Salmos 31-37', passage: 'Confia en Jehova' },
    { ref: 'Salmos 38-44', passage: 'Mi esperanza esta en ti' },
    { ref: 'Mateo 1-4', passage: 'Nacimiento y tentacion de Jesus' },
    { ref: 'Mateo 5-7', passage: 'Sermon del Monte' },
    { ref: 'Mateo 8-10', passage: 'Milagros y envio' },
    { ref: 'Mateo 11-13', passage: 'Parabolas del reino' },
    { ref: 'Mateo 14-17', passage: 'Pan y transfiguracion' },
    { ref: 'Mateo 18-20', passage: 'Perdon y servicio' },
    { ref: 'Mateo 21-23', passage: 'Entrada triunfal' },
    { ref: 'Mateo 24-26', passage: 'Profecia y Getsemani' },
    { ref: 'Mateo 27-28', passage: 'Crucifixion y resurreccion' },
    { ref: 'Marcos 1-4', passage: 'Inicio del ministerio' },
    { ref: 'Marcos 5-8', passage: 'Poder sobre todo' },
    { ref: 'Marcos 9-12', passage: 'Fe y sacrificio' },
    { ref: 'Marcos 13-16', passage: 'El fin y la victoria' },
    { ref: 'Proverbios 1-5', passage: 'Principio de sabiduria' },
    { ref: 'Proverbios 6-10', passage: 'La mujer sabia' },
    { ref: 'Proverbios 11-15', passage: 'Justicia y verdad' },
    { ref: 'Proverbios 16-20', passage: 'El corazon del rey' },
    { ref: 'Proverbios 21-25', passage: 'Disciplina y gracia' },
    { ref: 'Proverbios 26-31', passage: 'La mujer virtuosa' },
    { ref: 'Lucas 1-3', passage: 'Nacimiento y bautismo' },
    { ref: 'Lucas 4-6', passage: 'Sermon del llano' },
    { ref: 'Lucas 7-9', passage: 'Fe y transfiguracion' },
    { ref: 'Lucas 10-12', passage: 'El buen samaritano' },
    { ref: 'Lucas 13-16', passage: 'Parabolas de gracia' },
    { ref: 'Lucas 17-19', passage: 'Gratitud y Zaqueo' },
    { ref: 'Lucas 20-22', passage: 'Ultima cena' },
    { ref: 'Lucas 23-24', passage: 'Cruz y Emaus' },
    { ref: 'Juan 1-3', passage: 'El Verbo y Nicodemo' },
    { ref: 'Juan 4-6', passage: 'Agua viva y pan de vida' },
    { ref: 'Juan 7-9', passage: 'Luz del mundo' },
    { ref: 'Juan 10-12', passage: 'El buen pastor' },
    { ref: 'Juan 13-15', passage: 'Lavamiento y vid' },
    { ref: 'Juan 16-18', passage: 'Consolador y arresto' },
    { ref: 'Juan 19-21', passage: 'Cruz y restauracion' },
    { ref: 'Romanos 1-4', passage: 'Justificacion por fe' },
    { ref: 'Romanos 5-8', passage: 'Nada nos separara' },
    { ref: 'Romanos 9-12', passage: 'Misericordia y servicio' },
    { ref: 'Romanos 13-16', passage: 'Amor y unidad' },
    { ref: 'Hechos 1-4', passage: 'Pentecostes' },
    { ref: 'Hechos 5-8', passage: 'Esteban y Felipe' },
    { ref: 'Hechos 9-12', passage: 'Conversion de Pablo' },
    { ref: 'Hechos 13-16', passage: 'Viajes misioneros' },
    { ref: 'Hechos 17-20', passage: 'Atenas y Efeso' },
    { ref: 'Hechos 21-24', passage: 'Arresto de Pablo' },
    { ref: 'Hechos 25-28', passage: 'Pablo en Roma' },
    { ref: 'Isaias 1-6', passage: 'Vision del trono' },
    { ref: 'Isaias 7-12', passage: 'Emanuel' },
    { ref: 'Isaias 40-45', passage: 'Consuelo de Dios' },
    { ref: 'Isaias 53-55', passage: 'El siervo sufriente' },
    { ref: 'Isaias 60-66', passage: 'Gloria futura' },
    { ref: 'Filipenses 1-4', passage: 'Gozo en Cristo' },
    { ref: 'Colosenses 1-4', passage: 'Supremacia de Cristo' },
    { ref: 'Efesios 1-3', passage: 'Bendiciones espirituales' },
    { ref: 'Efesios 4-6', passage: 'Armadura de Dios' },
    { ref: '1 Tesalonicenses 1-5', passage: 'Venida del Senor' },
    { ref: '2 Tesalonicenses 1-3', passage: 'Firmeza en la fe' },
    { ref: '1 Timoteo 1-6', passage: 'Instrucciones pastorales' },
    { ref: '2 Timoteo 1-4', passage: 'Pelea la buena batalla' },
    { ref: 'Tito + Filemon', passage: 'Sana doctrina y perdon' },
    { ref: 'Hebreos 1-4', passage: 'Jesus superior a todo' },
    { ref: 'Hebreos 5-8', passage: 'Sumo sacerdote' },
    { ref: 'Hebreos 9-10', passage: 'Nuevo pacto' },
    { ref: 'Hebreos 11-13', passage: 'Heroes de la fe' },
    { ref: 'Santiago 1-5', passage: 'Fe con obras' },
    { ref: '1 Pedro 1-5', passage: 'Esperanza viva' },
    { ref: '2 Pedro 1-3', passage: 'Crecimiento espiritual' },
    { ref: '1 Juan 1-5', passage: 'Dios es amor' },
    { ref: 'Apocalipsis 1-3', passage: 'Cartas a las iglesias' },
    { ref: 'Apocalipsis 4-7', passage: 'El trono y los sellos' },
    { ref: 'Apocalipsis 19-22', passage: 'Cielo nuevo y tierra nueva' },
  ];
  for (let i = 0; i < 365; i++) {
    const r = readings[i % readings.length];
    plan.push({ day: i + 1, ref: r.ref, passage: r.passage });
  }
  return plan;
})();

const Devocional: React.FC = () => {
  const { state, updateToday, updateSettings } = useJournal();
  const { today } = state;
  const [showBible, setShowBible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPlan, setShowPlan] = useState(false);

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

        {/* ABI-07: Plan de Lectura Biblica Anual */}
        <div className="card-premium overflow-hidden">
          <div style={{ background:"linear-gradient(135deg, var(--color-theme-primary), var(--color-theme-hover))", padding:"1.3rem 1.6rem", display:"flex", alignItems:"center", justifyContent:"space-between", borderRadius:"2.5rem 2.5rem 0 0" }}>
            <div style={{ display:"flex", alignItems:"center", gap:".6rem" }}>
              <BookOpen size={20} color="white" />
              <span style={{ color:"white", fontWeight:900, fontSize:".8rem", letterSpacing:".1em", textTransform:"uppercase" }}>Plan de Lectura Anual</span>
            </div>
            <button
              onClick={() => setShowPlan(!showPlan)}
              style={{ background:"rgba(255,255,255,.2)", border:"none", borderRadius:999, padding:".4rem .9rem", color:"white", fontSize:".72rem", fontWeight:700, cursor:"pointer" }}
            >
              {showPlan ? 'Ocultar' : 'Ver Plan'}
            </button>
          </div>

          {(() => {
            const plan = state?.settings?.readingPlan;
            const startDate = plan?.startDate ? new Date(plan.startDate) : null;
            const completedDays = plan?.completedDays || [];

            // Calculate current day of plan
            let currentPlanDay = 1;
            if (startDate) {
              const diffMs = Date.now() - startDate.getTime();
              currentPlanDay = Math.max(1, Math.min(365, Math.floor(diffMs / 86400000) + 1));
            }

            const todayReading = READING_PLAN[currentPlanDay - 1];
            const isCompletedToday = completedDays.includes(currentPlanDay);
            const progress = startDate ? Math.round((completedDays.length / 365) * 100) : 0;

            return (
              <div style={{ padding:"1.5rem" }}>
                {!startDate ? (
                  <div style={{ textAlign:"center", padding:"1.5rem 0" }}>
                    <p style={{ fontSize:"inherit", color:"var(--color-soft-text)", marginBottom:"1rem", fontStyle:"italic" }}>
                      Lee toda la Biblia en un ano con lecturas diarias guiadas.
                    </p>
                    <button
                      onClick={() => updateSettings({
                        readingPlan: {
                          startDate: new Date().toISOString(),
                          currentDay: 1,
                          completedDays: []
                        }
                      })}
                      style={{ background:"var(--color-theme-primary)", color:"white", border:"none", borderRadius:999, padding:".7rem 2rem", fontWeight:900, fontSize:".8rem", letterSpacing:".06em", cursor:"pointer", boxShadow:"0 4px 16px rgba(225,29,116,.3)" }}
                    >
                      Comenzar Plan
                    </button>
                  </div>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                    {/* Progress bar */}
                    <div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:".4rem" }}>
                        <span style={{ fontSize:".7rem", fontWeight:900, letterSpacing:".1em", textTransform:"uppercase", color:"var(--color-theme-primary)" }}>
                          Dia {currentPlanDay} de 365
                        </span>
                        <span style={{ fontSize:".7rem", fontWeight:700, color:"var(--color-theme-muted)" }}>
                          {completedDays.length} completados ({progress}%)
                        </span>
                      </div>
                      <div style={{ height:8, background:"var(--color-theme-pastel)", borderRadius:999, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg, var(--color-theme-primary), var(--color-theme-hover))", borderRadius:999, transition:"width .5s ease" }} />
                      </div>
                    </div>

                    {/* Today's reading */}
                    <div style={{ background:"var(--color-theme-pastel)", borderRadius:"1.5rem", padding:"1.2rem", border:"1.5px solid var(--color-theme-border)" }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:".5rem", flexWrap:"wrap" }}>
                        <div>
                          <p style={{ fontSize:".65rem", fontWeight:900, letterSpacing:".12em", textTransform:"uppercase", color:"var(--color-theme-muted)", marginBottom:".3rem" }}>
                            Lectura de Hoy
                          </p>
                          <p style={{ fontSize:"1.1rem", fontWeight:700, color:"var(--color-soft-text)" }}>
                            {todayReading.ref}
                          </p>
                          <p style={{ fontSize:".8rem", fontStyle:"italic", color:"var(--color-theme-muted)", marginTop:".2rem" }}>
                            {todayReading.passage}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const newCompleted = isCompletedToday
                              ? completedDays.filter((d: number) => d !== currentPlanDay)
                              : [...completedDays, currentPlanDay];
                            updateSettings({
                              readingPlan: { ...plan!, completedDays: newCompleted, currentDay: currentPlanDay }
                            });
                          }}
                          style={{
                            width:48, height:48, borderRadius:"50%", border:"none", cursor:"pointer",
                            background: isCompletedToday ? "var(--color-theme-primary)" : "white",
                            color: isCompletedToday ? "white" : "var(--color-theme-border)",
                            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                            boxShadow: isCompletedToday ? "0 4px 12px rgba(225,29,116,.3)" : "0 2px 8px rgba(0,0,0,.08)",
                            transition:"all .2s"
                          }}
                        >
                          <Check size={24} />
                        </button>
                      </div>
                    </div>

                    {/* Week view */}
                    {showPlan && (
                      <div style={{ display:"grid", gap:".5rem", animation:"spIn .25s ease" }}>
                        {Array.from({ length: 7 }, (_, i) => {
                          const day = currentPlanDay - 3 + i;
                          if (day < 1 || day > 365) return null;
                          const r = READING_PLAN[day - 1];
                          const done = completedDays.includes(day);
                          const isCurrent = day === currentPlanDay;
                          return (
                            <div key={day} style={{
                              display:"flex", alignItems:"center", gap:".8rem", padding:".7rem 1rem",
                              borderRadius:"1rem", background: isCurrent ? "var(--color-theme-pastel)" : "transparent",
                              border: isCurrent ? "1.5px solid var(--color-theme-border)" : "1px solid transparent",
                              opacity: day < currentPlanDay && !done ? 0.5 : 1
                            }}>
                              <div style={{
                                width:28, height:28, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                                background: done ? "var(--color-theme-primary)" : "var(--color-theme-pastel)",
                                color: done ? "white" : "var(--color-theme-muted)", fontSize:".7rem", fontWeight:900
                              }}>
                                {done ? <Check size={14} /> : day}
                              </div>
                              <div style={{ flex:1, minWidth:0 }}>
                                <p style={{ fontSize:".78rem", fontWeight:700, color:"var(--color-soft-text)" }}>{r.ref}</p>
                                <p style={{ fontSize:".65rem", color:"var(--color-theme-muted)", fontStyle:"italic" }}>{r.passage}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

      </div>
    </>
  );
};

export default Devocional;
