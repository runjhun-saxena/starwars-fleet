'use client'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useAtom } from 'jotai'
import { selectedStarshipsAtom } from '@/store/starship'
import type { Starship } from '@/lib/api'
import { motion } from 'framer-motion'

interface ComparisonSheetProps { open: boolean; onOpenChange: (open: boolean) => void }

export function ComparisonSheet({ open, onOpenChange }: ComparisonSheetProps) {
  const [selectedStarships, setSelectedStarships] = useAtom(selectedStarshipsAtom)
  const removeStarship = (s: Starship) => setSelectedStarships(prev => prev.filter(x => x.url !== s.url))
  const formatValue = (value: string, type: 'crew' | 'hyperdrive' = 'crew') => {
    if (type === 'crew') {
      const num = parseInt(value.replace(/,/g, ''))
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-4xl h-[85vh] sm:h-auto overflow-y-auto">
        <SheetHeader className="sticky top-0 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 pb-3 flex flex-row items-center justify-between">
          <div>
            <SheetTitle>Compare Starships</SheetTitle>
            <SheetDescription>Compare up to 3 selected starships side by side</SheetDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            aria-label="Close comparison sheet"
          >
            <X className="h-5 w-5" />
          </Button>
        </SheetHeader>

        {selectedStarships.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No starships selected for comparison</p>
          </div>
        ) : (
          <div className="mt-4 sm:mt-6">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {selectedStarships.map((s, i) => (
                <motion.div key={s.url} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card>
                    <CardHeader className="pb-1">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base sm:text-lg leading-tight truncate" title={s.name}>{s.name}</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => removeStarship(s)} className="h-6 w-6 p-0" aria-label={`Remove ${s.name}`}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {getComparisonData(s).map(item => (
                        <div key={item.label} className="space-y-1">
                          <p className="text-xs sm:text-sm font-medium text-muted-foreground">{item.label}</p>
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
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}