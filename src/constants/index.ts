// Application constants
export const APP_NAME = 'Archimedes Frontend';

// API related constants
export const API_ENDPOINTS = {
  AUTH: '/auth',
  STUDENTS: '/students',
  TEACHERS: '/teachers',
  EXERCISES: '/exercises',
} as const;

// UI Constants
export const TOAST_DURATION = 5000;
export const DEBOUNCE_DELAY = 300;

// Validation constants
export const PASSWORD_MIN_LENGTH = 8;
export const USERNAME_MIN_LENGTH = 3;

// Application-wide constants
export const APP_CONFIG = {
  DEFAULT_CLASSROOM_ID: 'e46e7191-e31d-434a-aba3-b9a9c187a632',
  RESULTS_S3_BASE_URL: 'http://archimedes-exercise-results.s3-website-us-west-2.amazonaws.com',
} as const;

// User roles
export const USER_ROLES = {
  STUDENT: 'students',
  TEACHER: 'teachers',
  ADMIN: 'admins',
} as const;

// Score thresholds for grade classification
export const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 80,
  FAIR: 70,
  NEEDS_IMPROVEMENT: 0,
} as const;

// Bootstrap variant mappings for scores
export const SCORE_VARIANTS = {
  EXCELLENT: 'success',
  GOOD: 'primary',
  FAIR: 'warning',
  NEEDS_IMPROVEMENT: 'danger',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type ScoreVariant = (typeof SCORE_VARIANTS)[keyof typeof SCORE_VARIANTS];
