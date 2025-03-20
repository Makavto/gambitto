import React from "react";
import { useAppSelector } from "../../hooks/redux";
import styles from "./NotificationPage.module.scss";
import { UserCardWidget } from "../../widgets/UserCard/UserCardWidget";
import { ChessCardWidget } from "../../widgets/ChessCard/ChessCardWidget";

function NotificationsPage() {
  const { chessNotifications, friendshipNotifications } = useAppSelector(
    (state) => state.notificationsSlice
  );

  return (
    <div>
      <div className={`textBig ${styles.title} title`}>Заявки в друзья</div>
      <div>
        {friendshipNotifications.length === 0 && (
          <div className={`textSecondary ${styles.noInvitations}`}>
            Нет новых заявок
          </div>
        )}
        {friendshipNotifications.length > 0 &&
          friendshipNotifications.map((friendship, i) => (
            <div className={styles.card} key={i}>
              <UserCardWidget friendship={friendship} />
            </div>
          ))}
      </div>
      <div className={`textBig ${styles.title} title`}>
        Приглашения на игру в шахматы
      </div>
      <div>
        {chessNotifications.length === 0 && (
          <div className="textSecondary">Нет новых приглашений</div>
        )}
        {chessNotifications.length > 0 &&
          chessNotifications.map((chess, i) => (
            <div className={styles.card} key={i}>
              <ChessCardWidget game={chess} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default NotificationsPage;
