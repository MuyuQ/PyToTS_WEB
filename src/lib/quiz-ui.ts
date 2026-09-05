import { QuizManager, type QuizOption, type QuizQuestion } from "./quiz-manager";
import { saveQuizResult } from "./progress-store";

/**
 * 测验的客户端交互（渲染 / 判分 / 结果）
 *
 * 原先整段内联在 QuizContainer.astro 的 <script> 里，无法被单测覆盖。
 * 抽成模块后由组件调用 initQuizContainers()。
 */

/** 初始化（或重新初始化）页面上的全部测验容器 */
export function initQuizContainers(root: ParentNode = document): void {
  const containers = root.querySelectorAll(".quiz-container[data-quiz-id]");

  containers.forEach((container) => {
    const questionsData = container.getAttribute("data-questions");
    if (!questionsData) return;

    let questions: QuizQuestion[];
    try {
      questions = JSON.parse(questionsData);
    } catch {
      console.error("Failed to parse quiz questions");
      return;
    }

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

    // Check if this is a prediction question (based on presence of special keywords)
    const isPredictionQuestion = currentQ.question.includes("【预测输出】");

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

    // Get current selected option (may be null if none selected)
    const currentSelected = state.selectedOption;

    // Update options
    optionsEl.innerHTML = "";

    if (isPredictionQuestion) {
      // Render prediction question options specially
      currentQ.options.forEach((option: QuizOption, index: number) => {
        const btn = document.createElement("button");
        btn.className = "quiz-option";
        btn.appendChild(buildIndicator(index));

        const textEl = document.createElement("span");
        textEl.className = "option-text";
        // Show the expected output in bold and description
        if (option.text.includes("【预期:")) {
          // Extract and format expected output from specially formatted text
          const textParts = option.text.split("】");
          const expectedValue = textParts[0].replace("【预期:", "");
          const desc = textParts.slice(1).join("】");

          textEl.innerHTML = `<strong>预测输出:</strong> ${expectedValue} - <em>${desc}</em>`;
        } else {
          textEl.textContent = option.text;
        }
        btn.appendChild(textEl);

        btn.setAttribute("role", "radio");
        btn.setAttribute("aria-checked", currentSelected === index ? "true" : "false");
        btn.setAttribute("aria-label", `选项 ${index + 1}: ${option.text}`);
        btn.setAttribute("tabindex", "0");

        if (currentSelected === index) {
          btn.classList.add("selected");
          btn.setAttribute("aria-selected", "true");
        }

        if (state.showExplanation) {
          btn.disabled = true;
          btn.setAttribute("aria-disabled", "true");
          if (option.correct) {
            btn.classList.add("correct");
            btn.setAttribute("aria-label", `选项 ${index + 1}: ${option.text} - 正确答案`);
          } else if (currentSelected === index) {
            btn.classList.add("incorrect");
            btn.setAttribute("aria-label", `选项 ${index + 1}: ${option.text} - 回答错误`);
          }
        }

        btn.addEventListener("click", () => {
          quiz.selectOption(index);
          render();
        });

        btn.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            quiz.selectOption(index);
            render();
          }
        });

        optionsEl.appendChild(btn);
      });
    } else {
      // Original rendering logic for multiple choice questions
      currentQ.options.forEach((option: QuizOption, index: number) => {
        const btn = document.createElement("button");
        btn.className = "quiz-option";
        btn.appendChild(buildIndicator(index));

        const textEl = document.createElement("span");
        textEl.className = "option-text";
        textEl.textContent = option.text;
        btn.appendChild(textEl);
        btn.setAttribute("role", "radio");
        btn.setAttribute("aria-checked", currentSelected === index ? "true" : "false");
        btn.setAttribute("aria-label", `选项 ${index + 1}: ${option.text}`);
        btn.setAttribute("tabindex", "0");

        if (currentSelected === index) {
          btn.classList.add("selected");
          btn.setAttribute("aria-selected", "true");
        }

        if (state.showExplanation) {
          btn.disabled = true;
          btn.setAttribute("aria-disabled", "true");
          if (option.correct) {
            btn.classList.add("correct");
            btn.setAttribute("aria-label", `选项 ${index + 1}: ${option.text} - 正确答案`);
          } else if (currentSelected === index) {
            btn.classList.add("incorrect");
            btn.setAttribute("aria-label", `选项 ${index + 1}: ${option.text} - 回答错误`);
          }
        }

        btn.addEventListener("click", () => {
          quiz.selectOption(index);
          render();
        });

        btn.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            quiz.selectOption(index);
            render();
          }
        });

        optionsEl.appendChild(btn);
      });
    }

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
        // 自动聚焦到新问题的第一个选项
        const firstOption = container.querySelector(".quiz-option") as HTMLElement;
        if (firstOption && !quiz.getState().showExplanation) {
          firstOption.focus();
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
      explanationEl.innerHTML = `
        <div class="explanation-header ${selectedOption.correct ? "correct" : "incorrect"}">
          ${selectedOption.correct ? "✓ 回答正确" : "✗ 回答错误"}
        </div>
        <div class="explanation-content">${selectedOption.explanation}</div>
      `;
      explanationEl.style.display = "block";
    } else {
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
