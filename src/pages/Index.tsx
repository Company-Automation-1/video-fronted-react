import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components'
import BentoGrid from '@/components/BentoGrid'
import { IconArrowRight, IconSparkles } from '@/components/Icons'
import './index.css'

const Index = () => {
  const navigate = useNavigate()
  const [isHoveringEnter, setIsHoveringEnter] = useState(false)

  const welcomeMsg = useMemo(() => {
    const hour = new Date().getHours()
    let timeOfDay = 'day'
    if (hour < 12) timeOfDay = 'morning'
    else if (hour < 18) timeOfDay = 'afternoon'
    else timeOfDay = 'evening'

    const messages: Record<string, string> = {
      morning: 'Embrace the dawn of new possibilities.',
      afternoon: 'The horizon of innovation awaits.',
      day: 'Welcome to the future of design.',
    }
    return messages[timeOfDay] || messages.day
  }, [])

  return (
    <div className="index-page">
      <Header />
      <div className="index-background">
        <div className="index-gradient index-gradient-1"></div>
        <div className="index-gradient index-gradient-2"></div>
      </div>
      
      <main className="index-main">
        {/* Dynamic AI Greeting Pill */}
        <div className="index-greeting">
          <IconSparkles className="index-greeting-icon" />
          <span className="index-greeting-text">
            {welcomeMsg || 'Initializing AI...'}
          </span>
        </div>

        {/* Hero Text */}
        <h1 className="index-hero-title">
          Design beyond <br /> boundaries.
        </h1>
        
        <p className="index-hero-description">
          Welcome to the Nova Portal. A minimalistic gateway designed to streamline your digital workflow with intelligent components.
        </p>

        {/* Primary CTA */}
        <div className="index-cta-container">
          <div className="index-cta-glow"></div>
          <button 
            className="index-cta-button"
            onClick={() => navigate('/home')}
            onMouseEnter={() => setIsHoveringEnter(true)}
            onMouseLeave={() => setIsHoveringEnter(false)}
          >
            <span className="index-cta-text">Enter Dashboard</span>
            <IconArrowRight className={`index-cta-icon ${isHoveringEnter ? 'index-cta-icon-hover' : ''}`} />
          </button>
        </div>

        {/* Visual Content / Bento Grid */}
        <div className="index-bento-section">
          <p className="index-bento-label">System Capabilities</p>
          <BentoGrid />
        </div>
      </main>

      {/* Footer */}
      <footer className="index-footer">
        <div className="index-footer-content">
          <p>© 2024 Nova Portal. All rights reserved.</p>
          <div className="index-footer-links">
            <a href="#" className="index-footer-link">Privacy</a>
            <a href="#" className="index-footer-link">Terms</a>
            <a href="#" className="index-footer-link">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index
