import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const starshipSchema = z.object({
  name: z.string(),
  model: z.string(),
  manufacturer: z.string(),
  crew: z.string(),
  hyperdrive_rating: z.string(),
  starship_class: z.string(),
  url: z.string(),
});

const starshipsResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(starshipSchema),
});

export const apiContract = initContract().router({
  getStarships: {
    method: 'GET',
    path: '/api/starships/',
    query: z.object({
      search: z.string().optional(),
      page: z.number().optional(),
    }),
    responses: {
      200: starshipsResponseSchema,
    },
  },
});

export type Starship = z.infer<typeof starshipSchema>;
export type StarshipsResponse = z.infer<typeof starshipsResponseSchema>;