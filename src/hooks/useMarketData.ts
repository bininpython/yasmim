import { useQuery } from '@tanstack/react-query'
import { fetchGoldQuote, fetchMarketNews } from '../services/marketData'

export function useGoldQuote() {
  return useQuery({
    queryKey: ['gold-quote'],
    queryFn: ({ signal }) => fetchGoldQuote(signal),
    staleTime: 45_000,
    refetchInterval: 60_000,
    retry: 1,
  })
}

export function useMarketNews() {
  return useQuery({
    queryKey: ['market-news'],
    queryFn: ({ signal }) => fetchMarketNews(signal),
    staleTime: 10 * 60_000,
    refetchInterval: 15 * 60_000,
    retry: 1,
  })
}
