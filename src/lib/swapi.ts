import { initContract } from '@ts-rest/core';
import { z } from 'zod';

export const starshipSchema = z.object({
  name: z.string(),
  model: z.string(),
  manufacturer: z.string(),
  crew: z.string(),
  hyperdrive_rating: z.string(),
  starship_class: z.string(),
  url: z.string(),
});

export const starshipsResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(starshipSchema),
});

export type Starship = z.infer<typeof starshipSchema>;
export type StarshipsResponse = z.infer<typeof starshipsResponseSchema>;

const c = initContract();

export const apiContract = c.router({
  getStarships: {
    method: 'GET',
    path: '/starships/',
    query: z.object({
      search: z.string().optional(),
      page: z.number().optional(),
    }),
    responses: {
      200: starshipsResponseSchema,
    },
  },
});
