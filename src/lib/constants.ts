// ============================================================
// API Constants — single source of truth for endpoints
// Never mutate these objects; the api.ts client creates
// fresh headers per request to avoid race conditions.
// ============================================================

export const API_BASE = 'https://watawanu.com/api/';

export const ENDPOINTS = {
  REGISTER: `${API_BASE}user/register`,
  LOGIN: `${API_BASE}user/login`,
  LOGOUT: `${API_BASE}user/logout`,
  RESET_PASSWORD: `${API_BASE}user/reset-password`,
  HOME: `${API_BASE}home`,
  ANSWER: `${API_BASE}answer`,
  RESULT: `${API_BASE}result`,
} as const;

// Auth
export const TOKEN_KEY = 'quraan_token';

// Response codes
export const CODE = {
  SUCCESS: 200,
  REDIRECT_LOGIN: 301,
  ALREADY_ANSWERED: 401,
  VALIDATION_ERROR: 400,
} as const;
