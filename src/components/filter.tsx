'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAtom } from 'jotai';
import {
  hyperdriveFilterAtom,
  crewFilterAtom,
  hyperdriveOptions,
  crewOptions,
} from '@/store/starship';

export function HyperdriveFilter() {
  const [hyperdriveFilter, setHyperdriveFilter] = useAtom(hyperdriveFilterAtom);
  return (
    <Select value={hyperdriveFilter} onValueChange={setHyperdriveFilter}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Hyperdrive Rating" />
      </SelectTrigger>
      <SelectContent>
        {hyperdriveOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
export function CrewFilter() {
  const [crewFilter, setCrewFilter] = useAtom(crewFilterAtom);

  return (
    <Select value={crewFilter} onValueChange={setCrewFilter}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Crew Size" />
      </SelectTrigger>
      <SelectContent>
        {crewOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}