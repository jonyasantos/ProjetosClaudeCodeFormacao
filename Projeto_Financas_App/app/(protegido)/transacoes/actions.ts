"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TipoTransacao } from "@/lib/supabase/database.types";

interface DadosTransacao {
  descricao: string;
  valor: number;
  data: string;
  tipo: TipoTransacao;
  categoriaId: string | null;
}

function lerDadosFormulario(formData: FormData): DadosTransacao {
  return {
    descricao: formData.get("descricao") as string,
    valor: Number(formData.get("valor")),
    data: formData.get("data") as string,
    tipo: formData.get("tipo") as TipoTransacao,
    categoriaId: (formData.get("categoriaId") as string) || null,
  };
}

export async function criarTransacao(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  const { descricao, valor, data, tipo, categoriaId } =
    lerDadosFormulario(formData);

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    description: descricao,
    amount: valor,
    date: data,
    type: tipo,
    category_id: categoriaId,
  });

  if (error) {
    throw new Error("Não foi possível salvar a transação.");
  }

  revalidatePath("/transacoes");
}

export async function atualizarTransacao(id: string, formData: FormData) {
  const supabase = await createClient();
  const { descricao, valor, data, tipo, categoriaId } =
    lerDadosFormulario(formData);

  const { error } = await supabase
    .from("transactions")
    .update({
      description: descricao,
      amount: valor,
      date: data,
      type: tipo,
      category_id: categoriaId,
    })
    .eq("id", id);

  if (error) {
    throw new Error("Não foi possível atualizar a transação.");
  }

  revalidatePath("/transacoes");
}

export async function excluirTransacao(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    throw new Error("Não foi possível excluir a transação.");
  }

  revalidatePath("/transacoes");
}
