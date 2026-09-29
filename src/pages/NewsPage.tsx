import { CalendarDays, ExternalLink, ShieldAlert } from 'lucide-react'
import { PageIntro } from '../components/layout/AppLayout'
import { NewsFeed } from '../components/market/NewsFeed'
import { SourceCaption } from '../components/market/MarketWidgets'
import { useMarketNews, useGoldQuote } from '../hooks/useMarketData'
import { buildWeeklyContext } from '../components/market/MarketWidgets'

export function NewsPage() {
  const news = useMarketNews()
  const quote = useGoldQuote()
  const context = buildWeeklyContext(news.data ?? [])
  return <>
    <PageIntro eyebrow="INFORMAÇÃO DE MERCADO" title="Notícias e agenda." description="Acompanhe assuntos ligados ao ouro, ao dólar, à inflação e ao Federal Reserve. Compare os dados com as expectativas e com a reação do preço."/>
    <div className="news-page-grid"><section className="surface news-page-feed"><div className="section-title-row"><div><span className="eyebrow-label">FEED · GOOGLE NEWS RSS</span><h2>Manchetes recentes</h2></div><button className="outline-action" onClick={() => void news.refetch()} disabled={news.isFetching}><CalendarDays size={14}/>{news.isFetching ? 'Atualizando' : 'Atualizar feed'}</button></div><NewsFeed items={news.data ?? []} loading={news.isLoading} error={news.isError}/></section>
      <aside className="news-aside"><section className="surface aside-card"><span className="eyebrow-label">LEITURA QUALITATIVA</span><h2>{context.title}</h2><p>{context.description}</p><div className="aside-foot"><ShieldAlert size={14}/> Não é previsão nem sinal de negociação</div></section><section className="surface aside-card"><span className="eyebrow-label">LEIA O CONTEXTO</span><h2>Antes de interpretar</h2><ol className="question-list"><li><span>01</span>O dado veio acima ou abaixo do consenso?</li><li><span>02</span>O preço já antecipava essa expectativa?</li><li><span>03</span>Como dólar e rendimentos reagiram?</li></ol></section><section className="surface aside-card"><span className="eyebrow-label">FONTES OFICIAIS</span><a className="source-link" href="https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" target="_blank" rel="noreferrer">Calendário do Federal Reserve <ExternalLink size={13}/></a><a className="source-link" href="https://www.bls.gov/schedule/2026/home.htm" target="_blank" rel="noreferrer">Agenda de dados do BLS <ExternalLink size={13}/></a><a className="source-link" href="https://www.bea.gov/news/schedule" target="_blank" rel="noreferrer">Agenda econômica BEA <ExternalLink size={13}/></a></section><SourceCaption updatedAt={quote.dataUpdatedAt ? new Date(quote.dataUpdatedAt) : null}/></aside>
    </div>
    <div className="disclaimer-banner"><ShieldAlert size={15}/><p><b>Sobre o resumo semanal.</b> O site categoriza termos nas manchetes recentes; não lê dados econômicos em profundidade nem calcula uma previsão numérica. Eventos podem gerar reações diferentes das expectativas.</p></div>
  </>
}
