import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/Dashboard.module.css'
import { GeminiService } from '@/utils/gemini'
import GeminiChat from '@/components/GeminiChat'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedSource, setSelectedSource] = useState('all')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('news')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [geminiKey, setGeminiKey] = useState('')
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [globalAnalysis, setGlobalAnalysis] = useState<{
    analysis: string | null;
    news: any[];
    research: any[];
    financial: any[];
  }>({
    analysis: null,
    news: [],
    research: [],
    financial: []
  });

  const sources = [
    { id: 'all', label: 'All Sources', icon: 'fas fa-globe' },
    { id: 'news', label: 'News', icon: 'fas fa-newspaper' },
    { id: 'research', label: 'Research', icon: 'fas fa-microscope' },
    { id: 'financial', label: 'Financial', icon: 'fas fa-chart-line' },
    { id: 'knowledge', label: 'General Knowledge', icon: 'fas fa-brain' },
    { id: 'weather', label: 'Weather', icon: 'fas fa-cloud-sun' },
    { id: 'public', label: 'Public Data', icon: 'fas fa-database' },
    { id: 'crypto', label: 'Coin Info', icon: 'fas fa-coins' },
    { id: 'ai', label: 'AI Analysis', icon: 'fas fa-robot' }
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // In the Dashboard component, add this effect to load saved key
  useEffect(() => {
    // Try to load from localStorage first
    const savedKey = typeof window !== 'undefined' ? localStorage.getItem('geminiKey') : null
    if (savedKey) {
      setGeminiKey(savedKey)
    }
  }, [])

  const handleLogout = () => {
    // Add logout logic here
    router.push('/')
  }

  const handleSaveApiKey = async () => {
    try {
      const response = await fetch('/api/saveApiKey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ geminiKey }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }
      
      // Save to localStorage as well
      if (typeof window !== 'undefined') {
        localStorage.setItem('geminiKey', geminiKey)
      }
      
      setIsSettingsOpen(false)
    } catch (error) {
      console.error('Error saving API key:', error)
      setError(error instanceof Error ? error.message : 'Failed to save API key')
    }
  }

  const handleAnalyze = async (content: string) => {
    if (!geminiKey) {
      setIsSettingsOpen(true)
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const gemini = new GeminiService(geminiKey)
      const result = await gemini.analyze(content)
      setAnalysisResult(result)
    } catch (error) {
      console.error('Analysis error:', error)
      setError('Failed to analyze content')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Handle global search
  const handleGlobalSearch = async () => {
    if (!searchQuery.trim() || !geminiKey) {
      if (!geminiKey) setIsSettingsOpen(true);
      return;
    }

    setIsAnalyzing(true);
    try {
      const gemini = new GeminiService(geminiKey);
      const prompt = `
        Analyze the following topic comprehensively: "${searchQuery}"
        
        Please provide:
        1. A detailed analysis
        2. Recent news headlines related to this topic (if any)
        3. Research findings or studies (if applicable)
        4. Financial implications or market data (if relevant)
        
        Format the response in JSON with the following structure:
        {
          "analysis": "detailed analysis here",
          "news": [{"title": "headline", "summary": "brief summary"}],
          "research": [{"title": "research title", "summary": "key findings"}],
          "financial": [{"metric": "name", "value": "data point", "trend": "up/down"}]
        }
      `;

      const response = await gemini.analyze(prompt, 'explain');
      const parsedResponse = JSON.parse(response);
      
      setGlobalAnalysis(parsedResponse);
      setAnalysisResult(parsedResponse.analysis);
      
      // Automatically switch to AI Analysis tab
      setActiveTab('ai');
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Failed to analyze content');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Update the search input to trigger analysis
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === '') {
      setGlobalAnalysis({
        analysis: null,
        news: [],
        research: [],
        financial: []
      });
    }
  };

  // Render result cards based on the active tab
  const renderResultCards = () => {
    if (!globalAnalysis) return null;

    switch (activeTab) {
      case 'news':
        return globalAnalysis.news.map((item, index) => (
          <div key={index} className={styles.resultCard}>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <a href="#" className={styles.sourceLink}>View Source →</a>
          </div>
        ));

      case 'research':
        return globalAnalysis.research.map((item, index) => (
          <div key={index} className={styles.resultCard}>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <a href="#" className={styles.sourceLink}>View Research →</a>
          </div>
        ));

      case 'financial':
        return globalAnalysis.financial.map((item, index) => (
          <div key={index} className={styles.resultCard}>
            <h3>{item.metric}</h3>
            <p>Value: {item.value}</p>
            <p>Trend: {item.trend}</p>
          </div>
        ));

      default:
        return (
          <div className={styles.resultCard}>
            <h3>Sample Research Title</h3>
            <p>Brief summary of the research paper or article...</p>
            <a href="#" className={styles.sourceLink}>View Source →</a>
          </div>
        );
    }
  };

  // Update the Settings Modal content
  const renderSettingsModal = () => (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>API Settings</h2>
          <button 
            className={styles.closeButton}
            onClick={() => setIsSettingsOpen(false)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label>Gemini API Key</label>
            <input 
              type="password"
              placeholder="Enter your Gemini API key"
              className={styles.input}
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
            />
            <p className={styles.helperText}>
              Get your API key from the <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>
            </p>
          </div>
          <button 
            className={styles.saveButton}
            onClick={handleSaveApiKey}
          >
            Save Changes
          </button>
          {error && <p className={styles.errorText}>{error}</p>}
        </div>
      </div>
    </div>
  )

  // Update the AI Analysis tab content
  const renderAiAnalysis = () => (
    <div className={styles.aiAnalysis}>
      <div className={styles.analysisInput}>
        <textarea
          placeholder="Enter text to analyze..."
          className={styles.textarea}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleGlobalSearch();
            }
          }}
        />
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
      {isAnalyzing && (
        <div className={styles.loadingState}>
          <i className="fas fa-circle-notch fa-spin"></i>
          <span>Analyzing...</span>
        </div>
      )}
      {analysisResult && (
        <div className={styles.analysisResult}>
          <h3>Analysis Result</h3>
          <div className={styles.resultContent}>
            {analysisResult}
          </div>
          <button className={styles.exportBtn}>
            <i className="fas fa-file-export"></i> Export to PDF
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search across multiple sources..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={handleSearchInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleGlobalSearch();
              }
            }}
          />
          <div className={styles.filterContainer} ref={dropdownRef}>
            <button
              className={styles.filterSelect}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {sources.find(s => s.id === selectedSource)?.label}
            </button>
            <div className={`${styles.customDropdown} ${isDropdownOpen ? styles.open : ''}`}>
              {sources.map((source) => (
                <div
                  key={source.id}
                  className={`${styles.dropdownOption} ${selectedSource === source.id ? styles.selected : ''}`}
                  onClick={() => {
                    setSelectedSource(source.id)
                    setIsDropdownOpen(false)
                  }}
                >
                  <i className={source.icon}></i>
                  {source.label}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.headerControls}>
          <button 
            className={styles.iconButton}
            onClick={() => setIsSettingsOpen(true)}
            title="Settings"
          >
            <i className="fas fa-cog"></i>
          </button>
          <div className={styles.userMenu}>
            <img src="/avatar.png" alt="User" className={styles.userAvatar} />
          </div>
          <button 
            className={styles.iconButton}
            onClick={handleLogout}
            title="Logout"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </header>

      {/* Settings Modal */}
      {isSettingsOpen && renderSettingsModal()}

      {/* Main Content */}
      <main className={styles.main}>
        {/* Section 1: Search Results */}
        <section className={styles.resultsSection}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'news' ? styles.active : ''}`}
              onClick={() => setActiveTab('news')}
            >
              News
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'research' ? styles.active : ''}`}
              onClick={() => setActiveTab('research')}
            >
              Research
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'financial' ? styles.active : ''}`}
              onClick={() => setActiveTab('financial')}
            >
              Financial Data
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'knowledge' ? styles.active : ''}`}
              onClick={() => setActiveTab('knowledge')}
            >
              General Knowledge
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'weather' ? styles.active : ''}`}
              onClick={() => setActiveTab('weather')}
            >
              Weather
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'public' ? styles.active : ''}`}
              onClick={() => setActiveTab('public')}
            >
              Public Data
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'crypto' ? styles.active : ''}`}
              onClick={() => setActiveTab('crypto')}
            >
              Coin Info
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'ai' ? styles.active : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              AI Analysis
            </button>
          </div>
          {activeTab === 'ai' ? renderAiAnalysis() : (
            <div className={styles.resultCards}>
              {renderResultCards()}
            </div>
          )}
          <button className={styles.loadMore}>Load More</button>
        </section>

        {/* Section 2: Visualizations */}
        <section className={styles.visualSection}>
          <h2>Data Visualization</h2>
          <div className={styles.charts}>
            <div className={styles.chart}>
              {/* Add your chart components here */}
              <div className={styles.chartPlaceholder}>Line Graph</div>
            </div>
            <div className={styles.chart}>
              <div className={styles.chartPlaceholder}>Pie Chart</div>
            </div>
          </div>
        </section>

        {/* Section 3: Analysis */}
        <section className={styles.analysisSection}>
          <h2>Gemini Analysis</h2>
          <div className={styles.insights}>
            <ul>
              <li>Key insight point 1</li>
              <li>Key insight point 2</li>
              <li>Key insight point 3</li>
            </ul>
            <button className={styles.exportBtn}>
              <i className="fas fa-file-export"></i> Export to PDF
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <nav className={styles.footerNav}>
          <a href="#">Home</a>
          <a href="#">Contact Us</a>
          <a href="#">About</a>
          <a href="#">API Credits</a>
        </nav>
        <div className={styles.socialLinks}>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-github"></i></a>
          <a href="#"><i className="fab fa-discord"></i></a>
        </div>
      </footer>

      {/* Add chat button */}
      <button 
        className={styles.chatButton}
        onClick={() => setIsChatOpen(true)}
        title="Chat with Gemini"
      >
        <i className="fas fa-comments"></i>
      </button>

      {/* Add chat component */}
      <GeminiChat 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        apiKey={geminiKey}
      />
    </div>
  )
}

export default Dashboard 