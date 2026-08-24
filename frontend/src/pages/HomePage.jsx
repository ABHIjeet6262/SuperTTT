import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homeContainer}>
      <div className={styles.heroSection}>
        <div className={styles.badge}>Multiplayer & Local Pass-and-Play</div>
        <h1 className={styles.title}>
          Super <span className={styles.highlight}>Tic-Tac-Toe</span>
        </h1>
        <p className={styles.subtitle}>
          Control the grid and outplay your opponent in a tactical 9×9 board game.
        </p>

        <div className={styles.actionGrid}>
          {/* Option 1: Pass & Play (Local Same Device) */}
          <button 
            onClick={() => navigate('/local')} 
            className={`${styles.cardBtn} ${styles.primaryCard}`}
          >
            <div className={styles.btnContent}>
              <h3>Pass & Play</h3>
              <p>Two players take turns on the same device</p>
            </div>
            <span className={styles.arrowIcon}>→</span>
          </button>

          {/* Option 2: Online Multiplayer */}
          <button 
            onClick={() => navigate('/guest')} 
            className={styles.cardBtn}
          >
            <div className={styles.btnContent}>
              <h3>Play Online</h3>
              <p>Create a private room and invite an opponent</p>
            </div>
            <span className={styles.arrowIcon}>→</span>
          </button>

          {/* Option 3: How to Play */}
          <button 
            onClick={() => navigate('/how-to-play')} 
            className={styles.cardBtn}
          >
            <div className={styles.btnContent}>
              <h3>How to Play</h3>
              <p>Learn the active board and wildcard rules</p>
            </div>
            <span className={styles.arrowIcon}>→</span>
          </button>
        </div>

        <div className={styles.authPrompt}>
          <span>Want to track online stats and match history?</span>
          <button onClick={() => navigate('/register')} className={styles.authLinkBtn}>
            Create an Account
          </button>
          <span className={styles.divider}>or</span>
          <button onClick={() => navigate('/login')} className={styles.authLinkBtn}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
