-- =====================================================================
-- Convite de batizado — Anthony Gael
-- Cole TUDO no Supabase → SQL Editor → New query → Run.
-- ⚠️ ANTES de rodar: troque 'seu-email@exemplo.com' (na função is_admin)
--    pelo MESMO e-mail do usuário administrador.
-- =====================================================================

create extension if not exists pgcrypto;

-- 1) Tabela --------------------------------------------------------
create table if not exists public.confirmacoes (
  id                 uuid primary key default gen_random_uuid(),
  nome               text not null
                       check (char_length(btrim(nome)) between 2 and 120),
  presenca           text not null check (presenca in ('sim', 'nao')),
  quantidade_pessoas int  not null default 0
                       check (quantidade_pessoas between 0 and 20),
  -- chave normalizada do nome: impede duplicar "Maria  Silva" / "maria silva"
  nome_key           text generated always as
                       (regexp_replace(lower(btrim(nome)), '\s+', ' ', 'g')) stored,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint quantidade_coerente check (
    (presenca = 'sim' and quantidade_pessoas >= 1) or
    (presenca = 'nao' and quantidade_pessoas = 0)
  )
);

create unique index if not exists confirmacoes_nome_key_uidx
  on public.confirmacoes (nome_key);
create index if not exists confirmacoes_created_at_idx
  on public.confirmacoes (created_at desc);

-- 2) Quem é admin --------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'dion3m2010@gmail.com';
$$;

-- 3) RLS: o convidado NÃO lê, NÃO edita, NÃO apaga e NÃO insere direto ----
alter table public.confirmacoes enable row level security;

drop policy if exists "admin lê"    on public.confirmacoes;
drop policy if exists "admin apaga" on public.confirmacoes;

create policy "admin lê"    on public.confirmacoes
  for select to authenticated using (public.is_admin());
create policy "admin apaga" on public.confirmacoes
  for delete to authenticated using (public.is_admin());
-- (sem policy de INSERT/UPDATE: convidados usam apenas a função abaixo)

revoke all on public.confirmacoes from anon;
revoke insert, update on public.confirmacoes from authenticated;

-- 4) Função pública usada pelo formulário --------------------------
-- Insere a confirmação; se o mesmo nome já existir, ATUALIZA a resposta
-- (evita duplicidade e permite que a pessoa mude de ideia).
create or replace function public.confirmar_presenca(
  p_nome       text,
  p_presenca   text,
  p_quantidade int
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_nome text := regexp_replace(btrim(coalesce(p_nome, '')), '\s+', ' ', 'g');
  v_qtd  int;
begin
  if char_length(v_nome) < 2 or char_length(v_nome) > 120 then
    raise exception 'Nome inválido';
  end if;
  if p_presenca not in ('sim', 'nao') then
    raise exception 'Resposta inválida';
  end if;

  if p_presenca = 'sim' then
    v_qtd := coalesce(p_quantidade, 1);
    if v_qtd < 1 or v_qtd > 20 then
      raise exception 'Quantidade inválida';
    end if;
  else
    v_qtd := 0;
  end if;

  insert into public.confirmacoes (nome, presenca, quantidade_pessoas)
  values (v_nome, p_presenca, v_qtd)
  on conflict (nome_key) do update
    set nome               = excluded.nome,
        presenca           = excluded.presenca,
        quantidade_pessoas = excluded.quantidade_pessoas,
        updated_at         = now();
end;
$$;

revoke all on function public.confirmar_presenca(text, text, int) from public;
grant execute on function public.confirmar_presenca(text, text, int) to anon, authenticated;
