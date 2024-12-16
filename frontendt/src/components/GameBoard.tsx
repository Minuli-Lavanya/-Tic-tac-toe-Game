import React, { useState, useEffect } from "react";
import axios from "axios";

interface GameBoardProps {
    gameId: number;
    token: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameId, token }) => {
    const [board, setBoard] = useState<string[][]>([["", "", ""], ["", "", ""], ["", "", ""]]); // Board state
    const [currentPlayer, setCurrentPlayer] = useState<string>("X"); // To keep track of the current player
    const [winner, setWinner] = useState<string | null>(null); // To store the winner, null if no winner
    const [isGameOver, setIsGameOver] = useState<boolean>(false); // To check if the game is over

    // Fetch the game state when the component mounts or the gameId changes
    useEffect(() => {
        const fetchGameState = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/games/${gameId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBoard(response.data.state);
            } catch (err) {
                console.error("Error fetching game state", err);
            }
        };

        if (gameId) {
            fetchGameState();
        }
    }, [gameId, token]);

    // Check for a winner
    const checkWinner = (board: string[][]) => {
        // Check rows, columns, and diagonals
        const lines = [
            // Rows
            [board[0][0], board[0][1], board[0][2]],
            [board[1][0], board[1][1], board[1][2]],
            [board[2][0], board[2][1], board[2][2]],
            // Columns
            [board[0][0], board[1][0], board[2][0]],
            [board[0][1], board[1][1], board[2][1]],
            [board[0][2], board[1][2], board[2][2]],
            // Diagonals
            [board[0][0], board[1][1], board[2][2]],
            [board[0][2], board[1][1], board[2][0]],
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (a && a === b && a === c) {
                return a; // Return winner ("X" or "O")
            }
        }

        // Check if the board is full (draw)
        if (board.flat().every(cell => cell !== "")) {
            return "DRAW";
        }

        return null; // No winner yet
    };

    // Handle making a move
    const makeMove = async (row: number, col: number) => {
        // Don't allow move if the game is over or the cell is already filled
        if (isGameOver || board[row][col] !== "") return;

        // Make the move by updating the board
        const newBoard = board.map((r, i) => r.map((cell, j) => {
            if (i === row && j === col) {
                return currentPlayer;
            }
            return cell;
        }));

        setBoard(newBoard);

        // Check for winner or draw
        const gameResult = checkWinner(newBoard);
        if (gameResult) {
            setWinner(gameResult);
            setIsGameOver(true);
            return;
        }

        // Switch to the next player (X or O)
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");

        // Update the backend with the new state
        try {
            await axios.post(
                `http://localhost:3001/games/${gameId}/move`,
                { row, col },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error("Error making move", err);
        }
    };

    return (
        <div>
            <h3>Game ID: {gameId}</h3>
            <h4>Current Player: {currentPlayer}</h4>
            {winner && <h3>{winner === "DRAW" ? "It's a draw!" : `Winner: ${winner}`}</h3>}

            <div>
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} style={{ display: "flex" }}>
                        {row.map((cell, colIndex) => (
                            <button
                                key={colIndex}
                                onClick={() => makeMove(rowIndex, colIndex)}
                                style={{
                                    width: 50,
                                    height: 50,
                                    fontSize: "20px",
                                    backgroundColor: cell ? "#ddd" : "#fff",
                                }}
                            >
                                {cell}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameBoard;
