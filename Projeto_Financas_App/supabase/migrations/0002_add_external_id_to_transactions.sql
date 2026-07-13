-- Identificador da transação vindo do OFX (FITID), usado para não duplicar
-- importações repetidas do mesmo extrato.
alter table public.transactions add column if not exists external_id text;

create unique index if not exists transactions_user_external_id_idx
  on public.transactions (user_id, external_id)
  where external_id is not null;
