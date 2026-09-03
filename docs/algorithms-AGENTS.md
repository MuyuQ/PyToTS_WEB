# ALGORITHMS KNOWLEDGE BASE

**Location:** `src/content/docs/algorithms/`

## OVERVIEW

36 道经典算法题的双语实现（Python + TypeScript）。每道题包含完整的问题描述、复杂度分析、两种语言的实现代码以及面试变体。

## STRUCTURE

```
algorithms/
├── index.mdx                                    # 算法目录首页
├── two-sum.mdx                                  # Easy:   哈希表
├── binary-search.mdx                            # Easy:   二分查找
├── valid-parentheses.mdx                        # Easy:   栈
├── climbing-stairs.mdx                          # Easy:   DP
├── reverse-linked-list.mdx                      # Easy:   链表
├── linked-list-cycle.mdx                        # Easy:   双指针
├── maximum-subarray.mdx                         # Easy:   DP (Kadane)
├── counting-bits.mdx                            # Easy:   位运算+DP
├── binary-tree-inorder-traversal.mdx            # Easy:   二叉树（迭代遍历）
├── single-number.mdx                            # Easy:   位运算
├── subsets.mdx                                  # Medium:  回溯
├── permutations.mdx                             # Medium:  回溯
├── merge-intervals.mdx                          # Medium:  排序+贪心
├── 3sum.mdx                                     # Medium:  双指针
├── container-with-most-water.mdx                # Medium:  双指针
├── longest-substring-without-repeating.mdx      # Medium:  滑动窗口
├── coin-change.mdx                              # Medium:  完全背包
├── house-robber.mdx                             # Medium:  DP
├── longest-increasing-subsequence.mdx           # Medium:  DP+二分
├── decode-ways.mdx                              # Medium:  DP
├── partition-equal-subset-sum.mdx               # Medium:  0-1背包
├── word-break.mdx                               # Medium:  DP
├── course-schedule.mdx                          # Medium:  拓扑排序
├── number-of-islands.mdx                        # Medium:  DFS/BFS
├── rotting-oranges.mdx                          # Medium:  BFS
├── word-search.mdx                              # Medium:  回溯
├── lru-cache.mdx                                # Medium:  哈希+双向链表
├── edit-distance.mdx                            # Medium:  DP
├── clone-graph.mdx                              # Medium:  图遍历
├── implement-trie.mdx                           # Medium:  前缀树
├── validate-bst.mdx                             # Medium:  二叉树验证
├── merge-k-sorted-lists.mdx                     # Hard:    分治/优先队列
├── longest-common-subsequence.mdx               # Medium:  DP
├── network-delay-time.mdx                       # Medium:  最短路(Dijkstra)
├── minimum-window-substring.mdx                 # Hard:    滑动窗口
└── find-median-from-data-stream.mdx             # Hard:    双堆
```

## FILE NAMING

- **格式**: `kebab-case.mdx`
- **示例**: `two-sum.mdx`, `merge-intervals.mdx`

## FRONTMATTER TEMPLATE

```yaml
---
title: 中文名 (英文名)
kind: algorithm
difficulty: easy | medium | hard
tags: ["tag1", "tag2"]
time_complexity: "O(n)" | "O(n log n)" | "O(n²)"
space_complexity: "O(n)" | "O(1)"
description: 简短描述（50字内）
---
```

## REQUIRED SECTIONS

1. `## 问题描述` - LeetCode 风格描述
2. `## 思路分析` - 算法思路
3. `## 复杂度分析` - 时间/空间复杂度
4. `## Python 实现` - 完整代码
5. `## TypeScript 实现` - 完整代码
6. `## 面试变体` - 常见追问
7. `## 常见错误` - 易错点

## CODE STYLE

### Python

- 类型注解：`def func(n: int) -> int:`
- 注释: `# 注释内容`
- 类方法: `def method(self) -> None:`

### TypeScript

- 显式类型：`function func(n: number): number`
- 注释: `// 注释内容`
- 接口/类型：适当使用

## DIFFICULTY DISTRIBUTION

- **Easy**: 10 题 (基础数据结构、位运算、二叉树遍历)
- **Medium**: 22 题 (主流面试难度)
- **Hard**: 4 题 (高级技巧：分治/优先队列、滑动窗口、双堆、编辑距离)

## TOPIC COVERAGE

| 主题              | 题目数 |
| ----------------- | ------ |
| 数组/双指针       | 6      |
| 动态规划          | 9      |
| 链表              | 2      |
| 字符串/滑动窗口   | 3      |
| 图/BFS/DFS/最短路 | 5      |
| 设计/数据结构     | 3      |
| 回溯/排列组合     | 3      |
| 位运算            | 2      |
| 二叉树            | 2      |
| 前缀树            | 1      |

## NOTES

- 所有代码必须能在本地运行通过
- Python 使用标准库，TypeScript 无额外依赖
- 面试变体部分要实用，贴近真实面试场景
- 保持双语代码结构一致（变量名、逻辑流程）
