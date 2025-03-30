import { Navigate, RouteProps } from "react-router";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import StatsPage from "../pages/StatsPage/StatsPage";
import CommunityPage from "../pages/CommunityPage/CommunityPage";
import UserSearchPage from "../pages/UserSearchPage/UserSearchPage";
import GamePage from "../pages/GamePage/GamePage";
import NotificationsPage from "../pages/NotificationsPage/NotificationsPage";

const MainRoutes: RouteProps[] = [
  {
    path: '/profile',
    element: <ProfilePage/>
  },
  {
    path: '/stats',
    element: <StatsPage />
  },
  {
    path: '/community',
    element: <CommunityPage />,
  },
  {
    path: '/notifications',
    element: <NotificationsPage />,
  },
  {
    path: '/community/add',
    element: <UserSearchPage isForChessGame={false}/>,
  },
  {
    path: '/community/:userId',
    element: <ProfilePage />,
  },
  {
    path: '/community/:userId/stats',
    element: <StatsPage />,
  },
  {
    path: '/chess',
    element: <UserSearchPage isForChessGame={true}/>
  },
  {
    path: '/chess/:gameId',
    element: <GamePage />,
  },
  {
    path: '/chess/:gameId/user/:userId',
    element: <GamePage />,
  },
  {
    path: '/*',
    element: <Navigate to={'/profile'} replace/>
  }
]

const Routes: RouteProps[] = [
  ...MainRoutes
]

export default Routes;