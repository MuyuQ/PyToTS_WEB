import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { lessonSchema, algorithmSchema } from "./lib/frontmatter-schema";

const docs = defineCollection({
  type: "content",
  schema: z.union([lessonSchema, algorithmSchema, z.object({ title: z.string(), description: z.string().optional() })]),
});

export const collections = { docs };