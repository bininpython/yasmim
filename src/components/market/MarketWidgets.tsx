import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Clock3, ExternalLink, Newspaper, RefreshCw, ShieldAlert, TrendingUp, Zap } from 'lucide-react'

import type { GoldQuote, MarketNews, WeeklyContext } from '../../types/market'
import { formatUsd } from '../../lib/format'
import { NewsFeed } from './NewsFeed'

export function QuoteCard({ quote, updatedAt, onRefresh, refreshing, error }: { quote?: GoldQuote; updatedAt: Date | null; onRefresh: () => void; refreshing: boolean; error: boolean }) {
  return <section className="surface quote-card bg-white text-neutral-900">
    <div className="widget-top"><div><span className="eyebrow-label">OURO À VISTA · XAU/USD</span><h2>Ouro em dólar <span className="symbol-label">XAU / USD</span></h2></div><button className="icon-action" onClick={onRefresh} aria-label="Atualizar cotação" disabled={refreshing}><RefreshCw size={15}/></button></div>
    <div className="quote-value-row"><strong>{quote ? formatUsd(quote.price) : '—'}</strong>{quote?.changePercent !== undefined && <span className={`change-label ${quote.changePercent >= 0 ? 'positive' : 'negative'}`}>{quote.changePercent >= 0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {Math.abs(quote.changePercent).toFixed(2)}%</span>}</div>
    <div className="quote-caption"><span><i className="status-dot"/>Cotação indicativa · USD por onça troy</span><span>{updatedAt ? `Atualizado ${updatedAt.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}` : 'Aguardando atualização'}</span></div>
    {error && <p className="inline-message">A cotação não respondeu. Tente atualizar novamente.</p>}
  </section>
}

export function buildWeeklyContext(news: MarketNews[]): WeeklyContext {
  const text = news.slice(0, 6).map((item) => item.title.toLocaleLowerCase('pt-BR')).join(' ')
  const riskTone = /(guerra|conflito|tens[aã]o|ataque|incerteza|crise|geopol[ií]tic)/i.test(text)
  const ratesTone = /(fed|juros|rendimento|payroll|emprego|infla|d[oó]lar|cpi|pce)/i.test(text)
  if (news.length === 0) return { bias: 'unclear', title: 'Aguardando notícias atuais', description: 'Quando o feed responder, esta área resume os assuntos presentes nas manchetes recentes.' }
  if (riskTone && ratesTone) return { bias: 'mixed', title: 'Manchetes com fatores mistos', description: 'Há referências a risco global e a dados monetários. Esses vetores podem atuar em direções diferentes; acompanhe a reação do preço.' }
  if (riskTone) return { bias: 'supportive', title: 'Risco global em destaque', description: 'Manchetes citam incerteza, que pode ampliar a procura por proteção. Isso não determina a direção do ouro.' }
  if (ratesTone) return { bias: 'pressure', title: 'Juros, dados e dólar em foco', description: 'As manchetes citam fatores que podem mudar expectativas de juros e dólar. O efeito no ouro depende do dado e do que já estava precificado.' }
  return { bias: 'unclear', title: 'Sem direção clara nas manchetes', description: 'O feed não sustenta uma leitura única. Observe os próximos dados e a reação do mercado.' }
}

export function WeeklyContextCard({ context, newsCount }: { context: WeeklyContext; newsCount: number }) {
  return <section className="surface context-card">
    <div className="widget-top"><div><span className="eyebrow-label">CENÁRIO DA SEMANA</span><h2>Contexto macroeconômico</h2></div><span className="minimal-icon"><Activity size={17}/></span></div>
    <div className={`context-callout ${context.bias}`}><span className="context-indicator"><Zap size={16}/></span><div><b>{context.title}</b><p>{context.description}</p></div></div>
    <div className="context-footer"><span>Resumo automático de até {Math.min(newsCount, 6)} manchetes</span><span className="context-note"><ShieldAlert size={13}/> Não é previsão de preço</span></div>
  </section>
}

export function MacroDrivers() {
  const drivers = [
    { icon: <Activity size={17}/>, title: 'Federal Reserve', tag: 'POLÍTICA MONETÁRIA', text: 'Expectativas de juros e comunicação do Fed podem influenciar o dólar e os juros reais.' },
    { icon: <TrendingUp size={17}/>, title: 'Inflação e emprego', tag: 'DADOS DOS EUA', text: 'CPI, PCE e Payroll podem alterar as expectativas para os próximos passos do Fed.' },
    { icon: <ShieldAlert size={17}/>, title: 'Risco global', tag: 'SENTIMENTO', text: 'Incertezas podem aumentar a procura por proteção, sem definir o movimento do ouro.' },
  ]
  return <div className="driver-grid">{drivers.map((driver) => <article className="driver-card" key={driver.title}><div className="driver-heading"><span className="driver-icon">{driver.icon}</span><span>{driver.tag}</span></div><h3>{driver.title}</h3><p>{driver.text}</p></article>)}</div>
}

export function TradingViewChart() {
  return <section className="surface chart-card"><div className="widget-top"><div><span className="eyebrow-label">GRÁFICO INTERATIVO</span><h2>XAU/USD <span className="chart-subtitle">· visão de mercado</span></h2></div><a className="source-label" href="https://www.tradingview.com/symbols/XAUUSD/" target="_blank" rel="noreferrer">TradingView <ExternalLink size={12}/></a></div><div className="tradingview-frame"><iframe title="Gráfico XAU/USD" src="https://s.tradingview.com/widgetembed/?symbol=OANDA%3AXAUUSD&interval=60&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=%23ffffff&theme=light&style=1&timezone=America%2FSao_Paulo&withdateranges=1&hideideas=1&hidevolume=1&allow_symbol_change=0&locale=br" loading="lazy"/></div><div className="chart-caption"><span>Feed de mercado exibido pelo TradingView.</span><span>Confirme preço e especificações na sua corretora.</span></div></section>
}

export function HeadlinesCard({ news, loading, error, onOpenNews }: { news: MarketNews[]; loading: boolean; error: boolean; onOpenNews: () => void }) {
  return <section className="surface headlines-card"><div className="widget-top"><div><span className="eyebrow-label">ÚLTIMAS MANCHETES</span><h2>Notícias em foco</h2></div><span className="minimal-icon"><Newspaper size={17}/></span></div><NewsFeed items={news.slice(0, 4)} loading={loading} error={error} compact/><button className="text-action" onClick={onOpenNews}>Abrir central de notícias <ArrowRight size={14}/></button></section>
}

export function SourceCaption({ updatedAt }: { updatedAt: Date | null }) { return <div className="source-caption"><Clock3 size={13}/>{updatedAt ? `Cotação consultada às ${updatedAt.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}` : 'Dados renovados automaticamente quando disponíveis'}</div> }
