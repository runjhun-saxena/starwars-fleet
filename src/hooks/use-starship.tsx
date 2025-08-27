import { useInfiniteQuery } from '@tanstack/react-query';
import type { Starship, StarshipsResponse } from '@/lib/api';
import { getHyperdriveCategory, getCrewCategory } from '@/store/starship';

interface UseStarshipsParams {
  search?: string;
  hyperdriveFilter?: string;
  crewFilter?: string;
  page?: number;
}

const fetchStarships = async (params: UseStarshipsParams): Promise<StarshipsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.append('search', params.search);
  }
  if (params.page && params.page > 1) {
    searchParams.append('page', params.page.toString());
  }

  const urls = [
    `https://swapi.py4e.com/api/starships/?${searchParams.toString()}`,
    `https://swapi.info/api/starships/?${searchParams.toString()}`,
    `https://swapi.dev/api/starships/?${searchParams.toString()}`
  ];

  let lastError;
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      const data = await response.json();
      let filteredResults = data.results;

      if (params.hyperdriveFilter && params.hyperdriveFilter !== 'all') {
        filteredResults = filteredResults.filter((s: Starship) =>
          getHyperdriveCategory(s.hyperdrive_rating) === params.hyperdriveFilter
        );
      }

      if (params.crewFilter && params.crewFilter !== 'all') {
        filteredResults = filteredResults.filter((s: Starship) =>
          getCrewCategory(s.crew) === params.crewFilter
        );
      }

      return {
        ...data,
        results: filteredResults,
        count: filteredResults.length,
      };
    } catch (error) {
      lastError = error;
      continue;
    }
  }
  throw new Error(`All SWAPI endpoints failed. Last error: ${lastError}`);
};

export const useStarships = (params: UseStarshipsParams) => {
  return useInfiniteQuery({
    queryKey: ['starships', params],
    queryFn: ({ pageParam }) =>
      fetchStarships({ ...params, page: pageParam as number }),
    initialPageParam: 1, 
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        return Number(url.searchParams.get('page'));
      }
      return undefined;
    },
  });
};
