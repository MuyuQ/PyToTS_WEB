import { describe, it, expect, beforeEach } from "vitest";
import { QuizManager } from "../../../src/lib/quiz-manager";
import { initQuizContainers } from "../../../src/lib/quiz-ui";
import { questionsFor } from "../../../src/data/quizzes";
import { getProgress } from "../../../src/lib/progress-store";

/**
 * 直接测真实模块：quiz-manager（状态机）、quiz-ui（渲染/交互/判分）、
 * data/quizzes（真实题库）、progress-store（成绩持久化）。
 * DOM 骨架与 QuizContainer.astro 的服务端模板一致（quizId 挂在 data 属性上，
 * 题目数据由 quiz-ui 从题库模块自行 import，不再走 HTML 属性）。
 *
 * 历史教训：本文件曾复制一份 QuizManager 进测试来跑「全绿」，而真实的
 * quiz-manager/quiz-ui 零覆盖——改坏真实现象这里毫无反应。
 */

const QUESTIONS = questionsFor("variables");

/** 与 QuizContainer.astro 模板一致的容器骨架 */
function mountContainer(quizId: string): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = `
    <div class="quiz-container" data-quiz-id="${quizId}" role="region" aria-label="编程测验" tabindex="-1">
      <div class="quiz-header">
        <span class="quiz-progress" aria-live="polite"></span>
      </div>
      <div class="quiz-question" role="heading" aria-level="3"></div>
      <div class="quiz-options" role="radiogroup" aria-label="选项"></div>
      <div class="quiz-explanation" style="display: none;" aria-live="polite" aria-atomic="true" tabindex="-1"></div>
      <div class="quiz-actions">
        <button class="quiz-action-btn" disabled aria-label="提交答案">提交答案</button>
      </div>
      <div class="quiz-result" style="display: none;" role="region" aria-label="测验结果"></div>
    </div>`;
  document.body.appendChild(host);
  return host.querySelector(".quiz-container") as HTMLElement;
}

function options(container: HTMLElement): HTMLButtonElement[] {
  return [...container.querySelectorAll<HTMLButtonElement>(".quiz-option")];
}

function actionBtn(container: HTMLElement): HTMLButtonElement {
  return container.querySelector(".quiz-action-btn") as HTMLButtonElement;
}

describe("QuizManager（src/lib/quiz-manager.ts 状态机）", () => {
  it("题库 variables 存在且每题恰好一个正确答案", () => {
    expect(QUESTIONS.length).toBeGreaterThan(0);
    for (const q of QUESTIONS) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.options.filter((o) => o.correct)).toHaveLength(1);
    }
  });

  it("初始化状态", () => {
    const quiz = new QuizManager(QUESTIONS);
    expect(quiz.getState()).toEqual({
      currentQuestion: 0,
      selectedOption: null,
      showExplanation: false,
      score: 0,
      completed: false,
    });
  });

  it("未选择时提交是 no-op，选择后提交展示解释并计分", () => {
    const quiz = new QuizManager(QUESTIONS);
    quiz.submitAnswer();
    expect(quiz.getState().showExplanation).toBe(false);

    const correctIdx = QUESTIONS[0].options.findIndex((o) => o.correct);
    quiz.selectOption(correctIdx);
    quiz.submitAnswer();
    expect(quiz.getState().showExplanation).toBe(true);
    expect(quiz.getState().score).toBe(1);

    // 提交后选择被锁定
    quiz.selectOption(0);
    expect(quiz.getState().selectedOption).toBe(correctIdx);
  });

  it("nextQuestion 推进并在末题后标记 completed", () => {
    const quiz = new QuizManager(QUESTIONS);
    for (let i = 0; i < QUESTIONS.length; i++) {
      quiz.selectOption(0);
      quiz.submitAnswer();
      quiz.nextQuestion();
    }
    expect(quiz.getState().completed).toBe(true);
  });

  it("reset 复位全部状态", () => {
    const quiz = new QuizManager(QUESTIONS);
    quiz.selectOption(0);
    quiz.submitAnswer();
    quiz.nextQuestion();
    quiz.reset();
    expect(quiz.getState()).toEqual({
      currentQuestion: 0,
      selectedOption: null,
      showExplanation: false,
      score: 0,
      completed: false,
    });
  });
});

describe("initQuizContainers（src/lib/quiz-ui.ts 渲染与交互）", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
  });

  it("从题库渲染第一题：题干、选项、进度", () => {
    const container = mountContainer("variables");
    initQuizContainers();

    expect(container.querySelector(".quiz-question")?.textContent).toContain(QUESTIONS[0].question);
    expect(options(container)).toHaveLength(QUESTIONS[0].options.length);
    expect(container.querySelector(".quiz-progress")?.textContent).toBe(
      `问题 1 / ${QUESTIONS.length}`
    );
  });

  it("roving tabindex：Tab 停靠唯一，且随选中项移动", () => {
    const container = mountContainer("variables");
    initQuizContainers();

    expect(options(container).filter((b) => b.tabIndex === 0)).toHaveLength(1);
    expect(options(container)[0].tabIndex).toBe(0);

    options(container)[1].click();
    // 点击触发 render 重建全部选项节点，断言前必须重查
    const btns = options(container);
    expect(btns[1].tabIndex).toBe(0);
    expect(btns[0].tabIndex).toBe(-1);
  });

  it("方向键在选项间移动、随焦点选中（原生 radio 语义）", () => {
    const container = mountContainer("variables");
    initQuizContainers();

    options(container)[0].focus();
    options(container)[0].dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })
    );

    const btns = options(container);
    expect(btns[1].getAttribute("aria-checked")).toBe("true");
    expect(document.activeElement).toBe(btns[1]);
    expect(btns[1].tabIndex).toBe(0);
  });

  it("aria-checked 反映选中，且不出现 radio 不支持的 aria-selected", () => {
    const container = mountContainer("variables");
    initQuizContainers();

    options(container)[0].click();
    const btns = options(container);
    expect(btns[0].getAttribute("aria-checked")).toBe("true");
    for (const btn of btns) {
      expect(btn.hasAttribute("aria-selected")).toBe(false);
    }
  });

  it("提交后：选项用 aria-disabled 而非 disabled（留在 tab 序），解释区是 polite live region 且无 role=alert", () => {
    const container = mountContainer("variables");
    initQuizContainers();

    options(container)[0].click();
    actionBtn(container).click();

    const btns = options(container);
    expect(btns.every((b) => b.getAttribute("aria-disabled") === "true")).toBe(true);
    expect(btns.some((b) => b.disabled)).toBe(false);

    const explanation = container.querySelector(".quiz-explanation") as HTMLElement;
    expect(explanation.style.display).toBe("block");
    expect(explanation.getAttribute("aria-live")).toBe("polite");
    expect(explanation.getAttribute("role")).toBeNull();

    // 正确答案要能被屏幕阅读器读到
    const correctBtn = btns[QUESTIONS[0].options.findIndex((o) => o.correct)];
    expect(correctBtn.classList.contains("correct")).toBe(true);
    expect(correctBtn.getAttribute("aria-label")).toContain("正确答案");
  });

  it("答完整套题：渲染结果并把成绩写入 localStorage", () => {
    const container = mountContainer("variables");
    initQuizContainers();

    // 每题两个动作（选择 + 提交/下一题），留足余量
    for (let i = 0; i <= QUESTIONS.length * 2 + 2; i++) {
      options(container)[0].click();
      actionBtn(container).click();
      if (actionBtn(container).textContent === "查看结果") {
        actionBtn(container).click();
        break;
      }
    }

    const result = container.querySelector(".quiz-result") as HTMLElement;
    expect(result.style.display).toBe("block");
    expect(getProgress().quizzes.some((q) => q.quizId === "variables")).toBe(true);
  });

  it("重新测验：结果页重启后回到第一题并清空选择", () => {
    const container = mountContainer("variables");
    initQuizContainers();

    for (let i = 0; i <= QUESTIONS.length * 2 + 2; i++) {
      options(container)[0].click();
      actionBtn(container).click();
      if (actionBtn(container).textContent === "查看结果") {
        actionBtn(container).click();
        break;
      }
    }

    const restart = container.querySelector<HTMLButtonElement>(".quiz-restart-btn");
    expect(restart).toBeTruthy();
    restart!.click();

    expect((container.querySelector(".quiz-progress") as HTMLElement).textContent).toBe(
      `问题 1 / ${QUESTIONS.length}`
    );
    expect(options(container)).toHaveLength(QUESTIONS[0].options.length);
    const btns = options(container);
    expect(btns.every((b) => b.classList.contains("selected"))).toBe(false);
    expect(btns.filter((b) => b.tabIndex === 0)).toHaveLength(1);
  });

  it("重复初始化不叠加渲染（astro:page-load 复跑安全）", () => {
    const container = mountContainer("variables");
    initQuizContainers();
    initQuizContainers();
    expect(options(container)).toHaveLength(QUESTIONS[0].options.length);
  });

  it("预测题：渲染代码片段与「预测输出: X - 说明」结构化文案", () => {
    const container = mountContainer("prediction");
    initQuizContainers();

    const question = container.querySelector(".quiz-question") as HTMLElement;
    expect(question.querySelector(".quiz-snippet--python")).toBeTruthy();
    expect(question.querySelector(".quiz-prediction-label")).toBeTruthy();

    const btns = options(container);
    const first = btns[0].querySelector(".option-text");
    expect(first?.querySelector("strong")?.textContent).toBe("预测输出:");
    expect(first?.querySelector("code")?.textContent).toBeTruthy();
  });

  it("未知 quizId：容器保持空壳（服务端已渲染占位的场景）", () => {
    mountContainer("no-such-quiz");
    initQuizContainers();
    expect(document.querySelectorAll(".quiz-option")).toHaveLength(0);
  });
});
