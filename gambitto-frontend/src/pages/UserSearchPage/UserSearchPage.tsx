import React from "react";
import styles from "./UserSearchPage.module.scss";
import Input from "../../components/Input/Input";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import { ButtonTypesEnum } from "../../utils/ButtonTypesEnum";
import { useUserSearchPageController } from "../../controllers/pages/UserSearchPage/UserSearchPageController";

interface IUserSearchPageProps {
  isForChessGame?: boolean;
}

function UserSearchPage({ isForChessGame }: IUserSearchPageProps) {
  const {
    isUsersDataFetching,
    onAddFriend,
    onSearch,
    onStartChessGame,
    register,
    onViewUser,
    usersData,
  } = useUserSearchPageController();

  return (
    <div className={styles.pageWrapper}>
      <div className={`textBig ${styles.title} title`}>Поиск пользователей</div>
      <div className={styles.searchWrapper}>
        <Input
          name="searchQuery"
          registerField={register}
          placeholder="Найти пользователя"
          onChange={onSearch}
        />
      </div>
      {isUsersDataFetching && <div>Загрузка...</div>}
      {usersData?.length === 0 && (
        <div className="textSecondary">Пользователей не найдено</div>
      )}
      {usersData &&
        usersData.map((user, i) => (
          <div className={styles.cardWrapper} key={i}>
            <Card>
              <div className={styles.cardRow}>
                <Button
                  onClick={() => onViewUser(user.id)}
                  type={ButtonTypesEnum.Link}
                >
                  {user.username}
                </Button>
                {(!user.friendshipStatus || isForChessGame) && (
                  <div>
                    <Button
                      onClick={() =>
                        isForChessGame
                          ? onStartChessGame(user.id)
                          : onAddFriend(user.id)
                      }
                      type={ButtonTypesEnum.Primary}
                    >
                      {isForChessGame ? "Сыграть партию" : "Добавить в друзья"}
                    </Button>
                  </div>
                )}
              </div>
              <div className={styles.cardRow}>
                <div className={styles.cardItem}>
                  {user.friendshipStatusFromatted ?? "Не в друзьях"}
                </div>
                <div className={styles.cardItem}>Побед: {user.wins}</div>
                <div className={styles.cardItem}>
                  Всего игр: {user.totalGames}
                </div>
              </div>
            </Card>
          </div>
        ))}
    </div>
  );
}

export default UserSearchPage;
