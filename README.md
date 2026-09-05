# PyToTS - Python 转 TypeScript 学习站

[English](./README_EN.md) | 简体中文

面向 Python 开发者的 TypeScript 学习平台。通过双语对照、实战演练和交互测验，帮助 Python 程序员快速掌握 TypeScript。

## 功能特性

- **双语对照学习**：Python 与 TypeScript 代码并列展示，直观对比语法差异
- **系统学习路径**：从基础语法到高级类型，循序渐进
- **算法实战**：36 道 LeetCode 经典题目的双语实现
- **交互测验**：200+ 练习题，即时反馈
- **面试准备**：每课配套面试追问，实战导向

## 学习路径

| 路径     | 课时 | 内容                                       |
| -------- | ---- | ------------------------------------------ |
| 准备入门 | 2 课 | TypeScript 简介、开发环境搭建               |
| 基础入门 | 5 课 | 变量、控制流、数据结构、函数、类               |
| 语法迁移 | 7 课 | 类型系统、函数进阶、模块、错误处理、枚举、字符串与正则、异步 |
| 进阶实战 | 8 课 | 泛型、类型守卫、工具类型、装饰器、声明文件与配置、设计模式、日期时间、Node.js 基础 |

## 快速开始

### 环境要求

- Node.js 20+
- npm

### 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:4321
```

### 常用命令

| 命令               | 说明             |
| ------------------ | ---------------- |
| `npm run dev`      | 启动开发服务器   |
| `npm run build`    | 构建生产版本     |
| `npm run preview`  | 预览构建结果     |
| `npm run test`     | 运行单元测试     |
| `npm run test:e2e` | 运行 E2E 测试    |
| `npm run lint`     | 代码检查         |
| `npm run format`   | 代码格式化检查   |
| `npm run linkcheck`| 验证内部链接     |
| `npm run check`    | 完整质量检查     |

## 项目结构

```
src/
├── components/                      # UI 组件
│   ├── SiteNav.astro                # 顶层导航（课程/题库/手册/测验/我的）
│   ├── Header.astro                 # 顶栏（标题 + 导航 + 搜索 + 主题）
│   ├── HomePaths.astro              # 路径清单（课表式，含每条进度条）
│   ├── HomeRoutes.astro             # 三条支线入口（题库/手册/测验）
│   ├── ProgressPanel.astro          # 进度与收藏面板
│   ├── CodeCompare.astro            # Python/TS 双语对照
│   ├── AlgorithmIndex.astro         # 算法题库索引（难度筛选 + 搜索）
│   ├── Pagination.astro             # 上一课/下一课、上一题/下一题
│   ├── SidebarProgress.astro        # 侧边栏学习进度
│   ├── LessonProgressMarkers.astro  # 正文链接完成标记
│   ├── DifficultyBadge.astro        # 难度徽章
│   ├── DifficultyIndex.astro        # 难度索引
│   ├── TagIndex.astro               # 标签索引
│   ├── BookmarkToggle.astro         # 收藏开关
│   ├── QuizContainer.astro          # 测验容器
│   ├── Banner.astro                 # 横幅（挂载侧边栏进度）
│   └── overrides/PageTitle.astro    # 标题元数据徽章
├── content/docs/                    # 内容 (MDX)
│   ├── paths/                       # 四条学习路径，共 22 课
│   │   ├── preparation/             # 准备路径 2 课
│   │   ├── foundation/              # 基础路径 5 课
│   │   ├── migration/               # 迁移路径 7 课
│   │   └── advanced/                # 进阶路径 8 课
│   ├── algorithms/                  # 36 道算法题
│   ├── handbook/                    # 对照手册与速查表
│   ├── practice/                    # 练习与测验
│   ├── tags/ difficulty/            # 分类索引
│   ├── bookmarks/                   # 进度与收藏
│   └── about/                       # 关于与贡献
├── lib/
│   ├── curriculum.ts                # 课程结构单一数据源（顺序、路径、课时）
│   ├── neighbours.ts                # 上一项/下一项计算
│   ├── progress-store.ts            # localStorage 进度与收藏
│   └── quiz-manager.ts              # 测验逻辑
├── pages/404.astro                  # 独立 404 页
└── styles/
    ├── tokens.css                   # 设计令牌（原始/语义/Starlight 桥接/兼容别名）
    ├── base.css                     # 排版骨架、焦点可见、动效降级
    ├── layout.css                   # 内容排版、侧边栏、目录、响应式
    ├── components.css               # 卡片、按钮、徽章、表格、分页、进度
    ├── code.css                     # 代码块与双语对照
    ├── tabs-custom.css              # 标签页
    └── home.css                     # 首页
```

### 两条维护约定

1. **课程顺序只改一处**：`src/lib/curriculum.ts`。侧边栏、上一课/下一课、首页与路径页的进度
   全部从它派生，新增或调整课程不需要分别改四个文件。
2. **内容按用户任务分组**：课程（学）→ 实战（练）→ 参考（查）→ 我的（进度）→ 关于，
   不是按文件类型分组。新增页面时先判断它属于哪个任务。

## 技术栈

- **框架**：[Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/)
- **语言**：TypeScript
- **测试**：Vitest + Playwright
- **部署**：GitHub Pages

## 在线访问

站点已部署至 GitHub Pages：

**https://muyuq.github.io/PyToTS_WEB/**

## 内容规范

### 课程结构

```
## 场景与问题
## Python 回顾
## TypeScript 等价写法
## 差异与常见陷阱
## 练习
## 面试追问
```

### 算法结构

```
## 问题描述
## 思路分析
## 复杂度分析
## Python 实现
## TypeScript 实现
## 面试变体
```

## 贡献指南

欢迎提交 Issue 和 Pull Request。

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

[MIT](./LICENSE)

---

如本项目对你有帮助，欢迎 Star 支持！

---

*最后更新: 2026-09-04*
