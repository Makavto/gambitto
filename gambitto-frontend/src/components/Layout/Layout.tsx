import React from 'react'
import styles from './Layout.module.scss';
import Menu from '../Menu/Menu';
import SimpleBar from 'simplebar-react';

interface ILayoutProps {
  children: React.ReactNode;
}

function Layout({children}: ILayoutProps) {
  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.menuWrapper}>
        <Menu />
      </div>
      <SimpleBar style={{maxHeight: '100%', width: '100%'}}>
        <div className={styles.pageWrapper}>
            {children}
        </div>
      </SimpleBar>
    </div>
  )
}

export default Layout