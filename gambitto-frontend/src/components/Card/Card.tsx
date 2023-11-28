import React from 'react'
import styles from './Card.module.scss';

interface ICardProps {
  children: React.ReactNode,
  light?: boolean
}

function Card({children, light}: ICardProps) {
  return (
    <div className={`${styles.card} ${light && styles.light}`}>
      {children}
    </div>
  )
}

export default Card