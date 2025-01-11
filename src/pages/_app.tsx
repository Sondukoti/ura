import { AppProps } from 'next/app'
import { useEffect } from 'react'
import { initializeEnvironment } from '@/lib/init-env'
import { AuthProvider } from '@/contexts/AuthContext'
import '@/styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    initializeEnvironment()
  }, [])

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp 