const API_BASE = "https://api.coingecko.com/api/v3";

const CORES = {
  bitcoin: "#f7931a",
  grade: "#262b36",
  textoSuave: "#9aa1ac",
};

const estado = {
  moeda: "usd", // "usd" ou "brl"
};

const graficos = {
  semanal: null,
  anual: null,
  periodo: null,
};

const elementos = {
  precoAtual: document.getElementById("preco-atual"),
  variacao24h: document.getElementById("variacao-24h"),
  botaoMoeda: document.getElementById("botao-moeda"),
  mensagemStatus: document.getElementById("mensagem-status"),
  formPeriodo: document.getElementById("form-periodo"),
  dataInicial: document.getElementById("data-inicial"),
  dataFinal: document.getElementById("data-final"),
  tabelaCorpo: document.getElementById("tabela-historico-corpo"),
};

function formatarMoeda(valor, moeda) {
  return new Intl.NumberFormat(moeda === "brl" ? "pt-BR" : "en-US", {
    style: "currency",
    currency: moeda.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(valor);
}

function formatarData(timestampMs) {
  return new Date(timestampMs).toLocaleDateString("pt-BR");
}

function mostrarStatus(mensagem, tipo) {
  elementos.mensagemStatus.textContent = mensagem;
  elementos.mensagemStatus.hidden = false;
  elementos.mensagemStatus.classList.toggle("erro", tipo === "erro");
}

function esconderStatus() {
  elementos.mensagemStatus.hidden = true;
  elementos.mensagemStatus.classList.remove("erro");
}

async function buscarDados(url) {
  let resposta;
  try {
    resposta = await fetch(url);
  } catch (erro) {
    throw new Error("Sem conexão com a internet. Verifique sua rede e tente novamente.");
  }

  if (resposta.status === 429) {
    throw new Error("Limite de requisições da API foi atingido. Aguarde um minuto e tente novamente.");
  }
  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os dados do Bitcoin agora. Tente novamente em instantes.");
  }
  return resposta.json();
}

function converterPrecosParaPontos(prices) {
  return prices.map(([timestampMs, valor]) => ({ x: timestampMs, y: valor }));
}

function criarOuAtualizarGrafico(chave, canvasId, prices, rotulo) {
  const pontos = converterPrecosParaPontos(prices);

  if (graficos[chave]) {
    graficos[chave].data.datasets[0].data = pontos;
    graficos[chave].data.datasets[0].label = rotulo;
    graficos[chave].update();
    return;
  }

  const canvas = document.getElementById(canvasId);
  graficos[chave] = new Chart(canvas, {
    type: "line",
    data: {
      datasets: [
        {
          label: rotulo,
          data: pontos,
          borderColor: CORES.bitcoin,
          backgroundColor: "rgba(247, 147, 26, 0.15)",
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
          tension: 0.2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "time",
          time: { tooltipFormat: "dd/MM/yyyy HH:mm" },
          grid: { color: CORES.grade },
          ticks: { color: CORES.textoSuave },
        },
        y: {
          grid: { color: CORES.grade },
          ticks: { color: CORES.textoSuave },
        },
      },
      plugins: {
        legend: { display: false },
      },
    },
  });
}

function atualizarTabelaHistorico(prices) {
  elementos.tabelaCorpo.innerHTML = "";

  prices.forEach(([timestampMs, valor], indice) => {
    const linha = document.createElement("tr");

    const anterior = indice > 0 ? prices[indice - 1][1] : null;
    const variacao = anterior ? ((valor - anterior) / anterior) * 100 : null;

    const celulaData = document.createElement("td");
    celulaData.textContent = formatarData(timestampMs);

    const celulaPreco = document.createElement("td");
    celulaPreco.textContent = formatarMoeda(valor, estado.moeda);

    const celulaVariacao = document.createElement("td");
    celulaVariacao.textContent = variacao === null ? "—" : `${variacao.toFixed(2)}%`;

    linha.append(celulaData, celulaPreco, celulaVariacao);
    elementos.tabelaCorpo.appendChild(linha);
  });
}

async function carregarPrecoAtual() {
  const dados = await buscarDados(
    `${API_BASE}/simple/price?ids=bitcoin&vs_currencies=usd,brl&include_24hr_change=true`
  );

  const preco = dados.bitcoin[estado.moeda];
  const variacao = dados.bitcoin[`${estado.moeda}_24h_change`];

  elementos.precoAtual.textContent = formatarMoeda(preco, estado.moeda);
  elementos.variacao24h.textContent = `${variacao >= 0 ? "▲" : "▼"} ${Math.abs(variacao).toFixed(2)}% (24h)`;
  elementos.variacao24h.classList.toggle("positiva", variacao >= 0);
  elementos.variacao24h.classList.toggle("negativa", variacao < 0);
}

async function carregarGraficoPorDias(chave, canvasId, dias, rotulo) {
  const dados = await buscarDados(
    `${API_BASE}/coins/bitcoin/market_chart?vs_currency=${estado.moeda}&days=${dias}`
  );
  criarOuAtualizarGrafico(chave, canvasId, dados.prices, rotulo);
}

async function carregarGraficoPeriodo(dataInicialStr, dataFinalStr) {
  const from = Math.floor(new Date(`${dataInicialStr}T00:00:00`).getTime() / 1000);
  const to = Math.floor(new Date(`${dataFinalStr}T23:59:59`).getTime() / 1000);

  const dados = await buscarDados(
    `${API_BASE}/coins/bitcoin/market_chart/range?vs_currency=${estado.moeda}&from=${from}&to=${to}`
  );

  criarOuAtualizarGrafico("periodo", "grafico-periodo", dados.prices, "Preço no período");
  atualizarTabelaHistorico(dados.prices);
}

async function carregarTudo() {
  esconderStatus();
  mostrarStatus("Carregando dados...");

  try {
    await carregarPrecoAtual();
    await carregarGraficoPorDias("semanal", "grafico-semanal", 7, "Últimos 7 dias");
    await carregarGraficoPorDias("anual", "grafico-anual", 365, "Últimos 365 dias");
    await carregarGraficoPeriodo(elementos.dataInicial.value, elementos.dataFinal.value);
    esconderStatus();
  } catch (erro) {
    mostrarStatus(erro.message, "erro");
  }
}

function definirDatasPadrao() {
  const hoje = new Date();
  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(hoje.getDate() - 7);

  elementos.dataInicial.value = seteDiasAtras.toISOString().slice(0, 10);
  elementos.dataFinal.value = hoje.toISOString().slice(0, 10);
  elementos.dataFinal.max = hoje.toISOString().slice(0, 10);
}

elementos.botaoMoeda.addEventListener("click", async () => {
  estado.moeda = estado.moeda === "usd" ? "brl" : "usd";
  elementos.botaoMoeda.textContent = estado.moeda === "usd" ? "Ver em BRL" : "Ver em USD";
  await carregarTudo();
});

elementos.formPeriodo.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const inicio = elementos.dataInicial.value;
  const fim = elementos.dataFinal.value;

  if (new Date(inicio) > new Date(fim)) {
    mostrarStatus("A data inicial não pode ser depois da data final.", "erro");
    return;
  }

  esconderStatus();
  mostrarStatus("Atualizando período...");

  try {
    await carregarGraficoPeriodo(inicio, fim);
    esconderStatus();
  } catch (erro) {
    mostrarStatus(erro.message, "erro");
  }
});

definirDatasPadrao();
carregarTudo();
