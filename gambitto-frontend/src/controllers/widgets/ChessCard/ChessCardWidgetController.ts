import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { ChessAPI } from "../../../services/ChessService";
import { notificationsSlice } from "../../../store/reducers/notificationsSlice";

// Контроллер виджета карточки шахматной игры
// Управляет отображением информации об игре и действиями с ней
export const useChessCardWidgetController = () => {
  const { user } = useAppSelector((state) => state.userSlice);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { userId } = useParams();

  // Хуки для взаимодействия с API
  const [acceptChess, { data: acceptChessData }] =
    ChessAPI.useLazyAcceptInvitationQuery();
  const [declineChess, { data: declineChessData }] =
    ChessAPI.useLazyDeclineInvitationQuery();

  const { deleteChessNotification } = notificationsSlice.actions;

  // Обработчик принятия приглашения на игру
  const onAcceptGame = (id: number) => {
    acceptChess({ gameId: id });
  };

  // Обработчик отклонения приглашения на игру
  const onDeclineGame = (id: number) => {
    declineChess({ gameId: id });
  };

  // Обработчик перехода на страницу игры
  const onEnterGame = (id: number) => {
    if (userId) {
      navigate(`/chess/game/${id}/user/${userId}`);
    } else {
      navigate(`/chess/game/${id}`);
    }
  };

  // Обработка успешного принятия игры
  // Удаляет уведомление и перенаправляет на страницу игры
  useEffect(() => {
    if (!!acceptChessData) {
      dispatch(deleteChessNotification(acceptChessData.game));
      navigate(`/chess/game/${acceptChessData.game.id}`);
    }
  }, [acceptChessData]);

  // Обработка успешного отклонения игры
  // Удаляет уведомление о приглашении
  useEffect(() => {
    if (!!declineChessData) {
      dispatch(deleteChessNotification(declineChessData.game));
    }
  }, [declineChessData]);

  return {
    userId: !!userId ? Number(userId) : user?.id,
    user,
    onAcceptGame,
    onDeclineGame,
    onEnterGame,
  };
};
