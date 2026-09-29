import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { AcademyPage } from './pages/AcademyPage'
import { NewsPage } from './pages/NewsPage'
import { OverviewPage } from './pages/OverviewPage'

const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } })

export default function App() {
  return <QueryClientProvider client={queryClient}><BrowserRouter><Routes><Route element={<AppLayout/>}><Route index element={<OverviewPage/>}/><Route path="noticias" element={<NewsPage/>}/><Route path="academia" element={<AcademyPage/>}/></Route></Routes></BrowserRouter></QueryClientProvider>
}
