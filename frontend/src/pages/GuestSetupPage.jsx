import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GuestSetupPage.module.css';

const GuestSetupPage = () => {
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError('Please enter a display name to continue.');
      return;
    }
    if (displayName.trim().length < 2) {
      setError('Display name must be at least 2 characters.');
      return;
    }

    // Save temporary guest identity to session storage
    const guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem('superttt_guest', JSON.stringify({
      id: guestId,
      name: displayName.trim(),
      isGuest: true
    }));

    navigate('/lobby');
  };

  return (
    <div className={styles.container}>
      <div className={styles.guestCard}>
        <div className={styles.iconHeader}>👤</div>
        <h2>Play as Guest</h2>
        <p>No registration required. Choose a display name and jump right into the game!</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMsg}>{error}</div>}
          
          <div className={styles.field}>
            <label htmlFor="displayName">Display Name</label>
            <input
              id="displayName"
              type="text"
              placeholder="e.g. Alex, NeonKnight"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                setError('');
              }}
              maxLength={20}
              autoFocus
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Continue to Lobby ➔
          </button>
        </form>
      </div>
    </div>
  );
};

export default GuestSetupPage;
