import { FriendshipAPI } from "../../../services/FriendshipService";
import { UserAPI } from "../../../services/UserService";
import { useNavigate } from "react-router";

export const useCommunityPageController = () => {
  const { data: allFriendsData, isLoading: isFriendsLoading } =
    FriendshipAPI.useGetAllFriendsQuery(undefined, {refetchOnMountOrArgChange: true});
  const { data: topData, isLoading: isTopLoading } =
    UserAPI.useGetTopQuery(undefined, {pollingInterval: 5000});

  const navigate = useNavigate();

  const onAddFriend = () => {
    navigate("/community/add");
  };

  return {
    allFriendsData,
    onAddFriend,
    topData,
    isTopLoading,
    isFriendsLoading
  };
};
