import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { geminiKey } = req.body
    if (!geminiKey) {
      return res.status(400).json({ message: 'API key is required' })
    }

    // First, try to store in localStorage for testing
    if (typeof window !== 'undefined') {
      localStorage.setItem('geminiKey', geminiKey)
    }

    // For development/testing, store in memory
    global.geminiKey = geminiKey

    return res.status(200).json({ message: 'API key saved successfully' })
  } catch (error) {
    console.error('Error saving API key:', error)
    return res.status(500).json({ message: 'Error saving API key' })
  }
} 