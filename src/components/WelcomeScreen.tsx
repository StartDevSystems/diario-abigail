"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2 } from "lucide-react";
import { useJournal } from "@/context/JournalContext";
import { Mood } from "@/types";

const VERSES_BY_FEELING: Record<string, { ref: string; api: string; fallback: string }[]> = {
  "Ansiosa": [
    { ref: "Filipenses 4:6-7", api: "filipenses/4/6", fallback: "No se inquieten por nada; más bien, en toda ocasión, con oración y ruego, presenten sus peticiones a Dios y él les dará su paz." },
    { ref: "1 Pedro 5:7", api: "1pedro/5/7", fallback: "Depositen en él toda su ansiedad, porque él cuida de ustedes." },
    { ref: "Salmos 94:19", api: "salmos/94/19", fallback: "Cuando en mí la angustia iba en aumento, tu consuelo llenaba mi alma de alegría." }
  ],
  "Triste": [
    { ref: "Salmos 34:18", api: "salmos/34/18", fallback: "El Señor está cerca de los quebrantados de corazón, y salva a los de espíritu abatido." },
    { ref: "Mateo 5:4", api: "mateo/5/4", fallback: "Bienaventurados los que lloran, porque ellos recibirán consolación." },
    { ref: "Juan 14:27", api: "juan/14/27", fallback: "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón." }
  ],
  "Sola": [
    { ref: "Josué 1:9", api: "josue/1/9", fallback: "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo." },
    { ref: "Isaías 41:10", api: "isaias/41/10", fallback: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo." },
    { ref: "Mateo 28:20", api: "mateo/28/20", fallback: "He aquí yo estoy con vosotros todos los días, hasta el fin del mundo. Amén." }
  ],
  "Feliz": [
    { ref: "Salmos 118:24", api: "salmos/118/24", fallback: "Este es el día que hizo Jehová; nos gozaremos y alegraremos en él." },
    { ref: "Filipenses 4:4", api: "filipenses/4/4", fallback: "Regocijaos en el Señor siempre. Otra vez digo: ¡Regocijaos!" },
    { ref: "1 Tesalonicenses 5:16", api: "1tesalonicenses/5/16", fallback: "Estad siempre gozosos." }
  ],
  "Agotada": [
    { ref: "Mateo 11:28", api: "mateo/11/28", fallback: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar." },
    { ref: "Isaías 40:31", api: "isaias/40/31", fallback: "Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas." },
    { ref: "Salmos 62:1", api: "salmos/62/1", fallback: "En Dios solamente está acallada mi alma; de él viene mi salvación." }
  ],
  "Enojada": [
    { ref: "Efesios 4:26", api: "efesios/4/26", fallback: "Airaos, pero no pequéis; no se ponga el sol sobre vuestro enojo." },
    { ref: "Proverbios 15:1", api: "proverbios/15/1", fallback: "La blanda respuesta quita la ira; mas la palabra áspera hace subir el furor." },
    { ref: "Santiago 1:19", api: "santiago/1/19", fallback: "Todo hombre sea pronto para oír, tardo para hablar, tardo para airarse." }
  ],
  "Agradecida": [
    { ref: "1 Tesalonicenses 5:18", api: "1tesalonicenses/5/18", fallback: "Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús." },
    { ref: "Salmos 107:1", api: "salmos/107/1", fallback: "Alabad a Jehová, porque él es bueno; porque para siempre es su misericordia." },
    { ref: "Colosenses 3:15", api: "colosenses/3/15", fallback: "Y la paz de Dios gobierne en vuestros corazones... y sed agradecidos." }
  ],
  "Con miedo": [
    { ref: "Salmos 56:3", api: "salmos/56/3", fallback: "En el día que temo, yo en ti confío." },
    { ref: "2 Timoteo 1:7", api: "2timoteo/1/7", fallback: "Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio." },
    { ref: "Isaías 43:1", api: "isaias/43/1", fallback: "No temas, porque yo te redimí; te puse nombre, mío eres tú." }
  ],
  "Esperanzada": [
    { ref: "Jeremías 29:11", api: "jeremias/29/11", fallback: "Porque yo sé los pensamientos que tengo acerca de vosotros... pensamientos de paz, y no de mal." },
    { ref: "Romanos 15:13", api: "romanos/15/13", fallback: "Y el Dios de esperanza os llene de todo gozo y paz en el creer." },
    { ref: "Hebreos 11:1", api: "hebreos/11/1", fallback: "Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve." }
  ],
  "Confundida": [
    { ref: "Santiago 1:5", api: "santiago/1/5", fallback: "Y si alguno de vosotros tiene falta de sabiduría, pídala a Dios, el cual da a todos abundantemente." },
    { ref: "Proverbios 3:5-6", api: "proverbios/3/5", fallback: "Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia." },
    { ref: "Salmos 32:8", api: "salmos/32/8", fallback: "Te haré entender, y te enseñaré el camino en que debes andar; sobre ti fijaré mis ojos." }
  ],
};

const FEELINGS: { emoji: string; label: string; mood: Mood }[] = [
  { emoji:"😰", label:"Ansiosa",     mood:"triste" },
  { emoji:"😢", label:"Triste",      mood:"triste" },
  { emoji:"🥺", label:"Sola",        mood:"triste" },
  { emoji:"😊", label:"Feliz",       mood:"feliz" },
  { emoji:"😴", label:"Agotada",     mood:"neutral" },
  { emoji:"😤", label:"Enojada",     mood:"neutral" },
  { emoji:"🥰", label:"Agradecida",  mood:"feliz" },
  { emoji:"😨", label:"Con miedo",   mood:"triste" },
  { emoji:"🌅", label:"Esperanzada", mood:"feliz" },
  { emoji:"😵", label:"Confundida",  mood:"neutral" },
];

interface WelcomeScreenProps { onEnter: () => void; }

export default function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  const { state, updateToday, user } = useJournal();
  const [screen, setScreen] = useState<"feelings"|"verse">("feelings");
  const [loading, setLoading] = useState(false);
  const [verseText, setVerseText] = useState("");
  const [verseRef, setVerseRef] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");

  const fecha = new Date().toLocaleDateString("es-ES", { weekday:"long", day:"numeric", month:"long" });
  const firstName = state?.user?.name || user?.displayName?.split(' ')[0] || "Abigail";

  async function fetchVerseByFeeling(label: string) {
    setLoading(true);
    const possibleVerses = VERSES_BY_FEELING[label] || VERSES_BY_FEELING["Esperanzada"];
    const selected = possibleVerses[Math.floor(Math.random() * possibleVerses.length)];
    
    // Seteamos el fallback inmediatamente por si la API falla o tarda
    setVerseText(selected.fallback);
    setVerseRef(selected.ref);

    try {
      const res = await fetch(`https://bible-api.deno.dev/api/read/rv1960/${selected.api}`);
      const data = await res.json();
      
      let finalContent = "";
      
      // Mapeo robusto de la API
      if (data && data.vers && Array.isArray(data.vers)) {
        // En arrays, 'verse' suele ser el texto del versículo
        finalContent = data.vers.map((v: any) => v.verse || v.text || "").join(" ");
      } else if (data) {
        // Para un solo versículo, intentamos 'text' primero, luego 'verse' (si es string)
        finalContent = data.text || (typeof data.verse === 'string' ? data.verse : "");
      }

      if (finalContent && finalContent.length > 5) {
        const cleanText = finalContent.replace(/<[^>]*>?/gm, '').trim();
        setVerseText(cleanText);
        updateToday({ devocionalVerse: cleanText, devocionalRef: selected.ref });
      } else {
        // Si no hay contenido válido, nos quedamos con el fallback que ya pusimos
        updateToday({ devocionalVerse: selected.fallback, devocionalRef: selected.ref });
      }
    } catch (err) {
      console.error("Bible API Error:", err);
      updateToday({ devocionalVerse: selected.fallback, devocionalRef: selected.ref });
    } finally {
      setLoading(false);
    }
  }

  async function pickFeeling(f: typeof FEELINGS[0]) {
    setSelectedLabel(f.label);
    updateToday({ mood: f.mood });
    setScreen("verse");
    await fetchVerseByFeeling(f.label);
  }

  return (
    <AnimatePresence mode="wait">
      {screen === "feelings" && (
        <motion.div key="feelings"
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, scale:0.97 }}
          transition={{ duration:0.4 }}
          className="fixed inset-0 flex flex-col items-center justify-center p-6 bg-theme-light z-[9999]"
        >
          <motion.div className="text-center mb-12"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-theme-primary/30 mb-4">{fecha}</p>
            <h1 className="font-serif italic text-5xl text-soft-text leading-tight mb-4">
              Hola, {firstName} 🌸
            </h1>
            <p className="text-sm font-medium text-soft-text/40">Antes de empezar, ¿cómo late tu corazón hoy?</p>
          </motion.div>

          <div className="w-full max-w-md mx-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
            {FEELINGS.map((f, i) => (
              <motion.button
                key={f.label}
                onClick={() => pickFeeling(f)}
                initial={{ opacity:0, y:10 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.3 + i*0.03 }}
                whileHover={{ y:-5, scale:1.05 }}
                whileTap={{ scale:0.95 }}
                className="flex flex-col items-center gap-2 py-4 px-2 bg-white rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-all group"
              >
                <span className="text-4xl">{f.emoji}</span>
                <span className="text-[11px] font-bold text-soft-text/50 group-hover:text-theme-primary whitespace-nowrap capitalize">{f.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {screen === "verse" && (
        <motion.div key="verse"
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          className="fixed inset-0 flex flex-col items-center justify-center p-6 bg-theme-light z-[9999]"
        >
          <motion.div
            initial={{ opacity:0, y:30, scale:0.95 }} 
            animate={{ opacity:1, y:0, scale:1 }}
            transition={{ duration:0.6, ease:"easeOut" }}
            className="w-full max-w-lg bg-white rounded-[3rem] p-10 md:p-16 text-center border-2 border-theme-border shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-theme-pastel/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-50 rounded-full blur-3xl pointer-events-none" />

            <button onClick={onEnter} className="absolute right-8 top-8 p-2 bg-theme-pastel/20 rounded-full hover:rotate-90 transition-all text-theme-primary/40 hover:text-theme-primary">
              <X size={18} />
            </button>

            <div className="mb-8 flex flex-col items-center gap-2">
              <Sparkles className="text-theme-primary mb-2" size={24} />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-theme-primary/40">Consuelo para tu corazón {selectedLabel.toLowerCase()}</p>
            </div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
              <p className="font-serif italic text-2xl md:text-3xl text-soft-text leading-relaxed mb-8 px-4">
                "{verseText}"
              </p>
              <div className="w-12 h-1 bg-theme-pastel mx-auto mb-6 rounded-full" />
              <p className="text-xs font-black uppercase tracking-[0.2em] text-theme-primary flex items-center justify-center gap-2">
                {loading && <Loader2 className="animate-spin" size={12} />}
                {verseRef}
              </p>
              
              <button 
                onClick={onEnter}
                className="mt-12 w-full py-5 bg-theme-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-theme-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Amén, abrir mi diario
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
