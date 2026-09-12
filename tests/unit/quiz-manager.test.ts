import { describe, expect, it, vi } from "vitest";
import { QuizManager, type QuizQuestion } from "../../src/lib/quiz-manager";

const question: QuizQuestion = {
  question: "选择正确答案",
  options: ["正确", "错误一", "错误二", "错误三"].map((text, i) => ({
    text,
    correct: i === 0,
    explanation: `解析：${text}`,
  })),
};

describe("测验选项洗牌", () => {
  it("正确答案可以出现在四个位置，解析随选项移动，共享题库不变", () => {
    const original = JSON.stringify(question);
    const positions = [0, 0.3, 0.4, 0.99].map((value) => {
      const quiz = new QuizManager([question], () => value);
      const options = quiz.getCurrentQuestion().options;
      expect(options).toHaveLength(4);
      expect(new Set(options.map((option) => option.text)).size).toBe(4);
      const position = options.findIndex((option) => option.correct);
      expect(options[position].explanation).toBe("解析：正确");
      quiz.selectOption(position);
      quiz.submitAnswer();
      quiz.submitAnswer();
      expect(quiz.getState().score).toBe(1);
      return position;
    });
    expect(new Set(positions).size).toBe(4);
    expect(JSON.stringify(question)).toBe(original);
  });

  it("作答中不重新洗牌，重新测验时才生成新顺序", () => {
    const random = vi.fn(() => 0.99);
    const quiz = new QuizManager([question], random);
    const firstOrder = quiz.getCurrentQuestion().options.map((option) => option.text);
    random.mockClear();
    quiz.selectOption(0);
    quiz.submitAnswer();
    expect(quiz.getCurrentQuestion().options.map((option) => option.text)).toEqual(firstOrder);
    expect(random).not.toHaveBeenCalled();
    quiz.nextQuestion();
    random.mockReturnValue(0);
    quiz.reset();
    expect(random).toHaveBeenCalled();
    expect(quiz.getCurrentQuestion().options.map((option) => option.text)).not.toEqual(firstOrder);
    expect(quiz.getState().score).toBe(0);
  });

  it("未选择、无效选项和完成后操作不会推进或改变成绩", () => {
    const quiz = new QuizManager([question], () => 0.99);
    quiz.nextQuestion();
    for (const index of [-1, 4, 0.5, Number.NaN]) quiz.selectOption(index);
    quiz.submitAnswer();
    expect(quiz.getState().completed).toBe(false);
    expect(quiz.getState().selectedOption).toBeNull();
    quiz.selectOption(1);
    quiz.submitAnswer();
    quiz.nextQuestion();
    quiz.selectOption(0);
    quiz.submitAnswer();
    quiz.nextQuestion();
    expect(quiz.getState().score).toBe(0);
    expect(quiz.getState().completed).toBe(true);
  });
});
