'use client';
import { useEffect, useRef, useState, Suspense ,useMemo} from 'react';
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
import { ComparisonSheet } from '@/components/comparison-sheet';
import { SelectedStarshipsBar } from '@/components/selected-starship';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { StarshipsTable } from '@/components/starships/starships-table';

function DashboardContent() {
  const [search, setSearch] = useAtom(searchAtom);
  const [hyperdriveFilter, setHyperdriveFilter] = useAtom(hyperdriveFilterAtom);
  const [crewFilter, setCrewFilter] = useAtom(crewFilterAtom);
  const [selectedStarships, setSelectedStarships] = useAtom(selectedStarshipsAtom);
  const [selectedUrls] = useAtom(selectedUrlsAtom);

  useRestoreFromUrl();

  const [showComparison, setShowComparison] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    setShowComparison(sp.get('sheet') === '1');
  }, [sp]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useStarships({ search, hyperdriveFilter, crewFilter });

  // Flat pages
  const starships = useMemo(() => {
  return data?.pages.flatMap((p) => p.results) ?? [];
}, [data?.pages]);

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
    if (!loadMoreRef.current || !hasNextPage) return;
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
              The Force is not with us right now. Failed to load starships. Try again later, you must.
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
              Select and compare starships from the Star Wars universe
            </p>
          </div>
          <div className="justify-self-center sm:justify-self-end">
            <ThemeToggle />
          </div>
        </div>

        <Card className="mb-4 sm:mb-6">
          <CardContent>
            {/* Mobile Layout */}
            <div className="grid grid-cols-1 sm:hidden gap-3">
              <div className="min-w-0">
                <SearchInput />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <HyperdriveFilter />
                <CrewFilter />
              </div>
              <Button variant="outline" onClick={resetFilters} className="w-full">
                Reset
              </Button>
            </div>

            {/* Tablet Layout */}
            <div className="hidden sm:grid lg:hidden grid-cols-2 gap-4 items-end">
              <div className="min-w-0">
                <SearchInput />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <HyperdriveFilter />
                <CrewFilter />
                <Button variant="outline" onClick={resetFilters} className="w-full">
                  Reset
                </Button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex justify-between items-end w-full">
              <div className="flex-1 max-w-md">
                <SearchInput />
              </div>
              <div className="flex gap-6 items-end">
                <div className="w-40">
                  <HyperdriveFilter />
                </div>
                <div className="w-40">
                  <CrewFilter />
                </div>
                <Button variant="outline" onClick={resetFilters} className="whitespace-nowrap">
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-15">
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

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}