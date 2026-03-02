// Common type definitions for the application
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'student' | 'teacher' | 'admin';
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentSession {
  sessionId: string;
  exerciseId: string;
  startTime: string;
  endTime?: string;
  score?: number;
  completed: boolean;
}

// Validation types
export interface FormErrors {
  [key: string]: string | undefined;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}
