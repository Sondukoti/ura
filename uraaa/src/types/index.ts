export interface User {
  id: string;
  email: string;
  apiKeys?: APIKeys;
}

export interface APIKeys {
  gemini?: string;
  serp?: string;
  core?: string;
  semanticScholar?: string;
  youtube?: string;
  newsapi?: string;
}

export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
}