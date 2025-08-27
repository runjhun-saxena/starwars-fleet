'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useAtom } from 'jotai';
import { selectedStarshipsAtom } from '@/store/starship';
import type { Starship } from '@/lib/api';
import { motion } from 'framer-motion';

interface StarshipsTableProps {
  starships: Starship[];
  isLoading?: boolean;
}

export function StarshipsTable({ starships, isLoading }: StarshipsTableProps) {
  const [selectedStarships, setSelectedStarships] = useAtom(selectedStarshipsAtom);
  const isSelected = (starship: Starship) => {
    return selectedStarships.some(selected => selected.url === starship.url);
  };
  const handleSelection = (starship: Starship, checked: boolean) => {
    if (checked) {

      if (selectedStarships.length < 3) {
        setSelectedStarships(prev => [...prev, starship]);
      }
    } else {
      setSelectedStarships(prev => 
        prev.filter(selected => selected.url !== starship.url)
      );
    }
  };

  const formatNumber = (value: string) => {
    const num = parseInt(value.replace(/,/g, ''));
    return isNaN(num) ? value : num.toLocaleString();
  };

  const getHyperdriveBadge = (rating: string) => {
    const num = parseFloat(rating);
    if (isNaN(num)) return <Badge variant="secondary">{rating}</Badge>;
    
    if (num < 1.0) return <Badge variant="default">{rating}</Badge>;
    if (num <= 2.0) return <Badge variant="secondary">{rating}</Badge>;
    return <Badge variant="outline">{rating}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="border rounded-lg px-6">
      <Table>
        <TableHeader >
          <TableRow >
            <TableHead className="w-12">Select</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Manufacturer</TableHead>
            <TableHead className="text-right">Crew</TableHead>
            <TableHead className="text-center">Hyperdrive</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {starships.map((starship) => (
            <motion.tr
              key={starship.url}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              <TableCell>
                <Checkbox
                  checked={isSelected(starship)}
                  onCheckedChange={(checked) => 
                    handleSelection(starship, checked as boolean)
                  }
                  disabled={!isSelected(starship) && selectedStarships.length >= 3}
                />
              </TableCell>
              <TableCell className="font-medium">{starship.name}</TableCell>
              <TableCell>{starship.model}</TableCell>
              <TableCell className="text-sm text-gray-600">
                {starship.manufacturer}
              </TableCell>
              <TableCell className="text-right">
                {formatNumber(starship.crew)}
              </TableCell>
              <TableCell className="text-center">
                {getHyperdriveBadge(starship.hyperdrive_rating)}
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
      
      {starships.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No starships found matching your criteria
        </div>
      )}
    </div>
  );
}