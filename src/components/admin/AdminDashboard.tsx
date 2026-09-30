"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { excluirConfirmacao, listarConfirmacoes } from "@/services/confirmacoes";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { Confirmacao } from "@/types";

type Filtro = "todos" | "sim" | "nao";

const semAcento = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const fmtData = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date(iso));

export default function AdminDashboard({ email }: { email: string }) {
  const router = useRouter();
  const [dados, setDados] = useState<Confirmacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      setDados(await listarConfirmacoes());
    } catch {
      setErro("Não foi possível carregar as confirmações. Confira o SQL/RLS e o e-mail de admin.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const stats = useMemo(() => {
    const sim = dados.filter((d) => d.presenca === "sim");
    return {
      respostas: dados.length,
      confirmados: sim.length,
      pessoas: sim.reduce((t, d) => t + d.quantidade_pessoas, 0),
      nao: dados.filter((d) => d.presenca === "nao").length,
    };
  }, [dados]);

  const lista = useMemo(() => {
    const q = semAcento(busca.trim());
    return dados.filter((d) => (filtro === "todos" || d.presenca === filtro) && (!q || semAcento(d.nome).includes(q)));
  }, [dados, busca, filtro]);

  async function excluir(id: string) {
    setExcluindoId(id);
    try {
      await excluirConfirmacao(id);
      setDados((x) => x.filter((d) => d.id !== id));
      setConfirmandoId(null);
    } catch {
      setErro("Não foi possível excluir. Tente novamente.");
    } finally {
      setExcluindoId(null);
    }
  }

  async function sair() {
    await getSupabaseBrowser().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  const cards = [
    { rotulo: "Respostas", valor: stats.respostas },
    { rotulo: "Confirmados", valor: stats.confirmados },
    { rotulo: "Pessoas confirmadas", valor: stats.pessoas, destaque: true },
    { rotulo: "Não poderão ir", valor: stats.nao },
  ];
  const filtros: { id: Filtro; rotulo: string }[] = [
    { id: "todos", rotulo: "Todos" },
    { id: "sim", rotulo: "Confirmados" },
    { id: "nao", rotulo: "Não irão" },
  ];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-script text-[44px] leading-none text-ouro">Confirmações</h1>
          <p className="mt-1 text-[16px] text-tinta/65">Batizado de Anthony Gael · {email}</p>
        </div>
        <button onClick={sair} className="min-h-[44px] rounded-full px-4 font-semibold text-marinho underline underline-offset-4">
          Sair
        </button>
      </header>

      <section aria-label="Resumo" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((c) => (
          <div key={c.rotulo} className={`rounded-2xl p-4 ${c.destaque ? "bg-marinho text-white" : "bg-white/85"} shadow-sm ring-1 ring-ceu/60`}>
            <div className="text-[36px] font-bold leading-none">{carregando ? "–" : c.valor}</div>
            <div className={`mt-1 text-[15px] leading-tight ${c.destaque ? "text-white/85" : "text-tinta/70"}`}>{c.rotulo}</div>
          </div>
        ))}
      </section>

      <section className="mt-6 space-y-3">
        <div className="flex gap-2">
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome"
            aria-label="Buscar por nome"
            className="campo"
          />
          <button onClick={carregar} disabled={carregando} className="btn-contorno !w-auto !px-5" aria-label="Atualizar dados">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={carregando ? "animate-spin" : ""} aria-hidden>
              <path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar">
          {filtros.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              aria-pressed={filtro === f.id}
              className={`min-h-[44px] rounded-full px-5 font-semibold transition ${
                filtro === f.id ? "bg-ouro text-white" : "bg-white/85 text-marinho ring-1 ring-ceu"
              }`}
            >
              {f.rotulo}
            </button>
          ))}
        </div>
      </section>

      {erro && <p role="alert" className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-800">{erro}</p>}

      <ul className="mt-4 space-y-2.5">
        {!carregando && lista.length === 0 && !erro && (
          <li className="rounded-2xl bg-white/70 p-6 text-center text-tinta/70">
            {dados.length === 0 ? "Ninguém respondeu ainda. Compartilhe o link do convite." : "Nenhum resultado para essa busca."}
          </li>
        )}
        {lista.map((d) => (
          <li key={d.id} className="rounded-2xl bg-white/90 p-4 shadow-sm ring-1 ring-ceu/60">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words text-[19px] font-bold text-tinta">{d.nome}</p>
                <p className="mt-0.5 text-[15px] text-tinta/60">{fmtData(d.created_at)}</p>
              </div>
              <div className="shrink-0 text-right">
                <span className={`inline-block rounded-full px-3 py-1 text-[15px] font-bold ${d.presenca === "sim" ? "bg-folha/20 text-emerald-900" : "bg-ceu/60 text-marinho"}`}>
                  {d.presenca === "sim" ? "Vai" : "Não vai"}
                </span>
                {d.presenca === "sim" && (
                  <p className="mt-1 text-[15px] text-tinta/75">{d.quantidade_pessoas} {d.quantidade_pessoas === 1 ? "pessoa" : "pessoas"}</p>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-end gap-2">
              {confirmandoId === d.id ? (
                <>
                  <span className="mr-auto text-[15px] font-semibold text-red-800">Excluir esta confirmação?</span>
                  <button onClick={() => setConfirmandoId(null)} className="min-h-[44px] rounded-full px-4 font-semibold text-marinho">Cancelar</button>
                  <button onClick={() => excluir(d.id)} disabled={excluindoId === d.id} className="min-h-[44px] rounded-full bg-red-700 px-5 font-semibold text-white disabled:opacity-60">
                    {excluindoId === d.id ? "Excluindo…" : "Excluir"}
                  </button>
                </>
              ) : (
                <button onClick={() => setConfirmandoId(d.id)} className="min-h-[44px] rounded-full px-4 font-semibold text-red-800 hover:bg-red-50">
                  Excluir
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
