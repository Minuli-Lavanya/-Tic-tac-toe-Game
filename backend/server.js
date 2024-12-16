const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const gameRoutes = require("./routes/games");

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/games", gameRoutes);  // This will handle routes like GET /games

// Start server
app.listen(3001, () => console.log("Server running on port 3001"));
