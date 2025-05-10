import { Chess, Square } from "chess.js";
import React, { memo, useEffect, useMemo, useState } from "react";
import { Chessboard } from "react-chessboard";
import styles from "./ChessBoard.module.scss";
import {
  CustomSquareProps,
  PromotionPieceOption,
} from "react-chessboard/dist/chessboard/types";
import { MoveQualityEnum } from "../../models/enums/MoveQualityEnum";

interface IChessBoardProps {
  startingFen?: string;
  makeMove: (moveCode: string) => void;
  boardOrientation: "black" | "white";
  isMovingBlocked?: boolean;
  bestMoves?: string[];
}

type ISquares = {
  [key in Square]?: any;
};

const ChessBoard = memo(function ChessBoard({
  startingFen,
  boardOrientation,
  makeMove,
  isMovingBlocked,
  bestMoves,
}: IChessBoardProps) {
  const game = useMemo(() => new Chess(startingFen), []);
  const [chessBoardPosition, setChessBoardPosition] = useState("start");
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<ISquares>({});
  const [dangerSquares, setDangerSquares] = useState<ISquares>({});
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [arrows, setArrows] = useState<[Square, Square][]>([]);

  const checkDangerSquares = () => {
    setDangerSquares({});
    if (game.isCheck() || game.isCheckmate()) {
      const board = game.board();
      const turn = game.turn();
      let newDangerSquares: ISquares = {};
      for (let row of board) {
        for (let square of row) {
          if (
            square?.type === "k" &&
            ((square.color === "b" && turn === "b") ||
              (square.color === "w" && turn === "w"))
          ) {
            newDangerSquares[square.square] = {
              boxShadow: "inset 0 0 5px 5px #B15653",
            };
          }
        }
      }
      setDangerSquares(newDangerSquares);
    }
  };

  useEffect(() => {
    if (!!startingFen) {
      game.load(startingFen);
      checkDangerSquares();
      setChessBoardPosition(game.fen());
    }
  }, [startingFen]);

  useEffect(() => {
    if (bestMoves) {
      const newArrows: [Square, Square][] = [];

      bestMoves.forEach((move) => {
        const from = move.slice(0, 2) as Square;
        const to = move.slice(2, 4) as Square;
        newArrows.push([from, to]);
      });

      setArrows(newArrows);
    } else {
      setArrows([]);
    }
  }, [bestMoves, startingFen]);

  const getMoveOptions = (square: Square) => {
    if (
      (game.get(square).color === "b" && boardOrientation === "white") ||
      (game.get(square).color === "w" && boardOrientation === "black")
    ) {
      return;
    }
    const moves = game.moves({
      verbose: true,
      square,
    });

    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: ISquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  };

  const onSquareClick = (square: Square) => {
    if (isMovingBlocked) {
      return;
    }
    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    // to square
    if (!moveTo) {
      // check if valid move before showing dialog
      const moves = game.moves({
        verbose: true,
        square: moveFrom,
      });
      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square
      );
      // not a valid move
      if (!foundMove) {
        // check if clicked on new piece
        const hasMoveOptions = getMoveOptions(square);
        // if new piece, setMoveFrom, otherwise clear moveFrom
        setMoveFrom(hasMoveOptions ? square : null);
        return;
      }

      // valid move
      setMoveTo(square);

      // if promotion move
      if (
        (foundMove.color === "w" &&
          foundMove.piece === "p" &&
          square[1] === "8") ||
        (foundMove.color === "b" &&
          foundMove.piece === "p" &&
          square[1] === "1")
      ) {
        setShowPromotionDialog(true);
        return;
      }

      // is normal move
      const move = game.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      checkDangerSquares();
      makeMove(move.san);

      // if invalid, setMoveFrom and getMoveOptions
      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }

      setMoveFrom(null);
      setMoveTo(null);
      setOptionSquares({});
      return;
    }
  };

  const onPromotionPieceSelect = (piece?: PromotionPieceOption) => {
    // if no piece passed then user has cancelled dialog, don't make move and reset
    if (piece && moveFrom && moveTo) {
      const move = game.move({
        from: moveFrom,
        to: moveTo,
        promotion: piece[1].toLowerCase() ?? "q",
      });
      checkDangerSquares();
      makeMove(move.san);
    }

    setMoveFrom(null);
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
    return true;
  };

  // TODO: Implement this
  const onPieceDragBegin = (piece: string, sourceSquare: Square) => {
    if (isMovingBlocked) return false;

    const pieceColor = piece[0] === "w" ? "w" : "b";
    const isCorrectColor =
      (pieceColor === "w" && boardOrientation === "white") ||
      (pieceColor === "b" && boardOrientation === "black");

    if (!isCorrectColor) return false;

    const moves = game.moves({
      verbose: true,
      square: sourceSquare,
    });

    if (moves.length === 0) return false;

    return true;
  };

  const onPieceDrop = (
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ) => {
    if (isMovingBlocked) return false;

    const moves = game.moves({
      verbose: true,
      square: sourceSquare,
    });

    const move = moves.find(
      (m) => m.from === sourceSquare && m.to === targetSquare
    );

    if (!move) return false;

    // Handle promotion
    if (
      (move.color === "w" && move.piece === "p" && targetSquare[1] === "8") ||
      (move.color === "b" && move.piece === "p" && targetSquare[1] === "1")
    ) {
      setMoveFrom(sourceSquare);
      setMoveTo(targetSquare);
      setShowPromotionDialog(true);
      return false;
    }

    // Make normal move
    const chessMove = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (chessMove === null) return false;

    checkDangerSquares();
    makeMove(chessMove.san);
    setChessBoardPosition(game.fen());
    return true;
  };

  return (
    <div className={styles.board}>
      <Chessboard
        animationDuration={200}
        arePiecesDraggable={false}
        position={chessBoardPosition}
        boardOrientation={boardOrientation}
        onSquareClick={onSquareClick}
        customSquareStyles={{
          ...optionSquares,
          ...dangerSquares,
        }}
        onPromotionPieceSelect={onPromotionPieceSelect}
        promotionToSquare={moveTo}
        showPromotionDialog={showPromotionDialog}
        areArrowsAllowed={true}
        customSquare={CustomSquare}
        customArrows={arrows}
      />
    </div>
  );
});

const CustomSquare = React.forwardRef<HTMLDivElement, CustomSquareProps>(
  ({ squareColor, children, style }: CustomSquareProps, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        className={`${
          squareColor === "black" ? styles.darkSquare : styles.lightSquare
        }`}
      >
        {children}
      </div>
    );
  }
);

export default ChessBoard;
