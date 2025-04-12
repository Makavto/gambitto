import React from "react";
import styles from "./EvaluationBar.module.scss";

interface IEvaluationBarProps {
  evalCp?: number; // от -∞ до +∞
  maxCp?: number; // опционально, по умолчанию 1000
  mate?: number;
}

const EvaluationBarComponent = ({
  evalCp = 0,
  maxCp = 1000,
  mate,
}: IEvaluationBarProps) => {
  const clamped = Math.max(-maxCp, Math.min(evalCp, maxCp));
  const percent = ((clamped + maxCp) / (2 * maxCp)) * 100;

  const formatEval = () => {
    if (mate) {
      if (mate > 0) return `М${mate}`;
      if (mate < 0) return `-М${Math.abs(mate)}`;
    }

    const absCp = Math.abs(evalCp);
    const sign = evalCp > 0 ? "+" : "-";
    const pawns = (absCp / 100).toFixed(1);

    return `${sign}${pawns}`;
  };

  return (
    <div className={styles.bar}>
      <div
        className={styles.whiteZone}
        style={{ height: `${mate ? (mate > 0 ? 100 : 0) : percent}%` }}
      />
      <div
        className={styles.blackZone}
        style={{ height: `${100 - (mate ? (mate > 0 ? 100 : 0) : percent)}%` }}
      />
      <div className={styles.evalText}>{formatEval()}</div>
    </div>
  );
};

export const EvaluationBar = React.memo(EvaluationBarComponent);
