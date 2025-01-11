import { ApiKeyError, ApiRequestError } from './apiErrors';
import toast from 'react-hot-toast';

interface ErrorHandlerOptions {
  silent?: boolean;
  context?: string;
}

export function handleApiError(error: unknown, options: ErrorHandlerOptions = {}): void {
  const { silent = false, context = 'API' } = options;

  if (error instanceof ApiKeyError) {
    toast.error(`${error.message}. Please configure it in settings.`);
  } else if (error instanceof ApiRequestError) {
    if (!silent) {
      toast.error(`${context} error: ${error.message}`);
    }
  } else {
    console.error(`${context} error:`, error);
    if (!silent) {
      toast.error(`Failed to fetch ${context.toLowerCase()} data`);
    }
  }
}