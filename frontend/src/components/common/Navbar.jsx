import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { soundService } from '../../services/soundService';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  // Theme state: 'dark' or 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('superttt_theme') || 'dark';
  });

  // Mute state
  const [isMuted, setIsMuted] = useState(() => soundService.isMuted());

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('superttt_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleAudio = () => {
    const newMuted = soundService.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) {
      soundService.playMove();
    }
  };

  const handleLobbyClick = (e) => {
    e.preventDefault();
    const guestData = JSON.parse(sessionStorage.getItem('superttt_guest') || '{}');

    if (!guestData.name && !user) {
      navigate('/guest');
    } else {
      navigate('/lobby');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link to="/" className={styles.logoGroup}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>Super<span className={styles.highlight}>TTT</span></span>
        </Link>

        <nav className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/local" className={styles.navLink}>Pass & Play</Link>
          <Link to="/ai" className={styles.navLink}>vs AI Bot</Link>
          <Link to="/how-to-play" className={styles.navLink}>How To Play</Link>
          <a href="/lobby" onClick={handleLobbyClick} className={styles.navLink}>Online Lobby</a>
          {user && <Link to="/profile" className={styles.navLink}>Profile</Link>}
          {user && <Link to="/history" className={styles.navLink}>History</Link>}
        </nav>

        <div className={styles.authButtons}>
          <button 
            onClick={toggleAudio}
            className={styles.themeToggleBtn}
            title={isMuted ? 'Unmute Game Sounds' : 'Mute Game Sounds'}
          >
            {isMuted ? '🔇 Muted' : '🔊 Sound'}
          </button>

          <button 
            onClick={toggleTheme} 
            className={styles.themeToggleBtn}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>

          {user ? (
            <button onClick={handleLogout} className={styles.guestBtn}>
              Log Out ({user.username})
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/guest')} className={styles.guestBtn}>
                Play as Guest
              </button>
              <button onClick={() => navigate('/login')} className={styles.loginBtn}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
