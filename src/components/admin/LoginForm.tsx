"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    if (carregando) return;
    setErro("");
    setCarregando(true);
    try {
      const { error } = await getSupabaseBrowser().auth.signInWithPassword({ email: email.trim(), password: senha });
      if (error) throw error;
      router.replace("/admin");
      router.refresh();
    } catch {
      setErro("E-mail ou senha incorretos.");
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={entrar} className="mt-8 space-y-4 rounded-3xl bg-white/80 p-5 shadow-xl shadow-ceu/40">
      <div>
        <label htmlFor="email" className="mb-1.5 block font-semibold text-marinho">E-mail</label>
        <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className="campo" />
      </div>
      <div>
        <label htmlFor="senha" className="mb-1.5 block font-semibold text-marinho">Senha</label>
        <input id="senha" type="password" autoComplete="current-password" required value={senha} onChange={(e) => setSenha(e.target.value)} className="campo" />
      </div>
      {erro && <p role="alert" className="font-semibold text-red-700">{erro}</p>}
      <button type="submit" className="btn-ouro" disabled={carregando}>
        {carregando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
