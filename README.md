# Yasmim Markets

Painel educacional sobre XAU/USD e MetaTrader 5, feito com **React 19, TypeScript, Vite 8, Tailwind CSS 4, React Router, TanStack Query e Radix UI**. A interface usa componentes reutilizáveis e uma paleta branca monocromática.

## Executar localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

## Estrutura

- `src/pages`: visão geral, notícias e academia.
- `src/components`: layout, cards de mercado, feed e calculadora.
- `src/services` e `src/hooks`: acesso às APIs e atualização/cache dos dados.
- `src/data` e `src/types`: trilha didática e contratos TypeScript.

## Fontes externas

- **Cotação indicativa do ouro:** `https://api.gold-api.com/price/XAU`, atualizada a cada 60 segundos.
- **Manchetes:** Google News RSS convertido pelo RSS2JSON, atualizado a cada 15 minutos.
- **Gráfico:** widget TradingView no símbolo OANDA:XAUUSD.

As fontes podem ter indisponibilidade, atraso ou diferir da cotação e das condições da corretora. O resumo semanal organiza palavras-chave encontradas nas manchetes; não é uma previsão numérica, análise fundamental completa ou recomendação de compra/venda. A calculadora é educativa e usa premissas simplificadas: confirme tamanho do contrato, tick e lote mínimo no MT5 da sua corretora.
