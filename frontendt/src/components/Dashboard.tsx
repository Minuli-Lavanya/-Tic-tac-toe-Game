import React, { useState, useEffect } from "react";
import axios from "axios";
import GameBoard from "./GameBoard.tsx"; // Assuming this is the component to render the game

const Dashboard: React.FC = () => {
    const [games, setGames] = useState<any[]>([]);  // To store the list of games
    const [loading, setLoading] = useState(true);  // To handle loading state
    const [error, setError] = useState("");  // To handle error
    const [gameId, setGameId] = useState<number | null>(null);  // To store the selected game ID
    const token = localStorage.getItem("token");  // Retrieve the token from local storage

    // Fetch games function
    const fetchGames = async () => {
        try {
            const response = await axios.get("http://localhost:3001/games", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGames(response.data);  // Set the list of games
            setLoading(false);  // Set loading to false once data is fetched
        } catch (err) {
            setError("Failed to load games.");
            setLoading(false);  // Stop loading if there's an error
        }
    };

    // Fetch games when component is mounted or when token changes
    useEffect(() => {
        if (token) {
            fetchGames();
        }
    }, [token]);

    // Function to create a new game
    const createGame = async () => {
        try {
            const response = await axios.post(
                "http://localhost:3001/games",
                {
                    player1_id: 1,  // Example player1_id (you can use the user ID here)
                    player2_id: 2,  // Example player2_id (you can use another user ID here)
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setGameId(response.data.gameId);  // Set the ID of the newly created game
            fetchGames();  // Fetch games again to update the list
        } catch (err) {
            setError("Failed to create game.");
        }
    };

    // Function to handle playing a game (set the selected game ID)
    const handlePlayGame = (id: number) => {
        setGameId(id); // Set the selected game ID
    };

    if (loading) {
        return <div>Loading or Create Game...</div>;  // Show loading message while fetching games
    }

    return (
        <div>
            <h2>Game Dashboard</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {games.length === 0 ? (
                <div>
                    <p>No games available. Would you like to create a new game?</p>
                    <button onClick={createGame}>Create Game</button>
                </div>
            ) : (
                <div>
                    <h3>Available Games:</h3>
                    {games.map((game) => (
                        <div key={game.id}>
                            <p>Game ID: {game.id}</p>
                            <p>Player 1: {game.player1_id}</p>
                            <p>Player 2: {game.player2_id}</p>
                            <button onClick={() => handlePlayGame(game.id)}>Play Game</button>
                        </div>
                    ))}
                </div>
            )}

            {gameId && <GameBoard gameId={gameId} token={token!} />}
        </div>
    );
};

export default Dashboard;
