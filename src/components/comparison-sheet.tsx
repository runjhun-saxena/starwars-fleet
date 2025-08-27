'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useAtom } from 'jotai';
import { selectedStarshipsAtom} from '@/store/starship';
import type { Starship } from '@/lib/api';
import { motion } from 'framer-motion';

interface ComparisonSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComparisonSheet({ open, onOpenChange }: ComparisonSheetProps) {
  const [selectedStarships, setSelectedStarships] = useAtom(selectedStarshipsAtom);

  const removeStarship = (starshipToRemove: Starship) => {
    setSelectedStarships(prev => 
      prev.filter(starship => starship.url !== starshipToRemove.url)
    );
  };

  const formatValue = (value: string, type: 'crew' | 'hyperdrive' = 'crew') => {
    if (type === 'crew') {
      const num = parseInt(value.replace(/,/g, ''));
      return isNaN(num) ? value : num.toLocaleString();
    }
    return value;
  };

  const getComparisonData = (starship: Starship) => [
    { label: 'Model', value: starship.model },
    { label: 'Manufacturer', value: starship.manufacturer },
    { label: 'Crew Size', value: formatValue(starship.crew, 'crew') },
    { label: 'Hyperdrive Rating', value: starship.hyperdrive_rating },
    { label: 'Starship Class', value: starship.starship_class },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-4xl">
        <SheetHeader>
          <SheetTitle>Compare Starships</SheetTitle>
          <SheetDescription>
            Compare up to 3 selected starships side by side
          </SheetDescription>
        </SheetHeader>
        
        {selectedStarships.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No starships selected for comparison</p>
          </div>
        ) : (
          <div className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {selectedStarships.map((starship, index) => (
                <motion.div
                  key={starship.url}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{starship.name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStarship(starship)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {getComparisonData(starship).map((item) => (
                        <div key={item.label} className="space-y-1">
                          <p className="text-sm font-medium text-gray-600">
                            {item.label}
                          </p>
                          <div>
                            {item.label === 'Hyperdrive Rating' ? (
                              <Badge variant="outline">{item.value}</Badge>
                            ) : (
                              <p className="text-sm">{item.value}</p>
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
  );
}