import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setProfile(data);
      } catch (err) {
        setError('Please log in to view your profile and statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className={`container ${styles.centerBox}`}>
        <div className={styles.loadingSpinner}>Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className={`container ${styles.centerBox}`}>
        <div className={styles.card}>
          <h2>Sign In Required</h2>
          <p>{error}</p>
          <div className={styles.btnRow}>
            <button onClick={() => navigate('/login')} className={styles.primaryBtn}>
              Sign In
            </button>
            <button onClick={() => navigate('/register')} className={styles.secondaryBtn}>
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.profileContainer}`}>
      <header className={styles.header}>
        <div className={styles.avatar}>
          {profile.username ? profile.username.substring(0, 2).toUpperCase() : 'U'}
        </div>
        <div className={styles.userInfo}>
          <h1>{profile.username}</h1>
          <p className={styles.email}>{profile.email}</p>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Log Out
        </button>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Games Played</span>
          <span className={styles.statVal}>{profile.gamesPlayed || 0}</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Wins</span>
          <span className={`${styles.statVal} ${styles.winColor}`}>{profile.wins || 0}</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Losses</span>
          <span className={`${styles.statVal} ${styles.lossColor}`}>{profile.losses || 0}</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Win Rate</span>
          <span className={styles.statVal}>{profile.winRate ? profile.winRate.toFixed(1) : '0.0'}%</span>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
