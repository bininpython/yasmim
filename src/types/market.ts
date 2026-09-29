export interface GoldQuote {
  price: number
  changePercent?: number
  updatedAt?: string
}

export interface MarketNews {
  title: string
  link: string
  publishedAt?: string
  source: string
  summary?: string
}

export interface NewsFeedResponse {
  status?: string
  items?: Array<{
    title?: string
    link?: string
    pubDate?: string
    author?: string
    description?: string
    feed?: { title?: string }
  }>
}

export interface Lesson {
  title: string
  category: string
  content: string
}

export type MarketBias = 'supportive' | 'pressure' | 'mixed' | 'unclear'
export interface WeeklyContext {
  bias: MarketBias
  title: string
  description: string
}
