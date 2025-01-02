import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { makeMove } from '../services/api.ts';

const socket = io('http://localhost:3000');

const GameBoard: React.FC<{ gameId: number; token: string }> = ({ gameId, token }) => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState<number | null>(null);

  useEffect(() => {
    socket.on('updateGame', (data) => {
      if (data.gameId === gameId) {
        setBoard(data.board);
        setCurrentPlayer(data.currentPlayer);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [gameId]);

  const handleMove = async (index: number) => {
    try {
      if (board[index] === '') {
        await makeMove(gameId, index, token);
        socket.emit('move', { gameId, board });
      }
    } catch (err) {
      console.error('Invalid move:', err);
    }
  };

  return (
    <div>
      <h2>Game Board</h2>
      <div className="board">
        {board.map((cell, index) => (
          <button key={index} onClick={() => handleMove(index)}>
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
