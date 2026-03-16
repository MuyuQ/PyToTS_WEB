export interface QuizOption {
  text: string;
  correct: boolean;
  explanation: string;
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
