import React, { useEffect } from "react";
import { useGameAnalysisPageController } from "../../controllers/pages/GameAnalysisPage/GameAnalysisPageController";
import styles from "./GameAnalysisPage.module.scss";
import { Loader } from "../../components/Loader/Loader";
import { ChessGameField } from "../../components/ChessGameField/ChessGameField";
import { MovesHistory } from "../../components/MovesHistory/MovesHistory";
import { MoveEvaluation } from "../../components/MoveEvaluation/MoveEvaluation";
import { EvaluationBar } from "../../components/EvaluationBar/EvaluationBar";
import { ChevronLeftIcon, ChevronRightIcon } from "../../components/icons";
import SimpleBar from "simplebar-react";
import variables from "../../styles/variables.module.scss";

const GameAnalysisPage = () => {
  const {
    activeMove,
    chessGame,
    getPositionAfterMove,
    history,
    onMakeMoveActive,
    opponentData,
    user,
    moveEvaluation,
    positionEvaluation,
    bestMoves,
  } = useGameAnalysisPageController();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handlePreviousMove();
      } else if (event.key === "ArrowRight") {
        handleNextMove();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [history, activeMove]);

  const findCurrentMoveIndex = () => {
    if (!activeMove) return -1;
    for (let i = 0; i < history.length; i++) {
      for (let j = 0; j < history[i].length; j++) {
        if (history[i][j].number === activeMove.number) {
          return { movePairIndex: i, moveIndex: j };
        }
      }
    }
    return -1;
  };

  const handlePreviousMove = () => {
    const currentIndex = findCurrentMoveIndex();
    if (currentIndex === -1) return;

    const { movePairIndex, moveIndex } = currentIndex;
    if (moveIndex > 0) {
      // Move within the same pair
      onMakeMoveActive(history[movePairIndex][moveIndex - 1]);
    } else if (movePairIndex > 0) {
      // Move to previous pair
      onMakeMoveActive(
        history[movePairIndex - 1][history[movePairIndex - 1].length - 1]
      );
    }
  };

  const handleNextMove = () => {
    const currentIndex = findCurrentMoveIndex();
    if (currentIndex === -1) return;

    const { movePairIndex, moveIndex } = currentIndex;
    if (moveIndex < history[movePairIndex].length - 1) {
      // Move within the same pair
      onMakeMoveActive(history[movePairIndex][moveIndex + 1]);
    } else if (movePairIndex < history.length - 1) {
      // Move to next pair
      onMakeMoveActive(history[movePairIndex + 1][0]);
    }
  };

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
                bestMoves={bestMoves}
              />
            </div>
            <div className={styles.evaluationWrapper}>
              {positionEvaluation !== null && (
                <div className={styles.evaluationBarWrapper}>
                  <EvaluationBar
                    evalCp={positionEvaluation.cp}
                    mate={positionEvaluation.mate}
                  />
                </div>
              )}
            </div>
            <div className={styles.statusWrapper}>
              <div>
                Статус партии:{" "}
                <span className="textBig">{chessGame.gameStatusFormatted}</span>
              </div>
              <div className={styles.moveEvaluationWrapper}>
                <MoveEvaluation
                  quality={moveEvaluation?.quality}
                  bestMove={moveEvaluation?.bestMove}
                />
              </div>
              {history.length > 0 && (
                <div className={styles.historyWrapper}>
                  <SimpleBar style={{ maxHeight: variables.boardWidth }}>
                    <MovesHistory
                      history={history}
                      onMakeMoveActive={onMakeMoveActive}
                      activeMove={activeMove}
                    />
                  </SimpleBar>
                  <div className={styles.navigationButtons}>
                    <button
                      onClick={handlePreviousMove}
                      className={styles.navButton}
                      disabled={
                        findCurrentMoveIndex() === -1 ||
                        ((findCurrentMoveIndex() as any).movePairIndex === 0 &&
                          (findCurrentMoveIndex() as any).moveIndex === 0)
                      }
                    >
                      <ChevronLeftIcon />
                    </button>
                    <button
                      onClick={handleNextMove}
                      className={styles.navButton}
                      disabled={
                        findCurrentMoveIndex() === -1 ||
                        ((findCurrentMoveIndex() as any).movePairIndex ===
                          history.length - 1 &&
                          (findCurrentMoveIndex() as any).moveIndex ===
                            history[history.length - 1].length - 1)
                      }
                    >
                      <ChevronRightIcon />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default GameAnalysisPage;
