import { Plus, Pencil, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LinkButton } from "@/components/link-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormularioTransacao } from "./formulario-transacao";
import { BotaoExcluirTransacao } from "./botao-excluir-transacao";
import { FiltrosTransacoes } from "./filtros-transacoes";
import { BotaoExportar } from "./botao-exportar";
import type { TipoTransacao } from "@/lib/supabase/database.types";

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(data: string) {
  return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
}

interface TransacoesPageProps {
  searchParams: Promise<{
    busca?: string;
    categoriaId?: string;
    tipo?: string;
    de?: string;
    ate?: string;
  }>;
}

export default async function TransacoesPage({
  searchParams,
}: TransacoesPageProps) {
  const filtros = await searchParams;
  const supabase = await createClient();

  let consulta = supabase
    .from("transactions")
    .select("*, categories(name)")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filtros.busca) {
    consulta = consulta.ilike("description", `%${filtros.busca}%`);
  }
  if (filtros.categoriaId && filtros.categoriaId !== "todas") {
    consulta = consulta.eq("category_id", filtros.categoriaId);
  }
  if (filtros.tipo && filtros.tipo !== "todos") {
    consulta = consulta.eq("type", filtros.tipo);
  }
  if (filtros.de) {
    consulta = consulta.gte("date", filtros.de);
  }
  if (filtros.ate) {
    consulta = consulta.lte("date", filtros.ate);
  }

  const [{ data: transacoes }, { data: categorias }] = await Promise.all([
    consulta,
    supabase.from("categories").select("*").order("name"),
  ]);

  const comFiltro = Boolean(
    filtros.busca || filtros.categoriaId || filtros.tipo || filtros.de || filtros.ate,
  );

  const queryString = new URLSearchParams(
    Object.entries(filtros).filter(
      (entrada): entrada is [string, string] => Boolean(entrada[1]),
    ),
  ).toString();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Transações</h1>
          <p className="text-sm text-muted-foreground">
            Registre e acompanhe suas receitas e despesas.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LinkButton variant="outline" href="/transacoes/importar">
            <Upload className="size-4" />
            Importar OFX
          </LinkButton>
          <BotaoExportar queryString={queryString} />
          <FormularioTransacao categorias={categorias ?? []}>
            <Plus className="size-4" />
            Nova transação
          </FormularioTransacao>
        </div>
      </div>

      <FiltrosTransacoes categorias={categorias ?? []} valores={filtros} />

      {transacoes && transacoes.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-0" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {transacoes.map((transacao) => (
                <TableRow key={transacao.id}>
                  <TableCell className="font-medium">
                    {transacao.description}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {transacao.categories?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatarData(transacao.date)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        transacao.type === "receita"
                          ? "text-success"
                          : "text-destructive"
                      }
                    >
                      {transacao.type === "receita" ? "Receita" : "Despesa"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatarMoeda(transacao.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <FormularioTransacao
                        categorias={categorias ?? []}
                        transacao={{
                          ...transacao,
                          type: transacao.type as TipoTransacao,
                        }}
                        variant="ghost"
                        size="icon-sm"
                      >
                        <Pencil className="size-4" />
                        <span className="sr-only">Editar transação</span>
                      </FormularioTransacao>
                      <BotaoExcluirTransacao
                        id={transacao.id}
                        descricao={transacao.description}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
          {comFiltro
            ? "Nenhuma transação encontrada com esses filtros."
            : 'Nenhuma transação ainda. Clique em "Nova transação" para começar.'}
        </div>
      )}
    </div>
  );
}
