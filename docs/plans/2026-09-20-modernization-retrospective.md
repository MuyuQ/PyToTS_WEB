# PyToTS 现代化复盘与重设计记录

**日期**：2026-09-20
**范围**：全站界面现代化重设计 + 信息结构梳理 + 未完成需求收口
**前置**：[2026-09-04-site-ia-and-visual-refactor.md](./2026-09-04-site-ia-and-visual-refactor.md)（上一轮 IA/视觉重构）

---

## 1. 复盘：这次重设计之前，项目处于什么状态

### 1.1 做对了的（保持不动）

- **单一数据源**：课程顺序、课时数、上一课/下一课全部由 `src/lib/curriculum.ts` 派生，三层机制（构建数据、Pagination 覆盖、sidebar-order e2e）闭环。
- **设计令牌体系**：OKLCH 三层令牌（primitives → 语义明暗 → Starlight 桥接）在上一轮已建立，暗色模式完整，双色语言识别（Python 暖黄 / TS 冷蓝）是本站最有效的视觉资产。
- **质量门禁**：`npm run check`（lint + 内容规范 + 格式 + 类型 + 构建 + 覆盖率 + dist 级链接检查）+ Playwright e2e + axe a11y，本次重设计全程有护栏。
- **内容底盘**：22 节课、36 道双语题解、104 道测验题，全部有结构与覆盖率守护。

### 1.2 复盘发现的问题（本次处理的）

| 问题                                                                                                      | 性质 | 处理                                                         |
| --------------------------------------------------------------------------------------------------------- | ---- | ------------------------------------------------------------ |
| 首页是 Starlight splash 模板的"文档页 hero"，版式与内容型产品定位不匹配                                   | 视觉 | 全新 Hero/Footer 覆盖组件 + 着陆页信息结构（见 §2）          |
| 首页"继续学习"之下没有可扫视的规模感：22/36/104 这组数字散落在按钮旁的小字里                              | 视觉 | 数字升格为 hero 统计条，构建期派生                           |
| 首页"怎么用这个站"是普通有序列表，四步动作没有出口感                                                      | 结构 | `HomeHowTo` 步骤卡：编号 + 动词标题 + 具体出口链接           |
| 搜索结果是扁平列表，课程/题解/手册混在一起                                                                | 功能 | Pagefind filter + 自定义搜索模态（§3.1）                     |
| 学习进度纯 localStorage，换设备即丢，且无任何出口                                                         | 功能 | 进度导出/导入合并（§3.2）                                    |
| `curriculum.ts` 与内容目录是两份事实，slug 拼错静默失效                                                   | 工程 | 一致性校验单测（§3.3）                                       |
| 首页路径进度分母把入口页也算进去（"2 课"但"0/3"）                                                         | 缺陷 | HomePaths/ProgressPanel 口径对齐 SidebarProgress（只计正课） |
| `src/content/docs/404.mdx` 在 `disable404Route` + 自定义 404.astro 落地后成为孤儿文件                     | 卫生 | 已删除                                                       |
| README 落后代码（缺 2 个组件、缺 quiz.css、"200+ 练习题"与实际 104 不符）；根目录缺 README 引用的 LICENSE | 卫生 | 已同步/补齐                                                  |
| 三份历史计划文档无状态生命周期（09-02 被取代未标注、superpowers 计划 Partial、原始设计文档无现状注记）    | 卫生 | 全部补状态标注                                               |

## 2. 界面现代化重设计

设计立场延续上一轮的"工程感、克制、令牌驱动"，这一轮解决的是**版式层级**而不是再换一轮颜色：

- **`overrides/Hero.astro`（Starlight 官方可覆盖组件）**：着陆页 hero——aurora 光晕 + 细网格背景、玻璃质感徽章、frontmatter 标题内嵌 `<em class="hero-grad">` 渐变强调（全局 home.css 定义，因 set:html 拿不到 scoped 属性）、构建期派生的规模统计（22 节/36 道/104 道）、右栏直接放本站招牌的 `CodeCompare` 双语对照面板。数据全部派生，零硬编码。
- **`overrides/Footer.astro`**：文档页脚（最后更新/上一课下一课/编辑链接）之下补完整的站点页脚——品牌区 + 三列站内导航 + 许可行，解决了"全站没有统一页脚"的历史空白。
- **`HomeHowTo.astro`**：四步使用卡片，替换首页正文里的有序列表。
- **home.css 重写**：splash 容器放宽到站点容器宽度（改 `--sl-content-width` 一个变量，而非 hack 定位）、章节节奏、渐变强调文字。
- **tokens.css 增量**：`--grad-brand`（品牌渐变，明暗两套）、`--glow-*`（光晕）、`--surface-glass`（玻璃面）、`--shadow-glow`（主按钮光效）——渐变只用于强调文字/主按钮/着陆页光晕，不进正文排版。
- **主按钮**：`btn--primary` 加品牌光效阴影；新增 `btn--lg` 供 hero CTA 使用。

兼容性边界：e2e 依赖的 `nav.site-nav`、测验类名、算法索引类名、侧边栏顺序、404 出口全部未动；搜索按钮的 DOM 契约（`button[aria-label=搜索]`）保留。

## 3. 未完成需求收口（docs/plans/2026-09-04 §5.2 中期四项）

### 3.1 搜索按内容类型分组

- **类型标记**：Banner 覆盖组件按 `docSlug(entry.id)` 给每页注入 `<span data-pagefind-filter="type" data-pagefind-weight="0">`。注意两个坑：不能用 `display:none`（Pagefind 跳过不可见元素，filter 一并失效，故用 sr-only 模式）；首页/`practice/index` 的 `entry.id` 不含 `index` 后缀（归一后为空串/`practice`），必须走 `docSlug`。
- **搜索模态**：覆盖 `Search` 组件（官方覆盖点），弃用 `@pagefind/default-ui` 的扁平列表，基于 Pagefind JS API 自建结果渲染——"全部"视图按类型分组（课程/题解/手册/练习/参考），类型过滤片带实时计数（`pagefind.filters()`），保留 Ctrl/⌘+K、Esc、点遮罩关闭、dev 模式提示等默认行为契约。
- **守护**：`search-and-filter.spec.ts` 新增 e2e——分组标签可见、过滤片切换后只剩题解、计数正确（36）、Esc 可关闭。

### 3.2 进度跨设备迁移

无后端静态站做不了真正的"云端同步"（需要账号体系与服务端存储，属产品级决策）。按同等用户价值落地为**导出/导入**：

- `progress-store.ts` 新增 `mergeLearningProgress`（课程/测验按 path/quizId 去重、`completedAt` 新者胜、收藏并集、当前设备有记录时不覆盖 lastVisited）与 `parseProgressBlob`（外部输入形状校验）。
- 「我的」页新增"备份与恢复"区：导出 `pytots-progress-YYYYMMDD.json`、导入时与本地进度合并，双端数据都不丢。
- 单测 `progress-merge.test.ts` 守护合并语义（9 个用例）。
- 真正的云同步留待有后端时替换存储层——接口边界（`progress-store.ts` 的读写收口）保持清晰。

### 3.3 curriculum 一致性校验

`tests/unit/curriculum-consistency.test.ts`：curriculum 里每个 slug 必须有对应 MDX 文件（反向：文件必须登记），每条路径必有 `index.mdx` 入口，slug 无重复。**口径说明**：`index.mdx` 是侧边栏分组入口、约定不入课程序列（preparation 因历史原因例外，由 curriculum.test.ts 的既有断言固化），一致性测试对 index 只查"存在"，不要求登记。

### 3.4 设计令牌导出

按"发布机器可读快照"落地而非抽独立 npm 包——当前令牌量级（261 个）与复用诉求撑不起包的维护成本：

- `scripts/export-tokens.mjs`（`prebuild` 自动执行）：解析 tokens.css 四层（primitives/light/dark/starlight 桥接）→ `public/design-tokens.json`（gitignore，构建产物），部署后可通过 `/PyToTS_WEB/design-tokens.json` 访问。
- `tokens-export.test.ts` 守护解析契约（块顺序、明暗覆盖、空输入中止）。

## 4. 关键决策记录

1. **首页仍走 content 路由 + splash 模板，而不是迁移到 `src/pages/index.astro`**：Starlight 的 head 注入（OG、防白闪内联脚本、非阻塞字体）、Pagefind body 标注、Header 覆盖（SiteNav/VisitRecorder）都依赖 Starlight 页面管线；自建页面要重造这些chrome，风险大于收益。视觉自由度通过 Hero/Footer 官方覆盖点获得，够用。
2. **覆盖组件取数用 `Astro.locals.starlightRoute`，不透传 props**：Starlight 0.42 的 Page.astro 渲染覆盖组件时不透传数据 props（官方默认 Hero/Footer 同款写法）；此前读到的 `Astro.props.entry` 是旧版本源码。配套地，Footer 用到的三个虚拟组件（EditLink/LastUpdated/Pagination）在 `src/env.d.ts` 补了模块声明。
3. **搜索过滤片用中文类型值**（"课程"等）而不是英文 key：站点单语言，直接以展示文案为 filter 值，省一层映射；GROUP_ORDER 顺序即分组展示顺序。
4. **进度合并的 lastVisited 语义**：导入不覆盖"当前设备正在学的位置"——备份恢复不该把用户拽回另一台设备上次看的地方。

## 5. 遗留与后续方向

- **搜索分组 UI 的 sub-results**：默认 UI 支持的小节级深链（`showSubResults`）本次未复刻，结果粒度是页面级。若需要可基于 `result.data().sub_results` 扩展。
- **进度合并冲突提示**：当前静默合并（新者胜），不做逐条选择；若未来引入账号同步，需要在替换存储层时补冲突 UI。
- **Preparation 的 index 序列内注册**属历史例外，若某天统一口径（四条路径都不把 index 放进序列），记得同步 curriculum.test.ts 与 sidebar-order e2e 的推导。
- **英文版**：已移除（2026-09-10），若重启需要连同 CodeCompare 双语示例一起重做，工作量按"新内容"估算而不是翻译。
