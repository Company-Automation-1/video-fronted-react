import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store'
import './index.css'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token, logout } = useAuthStore()
  
  const currentPath = location.pathname
  const isHome = currentPath === '/' || currentPath === '/home'
  const isLogin = currentPath === '/login'
  const isDashboard = currentPath === '/home'

  const handleLogoClick = () => {
    navigate('/')
  }

  const handleLoginClick = () => {
    navigate('/login')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="header">
      {/* Logo */}
      <div className="logo-container" onClick={handleLogoClick}>
        <div className="logo-box">
          <span className="logo-box-text">N</span>
        </div>
        <span className="logo-text">Nova</span>
      </div>

      {/* Middle Navigation - Hidden on Dashboard */}
      {!isDashboard && (
        <div className="nav-menu">
          <button
            className={`nav-button ${isHome ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            Vision
          </button>
          <button
            className="nav-button"
            onClick={() => navigate('/Features')}
          >
            Features
          </button>
          <button
            className="nav-button"
            onClick={() => navigate('/About')}
          >
            About
          </button>
        </div>
      )}

      {/* Right Action */}
      <button
        className={`auth-button ${isLogin ? 'active' : 'default'}`}
        onClick={token ? handleLogout : handleLoginClick}
      >
        {token ? 'Sign Out' : 'Sign In'}
      </button>
    </nav>
  )
}

export default Header
