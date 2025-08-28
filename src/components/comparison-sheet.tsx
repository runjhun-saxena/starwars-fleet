'use client'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Trash2 } from 'lucide-react'
import { useAtom } from 'jotai'
import { selectedStarshipsAtom, selectedUrlsAtom } from '@/store/starship'
import type { Starship } from '@/lib/api'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useCallback } from 'react'

interface ComparisonSheetProps { 
  open: boolean; 
  onOpenChange: (open: boolean) => void 
}

export function ComparisonSheet({ open, onOpenChange }: ComparisonSheetProps) {
  const [selectedStarships, setSelectedStarships] = useAtom(selectedStarshipsAtom)
  const [selectedUrls, setSelectedUrls] = useAtom(selectedUrlsAtom)

  const formatValue = (value: string, type: 'crew' | 'hyperdrive' = 'crew') => {
    if (type === 'crew') {
      const num = parseInt((value ?? '').replace(/,/g, ''), 10)
      return isNaN(num) ? value : num.toLocaleString()
    }
    return value
  }

  const getComparisonData = (s: Starship) => [
    { label: 'Model', value: s.model },
    { label: 'Manufacturer', value: s.manufacturer },
    { label: 'Crew Size', value: formatValue(s.crew, 'crew') },
    { label: 'Hyperdrive Rating', value: s.hyperdrive_rating },
    { label: 'Starship Class', value: s.starship_class },
  ]

  // Helpful derived map for quick lookups
  const urlSet = useMemo(() => new Set(selectedStarships.map(s => s.url)), [selectedStarships])

  const removeStarship = useCallback((s: Starship) => {
    const url = s.url
    if (!url) return
    
    // Use setTimeout to prevent immediate closure
    setTimeout(() => {
      // Update BOTH atoms so state stays consistent across the app
      setSelectedStarships(prev => prev.filter(x => x.url !== url))
      setSelectedUrls(prev => prev.filter(x => x !== url))
    }, 0)
  }, [setSelectedStarships, setSelectedUrls])

  const clearAll = useCallback(() => {
    setTimeout(() => {
      setSelectedStarships([])
      setSelectedUrls([])
    }, 0)
  }, [setSelectedStarships, setSelectedUrls])

  // Prevent the sheet from closing when there are still starships
  const handleOpenChange = useCallback((newOpen: boolean) => {
    // Only allow closing if we're actually trying to close, not due to state updates
    if (!newOpen && selectedStarships.length > 0) {
      // Double-check this isn't just a state update causing unwanted closure
      setTimeout(() => {
        if (selectedStarships.length === 0) {
          onOpenChange(false)
        }
      }, 50)
      return
    }
    onOpenChange(newOpen)
  }, [onOpenChange, selectedStarships.length])

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-5xl h-[88vh] sm:h-auto overflow-y-auto">
        <SheetHeader className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <SheetTitle className="truncate">Compare Starships</SheetTitle>
              <SheetDescription className="truncate">
                Compare up to 3 selected starships side by side
              </SheetDescription>
            </div>
            <div className="flex items-center gap-2">
              {selectedStarships.length > 0 && (
                <Button variant="secondary" size="sm" onClick={clearAll} aria-label="Clear all">
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Clear all
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                aria-label="Close comparison sheet"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        {selectedStarships.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <p className="text-muted-foreground">No starships selected for comparison</p>
            <div className="text-xs text-muted-foreground">
              Tip: Use the "Compare" button on a card to add it here.
            </div>
          </div>
        ) : (
          <div className="mt-4 sm:mt-6">
            {/* Responsive, equal-height cards with smooth layout transitions */}
            <AnimatePresence initial={false}>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {selectedStarships.map((s, i) => (
                  <motion.div
                    key={s.url || `${s.name}-${i}`}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Card className="h-full">
                      <CardHeader className="pb-1">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle
                            className="text-base sm:text-lg leading-tight truncate"
                            title={s.name}
                          >
                            {s.name}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStarship(s)}
                            className="h-6 w-6 p-0 shrink-0"
                            aria-label={`Remove ${s.name}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {getComparisonData(s).map((item) => (
                          <div key={item.label} className="space-y-1">
                            <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                              {item.label}
                            </p>
                            <div>
                              {item.label === 'Hyperdrive Rating' ? (
                                <Badge variant="outline">{item.value}</Badge>
                              ) : (
                                <p className="text-sm break-words">{item.value}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>

            {/* Selection counter / subtle helper */}
            <div className="mt-4 text-xs text-muted-foreground">
              {selectedStarships.length}/3 selected
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}