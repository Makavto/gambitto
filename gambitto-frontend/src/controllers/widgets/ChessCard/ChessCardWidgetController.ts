import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { ChessAPI } from "../../../services/ChessService";
import { notificationsSlice } from "../../../store/reducers/notificationsSlice";

export const useChessCardWidgetController = () => {
  const { user } = useAppSelector((state) => state.userSlice);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

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
    navigate(`/chess/${id}`);
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
    user,
    onAcceptGame,
    onDeclineGame,
    onEnterGame,
  };
};
