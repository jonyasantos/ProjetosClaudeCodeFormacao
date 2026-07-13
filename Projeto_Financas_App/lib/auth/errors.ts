const MENSAGENS: Record<string, string> = {
  "Invalid login credentials": "E-mail ou senha incorretos.",
  "User already registered": "Já existe uma conta com esse e-mail.",
  "Password should be at least 6 characters":
    "A senha precisa ter pelo menos 6 caracteres.",
  "Email not confirmed":
    "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.",
  "Unable to validate email address: invalid format": "Digite um e-mail válido.",
};

export function traduzErroAuth(mensagem: string): string {
  return MENSAGENS[mensagem] ?? "Não foi possível concluir a ação. Tente novamente.";
}
