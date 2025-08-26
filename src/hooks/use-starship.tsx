import { useQuery } from '@tanstack/react-query';
import type { Starship, StarshipsResponse } from '@/lib/api';
import { getHyperdriveCategory, getCrewCategory } from '@/store/starship';

interface UseStarshipsParams {
  search?: string;
  page?: number;
  hyperdriveFilter?: string;
  crewFilter?: string;
}

const fetchStarships = async (params: UseStarshipsParams): Promise<StarshipsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.append('search', params.search);
  }
  if (params.page && params.page > 1) {
    searchParams.append('page', params.page.toString());
  }

  const url = `https://swapi.dev/api/starships/?${searchParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch starships: ${response.statusText}`);
  }

  const data: StarshipsResponse = await response.json();
  let filteredResults = data.results;

  if (params.hyperdriveFilter && params.hyperdriveFilter !== 'all') {
    filteredResults = filteredResults.filter((starship: Starship) =>
      getHyperdriveCategory(starship.hyperdrive_rating) === params.hyperdriveFilter
    );
  }
  if (params.crewFilter && params.crewFilter !== 'all') {
    filteredResults = filteredResults.filter((starship: Starship) =>
      getCrewCategory(starship.crew) === params.crewFilter
    );
  }

  return {
    ...data,
    results: filteredResults,
    count: data.count,
  };
};

export const useStarships = (params: UseStarshipsParams) => {
  return useQuery({
    queryKey: ['starships', params],
    queryFn: () => fetchStarships(params),
    enabled: true,
    staleTime: 1000 * 60 * 5, 
  });
};
