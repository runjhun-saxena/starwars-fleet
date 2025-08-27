'use client';

import { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import {
  searchAtom,
  hyperdriveFilterAtom,
  crewFilterAtom,
  selectedStarshipsAtom,
  selectedUrlsAtom,
} from '@/store/starship';
import { useStarships } from '@/hooks/use-starship';
import { useRestoreFromUrl, useSyncUrl, setSheetInUrl } from '@/hooks/use-sync-url';
import { SearchInput } from '@/components/search-input';
import { HyperdriveFilter, CrewFilter } from '@/components/filter';
import { StarshipsTable } from '@/components/starship-table';
import { ComparisonSheet } from '@/components/comparison-sheet';
import { SelectedStarshipsBar } from '@/components/selected-starship';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function DashboardPage() {
  const [search, setSearch] = useAtom(searchAtom);
  const [hyperdriveFilter, setHyperdriveFilter] = useAtom(hyperdriveFilterAtom);
  const [crewFilter, setCrewFilter] = useAtom(crewFilterAtom);
  const [selectedStarships, setSelectedStarships] = useAtom(selectedStarshipsAtom);
  const [selectedUrls, setSelectedUrls] = useAtom(selectedUrlsAtom);

 
  useRestoreFromUrl();

  const [showComparison, setShowComparison] = useState(false);
  const pathname = usePathname();
  const router   = useRouter();
  const sp       = useSearchParams();

  useEffect(() => {
    setShowComparison(sp.get('sheet') === '1');
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useStarships({ search, hyperdriveFilter, crewFilter });

  // Flatten pages
  const starships = data?.pages.flatMap((p) => p.results) ?? [];
  useEffect(() => {
    if (!starships.length) return;

    const dict = new Map(starships.map((s) => [s.url, s]));
    const hydrated = selectedUrls
      .map((u) => dict.get(u))
      .filter(Boolean)
      .slice(0, 3) as typeof starships;
    const oldUrls = selectedStarships.map((s) => s.url).join('|');
    const newUrls = hydrated.map((s) => s.url).join('|');
    if (oldUrls !== newUrls) {
      setSelectedStarships(hydrated);
    }
  }, [starships, selectedUrls, selectedStarships, setSelectedStarships]);

  // Push atoms URL (search, filters, sort, selected)
  useSyncUrl();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const ob = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      },
      { threshold: 1 }
    );
    ob.observe(loadMoreRef.current);
    return () => ob.disconnect();
  }, [fetchNextPage, hasNextPage]);

  const openSheet = () => {
    setShowComparison(true);
    setSheetInUrl(true, sp, pathname, router);
  };
  const closeSheet = () => {
    setShowComparison(false);
    setSheetInUrl(false, sp, pathname, router);
  };

  const resetFilters = () => {
    setSearch('');
    setHyperdriveFilter('all');
    setCrewFilter('all');
  };

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Failed to load starships. Please try again.
            </p>
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
              <Button onClick={openSheet} variant="default" className="w-full sm:w-auto lg:justify-self-end">
                Open Compare
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-24">
          <CardContent className="p-0">
            <StarshipsTable starships={starships} isLoading={isPending} />
          </CardContent>
        </Card>

        {/* Infinite sentinel */}
        <div ref={loadMoreRef} className="h-12" />
        {isFetchingNextPage && (
          <p className="text-center py-4 text-muted-foreground">Loading more...</p>
        )}
        <SelectedStarshipsBar onCompare={openSheet} />
        <ComparisonSheet open={showComparison} onOpenChange={(o) => (o ? openSheet() : closeSheet())} />
      </div>
    </div>
  );
}
