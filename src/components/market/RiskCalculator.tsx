import { useMemo, useState } from 'react'
import { Calculator, ShieldAlert } from 'lucide-react'
import { formatUsd } from '../../lib/format'

export function RiskCalculator() {
  const [balance, setBalance] = useState('500')
  const [riskPercent, setRiskPercent] = useState('1')
  const [stopDistance, setStopDistance] = useState('5')
  const [contractSize, setContractSize] = useState('100')
  const result = useMemo(() => {
    const account = Number(balance)
    const percent = Number(riskPercent)
    const distance = Number(stopDistance)
    const contract = Number(contractSize)
    const maxLoss = account > 0 && percent > 0 ? account * percent / 100 : 0
    const volume = distance > 0 && contract > 0 ? maxLoss / (distance * contract) : 0
    return { maxLoss, volume }
  }, [balance, riskPercent, stopDistance, contractSize])

  return <aside className="surface calculator-card">
    <div className="calculator-title"><span className="minimal-icon"><Calculator size={17}/></span><div><span className="eyebrow-label">FERRAMENTA EDUCATIVA</span><h2>Calculadora de posição</h2></div></div>
    <p className="calculator-intro">Estimativa simples de volume com base no risco e na distância do stop.</p>
    <label className="field-label">Saldo da conta (USD)<input type="number" min="0" value={balance} onChange={(event) => setBalance(event.target.value)}/></label>
    <label className="field-label">Risco planejado (%)<input type="number" min="0" max="100" step="0.1" value={riskPercent} onChange={(event) => setRiskPercent(event.target.value)}/></label>
    <label className="field-label">Distância do stop (USD/onça)<input type="number" min="0" step="0.01" value={stopDistance} onChange={(event) => setStopDistance(event.target.value)}/></label>
    <label className="field-label">Contrato por lote (onças)<input type="number" min="0" value={contractSize} onChange={(event) => setContractSize(event.target.value)}/></label>
    <div className="calculator-result"><span>Perda estimada no stop</span><b>{formatUsd(result.maxLoss)}</b><div><span>Volume teórico</span><strong>{result.volume.toFixed(3)} <small>lotes</small></strong></div></div>
    <div className="calculator-disclaimer"><ShieldAlert size={14}/><span>Exemplo simplificado em USD. Contrato, valor do tick, moeda da conta, lote mínimo e custos variam por corretora. Esta ferramenta não envia ordens.</span></div>
  </aside>
}
