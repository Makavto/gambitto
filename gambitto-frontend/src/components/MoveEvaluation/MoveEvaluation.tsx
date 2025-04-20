import React from "react";
import { MoveQualityEnum } from "../../models/enums/MoveQualityEnum";
import styles from "./MoveEvaluation.module.scss";

interface IMoveEvaluationProps {
  quality?: MoveQualityEnum | null;
  bestMove?: string | null;
}

const MoveEvaluationComponent: React.FC<IMoveEvaluationProps> = ({
  quality,
  bestMove,
}) => {
  const getQualityClass = (quality?: MoveQualityEnum | null) => {
    switch (quality) {
      case MoveQualityEnum.Best:
      case MoveQualityEnum.Excellent:
      case MoveQualityEnum.Good:
        return styles.good;
      case MoveQualityEnum.Inaccuracy:
        return styles.inaccuracy;
      case MoveQualityEnum.Mistake:
      case MoveQualityEnum.Blunder:
        return styles.bad;
      default:
        return "";
    }
  };

  return (
    <div className={styles.evaluation}>
      <div className={`${styles.quality} ${getQualityClass(quality)}`}>
        {quality}
      </div>
      {quality !== MoveQualityEnum.Best && bestMove && (
        <div className={styles.bestMove}>Лучший ход: {bestMove}</div>
      )}
    </div>
  );
};

export const MoveEvaluation = React.memo(MoveEvaluationComponent);
