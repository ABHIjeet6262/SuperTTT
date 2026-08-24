import React from 'react';
import styles from './HowToPlayPage.module.css';

const HowToPlayPage = () => {
  return (
    <div className={`container ${styles.guideContainer}`}>
      <header className={styles.header}>
        <span className={styles.badge}>MASTER THE RULES</span>
        <h1 className={styles.title}>How to Play Super Tic-Tac-Toe</h1>
        <p className={styles.subtitle}>
          Super Tic-Tac-Toe takes standard Tic-Tac-Toe and turns it into a high-stakes tactical board game. Learn the 9×9 active board mechanics below.
        </p>
      </header>

      <section className={styles.ruleSection}>
        <div className={styles.ruleCard}>
          <div className={styles.stepNum}>1</div>
          <div className={styles.ruleBody}>
            <h2>The 9×9 Grid Architecture</h2>
            <p>
              The game board consists of 9 smaller 3×3 Tic-Tac-Toe boards arranged inside a larger 3×3 grid. That’s 81 playable cells in total!
            </p>
          </div>
        </div>

        <div className={styles.ruleCard}>
          <div className={styles.stepNum}>2</div>
          <div className={styles.ruleBody}>
            <h2>The Active Board Rule (Target Steering)</h2>
            <p>
              Where you make your move determines which small board your opponent MUST play in next.
            </p>
            <div className={styles.exampleBox}>
              <p>👉 <strong>Example:</strong> If Player X plays in cell 3 (top-right) of any small board, Player O is forced to make their next move anywhere inside <strong>Board 3 (top-right small board)</strong>.</p>
            </div>
          </div>
        </div>

        <div className={styles.ruleCard}>
          <div className={styles.stepNum}>3</div>
          <div className={styles.ruleBody}>
            <h2>Winning Small Boards</h2>
            <p>
              When a player wins a 3×3 small board (by completing a row, column, or diagonal), that entire small board is claimed and marked with a massive X or O.
            </p>
          </div>
        </div>

        <div className={styles.ruleCard}>
          <div className={styles.stepNum}>4</div>
          <div className={styles.ruleBody}>
            <h2>The "Wildcard" Rule (Completed Boards)</h2>
            <p>
              What if a player sends you to a small board that is ALREADY won or completely full?
            </p>
            <div className={styles.exampleBox}>
              <p>✨ <strong>Wildcard Rule:</strong> If the destination small board is unavailable, you get a "Wildcard" turn! You are free to pick <strong>ANY available small board</strong> on the entire game grid.</p>
            </div>
          </div>
        </div>

        <div className={styles.ruleCard}>
          <div className={styles.stepNum}>5</div>
          <div className={styles.ruleBody}>
            <h2>Overall Victory & Draws</h2>
            <p>
              To win the entire game, you must win 3 small boards in a row (horizontally, vertically, or diagonally) on the main 3×3 board grid. If all cells are played and neither player claims 3 in a row, the game ends in a Draw.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowToPlayPage;
