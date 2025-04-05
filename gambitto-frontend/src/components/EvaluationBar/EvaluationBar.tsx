import React from "react";
import styles from "./EvaluationBar.module.scss";

interface IEvaluationBarProps {
  evalCp: number; // от -∞ до +∞
  maxCp?: number; // опционально, по умолчанию 1000
}

const EvaluationBarComponent = ({
  evalCp,
  maxCp = 1000,
}: IEvaluationBarProps) => {
  const clamped = Math.max(-maxCp, Math.min(evalCp, maxCp));
  const percent = ((clamped + maxCp) / (2 * maxCp)) * 100;

  const displayValue =
    evalCp > 900
      ? "Мат в N"
      : evalCp < -900
      ? "Мат в N"
      : `${(evalCp / 100).toFixed(2)}`;

  return (
    <div className={styles.evaluationBar}>
      <div className={styles.label + " " + styles.top}>Преимущество чёрных</div>

      <div className={styles.bar}>
        <div className={styles.whiteZone} style={{ height: `${percent}%` }} />
        <div
          className={styles.blackZone}
          style={{ height: `${100 - percent}%` }}
        />
        <div className={styles.evalText}>{displayValue}</div>
      </div>

      <div className={styles.label + " " + styles.bottom}>
        Преимущество белых
      </div>
    </div>
  );
};

export const EvaluationBar = React.memo(EvaluationBarComponent);
