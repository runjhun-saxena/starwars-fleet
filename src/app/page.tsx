'use client'
import { useState } from 'react'
import { useAtom } from 'jotai'
import {
  searchAtom,
  hyperdriveFilterAtom,
  crewFilterAtom,
  currentPageAtom,
} from '@/store/starship'
import { useStarships } from '@/hooks/use-starship'
import { SearchInput } from '@/components/search-input'
import { HyperdriveFilter, CrewFilter } from '@/components/filter'
import { StarshipsTable } from '@/components/starship-table'
import { ComparisonSheet } from '@/components/comparison-sheet'
import { SelectedStarshipsBar } from '@/components/selected-starship'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Rocket } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function DashboardPage() {
  const [search, setSearch] = useAtom(searchAtom)
  const [hyperdriveFilter, setHyperdriveFilter] = useAtom(hyperdriveFilterAtom)
  const [crewFilter, setCrewFilter] = useAtom(crewFilterAtom)
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom)
  const [showComparison, setShowComparison] = useState(false)

  const { data, isLoading, error } = useStarships({
    search,
    page: currentPage,
    hyperdriveFilter,
    crewFilter,
  })

  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1)
  const handleNextPage = () => data?.next && setCurrentPage(currentPage + 1)

  const resetFilters = () => {
    setSearch('')
    setHyperdriveFilter('all')
    setCrewFilter('all')
    setCurrentPage(1)
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-card text-card-foreground border border-border">
          <CardContent className="pt-6">
            <div className="text-center">
              <Rocket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
              <p className="text-muted-foreground mb-4">
                Unable to connect to the Star Wars API. This might be due to CORS or network issues.
              </p>
              <div className="text-xs sm:text-sm text-muted-foreground mb-4 break-all">
                Error: {error?.message || 'Unknown error'}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={() => window.location.reload()}>Retry</Button>
                <Button variant="outline" onClick={() => window.open('/api/test-swapi', '_blank')}>
                  Test API
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8 max-w-7xl">
        <div className="mb-6 md:mb-8 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-start">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-1">
              Star Wars Fleet Dashboard
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Search and compare starships from the Star Wars universe
            </p>
          </div>
          <div className="justify-self-center sm:justify-self-end">
            <ThemeToggle />
          </div>
        </div>

        <Card className="mb-4 sm:mb-6">
          <CardHeader className="pb-0">
            <CardTitle className="text-base sm:text-lg">Search & Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto] gap-3 sm:gap-4 items-end">
              <div className="min-w-0">
                <SearchInput />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
                <HyperdriveFilter />
                <CrewFilter />
              </div>
              <Button variant="outline" onClick={resetFilters} className="w-full sm:w-auto">
                Reset
              </Button>
              <Button
                onClick={() => setShowComparison(true)}
                variant="default"
                className="w-full sm:w-auto lg:justify-self-end"
              >
                Open Compare
              </Button>
            </div>
          </CardContent>
        </Card>
        {data && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              Showing {data.results.length} starships{search && ` matching "${search}"`}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePrevPage} disabled={currentPage === 1} aria-label="Previous page">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs sm:text-sm text-muted-foreground px-1 sm:px-2">Page {currentPage}</span>
              <Button variant="outline" size="icon" onClick={handleNextPage} disabled={!data.next} aria-label="Next page">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

     
        <Card className="mb-24">
          <CardContent className="p-0">
            <StarshipsTable starships={data?.results || []} isLoading={isLoading} />
          </CardContent>
        </Card>

       
        <SelectedStarshipsBar onCompare={() => setShowComparison(true)} />
        <ComparisonSheet open={showComparison} onOpenChange={setShowComparison} />
      </div>
    </div>
  )
}
