"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface Props {
  papel: "madrinha" | "padrinho";
  imagem: string;
}

export default function GodparentsFlow({ papel, imagem }: Props) {
  const [etapa, setEtapa] = useState<"parabens" | "escolha" | "convite">("parabens");
  const foiEscolhida = papel === "madrinha";
  const destinatario = foiEscolhida ? "a madrinha" : "o padrinho";
  const tituloEscolha = foiEscolhida
    ? "Você foi escolhida para ser Madrinha do Anthony Gael"
    : "Você foi escolhido para ser Padrinho do Anthony Gael";

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-white px-5 py-10">
      <section
        aria-live="polite"
        className={`w-full animate-surgir text-center ${
          etapa === "convite"
            ? "max-w-[520px]"
            : "max-w-[520px] rounded-[28px] border border-ouro-claro/50 bg-white px-6 py-12 shadow-[0_24px_70px_-38px_rgba(138,100,22,.45)] sm:px-12 sm:py-16"
        }`}
      >
        {etapa !== "convite" && (
          <div className="mx-auto mb-7 flex w-full max-w-[220px] items-center gap-3 text-ouro-claro" aria-hidden>
            <span className="h-px flex-1 bg-ouro-claro/60" />
            <span className="text-2xl">✦</span>
            <span className="h-px flex-1 bg-ouro-claro/60" />
          </div>
        )}

        {etapa === "parabens" ? (
          <>
            <h1 className="font-script text-6xl leading-tight text-ouro sm:text-7xl">Parabéns!</h1>
            <p className="mx-auto mt-5 max-w-[30ch] text-xl leading-relaxed text-ouro-escuro">
              Temos uma notícia muito especial para vocês.
            </p>
            <button type="button" className="btn-ouro mt-9" onClick={() => setEtapa("escolha")}>
              Avançar
            </button>
          </>
        ) : etapa === "escolha" ? (
          <>
            <p className="font-script text-4xl leading-tight text-ouro sm:text-5xl">Com muito carinho</p>
            <h1 className="mx-auto mt-5 max-w-[20ch] text-3xl font-semibold leading-snug text-ouro-escuro sm:text-4xl">
              {tituloEscolha}
            </h1>
            <button type="button" className="btn-ouro mt-9" onClick={() => setEtapa("convite")}>
              Ver o convite
            </button>
          </>
        ) : (
          <>
            <div className="w-full overflow-hidden rounded-[10px] bg-white shadow-[0_30px_60px_-28px_rgba(51,80,110,.35),0_0_0_1px_rgba(188,213,236,.7)]">
              <Image
                src={imagem}
                alt={`Convite especial para ${destinatario} do batizado de Anthony Gael`}
                width={736}
                height={1104}
                priority
                unoptimized
                sizes="(max-width: 520px) 100vw, 520px"
                className="block h-auto w-full object-contain"
              />
            </div>
            <Link href="/" className="btn-ouro mt-7">
              Continuar para o convite principal
            </Link>
          </>
        )}

        {etapa !== "convite" && (
          <div className="mx-auto mt-8 flex w-full max-w-[220px] items-center gap-3 text-ouro-claro" aria-hidden>
            <span className="h-px flex-1 bg-ouro-claro/60" />
            <span className="text-2xl">✦</span>
            <span className="h-px flex-1 bg-ouro-claro/60" />
          </div>
        )}
      </section>
    </main>
  );
}
