import { RouteProps } from "react-router";
import MainPage from "../pages/MainPage/MainPage";

const MainRoutes: RouteProps[] = [
  {
    path: '/*',
    Component: MainPage
  }
]

const Routes: RouteProps[] = [
  ...MainRoutes
]

export default Routes;