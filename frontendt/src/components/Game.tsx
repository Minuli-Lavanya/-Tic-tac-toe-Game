import React, { useState } from "react";
import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
  opponent: string;
  playingAs: string;
}

const Game: React.FC<Props> = ({ socket, opponent, playingAs }) => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [turn, setTurn] = useState<string>("circle");

  const handleMove = (index: number) => {
    if (board[index] || turn !== playingAs) return;

    const updatedBoard = [...board];
    updatedBoard[index] = playingAs;
    setBoard(updatedBoard);
    setTurn(turn === "circle" ? "cross" : "circle");

    socket.emit("playerMoveFromClient", { index, mark: playingAs });
  };

  socket.on("playerMoveFromServer", ({ index, mark }) => {
    const updatedBoard = [...board];
    updatedBoard[index] = mark;
    setBoard(updatedBoard);
    setTurn(turn === "circle" ? "cross" : "circle");
  });

  return (
    <div>
      <h3>Playing as: {playingAs}</h3>
      <h3>Opponent: {opponent}</h3>
      <div className="board">
        {board.map((cell, idx) => (
          <div
            key={idx}
            className={`cell ${cell}`}
            onClick={() => handleMove(idx)}
          >
            {cell}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Game;
