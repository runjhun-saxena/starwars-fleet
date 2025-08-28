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
  const [, setSelectedUrls] = useAtom(selectedUrlsAtom)

  const formatValue = (value: string, type: 'crew' | 'hyperdrive' = 'crew') => {
    if (type === 'crew') {
      const num = parseInt((value ?? '').replace(/,/g, ''), 10)
      return isNaN(num) ? value : num.toLocaleString()
    }
    return value
  }

  const allComparisonData = useMemo(() => {
    return selectedStarships.map(s => ({
      starship: s,
      data: [
        { label: 'Model', value: s.model },
        { label: 'Manufacturer', value: s.manufacturer },
        { label: 'Crew Size', value: formatValue(s.crew, 'crew') },
        { label: 'Hyperdrive Rating', value: s.hyperdrive_rating },
        { label: 'Starship Class', value: s.starship_class },
      ]
    }))
  }, [selectedStarships])

  const removeStarship = useCallback((s: Starship) => {
    const url = s.url
    if (!url) return
 
    setSelectedStarships(prev => prev.filter(x => x.url !== url))
    setSelectedUrls(prev => prev.filter(x => x !== url))
  }, [setSelectedStarships, setSelectedUrls])

  const clearAll = useCallback(() => {
    setSelectedStarships([])
    setSelectedUrls([])
  }, [setSelectedStarships, setSelectedUrls])

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!newOpen && selectedStarships.length > 0) {
      return 
    }
    onOpenChange(newOpen)
  }, [onOpenChange, selectedStarships.length])

  return (
    <Sheet open={open} onOpenChange={handleOpenChange} >
      <SheetContent className="w-full sm:max-w-5xl h-[88vh] sm:h-auto overflow-y-auto p-4" >
        <SheetHeader className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <SheetTitle className="truncate">Starship Comparison</SheetTitle>
              <SheetDescription className="truncate">
                {selectedStarships.length > 0 
                  ? `Comparing ${selectedStarships.length} starship${selectedStarships.length !== 1 ? 's' : ''}` 
                  : 'Select starships to compare features'}
              </SheetDescription>
            </div>
            <div className="flex items-center gap-2">
              {selectedStarships.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAll} 
                  aria-label="Clear all"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Clear
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                aria-label="Close comparison sheet"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        {selectedStarships.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
            <p>No starships selected</p>
            <div className="text-sm">
              Select starships to compare their specifications
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <AnimatePresence initial={false}>
              <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {allComparisonData.map(({ starship: s, data }, i) => (
                  <motion.div
                    key={s.url || `${s.name}-${i}`}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Card className="h-full border-border/40 bg-card/50">
                      <CardHeader className="pb-2">
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
                            className="h-6 w-6 p-0 shrink-0 text-muted-foreground hover:text-foreground"
                            aria-label={`Remove ${s.name}`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3.5">
                        {data.map((item) => (
                          <div key={item.label} className="space-y-1.5">
                            <p className="text-xs font-medium text-muted-foreground tracking-wide">
                              {item.label}
                            </p>
                            <div>
                              {item.label === 'Hyperdrive Rating' ? (
                                <Badge 
                                  variant="secondary" 
                                  className="font-normal bg-secondary/30"
                                >
                                  {item.value}
                                </Badge>
                              ) : (
                                <p className="text-sm break-words text-foreground/90">
                                  {item.value}
                                </p>
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
            <div className="mt-5 text-xs text-muted-foreground text-center">
              {selectedStarships.length} of 3 starships selected
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}