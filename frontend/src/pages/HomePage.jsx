import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homeContainer}>
      <div className={styles.heroSection}>
        <div className={styles.badge}>🎮 Real-Time Online Multiplayer</div>
        <h1 className={styles.title}>
          SUPER <span className={styles.gradientText}>TIC-TAC-TOE</span>
        </h1>
        <p className={styles.subtitle}>
          Think ahead. Control the board. Outsmart your opponent in a 9×9 battle of tactical dominance.
        </p>

        <div className={styles.actionGrid}>
          <button 
            onClick={() => navigate('/guest')} 
            className={`${styles.cardBtn} ${styles.primaryBtn}`}
          >
            <div className={styles.btnIcon}>⚡</div>
            <div className={styles.btnContent}>
              <h3>Play as Guest</h3>
              <p>Enter a display name and jump into the game lobby</p>
            </div>
          </button>

          <button 
            onClick={() => navigate('/how-to-play')} 
            className={styles.cardBtn}
          >
            <div className={styles.btnIcon}>📖</div>
            <div className={styles.btnContent}>
              <h3>How to Play</h3>
              <p>Master the 9×9 active board rules & strategies</p>
            </div>
          </button>
        </div>

        <div className={styles.authPrompt}>
          <span>Want to track your stats & game history?</span>
          <button onClick={() => navigate('/register')} className={styles.authLinkBtn}>
            Create an Account
          </button>
          <span className={styles.divider}>or</span>
          <button onClick={() => navigate('/login')} className={styles.authLinkBtn}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
