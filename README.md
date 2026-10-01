# Convite digital — Batizado de Anthony Gael

Link → convite (imagem original) → **Confirmar presença** → formulário → salvo no Supabase → mensagem de sucesso.
Painel protegido em `/admin`.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres + Auth + RLS) · Vercel

## Passo a passo

### 1) Criar o projeto no Supabase
1. Acesse https://supabase.com → **New project** (plano Free).
2. Dê um nome, defina uma senha do banco (guarde) e escolha a região **South America (São Paulo)**.
3. Aguarde ~2 min até ficar pronto.

### 2) Criar o usuário administrador (antes do SQL)
1. **Authentication → Users → Add user → Create new user**.
2. Informe **seu e-mail** e uma **senha forte**; marque **Auto Confirm User**.
3. Nas configurações de Authentication (Sign In / Providers → Email), desative **Allow new users to sign up**, para que ninguém além de você crie conta.

### 3) Executar o SQL da tabela
1. Abra `supabase/schema.sql`.
2. **Troque `seu-email@exemplo.com`** (função `is_admin`) pelo e-mail do passo 2.
3. **SQL Editor → New query** → cole tudo → **Run**. Deve aparecer *Success*.

### 4) Variáveis de ambiente
Copie `.env.example` para `.env.local` e preencha:

| Variável | Onde pegar |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → **API** → *Project URL* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Mesma tela → chave **anon public** |
| `ADMIN_EMAIL` | O e-mail do administrador (o mesmo do SQL) |
| `NEXT_PUBLIC_SITE_URL` | Local: `http://localhost:3000`. Produção: o link final da Vercel |
| `NEXT_PUBLIC_EVENT_ADDRESS` | *Opcional.* Endereço da cerimônia. Preenchido → aparece o botão **Como chegar** |

> Nunca use a chave `service_role` neste projeto. A `anon` é pública por natureza; a proteção vem do RLS.

### 5) Rodar localmente
```bash
npm install
npm run dev
```
Convite: http://localhost:3000 · Madrinha: http://localhost:3000/madrinha · Painel: http://localhost:3000/admin

### 6) Deploy na Vercel
1. Suba a pasta para um repositório no GitHub (o `.env.local` já está no `.gitignore`).
2. https://vercel.com → **Add New → Project** → importe o repositório.
3. Em **Environment Variables**, adicione as mesmas variáveis do passo 4.
4. **Deploy**.

### 7) Link final
1. Copie a URL (ex.: `https://batizado-anthony.vercel.app`).
2. Vercel → Settings → Environment Variables → altere `NEXT_PUBLIC_SITE_URL` para essa URL → **Redeploy**.
3. Envie o link pelo WhatsApp. Se aparecer uma prévia antiga, force nova leitura em https://developers.facebook.com/tools/debug/ ("Scrape again").

## Segurança
- O convidado **só executa** a função `confirmar_presenca` (validada no banco). Não consegue ler, editar nem apagar nada.
- `/admin`: o middleware valida a sessão no servidor do Supabase **e** confere que o e-mail é o `ADMIN_EMAIL`.
- Mesmo que alguém burle a interface, o RLS só devolve/apaga linhas para o e-mail definido em `is_admin()`.

## Duplicidade
- O botão desabilita e mostra "Enviando…" (trava contra duplo toque).
- Nomes iguais (ignorando maiúsculas e espaços extras) **atualizam** a resposta em vez de criar outra linha. Quem mudar de ideia reenvia com o mesmo nome.

## Estrutura
```
src/app            páginas (/, /madrinha, /padrinhos [redireciona para /madrinha], /admin, /admin/login), layout e SEO
src/components     GodparentsFlow, RsvpFlow, RsvpModal, RsvpForm, SuccessView, admin/*
src/services       acesso ao Supabase (confirmacoes.ts)
src/lib            clientes Supabase, auth, config do evento
src/types          interfaces
public/convite.png imagem original (não alterada)
public/convite-padrinhos.png imagem especial dos padrinhos
public/og.jpg      prévia do WhatsApp (convite inteiro sobre fundo desfocado)
supabase/schema.sql
```

## Convite da madrinha

Acesse `http://localhost:3000/madrinha` para ver as mensagens especiais e a imagem personalizada. O botão final direciona ao convite principal em `/`. Links antigos para `/padrinhos` redirecionam automaticamente para essa rota.
