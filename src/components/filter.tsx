'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAtom } from 'jotai'
import { hyperdriveFilterAtom, crewFilterAtom, hyperdriveOptions, crewOptions } from '@/store/starship'

export function HyperdriveFilter() {
  const [hyperdriveFilter, setHyperdriveFilter] = useAtom(hyperdriveFilterAtom)
  return (
    <Select value={hyperdriveFilter} onValueChange={setHyperdriveFilter}>
      <SelectTrigger className="w-full sm:w-44">
        <SelectValue placeholder="Hyperdrive Rating" />
      </SelectTrigger>
      <SelectContent align="start" className="max-h-72">
        {hyperdriveOptions.map(o => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function CrewFilter() {
  const [crewFilter, setCrewFilter] = useAtom(crewFilterAtom)
  return (
    <Select value={crewFilter} onValueChange={setCrewFilter}>
      <SelectTrigger className="w-full sm:w-44">
        <SelectValue placeholder="Crew Size" />
      </SelectTrigger>
      <SelectContent align="start" className="max-h-72">
        {crewOptions.map(o => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}