import React from 'react';
import styles from './ReactionPicker.module.css';

const REACTIONS = ['👍', '😂', '😮', '🔥', 'GG'];

const ReactionPicker = ({ onSendReaction }) => {
  return (
    <div className={styles.container}>
      <span className={styles.label}>Quick Reaction:</span>
      <div className={styles.buttonsGroup}>
        {REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSendReaction(emoji)}
            className={styles.reactionBtn}
            title={`Send ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReactionPicker;
