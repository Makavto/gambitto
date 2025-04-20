import styles from "./MovesHistory.module.scss";
import React from "react";
import { IHistoryMove } from "../../models/IHistoryMove";

interface IMovesHistoryProps {
  history: IHistoryMove[][];
  activeMove?: { number: number; moveCode: string };
  onMakeMoveActive: (newActiveMove: IHistoryMove) => void;
}

const MovesHistoryComponent = ({
  history,
  onMakeMoveActive,
  activeMove,
}: IMovesHistoryProps) => {
  return (
    <>
      <div>История ходов:</div>
      <div>
        {history.map((movePair, i) => (
          <div className={styles.historyItem} key={i}>
            {i + 1}.&nbsp;
            <button
              onClick={() => onMakeMoveActive(movePair[0])}
              className={`${styles.historyMove} ${
                movePair[0].number === activeMove?.number && styles.active
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
                    movePair[1].number === activeMove?.number && styles.active
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
    </>
  );
};

export const MovesHistory = React.memo(MovesHistoryComponent);
