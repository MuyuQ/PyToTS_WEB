import { z } from "astro/zod";

export const lessonSchema = z.object({
  title: z.string(),
  level: z.enum(["foundation", "migration", "advanced"]),
  topic: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  prerequisites: z.array(z.string()).default([]),
  python_tags: z.array(z.string()).default([]),
  ts_tags: z.array(z.string()).default([]),
});

export const algorithmSchema = z.object({
  title: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.array(z.string()).default([]),
  time_complexity: z.string().optional(),
  space_complexity: z.string().optional(),
});