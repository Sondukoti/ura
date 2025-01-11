import { validateEnv } from '@/utils/env'

export function initializeEnvironment() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    const isValid = validateEnv()
    console.log('Environment variables status:', {
      valid: isValid ? '✓' : '✗',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓' : '✗',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓' : '✗',
    })
  }
} 