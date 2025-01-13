const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3001", credentials: true },
});

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Malithi#01",
  database: "tic_tac_toe",
});

db.connect((err) => {
  if (err) console.error("Database connection error:", err);
  else console.log("Database connected!");
});

// Register Endpoint
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).json({ message: "User already exists." });
      res.json({ message: "User registered successfully!" });
    }
  );
});

// Login Endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err || results.length === 0) return res.status(401).json({ message: "User not found." });

      const isValidPassword = await bcrypt.compare(password, results[0].password);
      if (!isValidPassword) return res.status(401).json({ message: "Invalid credentials." });

      const token = jwt.sign({ id: results[0].id, username }, "your_secret_key", { expiresIn: "1h" });
      res.json({ token });
    }
  );
});

// WebSocket Logic
const allUsers = {};
const allRooms = [];
io.on("connection", (socket) => {
  socket.on("authenticate", (data) => {
    try {
      const decoded = jwt.verify(data.token, "your_secret_key");
      allUsers[socket.id] = { username: decoded.username, socket, online: true };
    } catch {
      socket.emit("unauthorized");
    }
  });

  socket.on("request_to_play", (data) => {
    const currentUser = allUsers[socket.id];
    
    if (!currentUser) {
      socket.emit("unauthorized");
      return;
    }
  
    currentUser.playerName = data.playerName;
  
    let opponentPlayer;
  
    // Search for an available opponent
    for (const key in allUsers) {
      const user = allUsers[key];
      if (user.online && !user.playing && socket.id !== key) {
        opponentPlayer = user;
        break;
      }
    }
  
    if (opponentPlayer) {
      // If an opponent is found, create a room and start the game
      allRooms.push({
        player1: opponentPlayer,
        player2: currentUser,
      });
  
      // Notify both players
      currentUser.socket.emit("OpponentFound", {
        opponentName: opponentPlayer.playerName,
        playingAs: "circle", // Player 1 is the circle
      });
  
      opponentPlayer.socket.emit("OpponentFound", {
        opponentName: currentUser.playerName,
        playingAs: "cross", // Player 2 is the cross
      });
  
      // Set up communication for player moves
      currentUser.socket.on("playerMoveFromClient", (data) => {
        opponentPlayer.socket.emit("playerMoveFromServer", { ...data });
      });
  
      opponentPlayer.socket.on("playerMoveFromClient", (data) => {
        currentUser.socket.emit("playerMoveFromServer", { ...data });
      });
    } else {
      // No opponent found
      currentUser.socket.emit("OpponentNotFound");
    }
  });
  
  

  socket.on("disconnect", () => {
    delete allUsers[socket.id];
  });
});

httpServer.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
