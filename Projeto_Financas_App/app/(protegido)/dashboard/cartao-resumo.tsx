import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CartaoResumoProps {
  titulo: string;
  valor: number;
  tom: "receita" | "despesa";
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function CartaoResumo({ titulo, valor, tom }: CartaoResumoProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1.5">
        <span className="text-sm text-muted-foreground">{titulo}</span>
        <span
          className={cn(
            "text-2xl font-semibold",
            tom === "receita" ? "text-success" : "text-destructive",
          )}
        >
          {formatarMoeda(valor)}
        </span>
      </CardContent>
    </Card>
  );
}
