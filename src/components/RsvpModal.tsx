"use client";

import { useEffect, useRef, useState } from "react";
import RsvpForm from "./RsvpForm";
import SuccessView from "./SuccessView";
import type { Presenca } from "@/types";

export default function RsvpModal({ onClose }: { onClose: () => void }) {
  const [resultado, setResultado] = useState<{ nome: string; presenca: Presenca } | null>(null);
  const painel = useRef<HTMLDivElement>(null);

  // bloqueia rolagem do fundo, fecha com Esc, devolve o foco ao fechar
  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    painel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      anterior?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="presentation">
      <div className="absolute inset-0 animate-surgir bg-marinho/45 backdrop-blur-[3px]" onClick={onClose} aria-hidden />
      <div
        ref={painel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rsvp-titulo"
        className="relative max-h-[94dvh] w-full max-w-[480px] animate-subir overflow-y-auto rounded-t-[28px] bg-creme px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl outline-none sm:rounded-[28px] sm:px-8 sm:pb-8"
      >
        <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-ceu sm:hidden" aria-hidden />
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full text-tinta/60 hover:bg-ceu/40"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {resultado ? (
          <SuccessView presenca={resultado.presenca} onClose={onClose} onChange={() => setResultado(null)} />
        ) : (
          <RsvpForm onDone={(nome, presenca) => setResultado({ nome, presenca })} />
        )}
      </div>
    </div>
  );
}
