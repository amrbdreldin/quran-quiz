// ============================================================
// All TypeScript interfaces for the Quraan MCQ App
// Single source of truth for data shapes
// ============================================================

// --------------- API Response Shape ---------------

/** Generic API response wrapper */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// --------------- Question / Exam ---------------

/** A single question returned from GET /home */
export interface Question {
  id: number;
  title: string;
  answers: string[];
}

/** The response from GET /home */
export type HomeApiData = Question[];

/** The answers payload submitted to POST /answer */
export interface AnswerPayload {
  reading: boolean;
  question1: number | null;
  answer1: string;
  question2: number | null;
  answer2: string;
}

// --------------- Result ---------------

/** A single result item returned from GET /result */
export interface ResultItem {
  id: number;
  title: string;
  answers: string[];
  his_answer: string;
  right_answer: string;
  /** 1 = correct, 0 = wrong */
  degree: number;
}

export type ResultApiData = ResultItem[];

// --------------- Auth ---------------

export interface LoginPayload {
  mobile: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  mobile: string;
  password: string;
}

export interface AuthData {
  token: string;
}

export interface ValidationErrors {
  name?: string | string[];
  mobile?: string | string[];
  password?: string | string[];
}

export interface AuthErrorData {
  validation_errors?: ValidationErrors;
}

// --------------- Exam State ---------------

export interface ExamAnswers {
  question1: number | null;
  answer1: string;
  question2: number | null;
  answer2: string;
}

// --------------- Toast ---------------

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

// --------------- Theme ---------------

export type Theme = 'light' | 'dark';
