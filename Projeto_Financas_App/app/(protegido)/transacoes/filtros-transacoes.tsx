"use client";

import { Input } from "@/components/ui/input";
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

interface FiltrosTransacoesProps {
  categorias: Categoria[];
  valores: {
    busca?: string;
    categoriaId?: string;
    tipo?: string;
    de?: string;
    ate?: string;
  };
}

function algumFiltroAtivo(valores: FiltrosTransacoesProps["valores"]) {
  return Boolean(
    valores.busca || valores.categoriaId || valores.tipo || valores.de || valores.ate,
  );
}

export function FiltrosTransacoes({
  categorias,
  valores,
}: FiltrosTransacoesProps) {
  return (
    <form
      method="GET"
      className="flex flex-wrap items-end gap-3 rounded-xl border p-4"
    >
      <div className="flex min-w-40 flex-1 flex-col gap-2">
        <Label htmlFor="busca">Buscar</Label>
        <Input
          id="busca"
          name="busca"
          placeholder="Descrição..."
          defaultValue={valores.busca}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="tipo">Tipo</Label>
        <Select name="tipo" defaultValue={valores.tipo ?? "todos"}>
          <SelectTrigger id="tipo" className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="receita">Receita</SelectItem>
            <SelectItem value="despesa">Despesa</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="categoriaId">Categoria</Label>
        <Select name="categoriaId" defaultValue={valores.categoriaId ?? "todas"}>
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
      <div className="flex flex-col gap-2">
        <Label htmlFor="de">De</Label>
        <Input
          id="de"
          name="de"
          type="date"
          defaultValue={valores.de}
          className="w-36"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="ate">Até</Label>
        <Input
          id="ate"
          name="ate"
          type="date"
          defaultValue={valores.ate}
          className="w-36"
        />
      </div>
      <Button type="submit">Filtrar</Button>
      {algumFiltroAtivo(valores) && (
        <LinkButton variant="ghost" href="/transacoes">
          Limpar filtros
        </LinkButton>
      )}
    </form>
  );
}
