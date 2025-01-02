const db = require('../db/db.js');

exports.createGame = (playerId) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO games (player1_id, status) VALUES (?, ?)';
    db.query(query, [playerId, 'waiting'], (err, results) => {
      if (err) return reject(err);
      resolve({ gameId: results.insertId, status: 'waiting' });
    });
  });
};

exports.makeMove = (playerId, gameId, move) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM games WHERE id = ?';
    db.query(query, [gameId], (err, results) => {
      if (err || results.length === 0) return reject('Game not found');
      const game = results[0];
      if (game.status !== 'active') return reject('Game is not active');
      if (game.currentPlayer !== playerId) return reject('Not your turn');
      // Add game move logic here
      resolve({ message: 'Move successful' });
    });
  });
};
  