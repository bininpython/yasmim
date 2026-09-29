export function formatUsd(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value)
}

export function formatDate(value?: string): string {
  if (!value) return 'Horário indisponível'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Horário indisponível' : date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

export function formatToday(): string {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).format(new Date())
}
