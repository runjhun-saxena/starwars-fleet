'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import {
  searchAtom,
  hyperdriveFilterAtom,
  crewFilterAtom,
  currentPageAtom,
} from '@/store/starship';;
import { useStarships } from '@/hooks/use-starship';
import { SearchInput } from '@/components/search-input';
import { HyperdriveFilter, CrewFilter} from '@/components/filter';
import { StarshipsTable } from '@/components/starship-table';
import { ComparisonSheet } from '@/components/comparison-sheet';
import { SelectedStarshipsBar } from '@/components/selected-starship';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight, Rocket } from 'lucide-react';

export default function DashboardPage() {
  const [search] = useAtom(searchAtom);
  const [hyperdriveFilter] = useAtom(hyperdriveFilterAtom);
  const [crewFilter] = useAtom(crewFilterAtom);
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
  const [showComparison, setShowComparison] = useState(false);

  const { data, isLoading, error } = useStarships({
    search,
    page: currentPage,
    hyperdriveFilter,
    crewFilter,
  });

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (data?.next) {
      setCurrentPage(currentPage + 1);
    }
  };

  const resetFilters = () => {
    setCurrentPage(1);
  };
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Rocket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
              <p className="text-gray-600 mb-4">
                Unable to connect to the Star Wars API. Please check your connection and try again.
              </p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Rocket className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Star Wars Fleet Management
            </h1>
          </div>
          <p className="text-gray-600">
            Search, filter, and compare starships from the Star Wars universe
          </p>
        </div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search & Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 min-w-0">
                <SearchInput />
              </div>
              <HyperdriveFilter />
              <CrewFilter />
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
        {data && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Showing {data.results.length} starships
              {search && ` matching "${search}"`}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-gray-600 px-2">
                Page {currentPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!data.next}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <Card>
          <CardContent className="p-0">
            <StarshipsTable 
              starships={data?.results || []} 
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        <SelectedStarshipsBar onCompare={() => setShowComparison(true)} />

        <ComparisonSheet
          open={showComparison}
          onOpenChange={setShowComparison}
        />
      </div>
    </div>
  );
}