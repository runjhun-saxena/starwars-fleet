import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { Starship } from '@/lib/api'

export const searchAtom = atom<string>('')
export const hyperdriveFilterAtom = atom<string>('all')
export const crewFilterAtom = atom<string>('all')

export const currentPageAtom = atom<number>(1)
export const selectedStarshipsAtom = atomWithStorage<Starship[]>('selected-starships', [])

// Comparison sheet atom In case  global later
export const showComparisonModalAtom = atom<boolean>(false)


export const selectedUrlsAtom = atom<string[]>([])

export type SortDir = 'asc' | 'desc'
export const sortAtom = atom<{ col?: 'hyperdrive'; dir?: SortDir }>({
  col: undefined,
  dir: 'asc',
})

export const hyperdriveOptions = [
  { value: 'all', label: 'Ratings' },
  { value: 'fast', label: '< 1.0' },
  { value: 'medium', label: '1.0 - 2.0' },
  { value: 'slow', label: '> 2.0' },
]
export const crewOptions = [
  { value: 'all', label: 'Crew Sizes' },
  { value: 'small', label: '1-5' },
  { value: 'medium', label: '6-50' },
  { value: 'large', label: '50+' },
]

export const getHyperdriveCategory = (rating: string): string => {
  const num = parseFloat(rating)
  if (isNaN(num)) return 'unknown'
  if (num < 1.0) return 'fast'
  if (num <= 2.0) return 'medium'
  return 'slow'
}
export const getCrewCategory = (crew: string): string => {
  const num = parseInt(crew.replace(/,/g, ''))
  if (isNaN(num)) return 'unknown'
  if (num <= 5) return 'small'
  if (num <= 50) return 'medium'
  return 'large'
}
