import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CartaoResumo } from "./cartao-resumo";
import { GraficoCategorias, type DadoCategoria } from "./grafico-categorias";
import { FiltrosDashboard } from "./filtros-dashboard";
import { ehDespesa } from "@/lib/transacoes/tipos";
import type { TipoTransacao } from "@/lib/supabase/database.types";

const NOMES_MES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

function paraISO(data: Date) {
  return data.toISOString().slice(0, 10);
}

function periodoConsultado(ano: number, mes: number | null) {
  if (mes === null) {
    return {
      inicio: paraISO(new Date(ano, 0, 1)),
      fim: paraISO(new Date(ano, 11, 31)),
    };
  }
  return {
    inicio: paraISO(new Date(ano, mes - 1, 1)),
    fim: paraISO(new Date(ano, mes, 0)),
  };
}

interface DashboardPageProps {
  searchParams: Promise<{
    ano?: string;
    mes?: string;
    tipo?: string;
    categoriaId?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const filtros = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const agora = new Date();
  const ano = Number(filtros.ano) || agora.getFullYear();
  const anoTodo = filtros.mes === "todos";
  const mes = anoTodo
    ? null
    : Number(filtros.mes) || agora.getMonth() + 1;
  const { inicio, fim } = periodoConsultado(ano, mes);

  let consulta = supabase
    .from("transactions")
    .select("amount, type, categories(name)")
    .gte("date", inicio)
    .lte("date", fim);

  if (filtros.tipo && filtros.tipo !== "todos") {
    consulta = consulta.eq("type", filtros.tipo);
  }
  if (filtros.categoriaId && filtros.categoriaId !== "todas") {
    consulta = consulta.eq("category_id", filtros.categoriaId);
  }

  const [{ data: transacoes }, { data: categorias }] = await Promise.all([
    consulta,
    supabase.from("categories").select("*").order("name"),
  ]);

  const lista = transacoes ?? [];
  const receitaTotal = lista
    .filter((t) => t.type === "receita")
    .reduce((soma, t) => soma + t.amount, 0);
  const despesaTotal = lista
    .filter((t) => ehDespesa(t.type as TipoTransacao))
    .reduce((soma, t) => soma + t.amount, 0);
  const saldo = receitaTotal - despesaTotal;

  const despesasPorCategoria = new Map<string, number>();
  for (const t of lista) {
    if (!ehDespesa(t.type as TipoTransacao)) continue;
    const nomeCategoria = t.categories?.name ?? "Outros";
    despesasPorCategoria.set(
      nomeCategoria,
      (despesasPorCategoria.get(nomeCategoria) ?? 0) + t.amount,
    );
  }
  const dadosGrafico: DadoCategoria[] = Array.from(
    despesasPorCategoria,
    ([categoria, valor]) => ({ categoria, valor }),
  ).sort((a, b) => b.valor - a.valor);

  const descricaoPeriodo =
    mes === null ? `de ${ano}` : `de ${NOMES_MES[mes - 1]} de ${ano}`;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <div>
        <h1 className="text-2xl font-semibold break-words">
          Olá, {user?.email}
        </h1>
        <p className="text-sm text-muted-foreground">
          Resumo {descricaoPeriodo}.
        </p>
      </div>

      <FiltrosDashboard
        categorias={categorias ?? []}
        valores={{
          ano: String(ano),
          mes: anoTodo ? "todos" : String(mes),
          tipo: filtros.tipo,
          categoriaId: filtros.categoriaId,
        }}
        filtroAtivo={Boolean(
          filtros.ano || filtros.mes || filtros.tipo || filtros.categoriaId,
        )}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <CartaoResumo titulo="Receita" valor={receitaTotal} tom="receita" />
        <CartaoResumo titulo="Despesa" valor={despesaTotal} tom="despesa" />
        <CartaoResumo
          titulo="Saldo"
          valor={saldo}
          tom={saldo >= 0 ? "receita" : "despesa"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Despesas por categoria</CardTitle>
          <CardDescription>
            Para onde foi o seu dinheiro no período selecionado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dadosGrafico.length > 0 ? (
            <GraficoCategorias dados={dadosGrafico} />
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Nenhuma despesa registrada neste período ainda.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
