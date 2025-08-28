'use client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { X, Eye } from 'lucide-react'
import { useAtom } from 'jotai'
import { selectedStarshipsAtom, selectedUrlsAtom } from '@/store/starship'
import type { Starship } from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'

interface SelectedStarshipsBarProps {
  onCompare: () => void
}

export function SelectedStarshipsBar({ onCompare }: SelectedStarshipsBarProps) {
  const [selectedStarships, setSelectedStarships] = useAtom(selectedStarshipsAtom)
  const [, setSelectedUrls] = useAtom(selectedUrlsAtom)

  const removeStarship = (s: Starship) => {
    setSelectedStarships(prev => prev.filter(x => x.url !== s.url))
    setSelectedUrls(prev => prev.filter(u => u !== s.url))
  }

  const clearAll = () => {
    setSelectedStarships([])
    setSelectedUrls([])
  }

  if (selectedStarships.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="fixed left-3 right-3 bottom-[calc(env(safe-area-inset-bottom)+12px)] z-50"
      >
        <Card className="p-3 sm:p-4 shadow-lg bg-card text-card-foreground border border-border">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs sm:text-sm font-medium">Selected for comparison:</span>
                <Badge variant="secondary" className="text-xs">{selectedStarships.length}/3</Badge>
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x pr-1" role="list" aria-label="Selected starships">
                {selectedStarships.map(starship => (
                  <motion.div key={starship.url} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="snap-start">
                    <Badge variant="secondary" className="pr-1 max-w-[220px] sm:max-w-[260px] truncate">
                      {starship.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeStarship(starship)}
                        aria-label={`Remove ${starship.name}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:justify-end">
              <Button variant="outline" size="sm" onClick={clearAll} className="flex-1 sm:flex-none">
                Clear All
              </Button>
              <Button onClick={onCompare} className="gap-2 flex-1 sm:flex-none">
                <Eye className="h-4 w-4" />
                Compare
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
