import { IUser } from "../models/IUser";
import { FriendshipWsServerMethodsEnum } from "../models/enums/FriendshipWsMethodsEnum";
import { IFriendshipDto } from "./IFriendshipDto";
import { IInvitationStatusDto } from "./IInvitationStatusDto";

export interface IFriendshipInvitation {
  method: FriendshipWsServerMethodsEnum,
  data: {
    newFriendship: {
      friendship: IFriendshipDto,
      invitationStatus?: IInvitationStatusDto
    },
    sender: IUser
  }
}