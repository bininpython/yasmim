import { useNavigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useGoldQuote, useMarketNews } from '../hooks/useMarketData'
import { formatToday } from '../lib/format'
import { HeadlinesCard, MacroDrivers, QuoteCard, TradingViewChart, WeeklyContextCard, buildWeeklyContext } from '../components/market/MarketWidgets'
import { PageIntro } from '../components/layout/AppLayout'

export function OverviewPage() {
  const navigate = useNavigate()
  const quote = useGoldQuote()
  const news = useMarketNews()
  const context = buildWeeklyContext(news.data ?? [])
  return <>
    <div className="overview-intro"><PageIntro eyebrow="PAINEL DO TRADER" title="Acompanhe o mercado." accent="Aprenda com clareza." description="Cotação, manchetes e conceitos essenciais para quem está começando no ouro."/><span className="date-stamp">{formatToday()}</span></div>
    <section className="overview-top-grid"><QuoteCard quote={quote.data} updatedAt={quote.dataUpdatedAt ? new Date(quote.dataUpdatedAt) : null} onRefresh={() => void quote.refetch()} refreshing={quote.isFetching} error={quote.isError}/><WeeklyContextCard context={context} newsCount={news.data?.length ?? 0}/></section>
    <section className="section-block"><div className="section-title-row"><div><span className="eyebrow-label">PONTOS DE ATENÇÃO</span><h2>O que pode influenciar o ouro</h2></div><button className="text-action" onClick={() => navigate('/noticias')}>Notícias e agenda <span>→</span></button></div><MacroDrivers/></section>
    <section className="overview-bottom-grid"><TradingViewChart/><HeadlinesCard news={news.data ?? []} loading={news.isLoading} error={news.isError} onOpenNews={() => navigate('/noticias')}/></section>
    <div className="disclaimer-banner"><ShieldAlert size={15}/><p><b>Informação para fins educacionais.</b> A cotação é indicativa e pode diferir da sua corretora. O resumo de manchetes é qualitativo, não prevê preço e não constitui sinal de compra ou venda.</p></div>
  </>
}
