import React from "react";
import { Loader } from "../../components/Loader/Loader";
import styles from "./RatingGamePage.module.scss";
import { useRatingGamePageController } from "../../controllers/pages/RatingGamePage/RatingGamePageController";

const RatingGamePageComponent = () => {
  useRatingGamePageController();

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loaderWrapper}>
        <Loader />
      </div>
      <div className="textBig">Поиск соперника...</div>
    </div>
  );
};

export const RatingGamePage = React.memo(RatingGamePageComponent);
