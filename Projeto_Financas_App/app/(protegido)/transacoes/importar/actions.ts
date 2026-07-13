"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { analisarOfx, type TransacaoOfx } from "@/lib/ofx/parse";

type ResultadoAnalise =
  | { sucesso: true; transacoes: TransacaoOfx[] }
  | { sucesso: false; erro: string };

export async function analisarArquivoOfx(
  formData: FormData,
): Promise<ResultadoAnalise> {
  const arquivo = formData.get("arquivo");

  if (!(arquivo instanceof File) || arquivo.size === 0) {
    return { sucesso: false, erro: "Selecione um arquivo .ofx para continuar." };
  }

  const conteudo = await arquivo.text();
  const transacoes = analisarOfx(conteudo);

  if (transacoes.length === 0) {
    return {
      sucesso: false,
      erro: "Não encontramos transações nesse arquivo. Confira se é um .ofx válido.",
    };
  }

  return { sucesso: true, transacoes };
}

interface LinhaConfirmada extends TransacaoOfx {
  categoriaId: string | null;
}

export async function confirmarImportacaoOfx(transacoes: LinhaConfirmada[]) {
  if (transacoes.length === 0) {
    throw new Error("Selecione ao menos uma transação para importar.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Sua sessão expirou. Faça login novamente.");
  }

  const linhas = transacoes.map((t) => ({
    user_id: user.id,
    description: t.descricao,
    amount: t.valor,
    date: t.data,
    type: t.tipo,
    category_id: t.categoriaId,
    external_id: t.fitId,
  }));

  const { data, error } = await supabase
    .from("transactions")
    .upsert(linhas, { onConflict: "user_id,external_id", ignoreDuplicates: true })
    .select("id");

  if (error) {
    throw new Error("Não foi possível importar as transações.");
  }

  revalidatePath("/transacoes");
  revalidatePath("/dashboard");

  const importadas = data?.length ?? 0;
  return { importadas, ignoradas: transacoes.length - importadas };
}
