"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const OPCOES_TEMA = [
  { valor: "light", rotulo: "Claro", Icone: Sun },
  { valor: "dark", rotulo: "Escuro", Icone: Moon },
  { valor: "system", rotulo: "Conforme o sistema", Icone: Monitor },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
  }, []);

  const IconeAtual =
    OPCOES_TEMA.find((opcao) => opcao.valor === theme)?.Icone ?? Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="icon" />}
      >
        {montado && <IconeAtual className="size-4" />}
        <span className="sr-only">Escolher tema</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {OPCOES_TEMA.map(({ valor, rotulo, Icone }) => (
          <DropdownMenuItem key={valor} onClick={() => setTheme(valor)}>
            <Icone className="size-4" />
            {rotulo}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
