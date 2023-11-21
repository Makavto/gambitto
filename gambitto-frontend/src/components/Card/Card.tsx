import React from 'react'
import styles from './Card.module.scss';

interface ICardProps {
  children: React.ReactNode
}

function Card({children}: ICardProps) {
  return (
    <div className={styles.card}>
      {children}
    </div>
  )
}

export default Card