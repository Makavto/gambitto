import React from "react";
import styles from "./GamePage.module.scss";
import Button from "../../components/Button/Button";
import { ButtonTypesEnum } from "../../utils/ButtonTypesEnum";
import { useGamePageController } from "../../controllers/pages/GamePage/GamePageController";
import { ChessGameField } from "../../components/ChessGameField/ChessGameField";
import { MovesHistory } from "../../components/MovesHistory/MovesHistory";
import SimpleBar from "simplebar-react";
import variables from "../../styles/variables.module.scss";

function GamePage() {
  const {
    activeMove,
    chessGame,
    getPositionAfterMove,
    history,
    onMakeMove,
    onMakeMoveActive,
    onResign,
    onAnalysis,
    user,
    opponentData,
  } = useGamePageController();

  return (
    <div className={styles.pageWrapper}>
      {!chessGame && <div>Загрузка...</div>}
      {!!chessGame && chessGame.gameStatus === "invitation" && (
        <div>Подождите, пока соперник войдёт в игру</div>
      )}
      {!!chessGame && chessGame.gameStatus === "declined" && (
        <div>Соперник не захотел играть :(</div>
      )}
      {!!chessGame &&
        !!user &&
        !!opponentData &&
        chessGame.gameStatus !== "invitation" &&
        chessGame.gameStatus !== "declined" && (
          <div className={styles.gameBlock}>
            <div className={styles.boardWrapper}>
              <ChessGameField
                chessGame={chessGame}
                isMovingBlocked={
                  activeMove?.number !==
                    chessGame.gameMoves[chessGame.gameMoves.length - 1]
                      ?.moveNumber || chessGame.gameStatus !== "inProgress"
                }
                onMakeMove={onMakeMove}
                opponentData={opponentData}
                user={user}
                startingFen={
                  activeMove
                    ? getPositionAfterMove(
                        activeMove.positionBefore,
                        activeMove.moveCode
                      )
                    : undefined
                }
              />
            </div>
            <div className={styles.statusWrapper}>
              <div>
                Статус партии:{" "}
                <span className="textBig">{chessGame.gameStatusFormatted}</span>
              </div>
              {chessGame.gameStatus === "inProgress" && (
                <div className={styles.giveUpBtn}>
                  <Button onClick={onResign} type={ButtonTypesEnum.Danger}>
                    Сдаться
                  </Button>
                </div>
              )}
              {chessGame.gameStatus !== "inProgress" && (
                <div className={styles.giveUpBtn}>
                  <Button onClick={onAnalysis} type={ButtonTypesEnum.Primary}>
                    Анализ партии
                  </Button>
                </div>
              )}
              {history.length > 0 && (
                <div className={styles.historyWrapper}>
                  <SimpleBar style={{ maxHeight: variables.boardWidth }}>
                    <MovesHistory
                      history={history}
                      onMakeMoveActive={onMakeMoveActive}
                      activeMove={activeMove}
                    />
                  </SimpleBar>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}

export default GamePage;
