import { IUser } from "./IUser";

export interface ILogin {
  accessToken: string,
  refreshToken: string,
  user: IUser
}