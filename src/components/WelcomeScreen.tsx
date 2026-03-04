"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useJournal } from "@/context/JournalContext";
import { Mood } from "@/types";

const FEELINGS: {
  emoji: string; label: string; mood: Mood;
  ref: string; apiRef: string; fallback: string;
}[] = [
  { emoji:"😰", label:"Ansiosa",     mood:"triste",  ref:"Filipenses 4:6-7",   apiRef:"Philippians 4:6-7",   fallback:"No se inquieten por nada; más bien, en toda ocasión, con oración y ruego, presenten sus peticiones a Dios y él les dará una paz que sobrepasa todo entendimiento." },
  { emoji:"😢", label:"Triste",      mood:"triste",  ref:"Salmos 34:18",        apiRef:"Psalm 34:18",          fallback:"El Señor está cerca de los quebrantados de corazón, y salva a los de espíritu abatido." },
  { emoji:"🥺", label:"Sola",        mood:"triste",  ref:"Josué 1:9",           apiRef:"Joshua 1:9",           fallback:"Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo." },
  { emoji:"😊", label:"Feliz",       mood:"feliz",   ref:"Salmos 118:24",       apiRef:"Psalm 118:24",         fallback:"Este es el día que hizo Jehová; nos gozaremos y alegraremos en él." },
  { emoji:"😴", label:"Agotada",     mood:"neutral", ref:"Mateo 11:28",         apiRef:"Matthew 11:28",        fallback:"Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar." },
  { emoji:"😤", label:"Enojada",     mood:"neutral", ref:"Efesios 4:26",        apiRef:"Ephesians 4:26",       fallback:"Airaos, pero no pequéis; no se ponga el sol sobre vuestro enojo." },
  { emoji:"🥰", label:"Agradecida",  mood:"feliz",   ref:"1 Tes. 5:18",        apiRef:"1 Thessalonians 5:18", fallback:"Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús." },
  { emoji:"😨", label:"Con miedo",   mood:"triste",  ref:"Isaías 41:10",        apiRef:"Isaiah 41:10",         fallback:"No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo." },
  { emoji:"🌅", label:"Esperanzada", mood:"feliz",   ref:"Jeremías 29:11",      apiRef:"Jeremiah 29:11",       fallback:"Porque yo sé los pensamientos que tengo acerca de vosotros, pensamientos de paz y no de mal." },
  { emoji:"😵", label:"Confundida",  mood:"neutral", ref:"Santiago 1:5",        apiRef:"James 1:5",            fallback:"Si alguno de vosotros tiene falta de sabiduría, pídala a Dios, el cual da a todos abundantemente y sin reproche." },
];

interface WelcomeScreenProps { onEnter: () => void; }

export default function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  const { updateToday, user } = useJournal(); // Extraemos 'user'
  const [screen, setScreen] = useState<"feelings"|"verse">("feelings");
  const [selected, setSelected] = useState<typeof FEELINGS[0]|null>(null);
  const [verseText, setVerseText] = useState("");
  const [verseRef, setVerseRef] = useState("");
  const [loading, setLoading] = useState(false);

  const fecha = new Date().toLocaleDateString("es-ES", { weekday:"long", day:"numeric", month:"long" });
  const firstName = user?.displayName?.split(' ')[0] || "Abigail";

  async function pickFeeling(f: typeof FEELINGS[0]) {
    setSelected(f);
    updateToday({ mood: f.mood, devocionalVerse: f.fallback, devocionalRef: f.ref });
    await new Promise(r => setTimeout(r, 350));
    setLoading(true);
    setScreen("verse");
    try {
      const res = await fetch(`https://bible-api.com/${encodeURIComponent(f.apiRef)}?translation=reina-valera`);
      const data = await res.json();
      if (data.text) {
        const clean = data.text.trim().replace(/\n/g, " ");
        setVerseText(clean);
        setVerseRef(data.reference ?? f.ref);
        updateToday({ devocionalVerse: clean, devocionalRef: data.reference ?? f.ref });
      } else { setVerseText(f.fallback); setVerseRef(f.ref); }
    } catch { setVerseText(f.fallback); setVerseRef(f.ref); }
    finally { setLoading(false); }
  }

  function goBack() {
    setScreen("feelings"); setSelected(null);
    setVerseText(""); setVerseRef(""); setLoading(false);
  }

  return (
    <AnimatePresence mode="wait">
      {screen === "feelings" && (
        <motion.div key="feelings"
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, scale:0.97 }}
          transition={{ duration:0.4 }}
          style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}
        >
          <motion.div className="text-center mb-10"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15, duration:0.55 }}>
            <p style={{ fontSize:11, color:"#9ca3af", textTransform:"uppercase", letterSpacing:".08em", marginBottom:12 }}>{fecha}</p>
            <h1 className="font-playfair text-soft-text" style={{ fontStyle:"italic", fontSize:38, lineHeight:1.2, marginBottom:8 }}>
              Hola, {firstName} 🌿
            </h1>
            <p style={{ fontSize:13, color:"#9ca3af" }}>¿Cómo te sientes hoy?</p>
          </motion.div>

          <motion.div
            style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, width:"100%", maxWidth:560 }}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35, duration:0.5 }}>
            {FEELINGS.map((f, i) => (
              <motion.button key={f.label} onClick={() => pickFeeling(f)}
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 + i*0.04 }}
                whileHover={{ y:-3, scale:1.05 }} whileTap={{ scale:0.9 }}
                style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:7,
                  padding:"14px 6px", background:"rgba(255,255,255,.72)",
                  border:"1px solid rgba(163,21,80,.1)", borderRadius:20, cursor:"pointer" }}>
                <span style={{ fontSize:26 }}>{f.emoji}</span>
                <span style={{ fontSize:10, color:"#9ca3af", fontWeight:500, textAlign:"center" }}>{f.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      )}

      {screen === "verse" && (
        <motion.div key="verse"
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          transition={{ duration:0.45 }}
          style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>

          <motion.p initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            style={{ fontSize:11, color:"#9ca3af", textTransform:"uppercase", letterSpacing:".08em", marginBottom:20 }}>
            Me siento {selected?.label.toLowerCase()}
          </motion.p>

          <motion.div
            initial={{ opacity:0, y:24, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }}
            transition={{ delay:0.3, duration:0.6, ease:"easeOut" }}
            style={{ width:"100%", maxWidth:480, background:"rgba(255,255,255,.92)",
              border:"1px solid rgba(163,21,80,.1)", borderRadius:28, padding:40,
              textAlign:"center", position:"relative", overflow:"hidden",
              boxShadow:"0 16px 60px rgba(163,21,80,.1),0 2px 8px rgba(163,21,80,.05)" }}>

            <div style={{ position:"absolute", top:-56, left:-56, width:192, height:192, borderRadius:"50%", background:"radial-gradient(circle, rgba(248,215,232,.55) 0%, transparent 70%)", pointerEvents:"none" }} />
            <div style={{ position:"absolute", bottom:-40, right:-40, width:144, height:144, borderRadius:"50%", background:"radial-gradient(circle, rgba(248,215,232,.35) 0%, transparent 70%)", pointerEvents:"none" }} />

            <motion.button onClick={onEnter}
              initial={{ opacity:0, scale:0.6 }} animate={{ opacity:1, scale:1 }}
              transition={{ delay:0.85, duration:0.3, ease:"backOut" }}
              whileHover={{ scale:1.15, rotate:90 }} whileTap={{ scale:0.88 }}
              style={{ position:"absolute", top:14, right:14, zIndex:20,
                width:32, height:32, borderRadius:"50%",
                background:"rgba(163,21,80,.07)", border:"1px solid rgba(163,21,80,.14)",
                display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <X size={13} strokeWidth={2.5} color="#9ca3af" />
            </motion.button>

            <span className="font-playfair" style={{ fontSize:72, color:"rgba(163,21,80,.1)", lineHeight:.4, display:"block", marginBottom:16, position:"relative", zIndex:1 }}>"</span>

            {loading ? (
              <div style={{ display:"flex", justifyContent:"center", gap:8, margin:"32px 0", position:"relative", zIndex:1 }}>
                {[0,1,2].map(i => (
                  <motion.div key={i} style={{ width:8, height:8, borderRadius:"50%", background:"rgba(163,21,80,.3)" }}
                    animate={{ scale:[.8,1.3,.8], opacity:[.4,1,.4] }}
                    transition={{ duration:1.2, repeat:Infinity, delay:i*.2 }} />
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
                style={{ position:"relative", zIndex:1 }}>
                <p className="font-playfair text-soft-text" style={{ fontStyle:"italic", fontSize:17, lineHeight:1.8, marginBottom:20 }}>
                  {verseText}
                </p>
                <div style={{ width:32, height:1, background:"rgba(163,21,80,.2)", margin:"0 auto 16px" }} />
                <p style={{ fontSize:11, color:"#9d1450", fontWeight:600, letterSpacing:".06em", textTransform:"uppercase" }}>
                  {verseRef}
                </p>
              </motion.div>
            )}
          </motion.div>

          <motion.button initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
            onClick={goBack}
            style={{ marginTop:20, fontSize:11, color:"#9ca3af", background:"transparent", border:"none", cursor:"pointer" }}>
            ← Cambiar sentimiento
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
