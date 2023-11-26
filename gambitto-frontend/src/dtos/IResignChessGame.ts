import { ChessWsServerMethodsEnum } from "../models/enums/ChessWsMethodsEnum";
import { IGameDto } from "./IGameDto";

export interface IResignChessGameDto {
  method: ChessWsServerMethodsEnum.Resigned,
  data: {
    game: IGameDto
  }
}