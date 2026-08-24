import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HowToPlayPage.module.css';

const HowToPlayPage = () => {
  const navigate = useNavigate();

  return (
    <div className={`container ${styles.guideContainer}`}>
      <header className={styles.header}>
        <h1>How to Play Super Tic-Tac-Toe</h1>
        <p>A strategic guide to mastering the 9×9 nested board rules.</p>
      </header>

      <div className={styles.sectionsGrid}>
        {/* Rule 1 */}
        <section className={styles.ruleCard}>
          <div className={styles.stepBadge}>Rule 1</div>
          <h2>The Nested Grid</h2>
          <p>
            The game consists of a large 3×3 grid. Inside each of those 9 main squares is a 
            complete, individual 3×3 Tic-Tac-Toe small board (81 cells total).
          </p>
        </section>

        {/* Rule 2 */}
        <section className={styles.ruleCard}>
          <div className={styles.stepBadge}>Rule 2</div>
          <h2>Active Board Targeting</h2>
          <p>
            Your move dictates where your opponent must play next. For example, if you place 
            your mark in the top-right cell of any small board, your opponent is forced to play 
            their next move inside the top-right small board (Board 3).
          </p>
        </section>

        {/* Rule 3 */}
        <section className={styles.ruleCard}>
          <div className={styles.stepBadge}>Rule 3</div>
          <h2>Winning a Small Board</h2>
          <p>
            Get 3 of your marks in a horizontal, vertical, or diagonal line inside any 3×3 small 
            board to claim that entire board for yourself.
          </p>
        </section>

        {/* Rule 4 */}
        <section className={styles.ruleCard}>
          <div className={styles.stepBadge}>Rule 4</div>
          <h2>The Wildcard Rule</h2>
          <p>
            If a player is directed to a small board that is already won or completely full, they 
            are granted a Wildcard. They may place their mark in any open cell on any unfinished small board.
          </p>
        </section>

        {/* Rule 5 */}
        <section className={styles.ruleCard}>
          <div className={styles.stepBadge}>Rule 5</div>
          <h2>Winning the Match</h2>
          <p>
            The ultimate objective: claim 3 small boards in a row (horizontally, vertically, or 
            diagonally) on the main board to win the entire game.
          </p>
        </section>
      </div>

      <div className={styles.actionCta}>
        <button onClick={() => navigate('/local')} className={styles.ctaPrimaryBtn}>
          Play Pass & Play Mode
        </button>
        <button onClick={() => navigate('/guest')} className={styles.ctaSecondaryBtn}>
          Play Online Multiplayer
        </button>
      </div>
    </div>
  );
};

export default HowToPlayPage;
