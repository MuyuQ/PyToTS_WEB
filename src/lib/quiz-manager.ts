export interface QuizOption {
  /**
   * 普通题：选项全文。
   * 预测题：输出的文字说明（与 expected 搭配渲染为「预测输出: X - 说明」）。
   */
  text: string;
  correct: boolean;
  explanation: string;
  /** 预测题专用：预期输出值。存在时 quiz-ui 渲染为强调输出，替代旧「【预期:x】y」文本协议 */
  expected?: string;
}

export interface QuizQuestion {
  question: string;
  questionType?: "multiple-choice" | "prediction";
  codeSnippets?: {
    python?: string;
    typescript?: string;
  };
  options: QuizOption[];
}

export interface QuizState {
  currentQuestion: number;
  selectedOption: number | null;
  showExplanation: boolean;
  score: number;
  completed: boolean;
}

export class QuizManager {
  private questions: QuizQuestion[];
  private state: QuizState;

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
