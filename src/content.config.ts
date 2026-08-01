import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const reference = z.object({
  title: z.string().min(1),
  url: z.url(),
  accessed: z.coerce.date().optional(),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(20).max(320),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    authors: z.array(z.string().min(1)).min(1).default(['Guillermo Villarroel']),
    tags: z.array(z.string().min(1)).min(1),
    knowledgeDomains: z
      .array(z.enum(['software-engineering', 'data-science']))
      .default([]),
    draft: z.boolean().default(false),
    canonicalUrl: z.url().optional(),
    references: z.array(reference).default([]),
  }),
});

export const collections = { posts };
