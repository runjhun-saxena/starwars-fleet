'use client'
import { useMemo, useCallback } from 'react'
import { useAtom } from 'jotai'
import {
  selectedStarshipsAtom,
  selectedUrlsAtom,
  sortAtom,
} from '@/store/starship'
import type { Starship } from '@/lib/swapi'
import { motion } from 'framer-motion'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table'
import { createStarshipColumns } from './columns'
import { DesktopTable } from './desktop-table'
import { MobileCard } from './mobileCards'
import { StarshipsLoadingSkeleton } from './loading-skeleton'

type Props = {
  starships: Starship[]
  isLoading?: boolean
}

export function StarshipsTable({ starships, isLoading }: Props) {
  const [selectedStarships, setSelectedStarships] = useAtom(selectedStarshipsAtom)
  const [, setSelectedUrls] = useAtom(selectedUrlsAtom)
  const [sort, setSort] = useAtom(sortAtom)

  const isSelected = useCallback((s: Starship) => 
    selectedStarships.some((x) => x.url === s.url), 
    [selectedStarships]
  )

  const addSelection = useCallback((s: Starship) => {
    if (!s.url) return
    setSelectedStarships((prev) => {
      if (prev.some((x) => x.url === s.url)) return prev
      if (prev.length >= 3) return prev
      return [...prev, s]
    })
    setSelectedUrls((prev) => {
      if (prev.includes(s.url!)) return prev
      if (prev.length >= 3) return prev
      return [...prev, s.url!]
    })
  }, [setSelectedStarships, setSelectedUrls])

  const removeSelection = useCallback((s: Starship) => {
    if (!s.url) return
    setSelectedStarships((prev) => prev.filter((x) => x.url !== s.url))
    setSelectedUrls((prev) => prev.filter((u) => u !== s.url))
  }, [setSelectedStarships, setSelectedUrls])

  const handleSelection = useCallback((s: Starship, checked: boolean) => {
    if (checked) addSelection(s)
    else removeSelection(s)
  }, [addSelection, removeSelection])

  // TanStack sorting state derived from jotai atom
  const sorting: SortingState = useMemo(() => {
    if (sort.col === 'hyperdrive') {
      return [{ id: 'hyperdrive', desc: sort.dir === 'desc' }]
    }
    return []
  }, [sort])

  const columns = useMemo(
    () =>
      createStarshipColumns({
        isSelected,
        handleSelection,
        selectedCount: selectedStarships.length,
      }),
    [selectedStarships.length, isSelected, handleSelection] 
  )

  const table = useReactTable({
    data: starships,
    columns,
    state: { sorting },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater
      const first = next[0]
      if (!first) {
        setSort({ col: undefined, dir: 'asc' })
      } else if (first.id === 'hyperdrive') {
        setSort({ col: 'hyperdrive', dir: first.desc ? 'desc' : 'asc' })
      } else {
        setSort({ col: undefined, dir: 'asc' })
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: true,
  })

  if (isLoading) return <StarshipsLoadingSkeleton />

  const rows = table.getRowModel().rows

  return (
    <div className="px-3 sm:px-6 py-3">
      {/* Mobile cards */}
      <motion.div layout className="md:hidden space-y-3">
        {rows.map((row) => {
          const s = row.original
          return (
            <MobileCard
              key={s.url}
              s={s}
              isSelected={isSelected(s)}
              onToggle={(checked) => handleSelection(s, checked)}
              disableWhenMaxed={selectedStarships.length >= 3}
            />
          )
        })}
        {rows.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No starships found matching your criteria
          </div>
        )}
      </motion.div>

      <DesktopTable table={table} />
    </div>
  )
}