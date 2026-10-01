"use client";

import { useEffect, useRef, useState } from "react";
import { enviarConfirmacao } from "@/services/confirmacoes";
import { EVENT } from "@/lib/config";
import type { Presenca } from "@/types";

const STORAGE_KEY = "batizado-anthony:rsvp";

interface Props {
  onDone: (nome: string, presenca: Presenca) => void;
}

export default function RsvpForm({ onDone }: Props) {
  const [nome, setNome] = useState("");
  const [presenca, setPresenca] = useState<Presenca | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [erros, setErros] = useState<{ nome?: string; presenca?: string }>({});
  const [erroEnvio, setErroEnvio] = useState("");
  const [enviando, setEnviando] = useState(false);
  const travado = useRef(false); // trava síncrona contra duplo toque
  const nomeRef = useRef<HTMLInputElement>(null);

  // se a pessoa já respondeu neste aparelho, pré-preenche (para poder alterar)
  useEffect(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (salvo?.nome) {
        setNome(salvo.nome);
        setPresenca(salvo.presenca);
        setQuantidade(salvo.quantidade || 1);
      }
    } catch {}
  }, []);

  function validar() {
    const e: typeof erros = {};
    const limpo = nome.trim().replace(/\s+/g, " ");
    if (limpo.length < 2) e.nome = "Digite seu nome completo.";
    else if (!/\p{L}/u.test(limpo)) e.nome = "Digite um nome válido.";
    if (!presenca) e.presenca = "Escolha uma das opções.";
    setErros(e);
    if (e.nome) nomeRef.current?.focus();
    return Object.keys(e).length === 0;
  }

  async function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    if (travado.current) return;
    setErroEnvio("");
    if (!validar() || !presenca) return;

    travado.current = true;
    setEnviando(true);
    const limpo = nome.trim().replace(/\s+/g, " ");
    try {
      await enviarConfirmacao({ nome: limpo, presenca, quantidade });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ nome: limpo, presenca, quantidade }));
      } catch {}
      onDone(limpo, presenca);
    } catch (err) {
      console.error(err);
      setErroEnvio("Não conseguimos salvar sua resposta agora. Verifique a internet e tente novamente.");
      travado.current = false;
      setEnviando(false);
    }
  }

  const opcoes: { valor: Presenca; rotulo: string }[] = [
    { valor: "sim", rotulo: "Sim, estarei presente" },
    { valor: "nao", rotulo: "Não poderei comparecer" },
  ];

  return (
    <form onSubmit={enviar} noValidate className="pt-4">
      <p className="text-center font-script text-[44px] leading-none text-ouro" id="rsvp-titulo">
        Confirmação de presença
      </p>
      <p className="mx-auto mt-2 text-center text-[16px] font-medium text-marinho/80">
        (Obs: Almoço após a celebração do batismo)
      </p>
       <p className="mx-auto mt-2 text-center text-[16px] font-medium text-marinho/80">
        (Sindritrema)
      </p>
        

      <div className="mt-6">
        <label htmlFor="nome" className="mb-2 block text-[17px] font-semibold text-marinho">
          Nome completo
        </label>
        <input
          ref={nomeRef}
          id="nome"
          name="nome"
          type="text"
          autoComplete="name"
          autoCapitalize="words"
          maxLength={120}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          disabled={enviando}
          aria-invalid={!!erros.nome}
          aria-describedby={erros.nome ? "erro-nome" : undefined}
          placeholder="Como você se chama?"
          className={`campo ${erros.nome ? "!border-red-500" : ""}`}
        />
        {erros.nome && (
          <p id="erro-nome" role="alert" className="mt-1.5 text-[15px] font-semibold text-red-700">
            {erros.nome}
          </p>
        )}
      </div>

      <fieldset className="mt-6" disabled={enviando}>
        <legend className="mb-2 text-[17px] font-semibold text-marinho">Você poderá comparecer?</legend>
        <div className="grid gap-2.5" role="radiogroup">
          {opcoes.map((o) => {
            const ativo = presenca === o.valor;
            return (
              <label
                key={o.valor}
                className={`flex min-h-[56px] cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 transition ${
                  ativo ? "border-ouro bg-white shadow-md shadow-ouro/15" : "border-ceu bg-white/70 hover:bg-white"
                } has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-fita`}
              >
                <input
                  type="radio"
                  name="presenca"
                  value={o.valor}
                  checked={ativo}
                  onChange={() => {
                    setPresenca(o.valor);
                    setErros((x) => ({ ...x, presenca: undefined }));
                  }}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${
                    ativo ? "border-ouro" : "border-fita"
                  }`}
                >
                  {ativo && <span className="h-3 w-3 rounded-full bg-ouro" />}
                </span>
                <span className="text-[18px] font-semibold text-tinta">{o.rotulo}</span>
              </label>
            );
          })}
        </div>
        {erros.presenca && (
          <p role="alert" className="mt-1.5 text-[15px] font-semibold text-red-700">
            {erros.presenca}
          </p>
        )}
      </fieldset>

      {presenca === "sim" && (
        <div className="mt-6 animate-surgir">
          <p id="qtd-label" className="mb-2 text-[17px] font-semibold text-marinho">
            Quantas pessoas irão?
          </p>
          <div className="flex items-center justify-between rounded-2xl border border-ceu bg-white px-2 py-2" role="group" aria-labelledby="qtd-label">
            <button
              type="button"
              aria-label="Diminuir quantidade"
              onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
              disabled={enviando || quantidade <= 1}
              className="grid h-12 w-12 place-items-center rounded-full bg-nevoa text-3xl leading-none text-marinho transition active:scale-95 disabled:opacity-40"
            >
              −
            </button>
            <div className="text-center" aria-live="polite">
              <span className="block text-[34px] font-bold leading-none text-marinho">{quantidade}</span>
              <span className="text-[15px] text-tinta/65">{quantidade === 1 ? "pessoa" : "pessoas"}</span>
            </div>
            <button
              type="button"
              aria-label="Aumentar quantidade"
              onClick={() => setQuantidade((q) => Math.min(EVENT.maxPessoas, q + 1))}
              disabled={enviando || quantidade >= EVENT.maxPessoas}
              className="grid h-12 w-12 place-items-center rounded-full bg-nevoa text-3xl leading-none text-marinho transition active:scale-95 disabled:opacity-40"
            >
              +
            </button>
          </div>
          <p className="mt-1.5 text-[15px] text-tinta/65">Inclua você na contagem.</p>
        </div>
      )}

      {erroEnvio && (
        <p role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[16px] font-semibold text-red-800">
          {erroEnvio}
        </p>
      )}

      <button type="submit" className="btn-ouro mt-7" disabled={enviando} aria-busy={enviando}>
        {enviando ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
            Enviando…
          </>
        ) : (
          "Confirmar presença"
        )}
      </button>
    </form>
  );
}
