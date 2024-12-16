const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root123",
    database: "tic_tac_toe"
});

db.connect((err) => {
    if (err) console.error("Database connection failed:", err);
    else console.log("Connected to MySQL database");
});

module.exports = db;
