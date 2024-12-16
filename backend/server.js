const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);

// Start server
app.listen(3001, () => console.log("Server running on port 3001"));
