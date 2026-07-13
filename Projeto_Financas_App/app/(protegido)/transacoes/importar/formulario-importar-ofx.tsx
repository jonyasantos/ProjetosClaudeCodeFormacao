"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { analisarArquivoOfx, confirmarImportacaoOfx } from "./actions";
import type { TransacaoOfx } from "@/lib/ofx/parse";
import type { Categoria } from "@/lib/supabase/database.types";

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(data: string) {
  return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
}

interface LinhaImportacao extends TransacaoOfx {
  selecionada: boolean;
  categoriaId: string | null;
}

export function FormularioImportarOfx({
  categorias,
}: {
  categorias: Categoria[];
}) {
  const [linhas, setLinhas] = useState<LinhaImportacao[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();
  const router = useRouter();

  async function aoAnalisar(formData: FormData) {
    setErro(null);
    const resultado = await analisarArquivoOfx(formData);
    if (!resultado.sucesso) {
      setErro(resultado.erro);
      setLinhas(null);
      return;
    }
    setLinhas(
      resultado.transacoes.map((t) => ({
        ...t,
        selecionada: true,
        categoriaId: null,
      })),
    );
  }

  function alternarSelecao(fitId: string) {
    setLinhas(
      (atual) =>
        atual?.map((l) =>
          l.fitId === fitId ? { ...l, selecionada: !l.selecionada } : l,
        ) ?? null,
    );
  }

  function definirCategoria(fitId: string, categoriaId: string | null) {
    setLinhas(
      (atual) =>
        atual?.map((l) => (l.fitId === fitId ? { ...l, categoriaId } : l)) ??
        null,
    );
  }

  function confirmar() {
    const selecionadas = (linhas ?? []).filter((l) => l.selecionada);
    iniciarTransicao(async () => {
      try {
        const resultado = await confirmarImportacaoOfx(selecionadas);
        const mensagem =
          resultado.ignoradas > 0
            ? `${resultado.importadas} transação(ões) importada(s), ${resultado.ignoradas} já existiam e foram ignoradas.`
            : `${resultado.importadas} transação(ões) importada(s) com sucesso.`;
        toast.success(mensagem);
        router.push("/transacoes");
      } catch {
        toast.error("Não foi possível importar as transações. Tente novamente.");
      }
    });
  }

  if (!linhas) {
    return (
      <form
        action={aoAnalisar}
        className="flex flex-col gap-4 rounded-xl border p-6"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="arquivo">Arquivo OFX</Label>
          <Input id="arquivo" name="arquivo" type="file" accept=".ofx" required />
        </div>
        {erro && <p className="text-sm text-destructive">{erro}</p>}
        <Button type="submit" className="self-start">
          Analisar arquivo
        </Button>
      </form>
    );
  }

  const totalSelecionadas = linhas.filter((l) => l.selecionada).length;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Encontramos {linhas.length} transação(ões) no arquivo. Confira, ajuste
        as categorias se quiser e escolha quais deseja importar.
      </p>
      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-0" />
              <TableHead>Descrição</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Categoria</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {linhas.map((linha) => (
              <TableRow key={linha.fitId}>
                <TableCell>
                  <Checkbox
                    checked={linha.selecionada}
                    onCheckedChange={() => alternarSelecao(linha.fitId)}
                  />
                </TableCell>
                <TableCell className="font-medium">{linha.descricao}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatarData(linha.data)}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      linha.tipo === "receita"
                        ? "text-success"
                        : "text-destructive"
                    }
                  >
                    {linha.tipo === "receita" ? "Receita" : "Despesa"}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatarMoeda(linha.valor)}
                </TableCell>
                <TableCell>
                  <Select
                    value={linha.categoriaId ?? undefined}
                    onValueChange={(valor) =>
                      definirCategoria(linha.fitId, valor)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          {categoria.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex gap-3">
        <Button onClick={confirmar} disabled={pendente || totalSelecionadas === 0}>
          {pendente
            ? "Importando..."
            : `Confirmar importação (${totalSelecionadas})`}
        </Button>
        <Button variant="outline" onClick={() => setLinhas(null)}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
