import { NextResponse, type NextRequest } from "next/server";
import ExcelJS from "exceljs";
import { createClient } from "@/lib/supabase/server";

const BOM_UTF8 = "﻿";

function escaparCsv(valor: string) {
  if (/[",\n]/.test(valor)) {
    return `"${valor.replace(/"/g, '""')}"`;
  }
  return valor;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;
  const formato = searchParams.get("formato") === "xlsx" ? "xlsx" : "csv";

  let consulta = supabase
    .from("transactions")
    .select("description, amount, date, type, categories(name)")
    .order("date", { ascending: false });

  const busca = searchParams.get("busca");
  const categoriaId = searchParams.get("categoriaId");
  const tipo = searchParams.get("tipo");
  const de = searchParams.get("de");
  const ate = searchParams.get("ate");

  if (busca) consulta = consulta.ilike("description", `%${busca}%`);
  if (categoriaId && categoriaId !== "todas") {
    consulta = consulta.eq("category_id", categoriaId);
  }
  if (tipo && tipo !== "todos") consulta = consulta.eq("type", tipo);
  if (de) consulta = consulta.gte("date", de);
  if (ate) consulta = consulta.lte("date", ate);

  const { data: transacoes, error } = await consulta;

  if (error) {
    return NextResponse.json(
      { erro: "Não foi possível exportar as transações." },
      { status: 500 },
    );
  }

  const linhas = (transacoes ?? []).map((transacao) => ({
    descricao: transacao.description,
    valor: transacao.amount,
    data: transacao.date,
    tipo: transacao.type === "receita" ? "Receita" : "Despesa",
    categoria: transacao.categories?.name ?? "",
  }));

  const dataArquivo = new Date().toISOString().slice(0, 10);

  if (formato === "xlsx") {
    const workbook = new ExcelJS.Workbook();
    const planilha = workbook.addWorksheet("Transações");
    planilha.columns = [
      { header: "Descrição", key: "descricao", width: 32 },
      { header: "Valor", key: "valor", width: 14 },
      { header: "Data", key: "data", width: 14 },
      { header: "Tipo", key: "tipo", width: 12 },
      { header: "Categoria", key: "categoria", width: 18 },
    ];
    planilha.addRows(linhas);
    planilha.getRow(1).font = { bold: true };
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="transacoes-${dataArquivo}.xlsx"`,
      },
    });
  }

  const cabecalho = ["Descrição", "Valor", "Data", "Tipo", "Categoria"];
  const corpo = linhas.map((linha) =>
    [linha.descricao, linha.valor.toFixed(2), linha.data, linha.tipo, linha.categoria]
      .map(String)
      .map(escaparCsv)
      .join(","),
  );
  const csv = [cabecalho.join(","), ...corpo].join("\n");

  return new NextResponse(BOM_UTF8 + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="transacoes-${dataArquivo}.csv"`,
    },
  });
}
