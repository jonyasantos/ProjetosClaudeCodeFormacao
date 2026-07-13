# Finanças+

App de finanças pessoais: registre receitas e despesas, acompanhe um dashboard mensal com gráfico por categoria, filtre e exporte suas transações (CSV/XLSX), e importe extratos bancários em formato OFX.

**Produção:** https://financas-pessoais-nu-vert.vercel.app

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Supabase (Auth + PostgreSQL + Row Level Security) + Recharts.

## Rodando localmente

```bash
npm install
npm run dev
```

Copie `.env.local.example` para `.env.local` e preencha com a URL e a chave `anon` do seu projeto Supabase (Project Settings → API).

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Banco de dados

As migrations SQL ficam em `supabase/migrations/`. Aplique-as no seu projeto Supabase (via SQL Editor ou CLI) antes de rodar o app.
