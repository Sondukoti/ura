export type Profile = {
  id: string;
  email: string;
  updated_at: string;
  theme_preference: 'light' | 'dark' | 'system';
  language_preference: string;
};

export type ApiKey = {
  id: string;
  user_id: string;
  service: 'gemini' | 'serp' | 'core' | 'semanticScholar' | 'youtube' | 'newsapi';
  key_value: string;
  created_at: string;
  last_used: string;
};