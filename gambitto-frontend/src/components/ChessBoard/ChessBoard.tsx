import { Chess, Square } from 'chess.js';
import React, { memo, useEffect, useState } from 'react'
import { Chessboard } from 'react-chessboard';
import styles from './ChessBoard.module.scss';
import { CustomSquareProps, PromotionPieceOption } from 'react-chessboard/dist/chessboard/types';

interface IChessBoardProps {
  startingFen?: string;
  lastMove?: string;
  makeMove: (moveCode: string) => void;
  boardOrientation: 'black' | 'white',
}

type ISquares = {
  [key in Square]?: any
}

const ChessBoard = memo(function ChessBoard({startingFen, boardOrientation, makeMove, lastMove}: IChessBoardProps) {

  const [game, setGame] = useState(new Chess(startingFen));
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [moveTo, setMoveTo] = useState<Square | null>(null);
  const [optionSquares, setOptionSquares] = useState<ISquares>({});
  const [dangerSquares, setDangerSquares] = useState<ISquares>({});
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);

  const checkDangerSquares = () => {
    setDangerSquares({});
    if (game.isCheck() || game.isCheckmate()) {
      const board = game.board();
      const turn = game.turn();
      let newDangerSquares: ISquares = {};
      for (let row of board) {
        for (let square of row) {
          if (square?.type === 'k' && (square.color === 'b' && turn === 'b' || square.color === 'w' && turn === 'w')) {
            newDangerSquares[square.square] = {
              boxShadow: 'inset 0 0 5px 5px #B15653'
            }
          }
        }
      }
      setDangerSquares(newDangerSquares);
    }
  }

  useEffect(() => {
    if (!!startingFen) {
      checkDangerSquares();
    }
  }, [startingFen])

  if (!!lastMove && game.moves().find(value => value === lastMove)) {
    game.move(lastMove);
    checkDangerSquares();
  }

  const getMoveOptions = (square: Square) => {
    if (game.get(square).color === 'b' && boardOrientation === 'white' || game.get(square).color === 'w' && boardOrientation === 'black') {
      return;
    }
    const moves = game.moves({
      verbose: true,
      square
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
  }

  const onSquareClick = (square: Square) => {
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
  }

  const onPromotionPieceSelect = (piece?: PromotionPieceOption) => {
    // if no piece passed then user has cancelled dialog, don't make move and reset
    if (piece && moveFrom && moveTo) {
      const move = game.move({
        from: moveFrom,
        to: moveTo,
        promotion: piece[1].toLowerCase() ?? "q",
      });
      setGame(game);
      checkDangerSquares();
      makeMove(move.san);
    }

    setMoveFrom(null);
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
    return true;
  }
  
  return (
    <div className={styles.board}>
      <Chessboard
        animationDuration={200}
        arePiecesDraggable={false}
        position={game.fen()}
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
      />
    </div>
  );
})

const CustomSquare = React.forwardRef(({squareColor, children, style}: CustomSquareProps, ref) => {
  return (
    <div style={style} className={`${squareColor === 'black' ? styles.darkSquare : styles.lightSquare}`}>
      {children}
    </div>
  )
})

export default ChessBoard