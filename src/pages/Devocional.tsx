"use client";
import React from 'react';
import { useJournal } from '../context/JournalContext';
import { Book, Quote, Heart, PenLine, Sparkles } from 'lucide-react';

const Devocional: React.FC = () => {
  const { state, updateToday } = useJournal();
  const { today } = state;

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-10">
      <header className="border-b border-rose-pastel pb-4 text-center">
        <h2 className="text-3xl font-serif text-soft-text font-light italic">Tiempo con Dios</h2>
        <p className="text-soft-text/60 font-medium text-sm">Creciendo en fe</p>
      </header>

      {/* Versículo */}
      <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-rose-pastel relative floral-pattern">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent-pink text-white p-3 rounded-full">
          <Book size={24} />
        </div>
        <div className="flex flex-col items-center text-center space-y-4 pt-4">
          <Quote className="text-accent-pink/20" size={40} />
          <p className="text-xl font-serif text-soft-text italic leading-relaxed">
            "{today.devocionalVerse}"
          </p>
          <span className="font-bold text-deep-rose uppercase text-xs tracking-widest">
            — {today.devocionalRef}
          </span>
        </div>
      </section>

      {/* Reflexión y Peticiones */}
      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-lavender-pastel/40 p-6 rounded-3xl border border-accent-lavender/30">
          <div className="flex items-center gap-2 mb-4 text-deep-rose font-bold text-xs uppercase tracking-widest">
            <Heart size={16} fill="#fbcfe8" className="text-accent-pink" />
            <h3>Reflexión</h3>
          </div>
          <textarea
            value={today.devocionalReflection}
            onChange={(e) => updateToday({ devocionalReflection: e.target.value })}
            placeholder="¿Qué aprendiste hoy?"
            className="w-full h-32 bg-transparent border-none outline-none resize-none text-soft-text text-sm leading-relaxed italic"
          />
        </section>

        <section className="bg-rose-pastel/30 p-6 rounded-3xl border border-rose-pastel/50">
          <div className="flex items-center gap-2 mb-4 text-deep-rose font-bold text-xs uppercase tracking-widest">
            <PenLine size={16} />
            <h3>Peticiones</h3>
          </div>
          <textarea
            value={today.prayerAsk}
            onChange={(e) => updateToday({ prayerAsk: e.target.value })}
            placeholder="¿Qué le pides al Señor?"
            className="w-full h-32 bg-transparent border-none outline-none resize-none text-soft-text text-sm leading-relaxed italic"
          />
        </section>
      </div>

      {/* Agradecimientos y Decretos */}
      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-rose-pastel/50">
          <div className="flex items-center gap-2 mb-4 text-deep-rose font-bold text-xs uppercase tracking-widest">
            <Sparkles size={16} className="text-accent-pink" />
            <h3>Agradecimientos Oración</h3>
          </div>
          <textarea
            value={today.prayerThanks}
            onChange={(e) => updateToday({ prayerThanks: e.target.value })}
            placeholder="Gracias por..."
            className="w-full h-32 bg-transparent border-none outline-none resize-none text-soft-text text-sm leading-relaxed italic"
          />
        </section>

        <section className="bg-white p-6 rounded-3xl shadow-sm border border-rose-pastel/50">
          <div className="flex items-center gap-2 mb-4 text-deep-rose font-bold text-xs uppercase tracking-widest">
            <Sparkles size={16} fill="#fbcfe8" className="text-accent-pink" />
            <h3>Decretos de Fe</h3>
          </div>
          <textarea
            value={today.prayerDecree}
            onChange={(e) => updateToday({ prayerDecree: e.target.value })}
            placeholder="Yo declaro que..."
            className="w-full h-32 bg-transparent border-none outline-none resize-none text-soft-text text-sm leading-relaxed italic"
          />
        </section>
      </div>
    </div>
  );
};

export default Devocional;
