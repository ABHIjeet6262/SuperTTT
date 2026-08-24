import React from 'react';
import styles from './ReactionPicker.module.css';

const QUICK_REACTIONS = ['GG', 'Well Played', 'Nice Move', '🔥', '👍'];

const ReactionPicker = ({ onSendReaction }) => {
  return (
    <div className={styles.container}>
      <span className={styles.label}>Quick Chat:</span>
      <div className={styles.buttonsGroup}>
        {QUICK_REACTIONS.map((item) => (
          <button
            key={item}
            onClick={() => onSendReaction(item)}
            className={styles.reactionBtn}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReactionPicker;
