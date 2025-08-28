import { useInfiniteQuery } from '@tanstack/react-query'
import type { StarshipsResponse } from '@/lib/api'
import { fetchStarshipsPage } from '@/lib/api'
import { getHyperdriveCategory, getCrewCategory } from '@/store/starship'

interface UseStarshipsParams {
  search?: string
  hyperdriveFilter?: string 
  crewFilter?: string     
}

export const useStarships = (params: UseStarshipsParams) => {
  return useInfiniteQuery<StarshipsResponse>({
    queryKey: ['starships', params],
    queryFn: ({ pageParam = 1 }) =>
      fetchStarshipsPage({ page: pageParam as number, search: params.search }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined
      const url = new URL(lastPage.next)
      return Number(url.searchParams.get('page'))
    },
    select: (data) => {
      const hyper = params.hyperdriveFilter ?? 'all'
      const crew  = params.crewFilter ?? 'all'

      const pages = data.pages.map((p) => {
        let results = p.results
        if (hyper !== 'all') {
          results = results.filter(
            (s) => getHyperdriveCategory(s.hyperdrive_rating) === hyper
          )
        }
        if (crew !== 'all') {
          results = results.filter(
            (s) => getCrewCategory(s.crew) === crew
          )
        }
        return { ...p, results }
      })

      return { ...data, pages }
    },
  })
}
