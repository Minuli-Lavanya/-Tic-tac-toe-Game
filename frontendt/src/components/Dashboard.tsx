import React, { useState, useEffect } from "react";
import axios from "axios";
import GameBoard from "./GameBoard.tsx";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard: React.FC = () => {
    const [games, setGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [gameId, setGameId] = useState<number | null>(null);
    const token = localStorage.getItem("token");

    const fetchGames = async () => {
        try {
            const response = await axios.get("http://localhost:3001/games", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGames(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load games.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchGames();
        }
    }, [token]);

    const createGame = async () => {
        try {
            const response = await axios.post(
                "http://localhost:3001/games",
                { player1_id: 1, player2_id: 2 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setGameId(response.data.gameId);
            fetchGames();
        } catch (err) {
            setError("Failed to create game.");
        }
    };

    const handlePlayGame = (id: number) => {
        setGameId(id);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Game Dashboard</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            {games.length === 0 ? (
                <div className="text-center">
                    <p>No games available. Would you like to create a new game?</p>
                    <button className="btn btn-primary" onClick={createGame}>
                        Create Game
                    </button>
                </div>
            ) : (
                <div>
                    <h3 className="mb-3">Available Games</h3>
                    <div className="row">
                        {games.map((game) => (
                            <div className="col-md-4 mb-4" key={game.id}>
                                <div className="card shadow-lg" style={{ backgroundColor: "#001f3f", color: "white", borderRadius: "15px", border: "1px solidrgb(157, 178, 200)" }}>
                                    <div className="card-body">
                                        <h5 className="card-title text-light" style={{ fontSize: "1.5rem", fontWeight: "bold", textAlign:"center", color: "white"}}>Game ID: {game.id}</h5>
                                        <p className="card-text text-light" style={{ fontSize: "1.1rem" }}>Player 1: {game.player1_id}</p>
                                        <p className="card-text text-light" style={{ fontSize: "1.1rem" }}>Player 2: {game.player2_id}</p>
                                        <button
                                            className="btn btn-success btn-lg w-100"
                                            onClick={() => handlePlayGame(game.id)}
                                            style={{ backgroundColor: "#77b1d4", border: "none", fontWeight: "bold", transition: "background-color 0.3s ease" }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#57b9ff"}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#77b1d4"}
                                        >
                                            Play Game
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            )}

            {gameId && (
                <div className="mt-4">
                    <GameBoard gameId={gameId} token={token!} />
                </div>
            )}
        </div>
    );
};

export default Dashboard;

