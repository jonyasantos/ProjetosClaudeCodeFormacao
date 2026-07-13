import { createClient } from "@/lib/supabase/server";
import { FormularioImportarOfx } from "./formulario-importar-ofx";

export default async function ImportarOfxPage() {
  const supabase = await createClient();
  const { data: categorias } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
      <div>
        <h1 className="text-2xl font-semibold">Importar extrato OFX</h1>
        <p className="text-sm text-muted-foreground">
          Envie o arquivo .ofx do seu banco ou cartão. Você confere tudo antes
          de salvar, e nada é gravado sem sua confirmação.
        </p>
      </div>
      <FormularioImportarOfx categorias={categorias ?? []} />
    </div>
  );
}
