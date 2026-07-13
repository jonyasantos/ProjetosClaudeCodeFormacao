import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CartaoResumo } from "./cartao-resumo";
import { GraficoCategorias, type DadoCategoria } from "./grafico-categorias";

function inicioFimMesAtual() {
  const agora = new Date();
  const inicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const fim = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);
  const paraISO = (data: Date) => data.toISOString().slice(0, 10);
  return { inicio: paraISO(inicio), fim: paraISO(fim) };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { inicio, fim } = inicioFimMesAtual();

  const { data: transacoes } = await supabase
    .from("transactions")
    .select("amount, type, categories(name)")
    .gte("date", inicio)
    .lte("date", fim);

  const lista = transacoes ?? [];
  const receitaTotal = lista
    .filter((t) => t.type === "receita")
    .reduce((soma, t) => soma + t.amount, 0);
  const despesaTotal = lista
    .filter((t) => t.type === "despesa")
    .reduce((soma, t) => soma + t.amount, 0);
  const saldo = receitaTotal - despesaTotal;

  const despesasPorCategoria = new Map<string, number>();
  for (const t of lista) {
    if (t.type !== "despesa") continue;
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

  const mesAtual = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <div>
        <h1 className="text-2xl font-semibold break-words">
          Olá, {user?.email}
        </h1>
        <p className="text-sm text-muted-foreground">
          Resumo de {mesAtual}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <CartaoResumo titulo="Receita do mês" valor={receitaTotal} tom="receita" />
        <CartaoResumo titulo="Despesa do mês" valor={despesaTotal} tom="despesa" />
        <CartaoResumo
          titulo="Saldo do mês"
          valor={saldo}
          tom={saldo >= 0 ? "receita" : "despesa"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Despesas por categoria</CardTitle>
          <CardDescription>
            Para onde foi o seu dinheiro este mês.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dadosGrafico.length > 0 ? (
            <GraficoCategorias dados={dadosGrafico} />
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Nenhuma despesa registrada este mês ainda.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
