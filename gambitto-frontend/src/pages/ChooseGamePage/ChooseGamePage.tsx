import { NavLink } from "react-router-dom";
import Card from "../../components/Card/Card";
import { FriendlyChessIcon } from "../../icons/FriendlyChessIcon";
import { RatingChessIcon } from "../../icons/RatingChessIcon";
import styles from "./ChooseGamePage.module.scss";
import React from "react";

const ChooseGamePageComponent = () => {
  return (
    <div className={styles.pageWrapper}>
      <div className="textBig title">Новая партия</div>
      <div className={styles.rowWrapper}>
        <NavLink className={styles.rowItem} to={"/chess/rating"}>
          <Card>
            <div className={styles.itemContainer}>
              <div className={styles.gameIcon}>
                <RatingChessIcon />
              </div>
              <div className="textBig">Рейтинговая (случайный соперник)</div>
            </div>
          </Card>
        </NavLink>
        <NavLink className={styles.rowItem} to={"/chess/friendly"}>
          <Card>
            <div className={styles.itemContainer}>
              <div className={styles.gameIcon}>
                <FriendlyChessIcon />
              </div>
              <div className="textBig">Товарищеская (по приглашению)</div>
            </div>
          </Card>
        </NavLink>
      </div>
      <div className="textBig title">Партии в процессе</div>
    </div>
  );
};

export const ChooseGamePage = React.memo(ChooseGamePageComponent);
