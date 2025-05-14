import React from "react";
import styles from "./ProfilePage.module.scss";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import { ButtonTypesEnum } from "../../utils/ButtonTypesEnum";
import { ChessCardWidget } from "../../widgets/ChessCard/ChessCardWidget";
import { useProfilePageController } from "../../controllers/pages/ProfilePage/ProfilePageController";
import { Loader } from "../../components/Loader/Loader";

function ProfilePage() {
  const {
    allGames,
    onLogout,
    user,
    isUserById,
    onViewUserStats,
    isGamesLoading,
    isUserLoading,
  } = useProfilePageController();

  return (
    <>
      <div className={styles.pageWrapper}>
        <div className={styles.cardWrapper}>
          <Card light={true}>
            {isUserLoading ? (
              <div>
                <Loader size={150} displayCenter={true} margin={40} />
              </div>
            ) : (
              user && (
                <div className={styles.cardContainer}>
                  <div className={styles.cardItem}>
                    <span className="textBig">
                      Имя пользователя:{" "}
                      <span className="textBold">{user.username}</span>
                    </span>
                    <div>
                      {!isUserById ? (
                        <Button
                          type={ButtonTypesEnum.Danger}
                          onClick={onLogout}
                        >
                          Выйти
                        </Button>
                      ) : (
                        <Button
                          type={ButtonTypesEnum.Primary}
                          onClick={onViewUserStats}
                        >
                          Статистика
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className={styles.cardItem}>
                    <span className="textSecondary">
                      Шахматный рейтинг: {user.rating}
                    </span>
                  </div>
                  <div className={styles.cardItem}>
                    <span className="textSecondary">E-mail: {user.email}</span>
                  </div>
                  <div>
                    <span className="textSecondary">
                      Шахматист с{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )
            )}
          </Card>
        </div>
        <div className="textBig title">История партий</div>
        <div className={styles.historyWrapper}>
          {isGamesLoading ? (
            <div>
              <Loader size={150} displayCenter={true} margin={40} />
            </div>
          ) : (
            !!allGames &&
            (allGames.games.length === 0 ? (
              <div>Не сыграно ни одной партии</div>
            ) : (
              allGames.games.map((game, i) => (
                <div className={styles.historyCardWrapper} key={i}>
                  <ChessCardWidget game={game} />
                </div>
              ))
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
