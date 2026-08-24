import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homeContainer}>
      <div className={styles.heroSection}>
        <div className={styles.badge}>🎮 Real-Time & Pass-and-Play Multiplayer</div>
        <h1 className={styles.title}>
          SUPER <span className={styles.gradientText}>TIC-TAC-TOE</span>
        </h1>
        <p className={styles.subtitle}>
          Think ahead. Control the board. Outsmart your opponent in a 9×9 battle of tactical dominance.
        </p>

        <div className={styles.actionGrid}>
          {/* Option 1: Pass & Play (Local Same Device) */}
          <button 
            onClick={() => navigate('/local')} 
            className={`${styles.cardBtn} ${styles.primaryBtn}`}
          >
            <div className={styles.btnIcon}>📱</div>
            <div className={styles.btnContent}>
              <h3>Pass & Play (Same Device)</h3>
              <p>Two players take turns on one phone or computer screen</p>
            </div>
          </button>

          {/* Option 2: Online Multiplayer (Separate Devices) */}
          <button 
            onClick={() => navigate('/guest')} 
            className={styles.cardBtn}
          >
            <div className={styles.btnIcon}>🌐</div>
            <div className={styles.btnContent}>
              <h3>Play Online (Separate Devices)</h3>
              <p>Create a room code and invite an online opponent</p>
            </div>
          </button>

          {/* Option 3: How to Play */}
          <button 
            onClick={() => navigate('/how-to-play')} 
            className={styles.cardBtn}
          >
            <div className={styles.btnIcon}>📖</div>
            <div className={styles.btnContent}>
              <h3>How to Play</h3>
              <p>Master the 9×9 active board rules & wildcard tactics</p>
            </div>
          </button>
        </div>

        <div className={styles.authPrompt}>
          <span>Want to track online stats & game history?</span>
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
