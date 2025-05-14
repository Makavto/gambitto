import React from "react";
import Button from "../../components/Button/Button";
import styles from "./CommunityPage.module.scss";
import { ButtonTypesEnum } from "../../utils/ButtonTypesEnum";
import { useCommunityPageController } from "../../controllers/pages/CommunityPage/CommunityPageController";
import { UserCardWidget } from "../../widgets/UserCard/UserCardWidget";
import { Loader } from "../../components/Loader/Loader";

function CommunityPage() {
  const {
    allFriendsData,
    isTopLoading,
    onAddFriend,
    topData,
    isFriendsLoading,
  } = useCommunityPageController();

  return (
    <div className={styles.pageWrapper}>
      <div>
        <div className={`textBig ${styles.row} title`}>Список лидеров</div>
      </div>
      {isTopLoading ? (
        <div>
          <Loader size={150} displayCenter={true} margin={40} />
        </div>
      ) : !topData || topData.length === 0 ? (
        <div>Ой, что-то сломалось. Повторите попытку позднее.</div>
      ) : (
        topData && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <h1>Имя пользователя</h1>
                </th>
                <th>
                  <h1>Рейтинг</h1>
                </th>
                <th>
                  <h1>Количество побед</h1>
                </th>
                <th>
                  <h1>Количество игр</h1>
                </th>
              </tr>
            </thead>
            <tbody>
              {topData.map((user, i) => (
                <tr key={i}>
                  <td>{user.username}</td>
                  <td>{user.rating}</td>
                  <td>{user.wins}</td>
                  <td>{user.totalGames}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
      <div className={styles.row}>
        <div className={`textBig title`}>Друзья</div>
        <Button type={ButtonTypesEnum.Primary} onClick={onAddFriend}>
          Добавить друга
        </Button>
      </div>
      <div>
        {isFriendsLoading ? (
          <div>
            <Loader size={150} displayCenter={true} margin={40} />
          </div>
        ) : !allFriendsData ? (
          <div>Ой, что-то сломалось. Повторите попытку позднее.</div>
        ) : (
          (allFriendsData.friendships.length === 0 ? (
            <div>Список друзей пуст. Самое время подружиться!</div>
          ) : (
            allFriendsData.friendships.map((friendship, i) => (
              <div className={styles.friendshipCardWrapper} key={i}>
                <UserCardWidget friendship={friendship} />
              </div>
            ))
          ))
        )}
      </div>
    </div>
  );
}

export default CommunityPage;
