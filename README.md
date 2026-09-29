# Yasmim Markets — XAU/USD para iniciantes

Aplicação em React, TypeScript e Vite para acompanhar uma cotação indicativa do ouro, consultar manchetes e aprender os conceitos básicos de Forex/XAUUSD e MetaTrader 5.

## Rodar localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

## Fontes de dados

- **Preço indicativo XAU/USD:** endpoint público `https://api.gold-api.com/price/XAU`, consultado a cada 60 segundos. Não é necessariamente o preço executável da corretora e não há garantia de disponibilidade ou latência.
- **Manchetes:** feed RSS do Google News consultado via RSS2JSON, renovado a cada 15 minutos. O feed pode ficar indisponível, limitar requisições ou apresentar manchetes em idiomas diferentes.
- **Gráfico:** widget incorporado do TradingView com o símbolo OANDA:XAUUSD. Pode usar um feed diferente do broker do usuário.

## Observação sobre a análise semanal

O painel faz uma classificação simples de palavras presentes nas manchetes, para organizar temas que merecem atenção. Ele **não** prevê uma cotação futura, não interpreta um calendário econômico ao vivo e não gera recomendações de compra/venda. A classificação pode errar contexto, ironia, manchetes antigas ou traduções. A calculadora de posição é educativa e deve ser ajustada às especificações do contrato da corretora.

## Deploy

Projeto estático compatível com Vercel, Netlify e GitHub Pages (configurar base path caso publique em subdiretório).
