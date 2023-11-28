import { FriendshipWsServerMethodsEnum } from "../models/enums/FriendshipWsMethodsEnum";
import { IFriendshipDto } from "./IFriendshipDto";

export interface IFriendshipInvitation {
  method: FriendshipWsServerMethodsEnum,
  data: {
    friendship: IFriendshipDto,
  }
}