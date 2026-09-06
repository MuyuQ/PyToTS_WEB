# PROJECT KNOWLEDGE BASE

**Generated:** 2026-07-04
**Commit:** 5fd5a4a
**Branch:** main

## OVERVIEW

Python to TypeScript 双语学习站点。基于 Astro + Starlight 构建的静态文档网站，包含教程、算法题解和交互测验。

## STRUCTURE

```
./
├── src/
│   ├── components/          # 自定义组件 (QuizContainer, CodeCompare, AlgorithmIndex...)
│   ├── content/docs/        # 文档内容 (MDX)
│   │   ├── algorithms/      # 36 道算法题 (双语实现)
│   │   ├── paths/           # 学习路径
│   │   │   ├── preparation/ # 准备 2 课
│   │   │   ├── foundation/  # 基础 5 课
│   │   │   ├── migration/   # 迁移 7 课
│   │   │   └── advanced/    # 进阶 8 课
│   │   ├── handbook/        # 速查手册
│   │   └── practice/        # 练习测验
│   ├── lib/                 # 工具库
│   ├── pages/               # 自定义页面
│   └── styles/              # 全局样式
├── tests/
│   ├── unit/                # 单元测试
│   └── e2e/                 # Playwright E2E
├── scripts/                 # 构建脚本
└── docs/plans/              # 设计文档
```

## WHERE TO LOOK

| 任务         | 位置                                 | 说明                                                               |
| ------------ | ------------------------------------ | ------------------------------------------------------------------ |
| 新增算法题   | `src/content/docs/algorithms/`       | 见 [docs/algorithms-AGENTS.md](./docs/algorithms-AGENTS.md) |
| 修改课程内容 | `src/content/docs/paths/*/`          | 每课独立 MDX                                                       |
| 组件开发     | `src/components/`                    | Astro 组件                                                         |
| 添加测验题目 | `src/components/QuizContainer.astro` | 内置题库                                                           |
| 样式调整     | `src/styles/` + Starlight 主题       |
| 构建问题     | `astro.config.mjs`                   | 站点配置                                                           |

## CONVENTIONS

### 内容文件 (MDX)

- **Frontmatter 必填**: `title`, `kind`, `level`, `topic`, `difficulty`, `prerequisites`, `python_tags`, `ts_tags`, `description`；课程还需 `sidebar.order`（对齐 `src/lib/curriculum.ts` 的教学顺序）
- **标题规范**: 标题中禁止 emoji（由 `npm run lint:content` 强制）；课程章节使用语义化中文标题（为什么重要 / 核心概念 / Python 回顾 / TypeScript 等价写法 / 差异与常见陷阱 / 练习 / 面试追问）
- **算法结构**（9 段加厚模板，详见 [docs/algorithms-AGENTS.md](./docs/algorithms-AGENTS.md)）: `## 问题描述` → `## 暴力解与瓶颈` → `## 思路分析`（含干跑表）→ `## 复杂度分析` → `## 双语实现`（Tabs: Python/TypeScript）→ `## Python 与 TypeScript 差异点评` → `## 常见错误分析` → `## 面试变体` → `## 面试追问`
- **链接规范**: 内容内部链接必须使用相对路径（站点部署在 `/PyToTS_WEB/` 子路径，根相对链接会 404，由 `npm run linkcheck` 在构建产物上强制校验）
- **高亮与提示**: 提示/答案要点使用 `:::note` / `:::tip` aside，不要自定义彩色块
- **双语对照**: 直接相邻且短小（≤20 行、单行 ≤48 字符）的 Python→TypeScript 代码对使用 `CodeCompare` 组件（`import CodeCompare from "../../../../components/CodeCompare.astro"`，注意相对深度；超限由 `npm run lint:content` 强制）；长代码保持上下排列，依赖代码块语言徽标

### 代码示例

- 双语对照：Python 在上，TypeScript 在下
- 注释使用 `#` (Python) 和 `//` (TypeScript)
- 变量命名保持一致（如都用 `nums` 而不是 `arr`）

### 测验题目

- 存储于 `QuizContainer.astro` 的 `quizData` 对象
- 每题：question + 4 options (含 correct flag + explanation)

## ANTI-PATTERNS (THIS PROJECT)

- **禁止**: 使用 `any` 类型（使用 `unknown` 替代）
- **禁止**: 在课程内容中加 `## 标题` 重复 frontmatter title
- **禁止**: 过多使用"你""我"人称（技术文档保持客观）
- **禁止**: AI 式开场白（"作为开发者..."）
- **要求**: `const` 优先于 `let`，除非必须重新赋值

## COMMANDS

```bash
# 开发
npm run dev -- --host 127.0.0.1

# 质量检查 (lint + lint:content + typecheck + build + test + linkcheck)
# 注意 test 在 build 之后：a11y 测试需要新鲜的 dist 产物
npm run check

# 测试
npm run test        # 单元测试
npm run test:e2e    # Playwright

# 构建
npm run build       # 静态站点
```

## NOTES

- **端口**: 开发服务器默认端口 4321（Astro 默认值），被占用时自动递增
- **内容检查**: `npm run linkcheck` 验证内部链接
- **搜索索引**: 构建时自动生成 Pagefind 索引
- **CI/CD**: GitHub Actions 自动部署到 GitHub Pages
