export type { Starship, StarshipsResponse } from './swapi';
import type { StarshipsResponse } from './swapi';
import { getStarshipsPageViaTsRest } from './tsrest-client';

export async function fetchStarshipsPage(opts: {
  page?: number;
  search?: string;
}): Promise<StarshipsResponse> {
  return getStarshipsPageViaTsRest({ page: opts.page, search: opts.search });
}
