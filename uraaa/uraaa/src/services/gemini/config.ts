export const GEMINI_CONFIG = {
  baseUrl: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
  defaultTemperature: 0.7,
  maxTokens: 1024,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;