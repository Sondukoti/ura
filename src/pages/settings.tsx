import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/Settings.module.css'
import Link from 'next/link'

type ApiKey = {
  id: string;
  name: string;
  description: string;
  value: string;
}

const Settings = () => {
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    youtube: '',
    newsApi: '',
    serpApi: '',
    geminiAi: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  // Load saved API keys
  useEffect(() => {
    const loadApiKeys = async () => {
      // TODO: Load from your backend/database
      const savedKeys = localStorage.getItem('apiKeys')
      if (savedKeys) {
        setApiKeys(JSON.parse(savedKeys))
      }
    }
    loadApiKeys()
  }, [])

  const handleChange = (key: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // TODO: Save to your backend/database
      localStorage.setItem('apiKeys', JSON.stringify(apiKeys))
      setMessage({ text: 'API keys saved successfully', type: 'success' })
    } catch (error) {
      setMessage({ text: 'Failed to save API keys', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (key: string) => {
    setApiKeys(prev => ({
      ...prev,
      [key]: ''
    }))
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/dashboard" className={styles.backButton}>
            <i className="fas fa-arrow-left"></i>
          </Link>
          <h1>Settings</h1>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.settingsContainer}>
          <div className={styles.settingsHeader}>
            <i className="fas fa-cog"></i>
            <h2>API Keys</h2>
            <p>Manage your API keys and preferences</p>
          </div>

          <div className={styles.apiKeysList}>
            {[
              { id: 'youtube', name: 'YouTube', icon: 'fa-youtube', description: 'Required for video search' },
              { id: 'newsApi', name: 'News API', icon: 'fa-newspaper', description: 'Required for news articles' },
              { id: 'serpApi', name: 'SERP API', icon: 'fa-image', description: 'Required for image search' },
              { id: 'geminiAi', name: 'Gemini AI', icon: 'fa-robot', description: 'Required for AI analysis' }
            ].map(api => (
              <div key={api.id} className={styles.apiKeyItem}>
                <div className={styles.apiKeyInfo}>
                  <i className={`fas ${api.icon}`}></i>
                  <div>
                    <h3>{api.name}</h3>
                    <p>{api.description}</p>
                  </div>
                </div>
                <div className={styles.apiKeyActions}>
                  <div className={styles.inputWrapper}>
                    <input
                      type="password"
                      value={apiKeys[api.id]}
                      onChange={(e) => handleChange(api.id, e.target.value)}
                      placeholder="Enter API key"
                    />
                    {apiKeys[api.id] && (
                      <button
                        onClick={() => handleDelete(api.id)}
                        className={styles.deleteButton}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                  <button
                    className={styles.changeButton}
                    onClick={() => handleChange(api.id, '')}
                  >
                    Change
                  </button>
                </div>
              </div>
            ))}
          </div>

          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
              {message.text}
            </div>
          )}

          <div className={styles.actions}>
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Settings 