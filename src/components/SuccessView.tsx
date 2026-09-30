import type { Presenca } from "@/types";

interface Props {
  presenca: Presenca;
  onClose: () => void;
  onChange: () => void;
}

export default function SuccessView({ presenca, onClose, onChange }: Props) {
  const vai = presenca === "sim";
  return (
    <div className="animate-surgir px-1 pb-2 pt-8 text-center" role="status" aria-live="polite">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white shadow-[0_0_0_6px_rgba(188,213,236,.55)]">
        {vai ? (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#A97C1F" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        ) : (
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#6F9BC4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 20.5s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.8a4.3 4.3 0 0 1 7.5 2.7c0 5.4-7.5 10-7.5 10Z" />
          </svg>
        )}
      </div>

      <h2 id="rsvp-titulo" className="mt-5 font-script text-[46px] leading-[1.05] text-ouro">
        {vai ? "Presença confirmada!" : "Obrigado por nos avisar."}
      </h2>
      <p className="mx-auto mt-4 max-w-[28ch] text-[20px] leading-snug text-tinta">
        {vai
          ? "Obrigado por confirmar. Será uma alegria ter você conosco neste momento especial."
          : "Sentiremos sua ausência e agradecemos por confirmar."}
      </p>

      <div className="mt-8 flex flex-col gap-2">
        <button type="button" className="btn-ouro" onClick={onClose}>
          Voltar ao convite
        </button>
        <button type="button" onClick={onChange} className="min-h-[48px] text-[17px] font-semibold text-marinho underline underline-offset-4">
          Alterar minha resposta
        </button>
      </div>
    </div>
  );
}
