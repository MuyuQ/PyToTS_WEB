/**
 * 测验题库的数据契约
 *
 * 拆分自 QuizContainer.astro（997 行内联数据 → src/data/quizzes.ts）。
 * 数据一旦独立成文件，就必须有契约守住：坏一行数据，构建期就报出来，
 * 而不是等用户做到一半发现选项是 undefined。
 */
import { describe, expect, it } from "vitest";
import { QUIZZES, questionsFor, quizIds } from "../../src/data/quizzes";

const CORRECT_PER_QUESTION = 1;
const OPTIONS_PER_QUESTION = 4;

describe("quiz data contract", () => {
  it("每个测验都有题目", () => {
    for (const id of quizIds()) {
      const questions = QUIZZES[id];
      expect(questions, `测验 ${id} 不应为空`).not.toHaveLength(0);
    }
  });

  it("每题 4 个选项，且恰好 1 个正确答案", () => {
    for (const id of quizIds()) {
      for (const [index, question] of QUIZZES[id].entries()) {
        const label = `${id}[${index}] ${question.question.slice(0, 24)}…`;
        expect(question.options, label).toHaveLength(OPTIONS_PER_QUESTION);
        const correctCount = question.options.filter((o) => o.correct).length;
        expect(correctCount, label).toBe(CORRECT_PER_QUESTION);
      }
    }
  });

  it("每个选项都有题面文本和解析", () => {
    for (const id of quizIds()) {
      for (const question of QUIZZES[id]) {
        for (const option of question.options) {
          expect(option.text.trim(), `测验 ${id} 选项文本缺失`).not.toBe("");
          expect(option.explanation.trim(), `测验 ${id} 选项解析缺失`).not.toBe("");
        }
      }
    }
  });

  it("预测输出题必须带代码片段（题干说「预测以下代码」却没有代码，用户无从作答）", () => {
    for (const id of quizIds()) {
      for (const question of QUIZZES[id]) {
        if (question.question.includes("【预测输出】")) {
          expect(
            question.codeSnippets,
            `测验 ${id} 的预测题缺 codeSnippets：${question.question.slice(0, 30)}…`
          ).toBeDefined();
          expect(
            question.codeSnippets?.python ?? question.codeSnippets?.typescript,
            `测验 ${id} 的预测题代码片段为空`
          ).toBeTruthy();
          expect(question.questionType).toBe("prediction");
        }
      }
    }
  });

  it("questionType=prediction 的题必须带【预测输出】标记（渲染器按类型字段判定，两处脱节会被静默当成普通选择题）", () => {
    for (const id of quizIds()) {
      for (const question of QUIZZES[id]) {
        if (question.questionType === "prediction") {
          expect(
            question.question.includes("【预测输出】"),
            `测验 ${id} 标记为预测题但题干缺「【预测输出」标记：${question.question.slice(0, 30)}…`
          ).toBe(true);
          expect(
            question.codeSnippets,
            `测验 ${id} 的预测题缺 codeSnippets：${question.question.slice(0, 30)}…`
          ).toBeDefined();
        }
      }
    }
  });

  it("预测题选项遵循【预期:…】编码协议（quiz-ui 据此解析加粗预测输出）", () => {
    for (const id of quizIds()) {
      for (const question of QUIZZES[id]) {
        if (question.questionType !== "prediction") continue;
        for (const option of question.options) {
          expect(
            option.text.includes("【预期:"),
            `测验 ${id} 预测题选项缺「【预期:」标记：${option.text.slice(0, 24)}…`
          ).toBe(true);
        }
      }
    }
  });

  it("questionsFor 对未知 id 返回空数组而非抛错", () => {
    expect(questionsFor("no-such-quiz")).toEqual([]);
    expect(questionsFor(quizIds()[0] ?? "").length).toBeGreaterThan(0);
  });
});
