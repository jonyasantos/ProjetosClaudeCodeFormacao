"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export interface DadoCategoria {
  categoria: string;
  valor: number;
}

const CORES_CATEGORIA: Record<string, string> = {
  Alimentação: "var(--chart-1)",
  Transporte: "var(--chart-2)",
  Moradia: "var(--chart-3)",
  Lazer: "var(--chart-4)",
  Saúde: "var(--chart-5)",
  Educação: "var(--chart-6)",
};
const COR_OUTROS = "var(--muted-foreground)";

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface TooltipPersonalizadoProps {
  active?: boolean;
  payload?: Array<{ payload: DadoCategoria }>;
}

function TooltipPersonalizado({ active, payload }: TooltipPersonalizadoProps) {
  if (!active || !payload?.length) return null;
  const { categoria, valor } = payload[0].payload;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-semibold text-popover-foreground">
        {formatarMoeda(valor)}
      </p>
      <p className="text-muted-foreground">{categoria}</p>
    </div>
  );
}

export function GraficoCategorias({ dados }: { dados: DadoCategoria[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dados}
            dataKey="valor"
            nameKey="categoria"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
            stroke="var(--card)"
            strokeWidth={2}
          >
            {dados.map((item) => (
              <Cell
                key={item.categoria}
                fill={CORES_CATEGORIA[item.categoria] ?? COR_OUTROS}
              />
            ))}
          </Pie>
          <Tooltip content={<TooltipPersonalizado />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-sm text-muted-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
