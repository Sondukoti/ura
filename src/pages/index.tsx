import Head from 'next/head'
import { FC, useState } from 'react'
import Link from 'next/link'
import RegisterModal from '@/components/RegisterModal'
import { useRouter } from 'next/router'

const Home: FC = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const router = useRouter()

  const handleRegisterClick = () => {
    setIsRegisterOpen(true)
  }

  return (
    <>
      <Head>
        <title>URA</title>
        <meta name="description" content="Next generation digital innovation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syncopate:wght@400;700&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className="noise-overlay"></div>

      <nav className="floating-nav">
        <div className="logo">URA</div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <button 
            className="register-btn"
            onClick={handleRegisterClick}
          >
            Register
          </button>
        </div>
      </nav>

      <header id="home">
        <div className="hero">
          <div className="hero-text">
            <h1>
              U<span className="middle">R</span>A
            </h1>
            <div className="glitch-line"></div>
          </div>
          <div className="hero-subtitle">
            <span className="word-1">RESEARCH</span>
            <span className="word-2">LEARN</span>
            <span className="word-3">CREATE</span>
          </div>
        </div>
        <div className="cyber-grid">
          {[...Array(100)].map((_, i) => (
            <div key={i} className="grid-cell"></div>
          ))}
        </div>
      </header>

      <section className="feature-showcase">
        <div className="showcase-container">
          <div className="showcase-track">
            <div className="showcase-item">
              <div className="showcase-icon">
                <i className="fas fa-cloud"></i>
              </div>
              <div className="showcase-content">
                <h3>Seamless API Integration</h3>
                <p>Integrate any API with ease. Customize your research experience without any limits.</p>
              </div>
            </div>

            <div className="showcase-item">
              <div className="showcase-icon">
                <i className="fas fa-search"></i>
              </div>
              <div className="showcase-content">
                <h3>Instant Search & Recommendations</h3>
                <p>Get instant recommendations based on your research topics. The more you search, the smarter it gets!</p>
              </div>
            </div>

            <div className="showcase-item">
              <div className="showcase-icon">
                <i className="fas fa-cogs"></i>
              </div>
              <div className="showcase-content">
                <h3>Collaborative Research</h3>
                <p>Collaborate effortlessly with team members in real-time, sharing research, notes, and insights.</p>
              </div>
            </div>

            <div className="showcase-item">
              <div className="showcase-icon">
                <i className="fas fa-robot"></i>
              </div>
              <div className="showcase-content">
                <h3>Superior AI Model</h3>
                <p>Better than other AI models, get what you want in details</p>
              </div>
            </div>

            <div className="showcase-item">
              <div className="showcase-icon">
                <i className="fas fa-database"></i>
              </div>
              <div className="showcase-content">
                <h3>Up-to-Date Knowledge</h3>
                <p>More reliable, using the latest data to keep up with the world</p>
              </div>
            </div>

            <div className="showcase-item">
              <div className="showcase-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <div className="showcase-content">
                <h3>Lightning Fast</h3>
                <p>Using AI to make everything faster</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="community-section">
        <div className="community-container">
          <h2>Join the community</h2>
          <p className="community-subtitle">Discover what our community has to say about their URA experience.</p>
          
          <div className="community-buttons">
            <a href="#" className="community-btn github">
              <i className="fab fa-github"></i> GitHub discussions
            </a>
            <a href="#" className="community-btn discord">
              <i className="fab fa-discord"></i> Discord
            </a>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="user-info">
                <i className="fab fa-discord"></i>
                <span>@cyberdev.eth</span>
              </div>
              <p className="testimonial-text">
                "My next SaaS app and basically my whole job straight out vibing with URA. The integration capabilities are mind-blowing!"
              </p>
            </div>

            <div className="testimonial-card">
              <div className="user-info">
                <i className="fab fa-twitter"></i>
                <span>@0xAlice_</span>
              </div>
              <p className="testimonial-text">
                "Working with URA has been one of the best dev experiences I've had lately. Incredibly easy to set up, great documentation, and so many fewer hoops to jump through than the competition."
              </p>
            </div>

            <div className="testimonial-card">
              <div className="user-info">
                <i className="fab fa-instagram"></i>
                <span>@tech.samurai</span>
              </div>
              <p className="testimonial-text">
                "Using URA I'm really pleased on the power of research. Despite being a bit dubious about the whole backend as a service thing I have to say I really don't miss anything."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-parallax">
        <div className="floating-elements">
          <div className="float-item research"></div>
          <div className="float-item graph"></div>
          <div className="float-item tech"></div>
        </div>
        
        <div className="cta-content">
          <h2>Ready to Dive In?</h2>
          <p>Take full control of your research. Explore, analyze, and make discoveries at your own pace.</p>
          <button className="cta-button" onClick={handleRegisterClick}>
            Start Your Journey
          </button>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">URA</div>
          <div className="footer-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="social-links">
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-discord"></i></a>
            <a href="#"><i className="fab fa-github"></i></a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 GORZ INDUSTRIES</p>
          <p className="made-with-love">Made with ❤️ in India</p>
        </div>
      </footer>

      <RegisterModal 
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </>
  )
}

export default Home
