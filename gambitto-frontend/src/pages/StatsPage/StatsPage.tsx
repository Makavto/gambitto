import React from "react";
import styles from "./StatsPage.module.scss";
import Card from "../../components/Card/Card";
import { ChessCardWidget } from "../../widgets/ChessCard/ChessCardWidget";
import { useStatsPageController } from "../../controllers/pages/StatsPage/StatsPageController";
import { RatingsHistoryGraph } from "../../widgets/RatingsHistoryGraph/RatingsHistoryGraph";

function StatsPage() {
  const { allGames, isStatsLoading, statsData } = useStatsPageController();

  return (
    <div>
      <div className="textBig title">Статистика</div>
      {isStatsLoading && <div>Загрузка...</div>}
      {statsData && (
        <>
          <div className={styles.cardWrapper}>
            <Card>
              <div className="textBig">Рейтинг: {statsData.rating}</div>
              <RatingsHistoryGraph />
            </Card>
          </div>
          <div className={styles.cardWrapper}>
            <Card>
              <div className={styles.statsWrapper}>
                <div className={styles.statsItemsRow}>
                  <div className={`${styles.statsItem} textBig`}>Игры</div>
                  <div className={`${styles.statsItem} textBig`}>Серии</div>
                </div>
                <div className={styles.statsItemsRow}>
                  <div className={styles.statsItem}>
                    <div className={styles.title}>Победы</div>
                    <div className={`${styles.stat} textSuccess`}>
                      {statsData.wins}
                    </div>
                  </div>
                  <div className={styles.statsItem}>
                    <div className={styles.title}>Победная серия</div>
                    <div className={`${styles.stat} textSuccess`}>
                      {statsData.winStreak}
                    </div>
                  </div>
                </div>
                <div className={styles.statsItemsRow}>
                  <div className={styles.statsItem}>
                    <div className={styles.title}>Поражения</div>
                    <div className={`${styles.stat} textAccent`}>
                      {statsData.defeats}
                    </div>
                  </div>
                  <div className={styles.statsItem}>
                    <div className={styles.title}>Серия поражений</div>
                    <div className={`${styles.stat} textAccent`}>
                      {statsData.defeatStreak}
                    </div>
                  </div>
                </div>
                <div className={styles.statsItemsRow}>
                  <div className={styles.statsItem}>
                    <div className={styles.title}>Вничью</div>
                    <div className={`${styles.stat} textSecondary`}>
                      {statsData.draws}
                    </div>
                  </div>
                  <div className={styles.statsItem}>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <div className={styles.statsItemsRow}>
                  <div className={styles.statsItem}>
                    <div className={styles.title}>Всего</div>
                    <div className={styles.stat}>{statsData.totalGames}</div>
                  </div>
                  <div className={styles.statsItem}>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
      <div className="textBig title">История партий</div>
      <div className={styles.historyWrapper}>
        {!allGames && <div>Загрузка...</div>}
        {allGames &&
          (allGames.games.length === 0 ? (
            <div>Не сыграно ни одной партии</div>
          ) : (
            allGames.games.map((game, i) => (
              <div className={styles.historyCardWrapper} key={i}>
                <ChessCardWidget game={game} />
              </div>
            ))
          ))}
      </div>
    </div>
  );
}

export default StatsPage;
