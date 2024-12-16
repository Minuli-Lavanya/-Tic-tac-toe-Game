const express = require("express");
const db = require("../db/connection");

const router = express.Router();

// GET /games - Retrieve all games
router.get("/", (req, res) => {
    db.query("SELECT * FROM games", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// POST /games - Create a new game
router.post("/", (req, res) => {
    const { player1_id, player2_id } = req.body;
    db.query(
        "INSERT INTO games (player1_id, player2_id, state) VALUES (?, ?, ?)",
        [player1_id, player2_id, JSON.stringify([["", "", ""], ["", "", ""], ["", "", ""]])],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({ message: "Game created", gameId: result.insertId });
        }
    );
});

// GET /game/:id - Retrieve the game state
router.get("/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT state FROM games WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: "Game not found" });

        let state = results[0].state;
        console.log("Fetched state:", state);

        // Check if the state is a string and needs to be parsed
        if (typeof state === 'string') {
            try {
                state = JSON.parse(state);  // Parse the JSON if it's a string
            } catch (jsonErr) {
                console.error("Error parsing game state:", jsonErr);
                return res.status(500).json({ message: "Invalid game state data" });
            }
        }

        res.json({ state });
    });
});


// POST /game/:id/move - Update the game state after a move
router.post("/:id/move", (req, res) => {
    const { row, col } = req.body;
    const { id } = req.params;

    db.query("SELECT state FROM games WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: "Game not found" });

        let state = results[0].state;
        console.log("Fetched state:", state); // Log the fetched state

        // Check the type of state to determine if it's already parsed
        if (typeof state === 'string') {
            try {
                state = JSON.parse(state); // Parse the state if it's a string
            } catch (jsonErr) {
                console.error("Error parsing game state:", jsonErr);
                return res.status(500).json({ message: "Invalid game state data" });
            }
        } else if (typeof state !== 'object') {
            console.error("State is not an object or array:", state);
            return res.status(500).json({ message: "Invalid game state data" });
        }

        // Check if the cell is already occupied
        if (state[row][col] !== "") return res.status(400).json({ message: "Cell already occupied" });

        // Update the board with the move (X or O)
        state[row][col] = "X"; // You can toggle between "X" and "O" depending on the player's turn

        db.query("UPDATE games SET state = ? WHERE id = ?", [JSON.stringify(state), id], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ state });
        });
    });
});

module.exports = router;
