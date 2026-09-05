import React from 'react';
import styles from './Cell.module.css';

const Cell = ({ value, onClick, disabled, isLastMove, currentPlayer }) => {
  const hoverClass = !disabled && value === '' 
    ? (currentPlayer === 'O' ? styles.hoverO : styles.hoverX) 
    : '';

  return (
    <button 
      className={`${styles.cell} ${value ? styles[value.toLowerCase()] : ''} ${isLastMove ? styles.lastMove : ''} ${hoverClass}`}
      onClick={onClick}
      disabled={disabled || value !== ''}
    >
      {value}
    </button>
  );
};

export default Cell;
