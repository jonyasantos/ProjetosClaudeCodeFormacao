"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { criarTransacao, atualizarTransacao } from "./actions";
import type { Categoria, Transacao } from "@/lib/supabase/database.types";
import { ITENS_TIPO } from "@/lib/transacoes/tipos";

interface FormularioTransacaoProps {
  categorias: Categoria[];
  transacao?: Transacao;
  children: React.ReactNode;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
}

export function FormularioTransacao({
  categorias,
  transacao,
  children,
  variant,
  size,
}: FormularioTransacaoProps) {
  const [aberto, setAberto] = useState(false);
  const editando = Boolean(transacao);
  const itensCategoria = Object.fromEntries(
    categorias.map((categoria) => [categoria.id, categoria.name]),
  );

  async function aoEnviar(formData: FormData) {
    if (transacao) {
      await atualizarTransacao(transacao.id, formData);
    } else {
      await criarTransacao(formData);
    }
    setAberto(false);
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger render={<Button variant={variant} size={size} />}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editando ? "Editar transação" : "Nova transação"}
          </DialogTitle>
          <DialogDescription>
            {editando
              ? "Altere os dados e salve para atualizar."
              : "Preencha os dados da receita ou despesa."}
          </DialogDescription>
        </DialogHeader>
        <form action={aoEnviar} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              name="descricao"
              defaultValue={transacao?.description}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                step="0.01"
                min="0.01"
                defaultValue={transacao?.amount}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                name="data"
                type="date"
                defaultValue={transacao?.date}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                name="tipo"
                items={ITENS_TIPO}
                defaultValue={transacao?.type ?? "despesa"}
                required
              >
                <SelectTrigger id="tipo" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
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
                defaultValue={transacao?.category_id ?? undefined}
                required
              >
                <SelectTrigger id="categoriaId" className="w-full">
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
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{editando ? "Salvar" : "Criar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
