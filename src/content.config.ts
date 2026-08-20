import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        linkTitle: z.string().optional(),
        date: z.coerce.date().optional(),
        authors: z.array(z.string()).optional(),
        categories: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        weight: z.number().optional(),
        aliases: z.array(z.string()).optional(),
      }),
    }),
  }),
};
