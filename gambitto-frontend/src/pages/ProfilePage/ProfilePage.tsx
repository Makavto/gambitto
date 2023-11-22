import React from 'react'
import styles from './ProfilePage.module.scss';
import Card from '../../components/Card/Card'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import Button from '../../components/Button/Button';
import { AuthAPI } from '../../services/AuthService';
import { userSlice } from '../../store/reducers/userSlice';
import { ButtonTypesEnum } from '../../utils/ButtonTypesEnum';

function ProfilePage() {
  const {user} = useAppSelector(state => state.userSlice);
  const {setUser} = userSlice.actions;

  const dispatch = useAppDispatch();

  const [logoutUser] = AuthAPI.useLogoutUserMutation();

  const onLogout = () => {
    logoutUser().then(() => {
      localStorage.removeItem('accessToken');
      dispatch(setUser(null));
    });
  }

  return (
    <>
      <div className={styles.pageWrapper}>
        <div className={styles.cardWrapper}>
          <Card light={true}>
            {
              user &&
              <div className={styles.cardContainer}>
                <div className={styles.cardItem}>
                  <span className='textBig'>Имя пользователя: {user.username}</span>
                  <div>
                    <Button type={ButtonTypesEnum.Danger} onClick={onLogout}>Выйти</Button>
                  </div>
                </div>
                <div className={styles.cardItem}>
                  <span className="textSecondary">E-mail: {user.email}</span>
                </div>
                <div>
                  <span className="textSecondary">Шахматист с {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            }
          </Card>
        </div>
        <div className='textBig title'>
          История партий
        </div>
        <div className={styles.historyWrapper}>
          <Card>

          </Card>
        </div>
      </div>
    </>
  )
}

export default ProfilePage