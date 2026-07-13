export interface TransacaoOfx {
  fitId: string;
  data: string;
  descricao: string;
  valor: number;
  tipo: "receita" | "despesa";
}

function extrairTag(bloco: string, tag: string): string | null {
  const correspondencia = bloco.match(new RegExp(`<${tag}>([^<\r\n]*)`, "i"));
  return correspondencia ? correspondencia[1].trim() : null;
}

function converterData(dtposted: string): string {
  const digitos = dtposted.replace(/\D/g, "").slice(0, 8);
  if (digitos.length !== 8) return "";
  const ano = digitos.slice(0, 4);
  const mes = digitos.slice(4, 6);
  const dia = digitos.slice(6, 8);
  return `${ano}-${mes}-${dia}`;
}

export function analisarOfx(conteudo: string): TransacaoOfx[] {
  const blocos = conteudo.match(/<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi) ?? [];

  return blocos
    .map((bloco, indice): TransacaoOfx => {
      const dtposted = extrairTag(bloco, "DTPOSTED") ?? "";
      const trnamt = extrairTag(bloco, "TRNAMT") ?? "0";
      const memo = extrairTag(bloco, "MEMO");
      const name = extrairTag(bloco, "NAME");
      const fitId = extrairTag(bloco, "FITID") ?? `sem-id-${indice}`;
      const valorBruto = Number(trnamt.replace(",", "."));

      return {
        fitId,
        data: converterData(dtposted),
        descricao: memo || name || "Transação importada",
        valor: Math.abs(valorBruto),
        tipo: valorBruto < 0 ? "despesa" : "receita",
      };
    })
    .filter((t) => t.data.length === 10 && !Number.isNaN(t.valor) && t.valor > 0);
}
