import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import styles from './HistoryPage.module.css';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await userService.getGameHistory();
        setHistory(data);
      } catch (err) {
        setError('Please log in to view your game history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className={`container ${styles.centerBox}`}>
        <div>Loading history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`container ${styles.centerBox}`}>
        <div className={styles.errorCard}>
          <h2>Sign In Required</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/login')} className={styles.primaryBtn}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.container}`}>
      <header className={styles.header}>
        <h1>Match History</h1>
        <p>Review your previous online multiplayer games</p>
      </header>

      {history.length === 0 ? (
        <div className={styles.emptyCard}>
          <h3>No Games Recorded</h3>
          <p>Play online matches to view your game log here.</p>
        </div>
      ) : (
        <div className={styles.historyList}>
          {history.map((game) => (
            <div key={game.id} className={styles.gameCard}>
              <div className={styles.players}>
                <span className={styles.playerX}>{game.playerXName} (X)</span>
                <span className={styles.vs}>vs</span>
                <span className={styles.playerO}>{game.playerOName} (O)</span>
              </div>

              <div className={styles.resultBadge}>
                {game.winner === 'DRAW' ? (
                  <span className={styles.drawText}>Draw</span>
                ) : (
                  <span className={styles.winnerText}>Winner: {game.winner}</span>
                )}
              </div>

              <div className={styles.date}>
                {new Date(game.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
