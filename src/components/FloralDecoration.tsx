"use client";
// ─────────────────────────────────────────────────────────────
// ARCHIVO: src/components/FloralDecoration.tsx
// ─────────────────────────────────────────────────────────────
export default function FloralDecoration() {
  return (
    <>
      {/* Esquina superior izquierda */}
      <svg
        className="fixed top-[-20px] left-[-20px] w-[200px] pointer-events-none z-0 opacity-[0.14]"
        viewBox="0 0 260 260" fill="none"
      >
        <circle cx="40" cy="40" r="30" fill="#fbcfe8" />
        <circle cx="80" cy="20" r="20" fill="#fdf2f2" />
        <circle cx="20" cy="80" r="22" fill="#fbcfe8" />
        <ellipse cx="60" cy="60" rx="50" ry="30" fill="#fdf2f2" opacity=".5" />
        <circle cx="110" cy="40" r="14" fill="#fbcfe8" opacity=".6" />
        <circle cx="40" cy="110" r="12" fill="#fbcfe8" opacity=".5" />
      </svg>

      {/* Esquina inferior derecha */}
      <svg
        className="fixed bottom-[-20px] right-[-20px] w-[180px] pointer-events-none z-0 opacity-[0.14] rotate-180"
        viewBox="0 0 240 240" fill="none"
      >
        <circle cx="40" cy="40" r="28" fill="#fbcfe8" />
        <circle cx="75" cy="18" r="18" fill="#fdf2f2" />
        <circle cx="18" cy="75" r="20" fill="#fbcfe8" />
        <ellipse cx="55" cy="55" rx="46" ry="28" fill="#fdf2f2" opacity=".5" />
        <circle cx="100" cy="38" r="12" fill="#fbcfe8" opacity=".6" />
      </svg>
    </>
  );
}