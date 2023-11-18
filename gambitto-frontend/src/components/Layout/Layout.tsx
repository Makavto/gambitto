import React from 'react'
import styles from './Layout.module.scss';
import Menu from '../Menu/Menu';

interface ILayoutProps {
  children: React.ReactNode;
}

function Layout({children}: ILayoutProps) {
  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.menuWrapper}>
        <Menu />
      </div>
      <div className={styles.pageWrapper}>
        {children}
      </div>
    </div>
  )
}

export default Layout