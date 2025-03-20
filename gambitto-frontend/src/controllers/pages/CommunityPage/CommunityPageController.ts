import { useEffect } from "react";
import { useAppSelector } from "../../../hooks/redux";
import { FriendshipAPI } from "../../../services/FriendshipService";
import { UserAPI } from "../../../services/UserService";
import { useNavigate } from "react-router";

export const useCommunityPageController = () => {
  const { friendshipWsReady } = useAppSelector((state) => state.wsSlice);

  const [getAllFriends, { data: allFriendsData }] =
    FriendshipAPI.useLazyGetAllFriendsQuery();
  const [getTop, { data: topData, isLoading: isTopLoading }] =
    UserAPI.useLazyGetTopQuery();

  useEffect(() => {
    if (friendshipWsReady) {
      getAllFriends();
      getTop();
    }
  }, [friendshipWsReady]);

  const navigate = useNavigate();

  const onAddFriend = () => {
    navigate("/community/add");
  };

  return {
    allFriendsData,
    onAddFriend,
    topData,
    isTopLoading,
  };
};
