import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    vendor: z.string(),
    category: z.enum([
      'chat',
      'ide',
      'ui',
      'agent',
      'media',
      'search',
      'data',
      'audio',
    ]),
    tags: z.array(z.string()).default([]),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    website: z.string().optional(),
    pricing: z.enum(['free', 'freemium', 'paid', 'open-source']).default('freemium'),
    updatedAt: z.string().default('2026-05-25'),
    order: z.number().default(0),
  }),
});

const learn = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/learn' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    level: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    category: z.enum(['foundation', 'prompt', 'rag', 'agent', 'multimodal', 'tools', 'safety']),
    tags: z.array(z.string()).default([]),
    readingTime: z.string().default('5 分钟'),
    order: z.number().default(0),
    updatedAt: z.string().default('2026-05-25'),
  }),
});

export const collections = { products, learn };
