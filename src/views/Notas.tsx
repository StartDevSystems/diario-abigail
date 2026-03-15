"use client";
import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { Plus, Trash2, Calendar } from 'lucide-react';

const TAGS = [
  { id: 'general',      label: 'General',       emoji: '📝', color: '#9ca3af' },
  { id: 'oracion',      label: 'Oración',       emoji: '🙏', color: '#e11d74' },
  { id: 'aprendizaje',  label: 'Aprendizaje',   emoji: '📖', color: '#7c3aed' },
  { id: 'suenos',       label: 'Sueños',        emoji: '💭', color: '#2563eb' },
];

const Notas: React.FC = () => {
  const { state, addNote, deleteNote } = useJournal();
  const [newContent, setNewContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('general');
  const [activeFilter, setActiveFilter] = useState('all');

  const handleAdd = () => {
    if (newContent.trim()) {
      addNote(newContent, selectedTag);
      setNewContent('');
      setSelectedTag('general');
    }
  };

  const filteredNotes = activeFilter === 'all' 
    ? state.notes 
    : state.notes.filter(note => (note.tag || 'general') === activeFilter);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <header className="border-b border-[#ffd6e7] pb-6">
        <h2 className="text-4xl font-serif text-[#e11d74] font-light italic">Mis Notas</h2>
        <p className="text-[#1d1d1f]/60 font-medium text-sm mt-1">Captura tus ideas y reflexiones</p>
      </header>

      {/* Barra de Filtros */}
      <div className="flex flex-wrap gap-2 py-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeFilter === 'all' 
              ? 'bg-[#e11d74] text-white shadow-md' 
              : 'bg-white border border-[#ffd6e7] text-[#1d1d1f]/60 hover:bg-[#fff0f5]'
          }`}
        >
          Todas
        </button>
        {TAGS.map(tag => (
          <button
            key={tag.id}
            onClick={() => setActiveFilter(tag.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeFilter === tag.id 
                ? 'text-white shadow-md' 
                : 'bg-white border border-[#ffd6e7] text-[#1d1d1f]/60 hover:bg-[#fff0f5]'
            }`}
            style={{ backgroundColor: activeFilter === tag.id ? tag.color : '' }}
          >
            <span>{tag.emoji}</span>
            {tag.label}
          </button>
        ))}
      </div>

      <div className="card-premium p-6 flex flex-col gap-4">
        {/* Selector de etiquetas para nueva nota */}
        <div className="flex flex-wrap gap-2">
          {TAGS.map(tag => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
                selectedTag === tag.id 
                  ? 'text-white shadow-sm' 
                  : 'bg-[#fff0f5] border-[#ffd6e7] text-[#1d1d1f]/60'
              }`}
              style={{ 
                backgroundColor: selectedTag === tag.id ? tag.color : '',
                borderColor: selectedTag === tag.id ? tag.color : '#ffd6e7'
              }}
            >
              <span>{tag.emoji}</span>
              {tag.label}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Escribe un nuevo pensamiento... 🌸"
            className="flex-1 bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-[#ffd6e7] outline-none text-[#1d1d1f] resize-none h-32 italic transition-all focus:border-[#e11d74]"
          />
          <button onClick={handleAdd} className="bg-[#e11d74] text-white p-5 rounded-2xl hover:scale-105 active:scale-95 transition-all self-end shadow-lg shadow-[#e11d74]/20">
            <Plus size={28} />
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mt-10">
        {filteredNotes.map((note) => {
          const noteTag = TAGS.find(t => t.id === (note.tag || 'general')) || TAGS[0];
          
          return (
            <div key={note.id} className="card-premium p-8 relative group transition-all">
              <button 
                onClick={() => deleteNote(note.id)}
                className="absolute top-6 right-6 text-red-300 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* Badge de Etiqueta */}
                <div 
                  className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1"
                  style={{ backgroundColor: `${noteTag.color}20`, color: noteTag.color }}
                >
                  <span>{noteTag.emoji}</span>
                  {noteTag.label}
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-[#e11d74]" />
                  <span className="text-[10px] font-black text-[#1d1d1f]/40 tracking-[0.2em] uppercase">
                    {new Date(note.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <p className="text-[#1d1d1f] leading-relaxed whitespace-pre-wrap italic text-base break-words">
                {note.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notas;
