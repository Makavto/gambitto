import styles from "./ChessCardWidget.module.scss";
import React from "react";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import { ButtonTypesEnum } from "../../utils/ButtonTypesEnum";
import { useChessCardWidgetController } from "../../controllers/widgets/ChessCard/ChessCardWidgetController";
import { IGameDto } from "../../dtos/IGameDto";
import { useNavigate } from "react-router";

interface IChessCard {
  game: IGameDto;
}

const ChessCardWidgetComponent = ({ game }: IChessCard) => {
  const { onAcceptGame, onDeclineGame, onEnterGame, userId, user } =
    useChessCardWidgetController();

  const navigate = useNavigate();

  return (
    <Card>
      <div className={styles.historyCardRow}>
        <div>
          {game.gameTypeFormatted} партия с{" "}
          {game.blackPlayerId === userId ? (
            <Button
              type={ButtonTypesEnum.Link}
              onClick={() =>
                navigate(
                  game.whitePlayerId === user?.id
                    ? "/profile"
                    : `/community/${game.whitePlayerId}`
                )
              }
            >
              {game.whitePlayerName}
            </Button>
          ) : (
            <Button
              type={ButtonTypesEnum.Link}
              onClick={() =>
                navigate(
                  game.blackPlayerId === user?.id
                    ? "/profile"
                    : `/community/${game.blackPlayerId}`
                )
              }
            >
              {game.blackPlayerName}
            </Button>
          )}
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
              onClick={() => onEnterGame(game.id)}
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
