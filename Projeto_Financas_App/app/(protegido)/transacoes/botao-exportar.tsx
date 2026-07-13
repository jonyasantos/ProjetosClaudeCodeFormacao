"use client";

import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function BotaoExportar({ queryString }: { queryString: string }) {
  const prefixo = queryString ? `${queryString}&` : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        <Download className="size-4" />
        Exportar
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          render={<a href={`/transacoes/exportar?${prefixo}formato=csv`} />}
        >
          Exportar CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          render={<a href={`/transacoes/exportar?${prefixo}formato=xlsx`} />}
        >
          Exportar Excel (.xlsx)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
