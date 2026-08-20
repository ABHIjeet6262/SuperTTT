import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.left}>
          <p>© {new Date().getFullYear()} SuperTTT. All rights reserved.</p>
        </div>
        <div className={styles.right}>
          <span>Strategic Real-Time Multiplayer Tic-Tac-Toe</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
