import styles from './ChessGameField.module.scss';
import React from "react";
import { IUser } from "../../models/IUser";
import { IGameFullInfoDto } from "../../dtos/IGameFullInfoDto";
import ChessBoard from "../ChessBoard/ChessBoard";
import { GetSignedNumber } from '../../utils/GetSignedNumber';

interface IChessGameFieldProps {
  chessGame: IGameFullInfoDto;
  opponentData: IUser;
  user: IUser;
  startingFen?: string;
  isMovingBlocked: boolean;
  onMakeMove: (moveCode: string) => void;
}

const ChessGameFieldComponent = ({
  chessGame,
  opponentData,
  user,
  startingFen,
  isMovingBlocked,
  onMakeMove,
}: IChessGameFieldProps) => {
  return (
    <>
      <div className="textBig">
        {opponentData && (
          <span>
            {opponentData.username} (
            {chessGame.gameStatus === "inProgress"
              ? opponentData.rating
              : chessGame.blackPlayerId === opponentData.id
              ? chessGame.blackPlayerRating
              : chessGame.whitePlayerRating}
            ){" "}
            {chessGame.gameStatus !== "inProgress" &&
            chessGame.blackPlayerId === opponentData.id
              ? chessGame.blackPlayerDelta && (
                  <span
                    className={`textSmall ${
                      chessGame.blackPlayerDelta > 0
                        ? "textSuccess"
                        : "textAccent"
                    }`}
                  >
                    {GetSignedNumber(chessGame.blackPlayerDelta)}
                  </span>
                )
              : chessGame.whitePlayerDelta && (
                  <span
                    className={`textSmall ${
                      chessGame.whitePlayerDelta > 0
                        ? "textSuccess"
                        : "textAccent"
                    }`}
                  >
                    {GetSignedNumber(chessGame.whitePlayerDelta)}
                  </span>
                )}
          </span>
        )}
      </div>
      <ChessBoard
        startingFen={startingFen}
        isMovingBlocked={isMovingBlocked}
        makeMove={onMakeMove}
        boardOrientation={
          chessGame.blackPlayerId === user?.id ? "black" : "white"
        }
      />
      <div className={`textBig ${styles.user}`}>
        <span>
          {user?.username} (
          {chessGame.gameStatus === "inProgress"
            ? user?.rating
            : chessGame.blackPlayerId === user?.id
            ? chessGame.blackPlayerRating
            : chessGame.whitePlayerRating}
          ){" "}
          {chessGame.gameStatus !== "inProgress" &&
          chessGame.blackPlayerId === user?.id
            ? chessGame.blackPlayerDelta && (
                <span
                  className={`textSmall ${
                    chessGame.blackPlayerDelta > 0
                      ? "textSuccess"
                      : "textAccent"
                  }`}
                >
                  {GetSignedNumber(chessGame.blackPlayerDelta)}
                </span>
              )
            : chessGame.whitePlayerDelta && (
                <span
                  className={`textSmall ${
                    chessGame.whitePlayerDelta > 0
                      ? "textSuccess"
                      : "textAccent"
                  }`}
                >
                  {GetSignedNumber(chessGame.whitePlayerDelta)}
                </span>
              )}
        </span>
      </div>
    </>
  );
};

export const ChessGameField = React.memo(ChessGameFieldComponent);
