import styles from "./ChessCardWidget.module.scss";
import React from "react";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import { ButtonTypesEnum } from "../../utils/ButtonTypesEnum";
import { useChessCardWidgetController } from "../../controllers/widgets/ChessCard/ChessCardWidgetController";
import { IGameDto } from "../../dtos/IGameDto";

interface IChessCard {
  game: IGameDto;
}

const ChessCardWidgetComponent = ({ game }: IChessCard) => {
  const { onAcceptGame, onDeclineGame, onEnterGame, user } =
    useChessCardWidgetController();

  return (
    <Card>
      <div className={styles.historyCardRow}>
        <div>
          Партия с{" "}
          <span className="textBold">
            {game.blackPlayerId === user?.id
              ? game.whitePlayerName
              : game.blackPlayerName}
          </span>
        </div>
        <div>
          {game.gameStatus === "invitation" && user?.id === game.inviteeId && (
            <>
              <span className={styles.button}>
                <Button
                  onClick={() => (onAcceptGame ? onAcceptGame(game.id) : {})}
                  type={ButtonTypesEnum.Primary}
                >
                  Принять заявку
                </Button>
              </span>
              <Button
                onClick={() => (onDeclineGame ? onDeclineGame(game.id) : {})}
                type={ButtonTypesEnum.Danger}
              >
                Отклонить заявку
              </Button>
            </>
          )}
          {(game.gameStatus === "blackWin" ||
            game.gameStatus === "whiteWin" ||
            game.gameStatus === "stalemate" ||
            game.gameStatus === "draw" ||
            (game.gameStatus === "invitation" && user?.id === game.senderId) ||
            game.gameStatus === "inProgress") && (
            <Button
              onClick={() => (onEnterGame ? onEnterGame(game.id) : {})}
              type={ButtonTypesEnum.Primary}
            >
              Сесть за доску
            </Button>
          )}
        </div>
      </div>
      <div className={styles.historyCardRow}>
        <div className={styles.historyCardItem}>
          {game.whitePlayerName}: за белых
        </div>
        <div className={styles.historyCardItem}>
          {game.blackPlayerName}: за чёрных
        </div>
        <div className={`textSecondary ${styles.historyCardItem}`}></div>
      </div>
      <div className={styles.historyCardRow}>
        <div>{game.gameStatusFormatted}</div>
        <div className={`textSecondary `}>
          Партия началась {new Date(game.createdAt).toLocaleDateString()} в{" "}
          {new Date(game.createdAt).getHours()}:
          {new Date(game.createdAt).getMinutes()}
        </div>
      </div>
    </Card>
  );
};

export const ChessCardWidget = React.memo(ChessCardWidgetComponent);
