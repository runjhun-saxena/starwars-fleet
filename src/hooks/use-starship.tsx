import { useQuery } from '@tanstack/react-query';
import type { Starship, StarshipsResponse } from '@/lib/api';
import { getHyperdriveCategory, getCrewCategory } from '@/store/starship';;

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
  const urls = [
    `https://swapi.py4e.com/api/starships/?${searchParams.toString()}`,
    `https://swapi.info/api/starships/?${searchParams.toString()}`,
    `https://swapi.dev/api/starships/?${searchParams.toString()}`
  ];
  
  let lastError;
  
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      let filteredResults = data.results;
      
      if (params.hyperdriveFilter && params.hyperdriveFilter !== 'all') {
        filteredResults = filteredResults.filter((starship: Starship) => {
          return getHyperdriveCategory(starship.hyperdrive_rating) === params.hyperdriveFilter;
        });
      }
      
      if (params.crewFilter && params.crewFilter !== 'all') {
        filteredResults = filteredResults.filter((starship: Starship) => {
          return getCrewCategory(starship.crew) === params.crewFilter;
        });
      }
      
      return {
        ...data,
        results: filteredResults,
        count: filteredResults.length,
      };
    } catch (error) {
      lastError = error;
      console.warn(`Failed to fetch from ${url}:`, error);
      continue;
    }
  }
  
  throw new Error(`All SWAPI endpoints failed. Last error: ${lastError}`);
};
export const useStarships = (params: UseStarshipsParams) => {
  return useQuery({
    queryKey: ['starships', params],
    queryFn: () => fetchStarships(params),
    enabled: true,
  });
};