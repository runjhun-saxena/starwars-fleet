'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useAtom } from 'jotai'
import { selectedStarshipsAtom } from '@/store/starship'
import type { Starship } from '@/lib/api'
import { motion } from 'framer-motion'

interface StarshipsTableProps { starships: Starship[];
     isLoading?: boolean }

export function StarshipsTable({ starships, isLoading }: StarshipsTableProps) {
  const [selectedStarships, setSelectedStarships] = useAtom(selectedStarshipsAtom)
  const isSelected = (s: Starship) => selectedStarships.some(x => x.url === s.url)

  const handleSelection = (s: Starship, checked: boolean) => {
    if (checked) {
      if (selectedStarships.length < 3) setSelectedStarships(prev => [...prev, s])
    } else {
      setSelectedStarships(prev => prev.filter(x => x.url !== s.url))
    }
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
      <div className="md:hidden space-y-3">
        {starships.map(s => (
          <motion.div key={s.url} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border rounded-lg p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium truncate" title={s.name}>{s.name}</p>
                <p className="text-xs text-muted-foreground truncate" title={s.model}>{s.model}</p>
              </div>
              <Checkbox
                checked={isSelected(s)}
                onCheckedChange={checked => handleSelection(s, Boolean(checked))}
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
        {starships.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No starships found matching your criteria</div>
        )}
      </div>

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
                <TableHead className="text-center">Hyperdrive</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {starships.map(s => (
                <motion.tr key={s.url} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="group">
                  <TableCell>
                    <Checkbox
                      checked={isSelected(s)}
                      onCheckedChange={checked => handleSelection(s, Boolean(checked))}
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
        {starships.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No starships found matching your criteria</div>
        )}
      </div>
    </div>
  )
}