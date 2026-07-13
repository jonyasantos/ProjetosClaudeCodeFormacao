-- Categorias pré-definidas (compartilhadas entre todos os usuários)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Categorias visíveis para usuários autenticados"
  on public.categories
  for select
  to authenticated
  using (true);

insert into public.categories (name) values
  ('Alimentação'),
  ('Transporte'),
  ('Moradia'),
  ('Lazer'),
  ('Saúde'),
  ('Educação'),
  ('Salário'),
  ('Freelance'),
  ('Outros')
on conflict (name) do nothing;

-- Transações (receitas e despesas) de cada usuário
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  description text not null,
  amount numeric(12, 2) not null check (amount > 0),
  date date not null,
  type text not null check (type in ('receita', 'despesa')),
  category_id uuid references public.categories (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.transactions enable row level security;

create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists transactions_date_idx on public.transactions (date);

create policy "Usuários veem só suas transações"
  on public.transactions
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Usuários criam suas transações"
  on public.transactions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Usuários editam suas transações"
  on public.transactions
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Usuários excluem suas transações"
  on public.transactions
  for delete
  to authenticated
  using (auth.uid() = user_id);
