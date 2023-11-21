import React from 'react'
import styles from './Menu.module.scss';
import { NavLink } from 'react-router-dom';

function Menu() {
  return (
    <div className={styles.menuContainer}>
      <div className={styles.logoShadow}>
        <img className={styles.logo} src={'/main_logo.jpeg'} alt="" />
      </div>
      <div className={styles.menuInner}>
        <NavLink to={'/chess'} className={({isActive}) => isActive ? `${styles.activeBtn} ${styles.menuBtn}` : styles.menuBtn}>
          Играть
        </NavLink>
        <NavLink to={'/profile'} className={({isActive}) => isActive ? `${styles.activeBtn} ${styles.menuBtn}` : styles.menuBtn}>
          Профиль
        </NavLink>
        <NavLink to={'/notifications'} className={({isActive}) => isActive ? `${styles.activeBtn} ${styles.menuBtn}` : styles.menuBtn}>
          Уведомления
        </NavLink>
        <NavLink to={'/stats'} className={({isActive}) => isActive ? `${styles.activeBtn} ${styles.menuBtn}` : styles.menuBtn}>
          Статистика
        </NavLink>
        <NavLink to={'/community'} className={({isActive}) => isActive ? `${styles.activeBtn} ${styles.menuBtn}` : styles.menuBtn}>
          Сообщество
        </NavLink>
      </div>
    </div>
  )
}

export default Menu