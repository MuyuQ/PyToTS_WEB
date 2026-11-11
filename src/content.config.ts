import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { docsLoader, i18nLoader } from "@astrojs/starlight/loaders";
import { docsSchema, i18nSchema } from "@astrojs/starlight/schema";

const learningMetadataSchema = z
  .object({
    kind: z.enum(["page", "lesson", "algorithm"]).default("page"),
    level: z.enum(["preparation", "foundation", "migration", "advanced"]).optional(),
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
        ctx.addIssue({ code: "custom", message: "lesson requires level" });
      }
      if (!value.topic) {
        ctx.addIssue({ code: "custom", message: "lesson requires topic" });
      }
      if (!value.difficulty) {
        ctx.addIssue({ code: "custom", message: "lesson requires difficulty" });
      }
      if (!value.prerequisites) {
        ctx.addIssue({ code: "custom", message: "lesson requires prerequisites" });
      }
      if (!value.python_tags) {
        ctx.addIssue({ code: "custom", message: "lesson requires python_tags" });
      }
      if (!value.ts_tags) {
        ctx.addIssue({ code: "custom", message: "lesson requires ts_tags" });
      }
    }

    if (value.kind === "algorithm") {
      if (!value.difficulty) {
        ctx.addIssue({ code: "custom", message: "algorithm requires difficulty" });
      }
      if (!value.tags) {
        ctx.addIssue({ code: "custom", message: "algorithm requires tags" });
      }
    }
  });

const docs = defineCollection({
  // docsLoader 是 Starlight 官方 loader：忽略 `_` 前缀文件、支持更多扩展名
  loader: docsLoader(),
  schema: docsSchema({
    extend: learningMetadataSchema,
  }),
});

// Starlight 启动时会读取 i18n 集合做 UI 翻译回退；本站单语言（root locale），
// 定义空集合只为消除构建时 "The collection i18n does not exist or is empty" 警告。
const i18n = defineCollection({
  loader: i18nLoader(),
  schema: i18nSchema(),
});

export const collections = { docs, i18n };
