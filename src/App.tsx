import { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, CalendarDays,
  Check, ChevronDown, Clock3, ExternalLink, GraduationCap, Menu, Newspaper,
  RefreshCw, ShieldAlert, Sparkles, TrendingUp, X, Zap,
} from 'lucide-react'

type Quote = { price: number; updatedAt?: string; ch?: number; chp?: number; high_price?: number; low_price?: number }
type NewsItem = { title: string; link: string; pubDate?: string; source?: string; description?: string }
type Tab = 'overview' | 'news' | 'academy'

const NEWS_URL = 'https://news.google.com/rss/search?q=ouro+OR+XAUUSD+OR+Federal+Reserve+OR+US+inflation&hl=pt-BR&gl=BR&ceid=BR:pt-419'
const RSS_PROXY = 'https://api.rss2json.com/v1/api.json?rss_url='
const lessons = [
  {title:'1. O que é Forex e como funciona o XAU/USD?',tag:'Fundamentos',content:'Forex é o mercado global de moedas. XAU/USD representa o valor de uma onça troy de ouro (XAU) cotada em dólares americanos (USD). O ouro é uma commodity, mas muitas corretoras oferecem sua negociação como CFD. Nesse caso, você negocia um contrato com a corretora, não barras físicas. Horários, custos, alavancagem e especificações variam entre brokers.'},
  {title:'2. Cotação, spread e custos da operação',tag:'Fundamentos',content:'A cotação mostra preços de compra (Ask) e venda (Bid). A diferença entre eles é o spread. Também podem existir comissão e swap (custo ou crédito por manter posição aberta durante a noite). Em notícias e períodos de baixa liquidez, spread e slippage podem aumentar. Confira os custos e o horário do servidor na especificação do símbolo da sua corretora.'},
  {title:'3. O que é pip no ouro?',tag:'Conceitos',content:'Pip é uma unidade de variação, mas no XAU/USD a quantidade de casas decimais e o tamanho do tick dependem da corretora. Alguns brokers chamam US$ 0,01 de ponto e US$ 0,10 ou US$ 1,00 de pip. Não suponha um padrão: abra “Especificação” do símbolo no MT5 e confira dígitos, tamanho do tick e valor do tick. Para gestão de risco, use a distância de preço e o valor monetário informado pela corretora.'},
  {title:'4. Lote, volume e tamanho do contrato',tag:'Risco',content:'Lote mede o volume negociado. Em muitos CFDs de ouro, 1,00 lote equivale a 100 onças, mas isso não é universal. 0,10 lote pode representar 10 onças e 0,01 lote uma onça se o contrato for de 100 oz. Confirme o tamanho do contrato e valor do tick no seu broker. Quanto maior o lote, maior o ganho ou a perda para a mesma variação do preço.'},
  {title:'5. Margem e alavancagem',tag:'Risco',content:'Margem é o valor reservado para manter uma posição. Alavancagem permite controlar uma exposição maior do que o saldo, ampliando ganhos e perdas. Ela não reduz o risco. Uma chamada de margem ou stop-out pode liquidar posições. Nunca escolha o lote pelo máximo que a plataforma permite; dimensione pelo valor que aceita perder no stop.'},
  {title:'6. Timeframes: M1, M5, M15, H1 e D1',tag:'Plataforma',content:'O timeframe define quanto tempo cada candle representa: M5 = 5 minutos, H1 = 1 hora, D1 = 1 dia. Gráficos curtos mostram mais ruído e exigem decisões rápidas; gráficos longos resumem mais contexto e têm menos candles. Muitos traders usam um timeframe maior para contexto e outro menor para planejar a execução, sem garantia de resultado.'},
  {title:'7. Primeiros passos no MetaTrader 5',tag:'Plataforma',content:'No MT5: abra Observação do Mercado, localize o símbolo de ouro da corretora (pode aparecer como XAUUSD, GOLD ou com sufixo), clique com o botão direito para abrir o gráfico e confira a especificação. Use Nova Ordem para definir volume, tipo de execução, Stop Loss e Take Profit. Treine em conta demo. Confira se a plataforma está conectada e se o mercado está aberto para aquele instrumento.'},
  {title:'8. Ordens: mercado, limite e stop',tag:'Plataforma',content:'Ordem a mercado tenta executar imediatamente ao preço disponível. Buy Limit e Sell Limit aguardam um preço melhor definido; Buy Stop e Sell Stop aguardam rompimento de um nível. Em gaps, volatilidade alta ou baixa liquidez, a execução pode ocorrer em preço diferente do solicitado. Stop Loss ajuda a limitar a perda, mas não garante o preço em todas as condições.'},
  {title:'9. Como ler candles e tendência',tag:'Análise',content:'Cada candle mostra abertura, máxima, mínima e fechamento no período escolhido. Uma sequência de máximas e mínimas ascendentes pode sugerir tendência de alta; descendentes, baixa. Um candle isolado não prevê o próximo movimento. Combine estrutura, níveis, contexto e plano de risco; teste suas regras antes de operar dinheiro real.'},
  {title:'10. Notícias que podem mexer com o ouro',tag:'Macro',content:'O ouro pode reagir a juros reais e expectativas do Fed, inflação (CPI/PCE), emprego (Payroll), força do dólar, compras de bancos centrais e riscos geopolíticos. Relações históricas não são leis: às vezes o preço já antecipou o dado ou reage ao texto e às revisões. Observe o consenso, o número divulgado, revisões e a reação dos preços.'},
  {title:'11. Plano de risco para iniciantes',tag:'Risco',content:'Antes de cada operação, defina entrada, invalidação (stop), objetivo e tamanho da posição. Uma conta demo ajuda a praticar execução; diário de operações ajuda a avaliar disciplina. Evite aumentar lote para recuperar perdas e não arrisque dinheiro necessário para despesas. Um limite de risco por operação é uma regra pessoal, não uma promessa de proteção.'},
]
function money(value?: number) { return typeof value === 'number' && Number.isFinite(value) ? new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(value) : '—' }
function safeDate(date?: string) { if(!date) return 'Horário indisponível'; const d = new Date(date); return Number.isNaN(d.getTime()) ? 'Horário indisponível' : d.toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'}) }
function stripHtml(s = '') { const doc = new DOMParser().parseFromString(s,'text/html'); return (doc.body.textContent || '').trim() }

export default function App() {
  const [tab,setTab] = useState<Tab>('overview')
  const [quote,setQuote] = useState<Quote | null>(null)
  const [quoteError,setQuoteError] = useState(false)
  const [news,setNews] = useState<NewsItem[]>([])
  const [newsLoading,setNewsLoading] = useState(true)
  const [newsError,setNewsError] = useState(false)
  const [riskBalance,setRiskBalance] = useState('500')
  const [riskPercent,setRiskPercent] = useState('1')
  const [stopDistance,setStopDistance] = useState('5')
  const [contract,setContract] = useState('100')
  const [openLesson,setOpenLesson] = useState(0)
  const [mobileMenu,setMobileMenu] = useState(false)
  const [lastRefresh,setLastRefresh] = useState<Date | null>(null)

  async function loadQuote() {
    try {
      const res = await fetch('https://api.gold-api.com/price/XAU', {signal:AbortSignal.timeout(10000),cache:'no-store'})
      if(!res.ok) throw new Error('quote unavailable')
      const data = await res.json()
      const price = Number(data.price ?? data.ask ?? data.rate)
      if(!Number.isFinite(price) || price <= 0) throw new Error('invalid quote')
      setQuote({price,updatedAt:data.updatedAt ?? data.timestamp,ch:Number(data.ch ?? data.change),chp:Number(data.chp ?? data.changePercent),high_price:Number(data.high_price ?? data.high),low_price:Number(data.low_price ?? data.low)})
      setQuoteError(false); setLastRefresh(new Date())
    } catch { setQuoteError(true) }
  }
  async function loadNews() {
    setNewsLoading(true)
    try {
      const res=await fetch(RSS_PROXY+encodeURIComponent(NEWS_URL),{signal:AbortSignal.timeout(12000),cache:'no-store'})
      if(!res.ok) throw new Error('news unavailable')
      const data=await res.json()
      if(data.status !== 'ok' || !Array.isArray(data.items)) throw new Error('invalid feed')
      setNews(data.items.slice(0,10).map((n: any)=>({title:stripHtml(n.title),link:n.link,pubDate:n.pubDate,source:n.author || n.feed?.title || 'Google News',description:stripHtml(n.description || '')})))
      setNewsError(false)
    } catch { setNewsError(true); setNews([]) }
    finally { setNewsLoading(false) }
  }
  useEffect(()=>{void loadQuote();void loadNews();const q=setInterval(()=>void loadQuote(),60000);const n=setInterval(()=>void loadNews(),15*60*1000);return()=>{clearInterval(q);clearInterval(n)}},[])

  const risk = useMemo(()=>{
    const balance=Number(riskBalance), pct=Number(riskPercent), distance=Number(stopDistance), contractSize=Number(contract)
    const loss=balance*pct/100
    const lots=distance>0 && contractSize>0 ? loss/(distance*contractSize) : 0
    return {loss,lots}
  },[riskBalance,riskPercent,stopDistance,contract])
  const headlineContext = useMemo(()=>news.slice(0,5),[news])
  const movers = useMemo(()=>{
    const texts=headlineContext.map(n=>n.title.toLowerCase()).join(' ')
    const hawkish=/(fed|juros|yield|rendimento|payroll|emprego|infla|dólar forte|dollar rises)/.test(texts)
    const safe=/(guerra|conflito|tensão|ataque|risco|incerteza|crise|safe haven)/.test(texts)
    if(!headlineContext.length) return {label:'Aguardando manchetes atuais',detail:'A leitura semanal será atualizada quando o feed de notícias estiver disponível.',tone:'neutral'}
    if(safe && !hawkish) return {label:'Atenção a fatores de proteção',detail:'Há termos ligados a risco nas manchetes. Isso pode sustentar procura por ouro, mas confirme a reação do preço e do dólar.',tone:'positive'}
    if(hawkish && safe) return {label:'Sinais macroeconômicos mistos',detail:'As manchetes sugerem forças opostas. Volatilidade pode aumentar; não há direção confiável sem observar dados e reação do mercado.',tone:'neutral'}
    if(hawkish) return {label:'Atenção a juros, emprego e dólar',detail:'As manchetes citam fatores que podem pressionar o ouro se reforçarem juros/dólar mais fortes. A reação real depende das expectativas.',tone:'negative'}
    return {label:'Sem viés direcional claro',detail:'As manchetes recentes não sustentam um cenário único. Acompanhe os próximos dados e os níveis de preço.',tone:'neutral'}
  },[headlineContext])

  const navItems: {id:Tab;label:string;icon:typeof Activity}[]=[{id:'overview',label:'Visão geral',icon:Activity},{id:'news',label:'Notícias e agenda',icon:Newspaper},{id:'academy',label:'Academia MT5',icon:GraduationCap}]
  function goTo(id:Tab){setTab(id);setMobileMenu(false);window.scrollTo({top:0,behavior:'smooth'})}

  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu?'mobile-open':''}`}>
      <button className="brand" onClick={()=>goTo('overview')} aria-label="Yasmim Markets início"><span className="brand-mark"><Sparkles size={19}/></span><span><b>YASMIM</b><small>MARKETS ACADEMY</small></span></button>
      <div className="side-label">MENU PRINCIPAL</div>
      <nav>{navItems.map(item=>{const Icon=item.icon;return <button key={item.id} className={`nav-item ${tab===item.id?'active':''}`} onClick={()=>goTo(item.id)}><Icon size={18}/><span>{item.label}</span>{item.id==='academy'&&<span className="nav-count">11</span>}</button>})}</nav>
      <div className="sidebar-bottom"><div className="learn-card"><div className="learn-icon"><BookOpen size={17}/></div><b>Comece pelo básico</b><p>Aprenda a proteger seu capital antes de pensar em operar.</p><button onClick={()=>goTo('academy')}>Abrir trilha <ArrowRight size={14}/></button></div><div className="profile"><div className="avatar">YM</div><div><b>Área do iniciante</b><small>Plano gratuito</small></div><ChevronDown size={15}/></div></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><button className="mobile-toggle" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="Abrir menu">{mobileMenu?<X size={21}/>:<Menu size={21}/>}</button><div className="breadcrumb"><span>Yasmim Markets</span><span className="slash">/</span><b>{navItems.find(i=>i.id===tab)?.label}</b></div><div className="top-right"><span className="market-open"><i/> Mercado em monitoramento</span><button className="refresh-btn" onClick={()=>{void loadQuote();void loadNews()}} title="Atualizar dados"><RefreshCw size={16}/></button><div className="avatar top-avatar">YM</div></div></header>
      <div className="content">
        {tab==='overview'&&<>
          <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line"/> {new Date().toLocaleDateString('pt-BR',{weekday:'long'}).toLocaleUpperCase()} · PAINEL DO TRADER</div><h1>Entenda o mercado.<br/><em>Opere com consciência.</em></h1><p className="welcome-text">Seu espaço para acompanhar o ouro e aprender a usar o MetaTrader 5.</p></div><div className="date-pill"><CalendarDays size={15}/>{new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</div></section>
          <section className="quote-grid">
            <div className="quote-card"><div className="quote-top"><div><span className="label">OURO À VISTA · XAU/USD</span><div className="instrument">Gold <span className="symbol-pill">XAU / USD</span></div></div><div className="quote-icon"><TrendingUp size={19}/></div></div><div className="quote-main"><strong>{quote?money(quote.price):'Carregando…'}</strong>{quote?.chp!==undefined&&Number.isFinite(quote.chp)&&<span className={`change ${quote.chp>=0?'up':'down'}`}>{quote.chp>=0?<ArrowUpRight size={15}/>:<ArrowDownRight size={15}/>} {Math.abs(quote.chp).toFixed(2)}%</span>}</div><div className="quote-meta"><span><i className="live-dot"/> Cotação indicativa · USD por onça troy</span><span>{lastRefresh?`Atualizado ${lastRefresh.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}`:'Conectando à API…'}</span></div>{quoteError&&<div className="inline-error">Não foi possível atualizar. Verifique a conexão ou tente novamente.</div>}</div>
            <div className="market-card"><div className="card-top"><div><span className="label">CENÁRIO DA SEMANA</span><h3>Leitura de contexto</h3></div><span className="sparkle-badge"><Sparkles size={15}/></span></div><div className={`bias-box ${movers.tone}`}><span className="bias-indicator"><Activity size={17}/></span><div><b>{movers.label}</b><p>{movers.detail}</p></div></div><div className="market-foot"><span>Baseado em manchetes recentes</span><button onClick={()=>goTo('news')}>Ver notícias <ArrowRight size={14}/></button></div></div>
          </section>
          <section className="section-heading"><div><div className="eyebrow small">ACOMPANHAMENTO</div><h2>O que move o ouro</h2></div><button className="text-link" onClick={()=>goTo('news')}>Ver central de notícias <ArrowRight size={15}/></button></section>
          <section className="driver-grid"><Driver icon={<Zap size={17}/>} title="Federal Reserve" text="Expectativas de juros e comunicação do Fed influenciam o dólar e os juros reais." tag="JUROS"/><Driver icon={<Activity size={17}/>} title="Inflação e emprego" text="CPI, PCE e Payroll podem mudar as expectativas para a política monetária." tag="DADOS DOS EUA"/><Driver icon={<ShieldAlert size={17}/>} title="Risco global" text="Incerteza geopolítica pode aumentar a busca por proteção, mas não define a direção sozinha." tag="SENTIMENTO"/></section>
          <section className="lower-grid"><div className="panel chart-panel"><div className="panel-head"><div><span className="label">GRÁFICO INTERATIVO</span><h3>XAU/USD · visão de mercado</h3></div><span className="external-label">TradingView <ExternalLink size={12}/></span></div><div className="chart-frame"><iframe title="Gráfico XAUUSD do TradingView" src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_xau&symbol=OANDA%3AXAUUSD&interval=60&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=%230c1728&studies=%5B%5D&theme=dark&style=1&timezone=America%2FSao_Paulo&withdateranges=1&hideideas=1&hidevolume=1&allow_symbol_change=0&locale=br" loading="lazy"/></div><div className="chart-note"><span>Dados do gráfico fornecidos pelo TradingView e pelo feed exibido na plataforma.</span><span>Confirme preço e especificações com sua corretora.</span></div></div><div className="panel news-panel"><div className="panel-head"><div><span className="label">ÚLTIMAS MANCHETES</span><h3>Notícias para acompanhar</h3></div><button className="icon-button" onClick={()=>void loadNews()} title="Atualizar notícias"><RefreshCw size={15}/></button></div>{newsLoading&&news.length===0?<div className="loading-lines"><i/><i/><i/></div>:news.length?news.slice(0,4).map((item,i)=><NewsRow item={item} key={item.link+i}/>):<div className="empty-news"><Newspaper size={20}/><p>{newsError?'Feed temporariamente indisponível. Confira estas fontes oficiais:':'Nenhuma manchete disponível agora.'}</p><a href="https://www.federalreserve.gov/newsevents.htm" target="_blank" rel="noreferrer">Federal Reserve <ExternalLink size={12}/></a><a href="https://www.bls.gov/news.release/" target="_blank" rel="noreferrer">Bureau of Labor Statistics <ExternalLink size={12}/></a></div>}<button className="panel-footer-link" onClick={()=>goTo('news')}>Abrir todas as notícias <ArrowRight size={14}/></button></div></section>
          <section className="disclaimer"><ShieldAlert size={16}/><p><b>Conteúdo educacional, não recomendação financeira.</b> A cotação é indicativa e pode diferir da sua corretora. O cenário semanal resume manchetes e relações macroeconômicas possíveis; não prevê o preço nem constitui sinal de compra ou venda.</p></section>
        </>}
        {tab==='news'&&<>
          <section className="page-heading"><div className="eyebrow"><span className="eyebrow-line"/> CENTRAL DE INFORMAÇÃO</div><h1>Notícias e <em>agenda macro.</em></h1><p>Acompanhe manchetes sobre ouro, dólar, inflação e Federal Reserve. Interprete o dado junto com as expectativas e a reação do mercado.</p></section>
          <div className="news-page-grid"><div className="panel news-list-panel"><div className="panel-head"><div><span className="label">FEED DE NOTÍCIAS · GOOGLE NEWS RSS</span><h3>Manchetes recentes</h3></div><button className="refresh-text" onClick={()=>void loadNews()}><RefreshCw size={14}/> Atualizar</button></div>{newsLoading?<div className="loading-lines"><i/><i/><i/><i/></div>:news.length?news.map((item,i)=><NewsRow item={item} big key={item.link+i}/>):<div className="feed-fallback"><Newspaper/><b>O feed não respondeu agora.</b><span>Estas fontes oficiais ajudam a consultar divulgações e decisões:</span><a href="https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" target="_blank" rel="noreferrer">Calendário do Federal Reserve <ExternalLink size={13}/></a><a href="https://www.bls.gov/schedule/2026/home.htm" target="_blank" rel="noreferrer">Calendário de dados do BLS <ExternalLink size={13}/></a><a href="https://www.bea.gov/news/schedule" target="_blank" rel="noreferrer">Agenda econômica BEA <ExternalLink size={13}/></a></div>}</div>
            <div className="right-stack"><div className="panel outlook-panel"><span className="label">RESUMO QUALITATIVO</span><h3>Contexto a observar</h3><div className={`bias-box ${movers.tone}`}><span className="bias-indicator"><Activity size={17}/></span><div><b>{movers.label}</b><p>{movers.detail}</p></div></div><div className="outlook-disclaimer">Este resumo classifica termos das manchetes. Não é modelo preditivo, análise fundamental completa ou sinal de negociação.</div></div><div className="panel checklist"><span className="label">ANTES DE INTERPRETAR</span><h3>3 perguntas úteis</h3><p><span>01</span> O dado veio acima ou abaixo do consenso?</p><p><span>02</span> O preço já havia antecipado essa expectativa?</p><p><span>03</span> Como o dólar e os rendimentos reagiram?</p></div><div className="source-note"><Clock3 size={14}/> {lastRefresh?`Cotação consultada às ${lastRefresh.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}`:'Feed de notícias renovado a cada 15 min quando disponível.'}</div></div></div>
          <section className="disclaimer"><ShieldAlert size={16}/><p><b>Sobre o “cenário da semana”.</b> O site não gera uma previsão numérica de preço. Eventos econômicos podem produzir reações diferentes do esperado, e a relação entre dólar, juros e ouro não é garantida.</p></section>
        </>}
        {tab==='academy'&&<>
          <section className="page-heading academy-heading"><div className="eyebrow"><span className="eyebrow-line"/> TRILHA DO INICIANTE</div><h1>Aprenda o mercado.<br/><em>Domine suas ferramentas.</em></h1><p>Conceitos de Forex, ouro e MetaTrader 5 em linguagem direta. Avance no seu ritmo e pratique em conta demo.</p><div className="progress-strip"><span className="progress-icon"><GraduationCap size={18}/></span><div><b>Trilha completa para começar</b><small>11 aulas · Fundamentos, MT5, leitura e gestão de risco</small></div><span className="lesson-total">11 AULAS</span></div></section>
          <div className="academy-layout"><div className="lessons-column"><div className="section-heading lesson-heading"><div><div className="eyebrow small">CONTEÚDO PROGRAMÁTICO</div><h2>Biblioteca do trader</h2></div></div>{lessons.map((lesson,i)=><article className={`lesson-card ${openLesson===i?'expanded':''}`} key={lesson.title}><button className="lesson-trigger" onClick={()=>setOpenLesson(openLesson===i?-1:i)}><span className={`lesson-index ${openLesson===i?'selected':''}`}>{openLesson===i?<Check size={15}/>:String(i+1).padStart(2,'0')}</span><span className="lesson-title-wrap"><span className="lesson-tag">{lesson.tag}</span><b>{lesson.title}</b></span><ChevronDown className="lesson-chevron" size={18}/></button>{openLesson===i&&<div className="lesson-content"><p>{lesson.content}</p><div className="lesson-tip"><Sparkles size={15}/><span>Prática: procure esse conceito na conta demo e anote o que encontrar na especificação do XAUUSD da sua corretora.</span></div></div>}</article>)}</div>
            <aside className="panel calculator"><div className="calc-title"><div className="calc-icon"><Activity size={17}/></div><div><span className="label">FERRAMENTA EDUCATIVA</span><h3>Calculadora de posição</h3></div></div><p className="calc-intro">Estimativa simplificada de volume baseada em risco e distância do stop.</p><label>Saldo da conta (USD)<input type="number" min="0" value={riskBalance} onChange={e=>setRiskBalance(e.target.value)}/></label><label>Risco planejado (%)<input type="number" min="0" max="100" step="0.1" value={riskPercent} onChange={e=>setRiskPercent(e.target.value)}/></label><label>Distância do stop (USD por onça)<input type="number" min="0" step="0.01" value={stopDistance} onChange={e=>setStopDistance(e.target.value)}/></label><label>Contrato por lote (onças)<input type="number" min="0" value={contract} onChange={e=>setContract(e.target.value)}/></label><div className="calc-result"><span>Perda planejada no stop</span><b>{money(risk.loss)}</b><div><span>Volume estimado</span><strong>{Number.isFinite(risk.lots)?risk.lots.toFixed(3):'0.000'} <small>lotes</small></strong></div></div><div className="calc-warning"><ShieldAlert size={15}/><span>Estimativa ilustrativa. O contrato, a moeda da conta, o tick e os custos variam por corretora. Confirme tudo no MT5; a calculadora não envia ordens.</span></div></aside></div>
          <section className="disclaimer"><ShieldAlert size={16}/><p><b>Aprendizado responsável.</b> Negociação alavancada envolve risco elevado de perda. Comece por conta demo, estude as condições da corretora e nunca use dinheiro que não pode perder.</p></section>
        </>}
        <footer className="footer"><span>© {new Date().getFullYear()} Yasmim Markets</span><span>Aprendizado claro. Decisões conscientes.</span><a href="https://github.com/bininpython/yasmim" target="_blank" rel="noreferrer">Projeto no GitHub <ExternalLink size={12}/></a></footer>
      </div>
    </main>
  </div>
}

function Driver({icon,title,text,tag}:{icon:React.ReactNode;title:string;text:string;tag:string}){return <article className="driver-card"><div className="driver-head"><span className="driver-icon">{icon}</span><span className="driver-tag">{tag}</span></div><h3>{title}</h3><p>{text}</p><div className="driver-line"/></article>}
function NewsRow({item,big=false}:{item:NewsItem;big?:boolean}){return <article className={`news-row ${big?'big':''}`}><div className="news-marker"><Newspaper size={15}/></div><div className="news-copy"><a href={item.link} target="_blank" rel="noreferrer" className="news-title">{item.title}<ExternalLink size={12}/></a>{item.description&&big&&<p>{item.description}</p>}<div className="news-meta"><span>{item.source||'Google News'}</span><i/> <time>{safeDate(item.pubDate)}</time></div></div></article>}
