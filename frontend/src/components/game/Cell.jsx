import React from 'react';
import styles from './Cell.module.css';

const Cell = ({ value, onClick, disabled, isLastMove }) => {
  return (
    <button 
      className={`${styles.cell} ${value ? styles[value.toLowerCase()] : ''} ${isLastMove ? styles.lastMove : ''}`}
      onClick={onClick}
      disabled={disabled || value !== ''}
    >
      {value}
    </button>
  );
};

export default Cell;
