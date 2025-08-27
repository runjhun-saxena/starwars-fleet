'use client'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useAtom } from 'jotai'
import { searchAtom } from '@/store/starship'
import { useDebouncedCallback } from 'use-debounce'
import { useEffect, useState } from 'react'

export function SearchInput() {
  const [search, setSearch] = useAtom(searchAtom)
  const [localValue, setLocalValue] = useState(search)
  const debouncedSetSearch = useDebouncedCallback((value: string) => setSearch(value), 300)

  useEffect(() => setLocalValue(search), [search])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalValue(value)
    debouncedSetSearch(value)
  }

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        inputMode="search"
        aria-label="Search starships"
        placeholder="Search starships..."
        value={localValue}
        onChange={handleChange}
        className="pl-10 h-10 sm:h-11"
      />
    </div>
  )
}