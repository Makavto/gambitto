import { Navigate, RouteProps } from "react-router";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import StatsPage from "../pages/StatsPage/StatsPage";
import CommunityPage from "../pages/CommunityPage/CommunityPage";
import UserSearchPage from "../pages/UserSearchPage/UserSearchPage";
import GamePage from "../pages/GamePage/GamePage";
import NotificationsPage from "../pages/NotificationsPage/NotificationsPage";
import { ChooseGamePage } from "../pages/ChooseGamePage/ChooseGamePage";
import { RatingGamePage } from "../pages/RatingGamePage/RatingGamePage";

const MainRoutes: RouteProps[] = [
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/stats",
    element: <StatsPage />,
  },
  {
    path: "/community",
    element: <CommunityPage />,
  },
  {
    path: "/notifications",
    element: <NotificationsPage />,
  },
  {
    path: "/community/add",
    element: <UserSearchPage isForChessGame={false} />,
  },
  {
    path: "/community/:userId",
    element: <ProfilePage />,
  },
  {
    path: "/community/:userId/stats",
    element: <StatsPage />,
  },
  {
    path: "/chess",
    element: <ChooseGamePage />,
  },
  {
    path: "/chess/rating",
    element: <RatingGamePage />,
  },
  {
    path: "/chess/friendly",
    element: <UserSearchPage isForChessGame={true} />,
  },
  {
    path: "/chess/game/:gameId",
    element: <GamePage />,
  },
  {
    path: "/chess/game/:gameId/user/:userId",
    element: <GamePage />,
  },
  {
    path: "/*",
    element: <Navigate to={"/profile"} replace />,
  },
];

const Routes: RouteProps[] = [...MainRoutes];

export default Routes;
