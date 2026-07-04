# 贡献指南

## 开发流程

本项目采用分片开发模式。每个功能点独立开发，完成后立即提交。

1. **创建分支**: `git checkout -b feat/your-feature-name`
2. **分片开发**: 每个逻辑单元完成后立即提交
3. **质量检查**: 运行 `npm run check` 确保通过
4. **提交 PR**: 创建 Pull Request 到 `main` 分支

## 代码规范

- 遵循 `AGENTS.md` 中的项目约定
- 双语内容保持格式一致（Python 在上，TypeScript 在下）
- 变量命名保持一致（如都用 `nums` 而不是 `arr`）
- 提交信息使用[约定式提交](https://www.conventionalcommits.org/)格式

## PR 审查标准

- 所有检查通过（CI 流程）
- 无 TypeScript 类型错误
- 新增内容通过 linkcheck 验证
- 测试覆盖合理

## 目录结构指南

| 内容类型 | 位置 | 说明 |
|---------|------|------|
| 算法题解 | `src/content/docs/algorithms/` | 见 `docs/algorithms-AGENTS.md` |
| 课程内容 | `src/content/docs/paths/*/` | 每课独立 MDX |
| 组件开发 | `src/components/` | Astro 组件 |
| 测验题目 | `src/components/QuizContainer.astro` | 内置题库 |
| 样式调整 | `src/styles/` | CSS 变量驱动 |
