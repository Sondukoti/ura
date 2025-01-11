export class ApiKeyError extends Error {
  constructor(service: string) {
    super(`API key for ${service} is not configured`);
    this.name = 'ApiKeyError';
  }
}

export class ApiRequestError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiRequestError';
  }
}