import type { Starship } from '@/lib/swapi'
import type { SortingFn } from '@tanstack/react-table'

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success'   

export const formatNumber = (value: string) => {
  const num = parseInt(value.replace(/,/g, ''))
  return Number.isNaN(num) ? value : num.toLocaleString()
}

export const getHyperdriveBadge = (rating: string) => {
  const num = parseFloat(rating)
  if (Number.isNaN(num)) return rating
  if (num < 1.0) return rating
  if (num <= 2.0) return rating
  return rating
}

export const getHyperdriveBadgeVariant = (rating: string): BadgeVariant => {
  const num = parseFloat(rating)
  if (Number.isNaN(num)) return 'secondary' 
  if (num < 1.0) return 'default'        
  if (num <= 2.0) return 'default'        
  return 'default'                     
}

export const hyperdriveSort: SortingFn<Starship> = (rowA, rowB) => {
  const a = parseFloat(rowA.original.hyperdrive_rating)
  const b = parseFloat(rowB.original.hyperdrive_rating)
  const aNaN = Number.isNaN(a)
  const bNaN = Number.isNaN(b)
  if (aNaN && bNaN) return 0
  if (aNaN) return 1
  if (bNaN) return -1
  return a - b
}
