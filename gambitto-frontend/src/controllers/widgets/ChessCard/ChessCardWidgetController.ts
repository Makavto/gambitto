import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { ChessAPI } from "../../../services/ChessService";
import { notificationsSlice } from "../../../store/reducers/notificationsSlice";

export const useChessCardWidgetController = () => {
  const { user } = useAppSelector((state) => state.userSlice);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { userId } = useParams();

  const [acceptChess, { data: acceptChessData }] =
    ChessAPI.useLazyAcceptInvitationQuery();
  const [declineChess, { data: declineChessData }] =
    ChessAPI.useLazyDeclineInvitationQuery();

  const { deleteChessNotification } = notificationsSlice.actions;

  const onAcceptGame = (id: number) => {
    acceptChess({ gameId: id });
  };

  const onDeclineGame = (id: number) => {
    declineChess({ gameId: id });
  };

  const onEnterGame = (id: number) => {
    if (userId) {
      navigate(`/chess/${id}/user/${userId}`);
    } else {
      navigate(`/chess/${id}`);
    }
  };

  useEffect(() => {
    if (!!acceptChessData) {
      dispatch(deleteChessNotification(acceptChessData.game));
      navigate(`/chess/${acceptChessData.game.id}`);
    }
  }, [acceptChessData]);

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
