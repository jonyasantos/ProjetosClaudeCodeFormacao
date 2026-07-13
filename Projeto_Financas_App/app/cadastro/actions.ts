"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { traduzErroAuth } from "@/lib/auth/errors";

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmarSenha = formData.get("confirmarSenha") as string;

  if (password !== confirmarSenha) {
    redirect(`/cadastro?erro=${encodeURIComponent("As senhas não coincidem.")}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/cadastro?erro=${encodeURIComponent(traduzErroAuth(error.message))}`);
  }

  if (data.session) {
    redirect("/dashboard");
  }

  redirect("/cadastro/confirme");
}
