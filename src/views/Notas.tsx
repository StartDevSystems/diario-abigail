"use client";
import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { Plus, Trash2, Calendar, Download, Lock, Unlock, FileText } from 'lucide-react';

const TAGS = [
  { id: 'general',      label: 'General',       emoji: '\u{1F4DD}', color: '#9ca3af', bgColor: '#9ca3af20' },
  { id: 'oracion',      label: 'Oraci\u00f3n',       emoji: '\u{1F64F}', color: 'var(--color-theme-primary)', bgColor: 'var(--color-theme-accent)' },
  { id: 'aprendizaje',  label: 'Aprendizaje',   emoji: '\u{1F4D6}', color: '#7c3aed', bgColor: '#7c3aed20' },
  { id: 'suenos',       label: 'Sue\u00f1os',        emoji: '\u{1F4AD}', color: '#2563eb', bgColor: '#2563eb20' },
];

// ABI-19: Encryption helpers using Web Crypto API
async function deriveKey(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode('diario-abigail-salt'), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptText(text: string, password: string): Promise<string> {
  const key = await deriveKey(password);
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(text));
  const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...combined));
}

async function decryptText(ciphertext: string, password: string): Promise<string> {
  const key = await deriveKey(password);
  const data = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
  const iv = data.slice(0, 12);
  const encrypted = data.slice(12);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);
  return new TextDecoder().decode(decrypted);
}

const Notas: React.FC = () => {
  const { state, addNote, deleteNote } = useJournal();
  const [newContent, setNewContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('general');
  const [activeFilter, setActiveFilter] = useState('all');
  const [encryptPassword, setEncryptPassword] = useState('');
  const [showEncrypt, setShowEncrypt] = useState(false);
  const [decryptingId, setDecryptingId] = useState<string | null>(null);
  const [decryptPassword, setDecryptPassword] = useState('');
  const [decryptedTexts, setDecryptedTexts] = useState<Record<string, string>>({});
  const [decryptError, setDecryptError] = useState('');

  const handleAdd = async () => {
    if (!newContent.trim()) return;

    if (showEncrypt && encryptPassword.length >= 4) {
      const encrypted = await encryptText(newContent, encryptPassword);
      // We store the encrypted content with a special prefix
      addNote(`__ENC__${encrypted}`, selectedTag);
      setEncryptPassword('');
      setShowEncrypt(false);
    } else {
      addNote(newContent, selectedTag);
    }
    setNewContent('');
    setSelectedTag('general');
  };

  const handleDecrypt = async (noteId: string, content: string) => {
    try {
      setDecryptError('');
      const cipher = content.replace('__ENC__', '');
      const plain = await decryptText(cipher, decryptPassword);
      setDecryptedTexts(prev => ({ ...prev, [noteId]: plain }));
      setDecryptingId(null);
      setDecryptPassword('');
    } catch {
      setDecryptError('Contrasena incorrecta');
    }
  };

  // ABI-15: Export notes to PDF (using printable HTML)
  const handleExportPDF = () => {
    const notes = filteredNotes;
    if (notes.length === 0) return;

    const html = `
      <!DOCTYPE html>
      <html><head>
        <meta charset="utf-8">
        <title>Mis Notas - Diario de Abigail</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Georgia, serif; color: #1d1d1f; padding: 2cm; max-width: 21cm; margin: 0 auto; }
          h1 { font-size: 24pt; color: #e11d74; font-style: italic; margin-bottom: 4pt; }
          .subtitle { font-size: 10pt; color: #999; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 24pt; border-bottom: 2px solid #ffd6e7; padding-bottom: 12pt; }
          .note { margin-bottom: 18pt; padding: 14pt; border: 1px solid #ffd6e7; border-radius: 12pt; page-break-inside: avoid; }
          .note-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8pt; }
          .tag { font-size: 8pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; padding: 2pt 8pt; border-radius: 999px; }
          .date { font-size: 8pt; color: #999; }
          .content { font-size: 11pt; line-height: 1.7; font-style: italic; white-space: pre-wrap; }
          .footer { margin-top: 30pt; text-align: center; font-size: 8pt; color: #ccc; border-top: 1px solid #ffd6e7; padding-top: 12pt; }
          @media print { body { padding: 1cm; } }
        </style>
      </head><body>
        <h1>Mis Notas</h1>
        <div class="subtitle">Diario de Abigail &mdash; ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        ${notes.map(note => {
          const tag = TAGS.find(t => t.id === (note.tag || 'general')) || TAGS[0];
          const isEncrypted = note.content.startsWith('__ENC__');
          return `
            <div class="note">
              <div class="note-header">
                <span class="tag" style="background:#f0f0f0">${tag.emoji} ${tag.label}</span>
                <span class="date">${new Date(note.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div class="content">${isEncrypted ? '[Nota encriptada]' : note.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            </div>
          `;
        }).join('')}
        <div class="footer">Exportado desde Diario de Abigail &bull; ${notes.length} notas</div>
      </body></html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  const filteredNotes = activeFilter === 'all'
    ? state.notes
    : state.notes.filter(note => (note.tag || 'general') === activeFilter);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <header className="border-b border-theme-border pb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-serif text-theme-primary font-light italic">Mis Notas</h2>
          <p className="text-soft-text/60 font-medium text-sm mt-1">Captura tus ideas y reflexiones</p>
        </div>
        {/* ABI-15: Export button */}
        <button
          onClick={handleExportPDF}
          disabled={filteredNotes.length === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-theme-primary text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-theme-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
        >
          <FileText size={16} /> Exportar PDF
        </button>
      </header>

      {/* Barra de Filtros */}
      <div className="flex flex-wrap gap-2 py-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeFilter === 'all'
              ? 'bg-theme-primary text-white shadow-md'
              : 'bg-white border border-theme-border text-soft-text/60 hover:bg-theme-pastel'
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
                : 'bg-white border border-theme-border text-soft-text/60 hover:bg-theme-pastel'
            }`}
            style={{ backgroundColor: activeFilter === tag.id ? tag.color : '' }}
          >
            <span>{tag.emoji}</span>
            {tag.label}
          </button>
        ))}
      </div>

      <div className="card-premium flex flex-col gap-4">
        {/* Selector de etiquetas para nueva nota */}
        <div className="flex flex-wrap gap-2">
          {TAGS.map(tag => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
                selectedTag === tag.id
                  ? 'text-white shadow-sm'
                  : 'bg-theme-pastel border-theme-border text-soft-text/60'
              }`}
              style={{
                backgroundColor: selectedTag === tag.id ? tag.color : '',
                borderColor: selectedTag === tag.id ? tag.color : ''
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
            placeholder="Escribe un nuevo pensamiento..."
            className="flex-1 bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-theme-border outline-none text-soft-text resize-none h-32 italic transition-all focus:border-theme-primary"
          />
          <div className="flex flex-col gap-2 self-end">
            <button onClick={handleAdd} className="bg-theme-primary text-white p-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-theme-primary/20">
              <Plus size={28} />
            </button>
          </div>
        </div>

        {/* ABI-19: Encryption toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowEncrypt(!showEncrypt)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold transition-all border ${
              showEncrypt
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-white border-theme-border text-soft-text/50 hover:bg-theme-pastel'
            }`}
          >
            <Lock size={14} />
            {showEncrypt ? 'Encriptar activado' : 'Encriptar nota'}
          </button>
          {showEncrypt && (
            <input
              type="password"
              value={encryptPassword}
              onChange={e => setEncryptPassword(e.target.value)}
              placeholder="Contrasena (min. 4 caracteres)"
              className="flex-1 min-w-[180px] bg-white/40 border border-amber-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-amber-400 transition-all"
            />
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mt-10">
        {filteredNotes.map((note) => {
          const noteTag = TAGS.find(t => t.id === (note.tag || 'general')) || TAGS[0];
          const isEncrypted = note.content.startsWith('__ENC__');
          const decryptedContent = decryptedTexts[note.id];

          return (
            <div key={note.id} className="card-premium relative group transition-all">
              <button
                onClick={() => deleteNote(note.id)}
                className="absolute top-6 right-6 text-red-400 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 size={18} />
              </button>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* Badge de Etiqueta */}
                <div
                  className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1"
                  style={{ backgroundColor: noteTag.bgColor, color: noteTag.color }}
                >
                  <span>{noteTag.emoji}</span>
                  {noteTag.label}
                </div>

                {isEncrypted && (
                  <div className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-200">
                    <Lock size={10} />
                    Encriptada
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-theme-primary" />
                  <span className="text-[10px] font-black text-soft-text/40 tracking-[0.2em] uppercase">
                    {new Date(note.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {isEncrypted && !decryptedContent ? (
                <div className="space-y-3">
                  <p className="text-soft-text/40 italic text-sm">Esta nota esta protegida con contrasena.</p>
                  {decryptingId === note.id ? (
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={decryptPassword}
                        onChange={e => { setDecryptPassword(e.target.value); setDecryptError(''); }}
                        placeholder="Contrasena"
                        onKeyDown={e => e.key === 'Enter' && handleDecrypt(note.id, note.content)}
                        className="flex-1 bg-white/40 border border-amber-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400"
                      />
                      <button
                        onClick={() => handleDecrypt(note.id, note.content)}
                        className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-all"
                      >
                        <Unlock size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setDecryptingId(note.id); setDecryptPassword(''); setDecryptError(''); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold hover:bg-amber-100 transition-all"
                    >
                      <Unlock size={14} /> Desbloquear
                    </button>
                  )}
                  {decryptError && decryptingId === note.id && (
                    <p className="text-red-500 text-[11px] font-bold">{decryptError}</p>
                  )}
                </div>
              ) : (
                <p className="text-soft-text leading-relaxed whitespace-pre-wrap italic text-base break-words">
                  {decryptedContent || note.content}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notas;
