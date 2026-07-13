import { MailCheck } from "lucide-react";
import { LinkButton } from "@/components/link-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConfirmeEmailPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-sm text-center">
        <CardHeader className="items-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck className="size-6" />
          </div>
          <CardTitle>Confirme seu e-mail</CardTitle>
          <CardDescription>
            Enviamos um link de confirmação para o seu e-mail. Clique nele para
            ativar sua conta e depois volte para entrar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LinkButton variant="outline" className="w-full" href="/login">
            Já confirmei, ir para o login
          </LinkButton>
        </CardContent>
      </Card>
    </div>
  );
}
