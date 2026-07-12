# Plano do Projeto — Dashboard Bitcoin

## Objetivo

Dashboard web simples para acompanhar o preço do Bitcoin em tempo real, com gráficos de variação de preço e histórico consultável, usando apenas front-end (sem servidor/backend próprio).

## Fonte de dados

[CoinGecko API](https://www.coingecko.com/en/api) pública, sem necessidade de chave de acesso (`https://api.coingecko.com/api/v3`).

Limite gratuito: 5–15 requisições por minuto. O dashboard evita chamadas desnecessárias (só busca dados no carregamento da página e quando o usuário troca o período ou a moeda).

Endpoints usados:
- `GET /simple/price?ids=bitcoin&vs_currencies=usd,brl&include_24hr_change=true` — preço atual e variação de 24h.
- `GET /coins/bitcoin/market_chart?vs_currency={usd|brl}&days=7` — histórico dos últimos 7 dias (gráfico semanal).
- `GET /coins/bitcoin/market_chart?vs_currency={usd|brl}&days=365` — histórico dos últimos 365 dias (gráfico anual).
- `GET /coins/bitcoin/market_chart/range?vs_currency={usd|brl}&from={timestamp}&to={timestamp}` — histórico de um período customizado escolhido pelo usuário.

## Stack

- HTML + CSS + JavaScript puro (sem framework, sem build, sem `npm install`).
- [Chart.js](https://www.chartjs.org/) via CDN, para os gráficos de linha.
- [chartjs-adapter-date-fns](https://github.com/chartjs/chartjs-adapter-date-fns) via CDN, para o eixo de datas dos gráficos.

Justificativa: projeto pequeno, sem necessidade de reatividade complexa ou múltiplas páginas — HTML/CSS/JS puro é o suficiente e o mais fácil de entender/editar para quem está começando.

## Estrutura de arquivos

```
ProjetoCloudeCode/
├── index.html      # estrutura da página
├── css/style.css    # tema escuro estilo "cripto"
├── js/app.js         # lógica: chamadas à API, gráficos, seletor de datas, troca de moeda
├── plan.md           # este arquivo
└── claude.md          # contexto do projeto para uso com Claude Code
```

## Funcionalidades implementadas

- Preço atual do Bitcoin em destaque, com variação das últimas 24h (verde/vermelho).
- Alternância entre exibir valores em USD ou BRL.
- Gráfico de variação semanal (últimos 7 dias).
- Gráfico de variação anual (últimos 365 dias).
- Seletor de período customizado (data inicial e final) com gráfico próprio.
- Tabela de dados históricos (data, preço, variação em relação ao dia anterior) para o período customizado.
- Mensagens de carregamento e de erro amigáveis (ex: sem internet, limite de requisições da API atingido).

## Como rodar

Basta abrir o arquivo `index.html` no navegador (duplo clique) ou servir a pasta com um servidor estático simples, como a extensão "Live Server" do VS Code.

## Possíveis melhorias futuras

- Suporte a outras criptomoedas além do Bitcoin.
- Cache local (localStorage) para reduzir chamadas repetidas à API.
- Modo PWA (funcionar offline com o último dado carregado).
- Gráfico de candlestick (velas) em vez de linha.
