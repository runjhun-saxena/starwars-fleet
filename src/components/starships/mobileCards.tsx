'use client'
import { motion } from 'framer-motion'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  formatNumber,
  getHyperdriveBadge,
  getHyperdriveBadgeVariant,
} from '@/lib/starship-table-utils'
import type { Starship } from '@/lib/swapi'

type Props = {
  s: Starship
  isSelected: boolean
  onToggle: (checked: boolean) => void
  disableWhenMaxed: boolean
}

export function MobileCard({ s, isSelected, onToggle, disableWhenMaxed }: Props) {
  return (
    <motion.div
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
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(Boolean(checked))}
          disabled={!isSelected && disableWhenMaxed}
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
          <div className="mt-1">
            <Badge variant={getHyperdriveBadgeVariant(s.hyperdrive_rating)}>
              {getHyperdriveBadge(s.hyperdrive_rating)}
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
