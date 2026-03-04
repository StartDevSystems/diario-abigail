"use client";
import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { StickyNote, Plus, Trash2, Calendar } from 'lucide-react';

const Notas: React.FC = () => {
  const { state, addNote, deleteNote } = useJournal();
  const [newContent, setNewContent] = useState('');

  const handleAdd = () => {
    if (newContent.trim()) {
      addNote(newContent);
      setNewContent('');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <header className="border-b border-rose-pastel pb-4">
        <h2 className="text-3xl font-serif text-soft-text font-light italic">Mis Notas</h2>
        <p className="text-soft-text/60 font-medium text-sm">Captura tus ideas</p>
      </header>

      <div className="flex gap-3 bg-white p-5 rounded-3xl journal-shadow border border-rose-pastel/30">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Escribe un nuevo pensamiento..."
          className="flex-1 bg-transparent border-none outline-none text-soft-text px-2 resize-none h-24 italic"
        />
        <button onClick={handleAdd} className="bg-accent-pink text-white p-4 rounded-2xl hover:bg-deep-rose self-end transition-all">
          <Plus size={24} />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        {state.notes.map((note) => (
          <div key={note.id} className="bg-white p-6 rounded-3xl journal-shadow border border-rose-pastel/20 relative group hover:border-accent-pink transition-all">
            <button 
              onClick={() => deleteNote(note.id)}
              className="absolute top-4 right-4 text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={18} />
            </button>
            <div className="flex items-start gap-3 mb-3">
              <Calendar size={14} className="text-accent-pink mt-0.5" />
              <span className="text-[10px] font-bold text-soft-text/40 tracking-widest uppercase">
                {new Date(note.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <p className="text-soft-text leading-relaxed whitespace-pre-wrap italic">
              {note.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notas;
