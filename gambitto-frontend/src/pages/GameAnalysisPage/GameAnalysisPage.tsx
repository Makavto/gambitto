import React from "react";
import { useGameAnalysisPageController } from "../../controllers/pages/GameAnalysisPage/GameAnalysisPageController";
import styles from "./GameAnalysisPage.module.scss";
import { Loader } from "../../components/Loader/Loader";
import { ChessGameField } from "../../components/ChessGameField/ChessGameField";
import { MovesHistory } from "../../components/MovesHistory/MovesHistory";

const GameAnalysisPage = () => {
  const {
    activeMove,
    chessGame,
    getPositionAfterMove,
    history,
    onMakeMoveActive,
    opponentData,
    user,
  } = useGameAnalysisPageController();

  return (
    <div className={styles.pageWrapper}>
      {!chessGame && <Loader />}
      {!!chessGame &&
        !!user &&
        !!opponentData &&
        chessGame.gameStatus !== "invitation" &&
        chessGame.gameStatus !== "declined" && (
          <div className={styles.gameBlock}>
            <div className={styles.boardWrapper}>
              <ChessGameField
                chessGame={chessGame}
                isMovingBlocked={true}
                onMakeMove={() => {}}
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
              {history.length > 0 && (
                <div className={styles.historyWrapper}>
                  <MovesHistory
                    history={history}
                    onMakeMoveActive={onMakeMoveActive}
                    activeMove={activeMove}
                  />
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default GameAnalysisPage;
