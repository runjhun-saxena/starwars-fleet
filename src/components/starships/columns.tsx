'use client'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { flexRender, type ColumnDef, type Header } from '@tanstack/react-table'
import type { Starship } from '@/lib/swapi'
import {
  formatNumber,
  hyperdriveSort,
  getHyperdriveBadge,
  getHyperdriveBadgeVariant,
} from '@/lib/starship-table-utils'

type CreateColumnsArgs = {
  isSelected: (s: Starship) => boolean
  handleSelection: (s: Starship, checked: boolean) => void
  selectedCount: number
}

export function createStarshipColumns({
  isSelected,
  handleSelection,
  selectedCount,
}: CreateColumnsArgs): ColumnDef<Starship>[] {
  return [
    {
      id: 'select',
      header: () => 'Select',
      enableSorting: false,
      size: 48,
      cell: ({ row }) => {
        const s = row.original
        return (
          <Checkbox
            checked={isSelected(s)}
            onCheckedChange={(checked) => handleSelection(s, Boolean(checked))}
            disabled={!isSelected(s) && selectedCount >= 3}
            aria-label={`Select ${s.name}`}
          />
        )
      },
    },
    {
      id: 'name',
      header: () => 'Name',
      accessorFn: (r) => r.name,
      enableSorting: false,
      cell: ({ getValue }) => (
        <span className="font-medium whitespace-nowrap">{String(getValue())}</span>
      ),
    },
    {
      id: 'model',
      header: () => 'Model',
      accessorFn: (r) => r.model,
      enableSorting: false,
      cell: ({ getValue }) => <span className="whitespace-nowrap">{String(getValue())}</span>,
    },
    {
      id: 'manufacturer',
      header: () => 'Manufacturer',
      accessorFn: (r) => r.manufacturer,
      enableSorting: false,
      cell: ({ getValue }) => (
        <span
          className="text-sm text-muted-foreground max-w-[320px] truncate block"
          title={String(getValue())}
        >
          {String(getValue())}
        </span>
      ),
    },
    {
      id: 'crew',
      header: () => <div className="text-right">Crew</div>,
      accessorFn: (r) => r.crew,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-right">{formatNumber(String(getValue()))}</div>
      ),
    },
    {
      id: 'hyperdrive',
      accessorFn: (r) => r.hyperdrive_rating,
      sortingFn: hyperdriveSort,
      enableSorting: true,
      header: ({ column }) => {
        const sorted = column.getIsSorted()
        const Icon = !sorted ? (
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-60" />
        ) : sorted === 'asc' ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )
        return (
          <div
            className="inline-flex items-center gap-1 justify-center cursor-pointer select-none"
            onClick={column.getToggleSortingHandler()}
            role="button"
            title="Sort by Hyperdrive rating"
          >
            <span>Hyperdrive</span>
            {Icon}
          </div>
        )
      },
      cell: ({ getValue }) => {
        const rating = String(getValue())
        return (
          <div className="text-center">
            <Badge variant={getHyperdriveBadgeVariant(rating)}>
              {getHyperdriveBadge(rating)}
            </Badge>
          </div>
        )
      },
    },
  ]
}

export function renderHeaderCell(header: Header<Starship, unknown>) {
  const isHyper = header.column.id === 'hyperdrive'
  const sorted = header.column.getIsSorted()
  const ariaSort = !sorted ? 'none' : sorted === 'asc' ? 'ascending' : 'descending'
  return (
    <div
      className={
        header.column.id === 'crew'
          ? 'text-right'
          : header.column.id === 'hyperdrive'
          ? 'text-center'
          : header.column.id === 'select'
          ? 'w-12'
          : undefined
      }
      aria-sort={isHyper ? (ariaSort as 'none' | 'ascending' | 'descending') : undefined}
    >
      {header.isPlaceholder ? null : (
        <div className={isHyper ? 'flex justify-center' : undefined}>
          {flexRender(header.column.columnDef.header, header.getContext())}
        </div>
      )}
    </div>
  )
}