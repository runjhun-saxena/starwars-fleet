'use client'

import { useMemo } from 'react'
import {  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useAtom } from 'jotai'
import {
  selectedStarshipsAtom,
  sortAtom,
  selectedUrlsAtom,
} from '@/store/starship'
import type { Starship } from '@/lib/api'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

interface StarshipsTableProps {
  starships: Starship[]
  isLoading?: boolean
}

export function StarshipsTable({ starships, isLoading }: StarshipsTableProps) {
  const [selectedStarships, setSelectedStarships] = useAtom(selectedStarshipsAtom)
  const [selectedUrls, setSelectedUrls] = useAtom(selectedUrlsAtom)
  const [sort, setSort] = useAtom(sortAtom)

  const isSelected = (s: Starship) =>
    selectedStarships.some((x) => x.url === s.url)

  const addSelection = (s: Starship) => {
    setSelectedStarships(prev => {
      if (prev.some(x => x.url === s.url)) return prev
      if (prev.length >= 3) return prev
      return [...prev, s]
    })
    setSelectedUrls(prev => {
      if (prev.includes(s.url)) return prev
      if (prev.length >= 3) return prev
      return [...prev, s.url]
    })
  }

  const removeSelection = (s: Starship) => {
    setSelectedStarships(prev => prev.filter(x => x.url !== s.url))
    setSelectedUrls(prev => prev.filter(u => u !== s.url))
  }

  const handleSelection = (s: Starship, checked: boolean) => {
    if (checked) addSelection(s)
    else removeSelection(s)
  }

  const formatNumber = (value: string) => {
    const num = parseInt(value.replace(/,/g, ''))
    return isNaN(num) ? value : num.toLocaleString()
  }

  const getHyperdriveBadge = (rating: string) => {
    const num = parseFloat(rating)
    if (isNaN(num)) return <Badge variant="secondary">{rating}</Badge>
    if (num < 1.0) return <Badge variant="default">{rating}</Badge>
    if (num <= 2.0) return <Badge variant="secondary">{rating}</Badge>
    return <Badge variant="outline">{rating}</Badge>
  }

  const sortedStarships = useMemo(() => {
    if (sort.col !== 'hyperdrive') return starships
    const copy = [...starships]
    copy.sort((a, b) => {
      const aNum = parseFloat(a.hyperdrive_rating)
      const bNum = parseFloat(b.hyperdrive_rating)
      const aIsNaN = Number.isNaN(aNum)
      const bIsNaN = Number.isNaN(bNum)
      if (aIsNaN && bIsNaN) return 0
      if (aIsNaN) return 1
      if (bIsNaN) return -1
      return sort.dir === 'asc' ? aNum - bNum : bNum - aNum
    })
    return copy
  }, [starships, sort])

  const toggleHyperdriveSort = () => {
    if (sort.col !== 'hyperdrive') setSort({ col: 'hyperdrive', dir: 'asc' })
    else if (sort.dir === 'asc') setSort({ col: 'hyperdrive', dir: 'desc' })
    else setSort({ col: undefined, dir: 'asc' })
  }

  const SortIcon = () =>
    sort.col !== 'hyperdrive'
      ? <ChevronsUpDown className="h-3.5 w-3.5 opacity-60" />
      : (sort.dir === 'asc'
          ? <ChevronUp className="h-3.5 w-3.5" />
          : <ChevronDown className="h-3.5 w-3.5" />)

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-muted rounded animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="px-3 sm:px-6 py-3">
      <motion.div layout className="md:hidden space-y-3">
        {sortedStarships.map((s) => (
          <motion.div
            key={s.url}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-lg p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium truncate" title={s.name}>{s.name}</p>
                <p className="text-xs text-muted-foreground truncate" title={s.model}>{s.model}</p>
              </div>
              <Checkbox
                checked={isSelected(s)}
                onCheckedChange={(checked) => handleSelection(s, Boolean(checked))}
                disabled={!isSelected(s) && selectedStarships.length >= 3}
                aria-label={`Select ${s.name}`}
              />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Manufacturer</p>
                <p className="truncate" title={s.manufacturer}>{s.manufacturer}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Crew</p>
                <p>{formatNumber(s.crew)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Hyperdrive</p>
                <div className="mt-1">{getHyperdriveBadge(s.hyperdrive_rating)}</div>
              </div>
            </div>
          </motion.div>
        ))}
        {sortedStarships.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No starships found matching your criteria
          </div>
        )}
      </motion.div>

      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Select</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead className="text-right">Crew</TableHead>
                <TableHead
                  className="text-center cursor-pointer select-none"
                  onClick={toggleHyperdriveSort}
                  aria-sort={
                    sort.col === 'hyperdrive'
                      ? (sort.dir === 'asc' ? 'ascending' : 'descending')
                      : 'none'
                  }
                  title="Sort by Hyperdrive rating"
                >
                  <div className="inline-flex items-center gap-1 justify-center">
                    <span>Hyperdrive</span>
                    <SortIcon />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedStarships.map((s) => (
                <motion.tr
                  key={s.url}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <TableCell>
                    <Checkbox
                      checked={isSelected(s)}
                      onCheckedChange={(checked) => handleSelection(s, Boolean(checked))}
                      disabled={!isSelected(s) && selectedStarships.length >= 3}
                      aria-label={`Select ${s.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap">{s.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{s.model}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[320px] truncate" title={s.manufacturer}>
                    {s.manufacturer}
                  </TableCell>
                  <TableCell className="text-right">{formatNumber(s.crew)}</TableCell>
                  <TableCell className="text-center">{getHyperdriveBadge(s.hyperdrive_rating)}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

        {sortedStarships.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No starships found matching your criteria
          </div>
        )}
      </div>
    </div>
  )
}
