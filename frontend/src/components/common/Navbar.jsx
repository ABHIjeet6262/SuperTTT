import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLobbyClick = (e) => {
    e.preventDefault();
    const guestData = JSON.parse(sessionStorage.getItem('superttt_guest') || '{}');
    const token = localStorage.getItem('superttt_token');

    if (!guestData.name && !token) {
      navigate('/guest');
    } else {
      navigate('/lobby');
    }
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
          <Link to="/how-to-play" className={styles.navLink}>How To Play</Link>
          <a href="/lobby" onClick={handleLobbyClick} className={styles.navLink}>Online Lobby</a>
        </nav>

        <div className={styles.authButtons}>
          <button onClick={() => navigate('/guest')} className={styles.guestBtn}>
            Play Online as Guest
          </button>
          <button onClick={() => navigate('/login')} className={styles.loginBtn}>
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
