import { QuizManager, type QuizOption } from "./quiz-manager";
import { questionsFor } from "../data/quizzes";
import { saveQuizResult } from "./progress-store";

/**
 * 测验的客户端交互（渲染 / 判分 / 结果）
 *
 * 题库从 src/data/quizzes.ts 直接 import（构建期随 bundle 打包一份），
 * 页面只携带 quizId——原先 21 份 JSON.stringify 进 HTML 属性的方案让
 * 测验页膨胀到 160KB。
 */

/** 初始化（或重新初始化）页面上的全部测验容器 */
export function initQuizContainers(root: ParentNode = document): void {
  const containers = root.querySelectorAll(".quiz-container[data-quiz-id]");

  containers.forEach((container) => {
    const quizId = container.getAttribute("data-quiz-id");
    if (!quizId) return;

    // questionsFor 对未知 quizId 返回空数组；组件侧已为空题渲染占位（无 data-quiz-id），
    // 这里再兜底一次，保证 quizId 悬空时静默跳过而不是渲染空壳
    const questions = questionsFor(quizId);
    if (questions.length === 0) return;

    const quiz = new QuizManager(questions);
    initializeQuizUI(container as HTMLElement, quiz);
  });
}

function initializeQuizUI(container: HTMLElement, quiz: QuizManager) {
  const questionEl = container.querySelector(".quiz-question") as HTMLElement;
  const optionsEl = container.querySelector(".quiz-options") as HTMLElement;
  const progressEl = container.querySelector(".quiz-progress") as HTMLElement;
  const actionBtn = container.querySelector(".quiz-action-btn") as HTMLButtonElement;
  const explanationEl = container.querySelector(".quiz-explanation") as HTMLElement;
  const resultEl = container.querySelector(".quiz-result") as HTMLElement;

  function buildIndicator(index: number) {
    const indicator = document.createElement("span");
    indicator.className = "option-indicator";
    indicator.setAttribute("aria-hidden", "true");
    indicator.textContent = String.fromCharCode(65 + index);
    return indicator;
  }

  /** 题干代码片段：Python 暖黄 / TypeScript 冷蓝的语言色条与正文代码块同源 */
  function buildCodeSnippet(lang: "python" | "typescript", code: string): HTMLElement {
    const wrap = document.createElement("div");
    wrap.className = `quiz-snippet quiz-snippet--${lang}`;

    const tag = document.createElement("span");
    tag.className = "quiz-snippet__lang";
    tag.textContent = lang === "python" ? "Python" : "TypeScript";

    const pre = document.createElement("pre");
    const codeEl = document.createElement("code");
    codeEl.textContent = code;
    pre.appendChild(codeEl);

    wrap.append(tag, pre);
    return wrap;
  }

  /** 预测题选项的展示文案：强调的预期输出 + 文字说明（数据侧已结构化为 expected/text 字段） */
  function predictionOptionText(option: QuizOption): HTMLElement {
    const textEl = document.createElement("span");
    textEl.className = "option-text";

    const label = document.createElement("strong");
    label.textContent = "预测输出:";
    const expected = document.createElement("code");
    expected.textContent = option.expected ?? "";
    textEl.append(label, expected);

    if (option.text) {
      const tail = document.createElement("em");
      tail.textContent = ` - ${option.text}`;
      textEl.append(tail);
    }
    return textEl;
  }

  /**
   * roving tabindex：radiogroup 里 Tab 只停一处（选中项，未选时停首项），
   * 方向键在选项间移动并随焦点选中（原生 radio 语义）。
   */
  function syncOptionTabbability() {
    const buttons = [...optionsEl.querySelectorAll<HTMLButtonElement>(".quiz-option")];
    const selectedIdx = buttons.findIndex((b) => b.classList.contains("selected"));
    const tabStop = selectedIdx === -1 ? 0 : selectedIdx;
    buttons.forEach((btn, i) => {
      btn.tabIndex = i === tabStop ? 0 : -1;
    });
  }

  function handleOptionKeydown(e: KeyboardEvent, index: number) {
    if (quiz.getState().showExplanation) return;

    const count = quiz.getCurrentQuestion().options.length;
    let target: number;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") target = (index + 1) % count;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") target = (index - 1 + count) % count;
    else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      quiz.selectOption(index);
      render();
      return;
    } else {
      return;
    }

    e.preventDefault();
    quiz.selectOption(target);
    render();
    optionsEl.querySelectorAll<HTMLButtonElement>(".quiz-option")[target]?.focus();
  }

  function buildOptionButton(
    option: QuizOption,
    index: number,
    isPrediction: boolean,
    currentSelected: number | null,
    answered: boolean
  ): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quiz-option";
    btn.appendChild(buildIndicator(index));

    // 预测题选项渲染为「预测输出: X - 说明」，屏幕阅读器标签与可见文本保持一致
    const isStructuredPrediction = isPrediction && option.expected !== undefined;
    let textEl: HTMLElement;
    let labelText: string;
    if (isStructuredPrediction) {
      textEl = predictionOptionText(option);
      labelText = option.text
        ? `预测输出: ${option.expected} - ${option.text}`
        : `预测输出: ${option.expected}`;
    } else {
      textEl = document.createElement("span");
      textEl.className = "option-text";
      textEl.textContent = option.text;
      labelText = option.text;
    }
    btn.appendChild(textEl);

    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", currentSelected === index ? "true" : "false");
    btn.setAttribute("aria-label", `选项 ${index + 1}: ${labelText}`);

    if (currentSelected === index) {
      btn.classList.add("selected");
    }

    if (answered) {
      // 不再用 disabled：从 tab 序消失会让屏幕阅读器拿不到「正确答案」标注
      btn.setAttribute("aria-disabled", "true");
      if (option.correct) {
        btn.classList.add("correct");
        btn.setAttribute("aria-label", `选项 ${index + 1}: ${labelText} - 正确答案`);
      } else if (currentSelected === index) {
        btn.classList.add("incorrect");
        btn.setAttribute("aria-label", `选项 ${index + 1}: ${labelText} - 回答错误`);
      }
    }

    btn.addEventListener("click", () => {
      if (quiz.getState().showExplanation) return;
      quiz.selectOption(index);
      render();
    });

    btn.addEventListener("keydown", (e) => handleOptionKeydown(e, index));

    return btn;
  }

  function render() {
    const state = quiz.getState();
    const questions = quiz.getQuestions();

    if (state.completed) {
      showResults();
      return;
    }

    const currentQ = quiz.getCurrentQuestion();

    // Update progress
    progressEl.textContent = `问题 ${state.currentQuestion + 1} / ${questions.length}`;

    // 预测题以类型字段判定（quiz-data 契约测试保证与「【预测输出】」标记双向一致）
    const isPredictionQuestion = currentQ.questionType === "prediction";

    // Update question text
    questionEl.innerHTML = "";

    if (isPredictionQuestion) {
      // Create question header (excluding the marker)
      const questionText = document.createElement("p");
      const cleanQuestion = currentQ.question.replace("【预测输出】", "").trim();
      questionText.textContent = cleanQuestion;
      questionEl.appendChild(questionText);

      // Add a label indicating this is a prediction question
      const predictionLabel = document.createElement("div");
      predictionLabel.className = "quiz-prediction-label";
      predictionLabel.textContent = "预测输出题目：先在心里运行代码，再选答案。";
      questionEl.appendChild(predictionLabel);
    } else {
      // Normal question
      questionEl.textContent = currentQ.question;
    }

    // 题目自带的代码片段（预测输出题的题干）：Python 在上、TypeScript 在下，与正文对照一致
    const snippets = currentQ.codeSnippets;
    if (snippets?.python) questionEl.appendChild(buildCodeSnippet("python", snippets.python));
    if (snippets?.typescript) {
      questionEl.appendChild(buildCodeSnippet("typescript", snippets.typescript));
    }

    // Update options
    optionsEl.innerHTML = "";
    currentQ.options.forEach((option, index) => {
      optionsEl.appendChild(
        buildOptionButton(
          option,
          index,
          isPredictionQuestion,
          state.selectedOption,
          state.showExplanation
        )
      );
    });
    syncOptionTabbability();

    // Update action button
    if (state.showExplanation) {
      actionBtn.textContent = state.currentQuestion < questions.length - 1 ? "下一题" : "查看结果";
      actionBtn.setAttribute(
        "aria-label",
        state.currentQuestion < questions.length - 1 ? "进入下一题" : "查看测验结果"
      );
      actionBtn.onclick = () => {
        quiz.nextQuestion();
        render();
        // 自动聚焦到新问题的当前 tab stop（未选时为首项）
        const tabStop = optionsEl.querySelector<HTMLButtonElement>('.quiz-option[tabindex="0"]');
        if (tabStop && !quiz.getState().showExplanation) {
          tabStop.focus();
        }
      };
    } else {
      actionBtn.textContent = "提交答案";
      actionBtn.setAttribute("aria-label", "提交答案");
      actionBtn.disabled = state.selectedOption === null;
      actionBtn.onclick = () => {
        quiz.submitAnswer();
        render();
        // 自动聚焦到解释区域
        if (explanationEl.style.display !== "none") {
          explanationEl.focus();
        }
      };
    }

    // Show explanation
    if (state.showExplanation && state.selectedOption !== null) {
      const currentQ = quiz.getCurrentQuestion();
      const selectedOption = currentQ.options[state.selectedOption];

      const header = document.createElement("div");
      header.className = `explanation-header ${selectedOption.correct ? "correct" : "incorrect"}`;
      header.textContent = selectedOption.correct ? "✓ 回答正确" : "✗ 回答错误";

      const content = document.createElement("div");
      content.className = "explanation-content";
      content.textContent = selectedOption.explanation;

      explanationEl.replaceChildren(header, content);
      explanationEl.classList.toggle("correct", selectedOption.correct);
      explanationEl.classList.toggle("incorrect", !selectedOption.correct);
      explanationEl.style.display = "block";
    } else {
      explanationEl.classList.remove("correct", "incorrect");
      explanationEl.style.display = "none";
    }

    resultEl.style.display = "none";
  }

  function showResults() {
    const state = quiz.getState();
    const questions = quiz.getQuestions();
    const percentage = Math.round((state.score / questions.length) * 100);

    // 保存测验结果（顶层 ESM import：浏览器脚本无 require）
    try {
      const quizId = container.getAttribute("data-quiz-id");
      if (quizId) {
        saveQuizResult(quizId, state.score, questions.length);
      }
    } catch (e) {
      console.error("Failed to save quiz result:", e);
    }

    // 发送分析事件
    try {
      const analytics = window as unknown as {
        plausible?: (
          event: string,
          data?: { props?: Record<string, string | number | null> }
        ) => void;
      };
      if (typeof window !== "undefined" && analytics.plausible) {
        analytics.plausible("Quiz Completed", {
          props: {
            quiz_id: container.getAttribute("data-quiz-id"),
            score: state.score,
            total: questions.length,
            percentage: percentage,
          },
        });
      }
    } catch {
      // Plausible 可能未加载
    }

    questionEl.style.display = "none";
    optionsEl.style.display = "none";
    progressEl.style.display = "none";
    actionBtn.style.display = "none";
    explanationEl.style.display = "none";

    let message = "";
    if (percentage >= 80) {
      message = "太棒了！你对 Python 到 TypeScript 的迁移掌握得很好！";
    } else if (percentage >= 60) {
      message = "不错的成绩！继续加油，还有一些细节可以改进。";
    } else {
      message = "建议重新复习对应的学习路径，巩固基础知识。";
    }

    resultEl.innerHTML = `
      <div class="quiz-result-header">测验完成！</div>
      <div class="quiz-result-score">${state.score} / ${questions.length}</div>
      <div class="quiz-result-percentage">${percentage}%</div>
      <div class="quiz-result-message">${message}</div>
      <button class="quiz-restart-btn">重新测验</button>
    `;
    resultEl.style.display = "block";

    const restartBtn = resultEl.querySelector(".quiz-restart-btn") as HTMLButtonElement;
    restartBtn.onclick = () => {
      quiz.reset();
      questionEl.style.display = "block";
      optionsEl.style.display = "flex";
      progressEl.style.display = "block";
      actionBtn.style.display = "block";
      render();
    };
  }

  render();
}
