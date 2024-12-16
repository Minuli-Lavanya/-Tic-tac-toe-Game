const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root123",
    database: "tic_tac_toe"
});

// Start server
app.listen(3001, () => console.log("Server running on port 3001"));
