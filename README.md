# PyToTS - Python 转 TypeScript 学习站

[English](./README_EN.md) | 简体中文

面向 Python 开发者的 TypeScript 学习平台。通过双语对照、实战演练和交互测验，帮助 Python 程序员快速掌握 TypeScript。

## 功能特性

- **双语对照学习**：Python 与 TypeScript 代码并列展示，直观对比语法差异
- **系统学习路径**：从基础语法到高级类型，循序渐进
- **算法实战**：26 道 LeetCode 经典题目的双语实现
- **交互测验**：200+ 练习题，即时反馈
- **面试准备**：每课配套面试追问，实战导向

## 学习路径

| 路径     | 课时 | 内容                                       |
| -------- | ---- | ------------------------------------------ |
| 基础入门 | 5 课 | 变量、控制流、数据结构、函数、类           |
| 语法迁移 | 7 课 | 模块、错误处理、枚举、字符串、异步、装饰器 |
| 进阶实战 | 8 课 | 泛型、类型守卫、工具类型、声明文件、配置   |

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

| 命令               | 说明           |
| ------------------ | -------------- |
| `npm run dev`      | 启动开发服务器 |
| `npm run build`    | 构建生产版本   |
| `npm run preview`  | 预览构建结果   |
| `npm run test`     | 运行单元测试   |
| `npm run test:e2e` | 运行 E2E 测试  |
| `npm run lint`     | 代码检查       |
| `npm run check`    | 完整质量检查   |

## 项目结构

```
src/
├── components/           # UI 组件
│   ├── QuizContainer.astro    # 测验容器
│   ├── DualCodeBlock.astro    # 双语代码块
│   └── PathNavigator.astro    # 学习路径导航
├── content/docs/         # 文档内容 (MDX)
│   ├── paths/            # 学习路径
│   │   ├── foundation/   # 基础课程
│   │   ├── migration/    # 迁移课程
│   │   └── advanced/     # 进阶课程
│   ├── algorithms/       # 算法题解
│   ├── handbook/         # 速查手册
│   └── practice/         # 练习测验
├── lib/                  # 工具库
├── pages/                # 页面路由
└── styles/               # 样式文件
```

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
