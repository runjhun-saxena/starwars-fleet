'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { X, Eye } from 'lucide-react';
import { useAtom } from 'jotai';
import { selectedStarshipsAtom } from '@/store/starship';
import type { Starship } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectedStarshipsBarProps {
  onCompare: () => void;
}
export function SelectedStarshipsBar({ onCompare }: SelectedStarshipsBarProps) {
  const [selectedStarships, setSelectedStarships] = useAtom(selectedStarshipsAtom);

  const removeStarship = (starshipToRemove: Starship) => {
    setSelectedStarships(prev => 
      prev.filter(starship => starship.url !== starshipToRemove.url)
    );
  };
  const clearAll = () => {
    setSelectedStarships([]);
  };
  if (selectedStarships.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 z-50"
      >
        <Card className="p-4 shadow-lg bg-white border">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">Selected for comparison:</span>
                <Badge variant="secondary">
                  {selectedStarships.length}/3
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {selectedStarships.map((starship) => (
                  <motion.div
                    key={starship.url}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge
                      variant="outline"
                      className="pr-1 max-w-[200px] truncate"
                    >
                      {starship.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeStarship(starship)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
              >
                Clear All
              </Button>
              <Button
                onClick={onCompare}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Compare
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}