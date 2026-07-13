import type { TipoTransacao } from "@/lib/supabase/database.types";

export const ITENS_TIPO: Record<TipoTransacao, string> = {
  receita: "Receita",
  despesa: "Despesa",
  despesa_cartao: "Despesa - Cartão de Crédito",
};

export function ehDespesa(tipo: TipoTransacao) {
  return tipo !== "receita";
}
