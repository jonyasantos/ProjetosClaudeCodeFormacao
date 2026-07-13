import { LinkButton } from "@/components/link-button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LayoutDashboard,
  PieChart,
  FileSpreadsheet,
  ShieldCheck,
} from "lucide-react";

const recursos = [
  {
    icone: LayoutDashboard,
    titulo: "Dashboard consolidado",
    descricao:
      "Veja receitas, despesas e saldo do mês em cards claros e diretos.",
  },
  {
    icone: PieChart,
    titulo: "Gráficos por categoria",
    descricao:
      "Entenda para onde vai o seu dinheiro com gráficos visuais e simples.",
  },
  {
    icone: FileSpreadsheet,
    titulo: "Importar e exportar",
    descricao:
      "Importe extratos em OFX e exporte seus lançamentos em CSV ou Excel.",
  },
  {
    icone: ShieldCheck,
    titulo: "Seus dados, só seus",
    descricao:
      "Login seguro e cada pessoa só enxerga as próprias transações.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-background">
      <header className="w-full border-b">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">
            Finanças<span className="text-primary">+</span>
          </span>
          <div className="flex items-center gap-3">
            <LinkButton variant="ghost" href="/login">
              Entrar
            </LinkButton>
            <LinkButton href="/cadastro">Criar conta</LinkButton>
          </div>
        </div>
      </header>

      <main className="flex w-full max-w-5xl flex-1 flex-col items-center gap-16 px-6 py-20 text-center">
        <div className="flex max-w-2xl flex-col items-center gap-5">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Organize suas finanças pessoais em um só lugar
          </h1>
          <p className="text-lg text-muted-foreground">
            Registre receitas e despesas, acompanhe seu saldo do mês e
            entenda seus gastos por categoria — de forma simples e visual.
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <LinkButton size="lg" href="/cadastro">
              Criar conta grátis
            </LinkButton>
            <LinkButton size="lg" variant="outline" href="/login">
              Já tenho conta
            </LinkButton>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {recursos.map(({ icone: Icone, titulo, descricao }) => (
            <Card key={titulo} className="text-left">
              <CardHeader className="gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icone className="size-5" />
                </div>
                <CardTitle>{titulo}</CardTitle>
                <CardDescription>{descricao}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>

      <footer className="w-full border-t py-6 text-center text-sm text-muted-foreground">
        Finanças+ — projeto pessoal de gestão financeira.
      </footer>
    </div>
  );
}
