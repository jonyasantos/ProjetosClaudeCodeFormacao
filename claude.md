# Contexto do Projeto para Claude Code

## Visão geral

Dashboard estático (HTML/CSS/JS puro) que mostra o preço do Bitcoin, gráficos de variação semanal e anual, e permite consultar um período customizado de datas. Não tem backend — todos os dados vêm diretamente do navegador via chamadas à CoinGecko API pública.

## Sobre o usuário deste projeto

Usuário não técnico, iniciante em programação. Ao explicar mudanças no código ou processos, usar linguagem simples e didática, evitando jargões desnecessários. Responder sempre em português.

## Stack

- HTML + CSS + JavaScript puro. Sem framework, sem bundler, sem `package.json`.
- [Chart.js](https://www.chartjs.org/) (via CDN) para os gráficos de linha.
- [chartjs-adapter-date-fns](https://github.com/chartjs/chartjs-adapter-date-fns) (via CDN) para o eixo de tempo dos gráficos.

Não introduzir build steps (Webpack, Vite, npm) a menos que explicitamente solicitado — a simplicidade de "abrir o HTML e funcionar" é um requisito do projeto.

## Como rodar localmente

Abrir `index.html` diretamente no navegador (duplo clique), ou usar um servidor estático simples (ex: extensão "Live Server" do VS Code, ou `python3 -m http.server`).

## Estrutura de arquivos

```
index.html      # estrutura da página (cabeçalho, gráficos, seletor de datas, tabela)
css/style.css     # tema visual (escuro, estilo "cripto")
js/app.js          # toda a lógica: chamadas à API, criação/atualização dos gráficos, seletor de datas, troca de moeda, tratamento de erro
plan.md             # plano e histórico de decisões do projeto
```

## Fonte de dados: CoinGecko API

Base: `https://api.coingecko.com/api/v3` — pública, sem chave de API, funciona direto do navegador (CORS liberado).

**Limite gratuito sem chave: 5–15 requisições/minuto.** Evitar disparar chamadas em excesso (ex: não buscar dados a cada tecla digitada — só ao enviar o formulário/trocar moeda).

Endpoints em uso, todos documentados em `plan.md`:
- `/simple/price` — preço atual + variação 24h.
- `/coins/bitcoin/market_chart` (com `days=7` ou `days=365`) — histórico semanal/anual.
- `/coins/bitcoin/market_chart/range` (com `from`/`to` em timestamp Unix) — período customizado.

## Convenções de código

- JavaScript puro (`js/app.js`), funções pequenas e nomeadas em português, reaproveitando lógica comum (ex: `buscarDados`, `formatarMoeda`) em vez de repetir chamadas `fetch` cruas em cada função.
- Sem comentários óbvios — só quando algo não for evidente pelo nome da função/variável.
- Tratamento de erro sempre com mensagem amigável na tela (função `mostrarStatus`), nunca deixando a tela travada em branco ou só um erro no console.
- Cores do tema centralizadas em `css/style.css` (variáveis CSS em `:root`) e replicadas como constantes no topo de `app.js` para os gráficos (Chart.js não lê variáveis CSS automaticamente).
