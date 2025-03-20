import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { ChessAPI } from "../../../services/ChessService";
import { FriendshipAPI } from "../../../services/FriendshipService";
import { UserAPI } from "../../../services/UserService";

export const useUserSearchPageController = () => {
  const [getUsers, { data: usersData, isFetching: isUsersDataFetching }] =
    UserAPI.useLazyGetUsersQuery();

  const [sendFriendInvitation, { data: friendInvitationData }] =
    FriendshipAPI.useLazySendInvitationQuery();

  const [sendChessGameInvitation, { data: chessGameInvitationData }] =
    ChessAPI.useLazySendInvitationQuery();

  const [searchParams, setSearchParams] = useSearchParams();

  const { register } = useForm<{ searchQuery: string }>();

  const navigate = useNavigate();

  useEffect(() => {
    getUsers({ searchQuery: searchParams.get("searchQuery") ?? "" });
  }, [searchParams.get("searchQuery")]);

  let inputDelay: NodeJS.Timeout;

  const onSearch = (value: string) => {
    clearTimeout(inputDelay);
    inputDelay = setTimeout(function () {
      setSearchParams({ searchQuery: value });
    }, 500);
  };

  const onAddFriend = (id: number) => {
    sendFriendInvitation({ inviteeId: id });
  };

  const onStartChessGame = (id: number) => {
    sendChessGameInvitation({ inviteeId: id });
  };

  useEffect(() => {
    if (!!friendInvitationData) {
      getUsers({ searchQuery: searchParams.get("searchQuery") ?? "" });
    }
  }, [friendInvitationData]);

  useEffect(() => {
    if (!!chessGameInvitationData) {
      navigate(`/chess/${chessGameInvitationData.game.id}`);
    }
  }, [chessGameInvitationData]);
  return {
    onAddFriend,
    onSearch,
    onStartChessGame,
    register,
    usersData,
    isUsersDataFetching,
  };
};
