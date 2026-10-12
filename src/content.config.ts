import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const szutrak = defineCollection({
  // ids keep the language folder: "hu/sziv-szutra", "en/heart-sutra"
  loader: glob({ pattern: '**/*.md', base: './src/content/szutrak' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    lang: z.enum(['hu', 'en']),
    group: z.string(),
    order: z.number(),
  }),
});

export const collections = { szutrak };
