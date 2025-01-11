import { useState, useEffect, useCallback } from 'react'
import debounce from 'lodash/debounce'
import { useAuth } from '@/contexts/AuthContext'
import { containsBadWord } from '@/utils/wordFilter'
import { supabase } from '@/lib/supabaseClient'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
}

type ErrorType = {
  message: string;
}

const checkUserExists = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGNF') {
      console.error('Supabase error:', error)
      return false // Fail gracefully if Supabase isn't configured
    }

    return !!data
  } catch (error) {
    console.error('Error checking user:', error)
    return false // Fail gracefully
  }
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const { signUp, signIn, signInWithGoogle } = useAuth()
  const [isLogin, setIsLogin] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [usernameError, setUsernameError] = useState<string | null>(null)

  const checkUsername = useCallback(
    debounce(async (username: string) => {
      if (username.length >= 3) {
        try {
          const { exists } = await checkUserExists('', username)
          if (exists) {
            setUsernameError('This username is already taken')
          } else {
            setUsernameError(null)
          }
        } catch (error) {
          console.error('Error checking username:', error)
        }
      }
    }, 500),
    []
  )

  useEffect(() => {
    if (formData.username) {
      checkUsername(formData.username)
    }
    return () => {
      checkUsername.cancel()
    }
  }, [formData.username, checkUsername])

  const validateUsername = (username: string): string | null => {
    // Length check
    if (username.length < 3) {
      return 'Username must be at least 3 characters long'
    }

    // Character check
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return 'Username can only contain letters, numbers, underscores and hyphens'
    }

    // Bad word check
    const { isValid, reason } = containsBadWord(username)
    if (!isValid) {
      return reason || 'This username is not allowed'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      if (isLogin) {
        const { error: signInError } = await signIn(formData.email, formData.password)
        if (signInError) throw signInError
        
        // Show success message instead of redirecting
        setError('Thanks for logging in! Website coming soon.')
        setTimeout(() => {
          onClose()
          setFormData({ username: '', email: '', password: '' })
        }, 3000)
        
      } else {
        // Validate username
        const usernameError = validateUsername(formData.username)
        if (usernameError) {
          throw new Error(usernameError)
        }

        // Check for existing username error
        if (usernameError) {
          throw new Error(usernameError)
        }

        const { data, error: signUpError } = await signUp(
          formData.email, 
          formData.password, 
          formData.username
        )

        if (signUpError) {
          throw signUpError
        }

        if (data?.user) {
          // Show success message instead of redirecting
          setError('Thanks for registering! Website coming soon.')
          setTimeout(() => {
            onClose()
            setFormData({ username: '', email: '', password: '' })
          }, 3000)
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setError(null)
      setLoading(true)
      
      const { error } = await signInWithGoogle()
      
      if (error) {
        throw error
      }
      
      // The redirect will happen automatically
      // No need to close modal here as the page will redirect
    } catch (error: any) {
      console.error('Google sign in error:', error)
      setError(error.message || 'Failed to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Real-time username validation
    if (name === 'username' && value) {
      const error = validateUsername(value)
      if (error) {
        setUsernameError(error)
      } else {
        setUsernameError(null)
        // Only check for existing username if basic validation passes
        checkUsername(value)
      }
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError(null)
    setFormData({ username: '', email: '', password: '' })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p>{isLogin ? 'Sign in to continue' : 'Join our community and explore the future of AI'}</p>
        
        <button 
          type="button" 
          className="google-sign-in-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Connecting to Google...
            </>
          ) : (
            <>
              <i className="fab fa-google"></i>
              Continue with Google
            </>
          )}
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && (
            <div className={`error-message ${error.includes('created') ? 'success' : 'error'}`}>
              <i className={`fas ${error.includes('created') ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
              {error}
            </div>
          )}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
                minLength={3}
                maxLength={20}
                pattern="[a-zA-Z0-9_-]+"
                className={usernameError ? 'error' : ''}
                title="Username can only contain letters, numbers, underscores and hyphens"
              />
              {usernameError && (
                <div className="input-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {usernameError}
                </div>
              )}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder={isLogin ? "Enter your password" : "Choose a password"}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> 
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={toggleMode} className="switch-btn">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterModal 