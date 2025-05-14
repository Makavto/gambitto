import { useEffect } from "react";
import { FriendshipAPI } from "../../../services/FriendshipService";
import { UserAPI } from "../../../services/UserService";
import { useNavigate } from "react-router";

export const useCommunityPageController = () => {
  const [getAllFriends, { data: allFriendsData }] =
    FriendshipAPI.useLazyGetAllFriendsQuery();
  const [getTop, { data: topData, isLoading: isTopLoading }] =
    UserAPI.useLazyGetTopQuery();

  useEffect(() => {
    getAllFriends();
    getTop();
  }, []);

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
