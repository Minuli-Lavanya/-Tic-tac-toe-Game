import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

interface GameBoardProps {
    gameId: number;
    token: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameId, token }) => {
    const [board, setBoard] = useState<string[][]>([["", "", ""], ["", "", ""], ["", "", ""]]);
    const [currentPlayer, setCurrentPlayer] = useState<string>("X");
    const [winner, setWinner] = useState<string | null>(null);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);

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

    const checkWinner = (board: string[][]) => {
        const lines = [
            [board[0][0], board[0][1], board[0][2]],
            [board[1][0], board[1][1], board[1][2]],
            [board[2][0], board[2][1], board[2][2]],
            [board[0][0], board[1][0], board[2][0]],
            [board[0][1], board[1][1], board[2][1]],
            [board[0][2], board[1][2], board[2][2]],
            [board[0][0], board[1][1], board[2][2]],
            [board[0][2], board[1][1], board[2][0]],
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (a && a === b && a === c) {
                return a;
            }
        }

        if (board.flat().every(cell => cell !== "")) {
            return "DRAW";
        }

        return null;
    };

    const makeMove = async (row: number, col: number) => {
        if (isGameOver || board[row][col] !== "") return;

        const newBoard = board.map((r, i) => r.map((cell, j) => (i === row && j === col ? currentPlayer : cell)));

        setBoard(newBoard);

        const gameResult = checkWinner(newBoard);
        if (gameResult) {
            setWinner(gameResult);
            setIsGameOver(true);
            return;
        }

        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");

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
        <div className="container mt-4">
            <h3 className="text-center">Game ID: {gameId}</h3>
            <h4 className="text-center text-primary">
                {winner ? (winner === "DRAW" ? "It's a Draw!" : `Winner: ${winner}`) : `Current Player: ${currentPlayer}`}
            </h4>

            <div className="d-flex justify-content-center mt-4">
                <div className="game-board" style={{ backgroundColor: "#001f3f", borderRadius: "15px", padding:"25px"}}>
                    {board.map((row, rowIndex) => (
                        <div key={rowIndex} className="d-flex">
                            {row.map((cell, colIndex) => (
                                <button
                                    key={colIndex}
                                    onClick={() => makeMove(rowIndex, colIndex)}
                                    className="btn btn-light border"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        fontSize: "24px",
                                        backgroundColor: cell ? "#e9ecef" : "#fff",
                                    }}
                                >
                                    {cell}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameBoard;
