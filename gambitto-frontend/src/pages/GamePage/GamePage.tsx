import React from "react";
import ChessBoard from "../../components/ChessBoard/ChessBoard";
import styles from "./GamePage.module.scss";
import Button from "../../components/Button/Button";
import { ButtonTypesEnum } from "../../utils/ButtonTypesEnum";
import { useGamePageController } from "../../controllers/pages/GamePage/GamePageController";

function GamePage() {
  const {
    activeMove,
    chessGame,
    getPositionAfterMove,
    history,
    onMakeMove,
    onMakeMoveActive,
    onResign,
    user,
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
        chessGame.gameStatus !== "invitation" &&
        chessGame.gameStatus !== "declined" && (
          <div className={styles.gameBlock}>
            <div className={styles.boardWrapper}>
              <div className="textBig">
                {user?.id === chessGame.blackPlayerId
                  ? chessGame.whitePlayerName
                  : chessGame.blackPlayerName}
              </div>
              <ChessBoard
                startingFen={
                  activeMove
                    ? getPositionAfterMove(
                        activeMove.positionBefore,
                        activeMove.moveCode
                      )
                    : undefined
                }
                isMovingBlocked={
                  activeMove?.number !==
                    chessGame.gameMoves[chessGame.gameMoves.length - 1]
                      ?.moveNumber || chessGame.gameStatus !== "inProgress"
                }
                makeMove={onMakeMove}
                boardOrientation={
                  chessGame.blackPlayerId === user?.id ? "black" : "white"
                }
              />
              <div className={`textBig ${styles.user}`}>{user?.username}</div>
            </div>
            <div className={styles.statusWrapper}>
              <div>
                Статус партии:{" "}
                <span className="textBig">{chessGame.gameStatusFormatted}</span>
              </div>
              {history.length > 0 && (
                <div className={styles.historyWrapper}>
                  <div>История ходов:</div>
                  <div>
                    {history.map((movePair, i) => (
                      <div className={styles.historyItem} key={i}>
                        {i + 1}.&nbsp;
                        <button
                          onClick={() => onMakeMoveActive(movePair[0])}
                          className={`${styles.historyMove} ${
                            movePair[0].number === activeMove?.number &&
                            styles.active
                          }`}
                        >
                          {movePair[0].moveCode}
                        </button>
                        &nbsp;
                        {!!movePair[1] && (
                          <>
                            <button
                              onClick={() => onMakeMoveActive(movePair[1])}
                              className={`${styles.historyMove} ${
                                movePair[1].number === activeMove?.number &&
                                styles.active
                              }`}
                            >
                              {movePair[1].moveCode}
                            </button>
                            &nbsp;
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {chessGame.gameStatus === "inProgress" && (
                <div className={styles.giveUpBtn}>
                  <Button onClick={onResign} type={ButtonTypesEnum.Danger}>
                    Сдаться
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}

export default GamePage;
