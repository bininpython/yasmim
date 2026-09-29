import type { GoldQuote, MarketNews, NewsFeedResponse } from '../types/market'

const GOLD_PRICE_URL = 'https://api.gold-api.com/price/XAU'
const GOOGLE_NEWS_RSS = 'https://news.google.com/rss/search?q=ouro+OR+XAUUSD+OR+Federal+Reserve+OR+infla%C3%A7%C3%A3o+EUA&hl=pt-BR&gl=BR&ceid=BR:pt-419'
const RSS_JSON_URL = 'https://api.rss2json.com/v1/api.json?rss_url='

function readText(value: string | undefined): string {
  if (!value) return ''
  const document = new DOMParser().parseFromString(value, 'text/html')
  return (document.body.textContent ?? '').trim()
}

export async function fetchGoldQuote(signal?: AbortSignal): Promise<GoldQuote> {
  const response = await fetch(GOLD_PRICE_URL, { signal, cache: 'no-store' })
  if (!response.ok) throw new Error(`Cotação indisponível (${response.status})`)
  const payload: unknown = await response.json()
  if (typeof payload !== 'object' || payload === null) throw new Error('Resposta de cotação inválida')

  const data = payload as Record<string, unknown>
  const price = Number(data.price ?? data.ask ?? data.rate)
  const changePercent = Number(data.chp ?? data.changePercent)
  if (!Number.isFinite(price) || price <= 0) throw new Error('Preço de ouro inválido')

  return {
    price,
    changePercent: Number.isFinite(changePercent) ? changePercent : undefined,
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : typeof data.timestamp === 'string' ? data.timestamp : undefined,
  }
}

export async function fetchMarketNews(signal?: AbortSignal): Promise<MarketNews[]> {
  const url = `${RSS_JSON_URL}${encodeURIComponent(GOOGLE_NEWS_RSS)}`
  const response = await fetch(url, { signal, cache: 'no-store' })
  if (!response.ok) throw new Error(`Feed de notícias indisponível (${response.status})`)
  const payload = (await response.json()) as NewsFeedResponse
  if (payload.status !== 'ok' || !Array.isArray(payload.items)) throw new Error('Resposta de notícias inválida')

  return payload.items.flatMap((item) => {
    if (!item.title || !item.link) return []
    return [{
      title: readText(item.title),
      link: item.link,
      publishedAt: item.pubDate,
      source: item.author || item.feed?.title || 'Google News',
      summary: readText(item.description),
    }]
  }).slice(0, 12)
}
