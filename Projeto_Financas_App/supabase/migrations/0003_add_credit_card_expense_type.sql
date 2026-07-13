-- Adiciona o tipo "despesa_cartao" (Despesa - Cartão de Crédito) às transações.
alter table public.transactions drop constraint transactions_type_check;

alter table public.transactions add constraint transactions_type_check
  check (type in ('receita', 'despesa', 'despesa_cartao'));
