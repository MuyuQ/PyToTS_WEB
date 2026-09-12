# PyToTS - Python 转 TypeScript 学习站

[English](./README_EN.md) | 简体中文

面向 Python 开发者的 TypeScript 学习站。通过 Python / TypeScript 代码对照、分阶段课程、算法题解和交互测验，集中学习两种语言的语法、类型系统与工程实践差异。

[在线学习](https://muyuq.github.io/PyToTS_WEB/) · [贡献指南](./CONTRIBUTING.md) · [项目约定](./AGENTS.md)

站点正文目前为简体中文；“双语对照”指 Python 与 TypeScript 两种编程语言的代码对照。

## 功能与内容

- **系统课程**：准备、基础、迁移、进阶四条路径，共 22 课，配套练习与面试追问。
- **代码对照**：短代码使用 `CodeCompare` 并排展示，窄屏上下排列；算法完整实现可通过 Python / TypeScript 标签页切换。
- **算法实战**：36 道经典算法题，包含暴力解与优化、干跑表、复杂度分析、双语实现、常见错误及面试变体；支持按难度筛选、按标题和标签搜索。
- **交互测验**：21 组共 104 题，覆盖基础、迁移和进阶课程，并包含预测输出题；提供答案解析、成绩记录和重新作答。
- **学习记录**：首页继续上次学习，课程与算法完成标记、路径进度、收藏及测验成绩集中展示。
- **查阅体验**：对照手册、速查表、标签与难度索引、Pagefind 全文搜索，以及明暗主题和移动端布局。

课程数不含路径入口页；测验组数与题量以 [`src/data/quizzes.ts`](./src/data/quizzes.ts) 为准。

站点为纯静态应用，无需账号或后端服务。进度、收藏、测验成绩和上次访问位置保存在当前浏览器的 `localStorage` 中，不会上传或跨设备同步；清理站点数据后会丢失。阅读至课程或算法正文末尾时会记录完成状态。

## 学习路径

| 路径     | 课时 | 内容（按教学顺序）                                                                 |
| -------- | ---- | ---------------------------------------------------------------------------------- |
| 准备入门 | 2    | TypeScript 简介、开发环境搭建                                                      |
| 基础入门 | 5    | 变量、函数基础、控制流、数据结构、类与对象                                         |
| 语法迁移 | 7    | 类型系统、函数进阶、模块、异步、错误处理、枚举、字符串与正则                       |
| 进阶实战 | 8    | 泛型、类型守卫、工具类型、声明文件与配置、装饰器、设计模式、日期时间、Node.js 基础 |

首次学习可按四条路径依次推进；已有 TypeScript 基础可从迁移或进阶路径开始，配合测验检验理解，再到算法题库练习。

## 快速开始

### 环境要求

- Node.js 22.12+（22.x，与 CI 一致）或 24.x。
- npm 9.6.5+，依赖通过仓库中的 `package-lock.json` 锁定。

### 本地开发

```bash
git clone https://github.com/MuyuQ/PyToTS_WEB.git
cd PyToTS_WEB
npm ci
npm run dev -- --host 127.0.0.1
```

打开 [http://127.0.0.1:4321/PyToTS_WEB/](http://127.0.0.1:4321/PyToTS_WEB/)。站点配置了 `/PyToTS_WEB/` 子路径，本地开发和预览也需包含此前缀。开发端口被占用时会自动递增，以终端输出为准。

### 构建与预览

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
```

构建产物输出到 `dist/`，预览地址同上。Pagefind 搜索索引在构建时生成，验证全文搜索需先构建再预览。

## 命令与质量检查

| 命令                      | 说明                                                        |
| ------------------------- | ----------------------------------------------------------- |
| `npm run dev`             | 启动 Astro 开发服务器                                       |
| `npm run build`           | 构建静态页面与 Pagefind 搜索索引                            |
| `npm run preview`         | 预览已有 `dist/` 产物                                       |
| `npm run lint`            | ESLint 检查，警告也会导致失败                               |
| `npm run lint:content`    | 检查内容标题、内部链接、元数据和短代码对照限制              |
| `npm run format`          | Prettier 格式检查，不会自动修改文件                         |
| `npm run typecheck`       | Astro 与 TypeScript 类型检查                                |
| `npm run test`            | Vitest 测试，包括单元、组件和构建产物可访问性检查           |
| `npm run test:coverage`   | 运行 Vitest 并校验覆盖率阈值，报告输出到 `coverage/`        |
| `npm run test:components` | 单独运行组件测试                                            |
| `npm run test:a11y`       | 对 `dist/` 中的真实页面进行可访问性检查                     |
| `npm run test:e2e`        | Playwright 浏览器测试，默认包含 Chromium、Firefox、WebKit   |
| `npm run linkcheck`       | 验证 `dist/` 中的内部链接、资源引用及跨页锚点               |
| `npm run check`           | 按顺序运行完整质量检查并构建                                |
| `npm run lighthouse`      | 对构建预览运行 Lighthouse；当前配置会上传报告至临时公共存储 |

`npm run check` 的执行顺序以 [`package.json`](./package.json) 为准：

```text
lint → lint:content → format → typecheck → build → test:coverage → linkcheck
```

`test`、`test:coverage`、`test:a11y`、`linkcheck`、E2E 和 Lighthouse 都依赖最新的 `dist/`。单独运行这些命令前先执行 `npm run build`。`check` 不包含 E2E 或 Lighthouse。

### 浏览器测试

运行与 CI 一致的 Chromium 测试：

```bash
npm run build
npx playwright install chromium
npm run test:e2e -- --project=chromium
```

如需运行全部浏览器项目，先执行 `npx playwright install`，再运行 `npm run test:e2e`。Linux CI 使用 `npx playwright install --with-deps chromium` 安装浏览器及系统依赖。

Playwright 会自动启动本地预览服务器，使用端口 4321；本地已有服务时会复用，需确保该服务对应本项目的最新构建。测试覆盖导航、课程顺序、搜索与筛选、测验流程及移动端布局。

## 项目结构

```text
.
├── src/
│   ├── components/          # 导航、代码对照、算法索引、测验、进度与收藏
│   ├── content/docs/        # MDX 文档
│   │   ├── paths/           # preparation / foundation / migration / advanced
│   │   ├── algorithms/      # 36 道算法题与索引页
│   │   ├── handbook/        # 对照手册与速查表
│   │   ├── practice/        # 自测清单与编程测验
│   │   ├── tags/            # 标签索引
│   │   ├── difficulty/      # 难度索引
│   │   ├── bookmarks/       # 进度与收藏
│   │   └── about/           # 关于与贡献
│   ├── content.config.ts    # Astro 内容集合与学习元数据校验
│   ├── data/quizzes.ts      # 测验题库
│   ├── lib/                 # 课程顺序、路由、进度存储、测验状态与交互
│   ├── pages/404.astro      # 自定义 404 页面
│   └── styles/              # 设计令牌、排版、布局、代码与测验样式
├── tests/
│   ├── unit/               # 工具库、内容契约与组件测试
│   ├── a11y/               # 基于真实构建页面的可访问性测试
│   └── e2e/                # Playwright 浏览器测试
├── scripts/                # 内容检查、构建产物链接检查、OG 图片生成
├── docs/                   # 部署与运维文档、架构决策、设计与实施计划
├── .github/workflows/      # Pages 部署与独立 E2E 流水线
├── astro.config.mjs        # 域名、子路径、侧边栏、主题与组件覆盖
└── package.json            # 命令与依赖
```

### 常见维护入口

| 任务               | 位置与约定                                                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| 新增或调整课程     | 修改 [`src/lib/curriculum.ts`](./src/lib/curriculum.ts) 与对应 MDX；同步 `sidebar.order`，保持侧边栏与分页教学顺序一致                  |
| 新增算法题         | 在 `src/content/docs/algorithms/` 新增 MDX，参考 [算法编写规范](./docs/algorithms-AGENTS.md)                                            |
| 修改测验题目       | 编辑 [`src/data/quizzes.ts`](./src/data/quizzes.ts)；新增测验组还需在 `src/content/docs/practice/quiz/index.mdx` 引用                   |
| 修改测验行为或样式 | `src/lib/quiz-manager.ts` 管理状态，`src/lib/quiz-ui.ts` 处理交互，`src/styles/quiz.css` 提供样式；`QuizContainer.astro` 负责模板与挂载 |
| 修改学习记录       | `src/lib/progress-store.ts` 管理存储，`learning-routes.ts` 提供内容路由，`ContinueCard.astro` 和 `VisitRecorder.astro` 实现继续学习     |
| 调整主题或导航     | `src/styles/tokens.css`、`src/components/` 与 `astro.config.mjs`                                                                        |

## 内容规范

完整约定见 [`AGENTS.md`](./AGENTS.md)，算法专用模板见 [`docs/algorithms-AGENTS.md`](./docs/algorithms-AGENTS.md)。

- 课程 frontmatter 包含 `title`、`kind`、`level`、`topic`、`difficulty`、`prerequisites`、`python_tags`、`ts_tags`、`description` 和 `sidebar.order`。
- 课程章节使用语义化中文标题：为什么重要、核心概念、Python 回顾、TypeScript 等价写法、差异与常见陷阱、练习、面试追问；不重复 frontmatter 标题，不在标题中使用 emoji。
- 内容内部链接使用相对路径，例如算法页链接到另一题时写 `../two-sum/`，避免遗漏部署子路径。
- 直接相邻的短 Python / TypeScript 代码对使用 `CodeCompare`：每段不超过 20 行，单行不超过 48 字符。超限时使用上下排列的代码块；提示和答案要点使用 `:::note` / `:::tip`。
- Python 在前、TypeScript 在后，对照示例保持变量命名一致；TypeScript 优先使用 `const`，避免 `any`，使用 `unknown` 或精确类型。
- 测验每题 4 个选项且恰好 1 个正确答案，每个选项都需提供解析；预测题使用 `questionType: "prediction"`、`codeSnippets` 和选项的 `expected` 字段。

算法题采用以下九段结构，并包含可运行的完整实现与测试用例：

```text
问题描述 → 暴力解与瓶颈 → 思路分析（含干跑表）→ 复杂度分析
→ 双语实现（Python / TypeScript Tabs）→ Python 与 TypeScript 差异点评
→ 常见错误分析 → 面试变体 → 面试追问
```

## 技术栈与部署

| 用途               | 技术                                                              |
| ------------------ | ----------------------------------------------------------------- |
| 静态站点与文档主题 | Astro 7、Starlight 0.42                                           |
| 内容与交互         | MDX、TypeScript、Astro 组件、浏览器原生 API                       |
| 搜索               | Pagefind，随静态构建生成索引                                      |
| 测试与质量         | Vitest 5、Testing Library、axe-core、Playwright、ESLint、Prettier |
| 托管               | GitHub Pages + GitHub Actions                                     |

精确依赖版本见 [`package-lock.json`](./package-lock.json)。

- [`static.yml`](./.github/workflows/static.yml)：推送到 `main` 后执行 `npm ci` 和 `npm run check`，通过后将 `dist/` 部署到 GitHub Pages。
- [`e2e.yml`](./.github/workflows/e2e.yml)：Pull Request 和 `main` 推送触发独立的 Chromium E2E 检查，失败时上传测试报告。

部署域名与子路径配置在 `astro.config.mjs`。迁移部署地址时，还需同步 `playwright.config.ts`、`scripts/link-check.mjs` 与 `lighthouserc.json` 中的地址或前缀。

## 贡献与更多文档

欢迎通过 Issue 反馈内容问题，或提交 Pull Request 改进课程、算法题解和站点功能。开发流程见 [贡献指南](./CONTRIBUTING.md)；提交前运行 `npm run check`，涉及页面交互时再运行相关 E2E 测试。

- [部署指南](./docs/DEPLOYMENT.md)
- [故障排查](./docs/TROUBLESHOOTING.md)
- [运维手册](./docs/RUNBOOK.md)
- [架构决策记录](./docs/adr/)

## 许可证

当前仓库尚未包含 `LICENSE` 文件。
