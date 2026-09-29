import { ExternalLink, Newspaper } from 'lucide-react'
import type { MarketNews } from '../../types/market'
import { formatDate } from '../../lib/format'

export function NewsFeed({ items, loading, error, compact = false }: { items: MarketNews[]; loading: boolean; error: boolean; compact?: boolean }) {
  if (loading && items.length === 0) return <div className="feed-loading" aria-label="Carregando notícias"><i/><i/><i/></div>
  if (items.length === 0) return <div className="feed-empty"><Newspaper size={18}/><b>{error ? 'Feed temporariamente indisponível' : 'Nenhuma manchete disponível agora'}</b><p>Consulte também as fontes econômicas oficiais.</p><a href="https://www.federalreserve.gov/newsevents.htm" target="_blank" rel="noreferrer">Federal Reserve <ExternalLink size={12}/></a><a href="https://www.bls.gov/news.release/" target="_blank" rel="noreferrer">Bureau of Labor Statistics <ExternalLink size={12}/></a></div>
  return <div className={`news-list ${compact ? 'news-list-compact' : ''}`}>
    {items.map((item, index) => <article className="news-item" key={`${item.link}-${index}`}>
      <span className="news-item-icon"><Newspaper size={15}/></span>
      <div className="news-item-content"><a href={item.link} target="_blank" rel="noreferrer" className="news-item-title">{item.title}<ExternalLink size={12}/></a>
        {!compact && item.summary && <p>{item.summary}</p>}
        <div className="news-item-meta"><span>{item.source}</span><i/>{formatDate(item.publishedAt)}</div>
      </div>
    </article>)}
  </div>
}
