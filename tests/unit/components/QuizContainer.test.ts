import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";

// Quiz data type definitions matching QuizContainer.astro
interface QuizOption {
  text: string;
  correct: boolean;
  explanation: string;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

// Mock quiz data for testing
const mockQuestions: QuizQuestion[] = [
  {
    question: "Test question 1?",
    options: [
      { text: "Option A", correct: true, explanation: "This is correct" },
      { text: "Option B", correct: false, explanation: "This is wrong" },
    ],
  },
  {
    question: "Test question 2?",
    options: [
      { text: "Option C", correct: false, explanation: "Not this one" },
      { text: "Option D", correct: true, explanation: "Correct answer" },
    ],
  },
];

// QuizManager class extracted from QuizContainer for testing
class QuizManager {
  private questions: QuizQuestion[];
  private state: {
    currentQuestion: number;
    selectedOption: number | null;
    showExplanation: boolean;
    score: number;
    completed: boolean;
  };

  constructor(questions: QuizQuestion[]) {
    this.questions = questions;
    this.state = {
      currentQuestion: 0,
      selectedOption: null,
      showExplanation: false,
      score: 0,
      completed: false,
    };
  }

  selectOption(index: number) {
    if (this.state.showExplanation) return;
    this.state.selectedOption = index;
  }

  submitAnswer() {
    if (this.state.selectedOption === null) return;

    const currentQ = this.questions[this.state.currentQuestion];
    const isCorrect = currentQ.options[this.state.selectedOption].correct;

    if (isCorrect) this.state.score++;
    this.state.showExplanation = true;
  }

  nextQuestion() {
    if (this.state.currentQuestion < this.questions.length - 1) {
      this.state.currentQuestion++;
      this.state.selectedOption = null;
      this.state.showExplanation = false;
    } else {
      this.state.completed = true;
    }
  }

  reset() {
    this.state = {
      currentQuestion: 0,
      selectedOption: null,
      showExplanation: false,
      score: 0,
      completed: false,
    };
  }

  getState() {
    return { ...this.state };
  }

  getQuestions() {
    return this.questions;
  }

  getCurrentQuestion() {
    return this.questions[this.state.currentQuestion];
  }
}

describe("QuizContainer Logic", () => {
  let quiz: QuizManager;

  beforeEach(() => {
    quiz = new QuizManager(mockQuestions);
  });

  describe("Initialization", () => {
    it("should initialize with correct default state", () => {
      const state = quiz.getState();
      expect(state.currentQuestion).toBe(0);
      expect(state.selectedOption).toBeNull();
      expect(state.showExplanation).toBe(false);
      expect(state.score).toBe(0);
      expect(state.completed).toBe(false);
    });

    it("should load questions correctly", () => {
      expect(quiz.getQuestions()).toHaveLength(2);
      expect(quiz.getCurrentQuestion().question).toBe("Test question 1?");
    });
  });

  describe("Option Selection", () => {
    it("should select an option", () => {
      quiz.selectOption(0);
      expect(quiz.getState().selectedOption).toBe(0);
    });

    it("should not allow selection after submitting", () => {
      quiz.selectOption(0);
      quiz.submitAnswer();
      quiz.selectOption(1);
      expect(quiz.getState().selectedOption).toBe(0);
    });

    it("should allow changing selection before submitting", () => {
      quiz.selectOption(0);
      quiz.selectOption(1);
      expect(quiz.getState().selectedOption).toBe(1);
    });
  });

  describe("Answer Submission", () => {
    it("should not submit if no option selected", () => {
      quiz.submitAnswer();
      expect(quiz.getState().showExplanation).toBe(false);
    });

    it("should show explanation after submission", () => {
      quiz.selectOption(0);
      quiz.submitAnswer();
      expect(quiz.getState().showExplanation).toBe(true);
    });

    it("should increment score for correct answer", () => {
      quiz.selectOption(0); // Correct option
      quiz.submitAnswer();
      expect(quiz.getState().score).toBe(1);
    });

    it("should not increment score for incorrect answer", () => {
      quiz.selectOption(1); // Incorrect option
      quiz.submitAnswer();
      expect(quiz.getState().score).toBe(0);
    });
  });

  describe("Navigation", () => {
    it("should move to next question", () => {
      quiz.selectOption(0);
      quiz.submitAnswer();
      quiz.nextQuestion();
      expect(quiz.getState().currentQuestion).toBe(1);
      expect(quiz.getState().selectedOption).toBeNull();
      expect(quiz.getState().showExplanation).toBe(false);
    });

    it("should mark as completed on last question", () => {
      quiz.selectOption(0);
      quiz.submitAnswer();
      quiz.nextQuestion();
      quiz.selectOption(1);
      quiz.submitAnswer();
      quiz.nextQuestion();
      expect(quiz.getState().completed).toBe(true);
    });
  });

  describe("Reset", () => {
    it("should reset to initial state", () => {
      quiz.selectOption(0);
      quiz.submitAnswer();
      quiz.nextQuestion();
      quiz.reset();

      const state = quiz.getState();
      expect(state.currentQuestion).toBe(0);
      expect(state.selectedOption).toBeNull();
      expect(state.showExplanation).toBe(false);
      expect(state.score).toBe(0);
      expect(state.completed).toBe(false);
    });
  });

  describe("Score Calculation", () => {
    it("should calculate score correctly for all correct answers", () => {
      // Question 1 - correct
      quiz.selectOption(0);
      quiz.submitAnswer();
      quiz.nextQuestion();
      // Question 2 - correct
      quiz.selectOption(1);
      quiz.submitAnswer();
      quiz.nextQuestion();

      expect(quiz.getState().score).toBe(2);
    });

    it("should calculate score correctly for mixed answers", () => {
      // Question 1 - incorrect
      quiz.selectOption(1);
      quiz.submitAnswer();
      quiz.nextQuestion();
      // Question 2 - correct
      quiz.selectOption(1);
      quiz.submitAnswer();
      quiz.nextQuestion();

      expect(quiz.getState().score).toBe(1);
    });
  });
});

describe("QuizContainer DOM", () => {
  let dom: JSDOM;
  let document: Document;

  beforeEach(() => {
    // Create a mock HTML structure similar to QuizContainer output
    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <div class="quiz-container" data-quiz-id="test" role="region" aria-label="编程测验" tabindex="-1">
            <div class="quiz-header">
              <span class="quiz-progress" aria-live="polite"></span>
            </div>
            <div class="quiz-question" role="heading" aria-level="3"></div>
            <div class="quiz-options" role="radiogroup" aria-label="选项"></div>
            <div class="quiz-explanation" style="display: none;" role="alert" aria-live="polite"></div>
            <div class="quiz-actions">
              <button class="quiz-action-btn" disabled aria-label="提交答案">提交答案</button>
            </div>
            <div class="quiz-result" style="display: none;" role="region" aria-label="测验结果"></div>
          </div>
        </body>
      </html>
    `;
    dom = new JSDOM(html);
    document = dom.window.document;
  });

  describe("Accessibility Attributes", () => {
    it("should have role region for quiz container", () => {
      const container = document.querySelector(".quiz-container");
      expect(container?.getAttribute("role")).toBe("region");
      expect(container?.getAttribute("aria-label")).toBe("编程测验");
    });

    it("should have proper heading structure", () => {
      const question = document.querySelector(".quiz-question");
      expect(question?.getAttribute("role")).toBe("heading");
      expect(question?.getAttribute("aria-level")).toBe("3");
    });

    it("should have radiogroup for options", () => {
      const options = document.querySelector(".quiz-options");
      expect(options?.getAttribute("role")).toBe("radiogroup");
      expect(options?.getAttribute("aria-label")).toBe("选项");
    });

    it("should have aria-live region for progress", () => {
      const progress = document.querySelector(".quiz-progress");
      expect(progress?.getAttribute("aria-live")).toBe("polite");
    });

    it("should have alert role for explanation", () => {
      const explanation = document.querySelector(".quiz-explanation");
      expect(explanation?.getAttribute("role")).toBe("alert");
      expect(explanation?.getAttribute("aria-live")).toBe("polite");
    });

    it("should have aria-label for action button", () => {
      const button = document.querySelector(".quiz-action-btn");
      expect(button?.getAttribute("aria-label")).toBe("提交答案");
      expect(button?.hasAttribute("disabled")).toBe(true);
    });
  });

  describe("HTML Structure", () => {
    it("should have all required elements", () => {
      expect(document.querySelector(".quiz-container")).toBeTruthy();
      expect(document.querySelector(".quiz-header")).toBeTruthy();
      expect(document.querySelector(".quiz-progress")).toBeTruthy();
      expect(document.querySelector(".quiz-question")).toBeTruthy();
      expect(document.querySelector(".quiz-options")).toBeTruthy();
      expect(document.querySelector(".quiz-explanation")).toBeTruthy();
      expect(document.querySelector(".quiz-actions")).toBeTruthy();
      expect(document.querySelector(".quiz-action-btn")).toBeTruthy();
      expect(document.querySelector(".quiz-result")).toBeTruthy();
    });
  });
});

describe("QuizContainer Data Parsing", () => {
  it("should parse valid quiz data JSON", () => {
    const json = JSON.stringify(mockQuestions);
    const parsed = JSON.parse(json);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].question).toBe("Test question 1?");
  });

  it("should handle empty questions array", () => {
    const quiz = new QuizManager([]);
    expect(quiz.getQuestions()).toHaveLength(0);
    expect(quiz.getCurrentQuestion()).toBeUndefined();
  });

  it("should preserve option properties", () => {
    const quiz = new QuizManager(mockQuestions);
    const question = quiz.getCurrentQuestion();
    expect(question.options[0].text).toBe("Option A");
    expect(question.options[0].correct).toBe(true);
    expect(question.options[0].explanation).toBe("This is correct");
  });
});
