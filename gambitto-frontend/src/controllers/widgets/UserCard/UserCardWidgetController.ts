import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { FriendshipAPI } from "../../../services/FriendshipService";
import { notificationsSlice } from "../../../store/reducers/notificationsSlice";

export const useUserCardWidgetController = () => {
  const [deleteFriend, { data: deleteFriendData }] =
    FriendshipAPI.useLazyDeleteFriendshipQuery();
  const [acceptFriend, { data: acceptFriendData }] =
    FriendshipAPI.useLazyAcceptInvitationQuery();
  const [declineFriend, { data: declineFriendData }] =
    FriendshipAPI.useLazyDeclineInvitationQuery();

  const { user } = useAppSelector((state) => state.userSlice);

  const dispatch = useAppDispatch();
  const { deleteFriendshipNotification } = notificationsSlice.actions;

  const onDeleteFriend = (id: number) => {
    deleteFriend({ invitationId: id });
  };

  const onDeclineFriend = (id: number) => {
    declineFriend({ invitationId: id });
  };

  const onAcceptFriend = (id: number) => {
    acceptFriend({ invitationId: id });
  };

  useEffect(() => {
    if (!!deleteFriendData) {
      dispatch(deleteFriendshipNotification(deleteFriendData.friendship));
    }
  }, [deleteFriendData]);

  useEffect(() => {
    if (!!declineFriendData) {
      dispatch(deleteFriendshipNotification(declineFriendData.friendship));
    }
  }, [declineFriendData]);

  useEffect(() => {
    if (!!acceptFriendData) {
      dispatch(deleteFriendshipNotification(acceptFriendData.friendship));
    }
  }, [acceptFriendData]);

  return {
    user,
    onAcceptFriend,
    onDeclineFriend,
    onDeleteFriend,
  };
};
