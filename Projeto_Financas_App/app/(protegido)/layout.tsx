import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/auth/actions";
import { LinkButton } from "@/components/link-button";
import { Button } from "@/components/ui/button";

export default async function ProtegidoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-1 flex-col">
      <header className="w-full border-b">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-lg font-semibold tracking-tight">
              Finanças<span className="text-primary">+</span>
            </span>
            <form action={logout} className="sm:hidden">
              <Button type="submit" variant="outline" size="sm">
                Sair
              </Button>
            </form>
          </div>

          <nav className="flex items-center gap-1">
            <LinkButton variant="ghost" size="sm" href="/dashboard">
              Dashboard
            </LinkButton>
            <LinkButton variant="ghost" size="sm" href="/transacoes">
              Transações
            </LinkButton>
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <form action={logout}>
              <Button type="submit" variant="outline" size="sm">
                Sair
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
