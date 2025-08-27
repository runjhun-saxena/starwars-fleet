'use client'
import { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import {
  searchAtom,
  hyperdriveFilterAtom,
  crewFilterAtom,
} from '@/store/starship';
import { useStarships } from '@/hooks/use-starship';
import { SearchInput } from '@/components/search-input';
import { HyperdriveFilter, CrewFilter } from '@/components/filter';
import { StarshipsTable } from '@/components/starship-table';
import { ComparisonSheet } from '@/components/comparison-sheet';
import { SelectedStarshipsBar } from '@/components/selected-starship';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function DashboardPage() {
  const [search, setSearch] = useAtom(searchAtom);
  const [hyperdriveFilter, setHyperdriveFilter] = useAtom(hyperdriveFilterAtom);
  const [crewFilter, setCrewFilter] = useAtom(crewFilterAtom);
  const [showComparison, setShowComparison] = useState(false);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useStarships({ search, hyperdriveFilter, crewFilter });
  const starships = data?.pages.flatMap((p) => p.results) ?? [];
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  const resetFilters = () => {
    setSearch('');
    setHyperdriveFilter('all');
    setCrewFilter('all');
  };

  if (status === 'error') {
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
            </div>
          </CardContent>
        </Card>
      </div>
    );
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

        <Card className="mb-24">
          <CardContent className="p-0">
        <StarshipsTable starships={starships} isLoading={status === 'pending'} />

          </CardContent>
        </Card>

        {/* Infinite scroll sentinel */}
        <div ref={loadMoreRef} className="h-12" />
        {isFetchingNextPage && (
          <p className="text-center py-4 text-muted-foreground">Loading more...</p>
        )}
        <SelectedStarshipsBar onCompare={() => setShowComparison(true)} />
        <ComparisonSheet open={showComparison} onOpenChange={setShowComparison} />
      </div>
    </div>
  );
}
