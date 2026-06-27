import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-IN', opts ?? { day: 'numeric', month: 'short', year: 'numeric' })
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function addDaysISO(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
