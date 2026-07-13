"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LinkButton } from "@/components/link-button";
import type { Categoria } from "@/lib/supabase/database.types";
import { ITENS_TIPO } from "@/lib/transacoes/tipos";

const ITENS_TIPO_FILTRO = { todos: "Todos", ...ITENS_TIPO };

const NOMES_MES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const ITENS_MES = {
  todos: "Todos os meses",
  ...Object.fromEntries(
    NOMES_MES.map((nome, indice) => [String(indice + 1), nome]),
  ),
};

function anosDisponiveis() {
  const anoAtual = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, indice) => anoAtual - indice);
}

interface FiltrosDashboardProps {
  categorias: Categoria[];
  valores: {
    ano: string;
    mes: string;
    tipo?: string;
    categoriaId?: string;
  };
  filtroAtivo: boolean;
}

export function FiltrosDashboard({
  categorias,
  valores,
  filtroAtivo,
}: FiltrosDashboardProps) {
  const itensCategoria = {
    todas: "Todas",
    ...Object.fromEntries(categorias.map((c) => [c.id, c.name])),
  };
  const anos = anosDisponiveis();
  const itensAno = Object.fromEntries(anos.map((ano) => [String(ano), String(ano)]));

  return (
    <form
      method="GET"
      className="flex flex-wrap items-end gap-3 rounded-xl border p-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="ano">Ano</Label>
        <Select name="ano" items={itensAno} defaultValue={valores.ano}>
          <SelectTrigger id="ano" className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {anos.map((ano) => (
              <SelectItem key={ano} value={String(ano)}>
                {ano}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="mes">Mês</Label>
        <Select name="mes" items={ITENS_MES} defaultValue={valores.mes}>
          <SelectTrigger id="mes" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os meses</SelectItem>
            {NOMES_MES.map((nome, indice) => (
              <SelectItem key={nome} value={String(indice + 1)}>
                {nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="tipo">Tipo</Label>
        <Select
          name="tipo"
          items={ITENS_TIPO_FILTRO}
          defaultValue={valores.tipo ?? "todos"}
        >
          <SelectTrigger id="tipo" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="receita">Receita</SelectItem>
            <SelectItem value="despesa">Despesa</SelectItem>
            <SelectItem value="despesa_cartao">
              Despesa - Cartão de Crédito
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="categoriaId">Categoria</Label>
        <Select
          name="categoriaId"
          items={itensCategoria}
          defaultValue={valores.categoriaId ?? "todas"}
        >
          <SelectTrigger id="categoriaId" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {categorias.map((categoria) => (
              <SelectItem key={categoria.id} value={categoria.id}>
                {categoria.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Filtrar</Button>
      {filtroAtivo && (
        <LinkButton variant="ghost" href="/dashboard">
          Limpar filtros
        </LinkButton>
      )}
    </form>
  );
}
