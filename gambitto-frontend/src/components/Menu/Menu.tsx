import React from 'react'
import styles from './Menu.module.scss';
import { Link } from 'react-router-dom'

function Menu() {
  return (
    <div className={styles.menuContainer}>
      GAMBITTO
      <Link to={'/'}>

      </Link>
    </div>
  )
}

export default Menu