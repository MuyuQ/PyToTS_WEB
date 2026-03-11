import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { docsSchema } from "@astrojs/starlight/schema";

const learningMetadataSchema = z
  .object({
    kind: z.enum(["page", "lesson", "algorithm"]).default("page"),
    level: z.enum(["foundation", "migration", "advanced"]).optional(),
    topic: z.string().optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    prerequisites: z.array(z.string()).optional(),
    python_tags: z.array(z.string()).optional(),
    ts_tags: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    time_complexity: z.string().optional(),
    space_complexity: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.kind === "lesson") {
      if (!value.level) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "lesson requires level" });
      }
      if (!value.topic) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "lesson requires topic" });
      }
      if (!value.difficulty) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "lesson requires difficulty" });
      }
      if (!value.prerequisites) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "lesson requires prerequisites" });
      }
      if (!value.python_tags) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "lesson requires python_tags" });
      }
      if (!value.ts_tags) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "lesson requires ts_tags" });
      }
    }

    if (value.kind === "algorithm") {
      if (!value.difficulty) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "algorithm requires difficulty" });
      }
      if (!value.tags) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "algorithm requires tags" });
      }
    }
  });

const docs = defineCollection({
  type: "content",
  schema: docsSchema({
    extend: learningMetadataSchema,
  }),
});

export const collections = { docs };
