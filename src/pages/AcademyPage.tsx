import * as Accordion from '@radix-ui/react-accordion'
import { Check, ChevronDown, GraduationCap, Sparkles } from 'lucide-react'
import { lessons } from '../data/lessons'
import { PageIntro } from '../components/layout/AppLayout'
import { RiskCalculator } from '../components/market/RiskCalculator'

export function AcademyPage() {
  return <>
    <PageIntro eyebrow="TRILHA DO INICIANTE" title="Aprenda o mercado." accent="Entenda o MT5." description="Aulas diretas sobre Forex, XAU/USD e MetaTrader 5. Avance no seu ritmo e pratique primeiro em uma conta demo."/>
    <div className="academy-progress"><span className="minimal-icon"><GraduationCap size={18}/></span><div><b>Trilha para começar</b><small>11 aulas · Fundamentos, plataforma, análise e risco</small></div><span className="progress-count">11 CONCEITOS</span></div>
    <div className="academy-layout"><section className="academy-lessons"><div className="section-title-row academy-title"><div><span className="eyebrow-label">CONTEÚDO PROGRAMÁTICO</span><h2>Biblioteca do trader</h2></div></div><Accordion.Root type="single" collapsible defaultValue="lesson-0" className="lesson-list">
      {lessons.map((lesson, index) => <Accordion.Item key={lesson.title} value={`lesson-${index}`} className="lesson-item"><Accordion.Header><Accordion.Trigger className="lesson-trigger"><span className="lesson-number">{String(index + 1).padStart(2, '0')}</span><span className="lesson-trigger-copy"><small>{lesson.category}</small><b>{lesson.title}</b></span><ChevronDown className="lesson-chevron" size={17}/></Accordion.Trigger></Accordion.Header><Accordion.Content className="lesson-content"><p>{lesson.content}</p><div className="lesson-practice"><Sparkles size={14}/><span>Prática: procure este conceito na conta demo e confira as especificações do XAU/USD da sua corretora.</span></div></Accordion.Content></Accordion.Item>)}
    </Accordion.Root></section><RiskCalculator/></div>
    <div className="disclaimer-banner"><Check size={15}/><p><b>Aprendizado responsável.</b> Negociação alavancada envolve risco de perda. Treine em conta demo, confira as condições da corretora e não opere com dinheiro necessário para despesas.</p></div>
  </>
}
