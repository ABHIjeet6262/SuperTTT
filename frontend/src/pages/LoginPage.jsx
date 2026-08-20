import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Authentication placeholder (Phase 3 will connect JWT backend API)
    alert('Login endpoint will be connected in Phase 3 Authentication!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <h2>Sign In to SuperTTT</h2>
        <p>Access your persistent statistics and match history</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.field}>
            <label>Username or Email</label>
            <input 
              type="text" 
              placeholder="Enter your username or email" 
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Sign In
          </button>
        </form>

        <div className={styles.footerLinks}>
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
          <p><Link to="/guest">Or Continue as Guest</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
