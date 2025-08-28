import { initClient } from '@ts-rest/core';
import { apiContract, StarshipsResponse } from './swapi';

const MIRRORS = [
  'https://swapi.dev/api',
  'https://swapi.py4e.com/api',
  'https://swapi.info/api',
] as const;

function makeClient(baseUrl: string) {
  return initClient(apiContract, { baseUrl });
}

const clients = MIRRORS.map(makeClient);

export async function getStarshipsPageViaTsRest(
  params: { page?: number; search?: string }
): Promise<StarshipsResponse> {
  let lastErr: unknown;
  for (const client of clients) {
    try {
      const res = await client.getStarships({ query: params });
      if (res.status === 200) return res.body;
      throw new Error(`Unexpected status ${res.status}`);
    } catch (e) {
      lastErr = e;
    }
  }
  throw new Error(
    `All SWAPI mirrors failed. Last error: ${(lastErr as Error)?.message ?? lastErr}`
  );
}
