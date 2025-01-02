const db = require('../db/db');

exports.createGame = (req, res) => {
  const { id } = req.user;

  db.query(
    'INSERT INTO games (player1_id, status, current_player) VALUES (?, "waiting", ?)',
    [id, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ gameId: result.insertId, status: 'waiting' });
    }
  );
};

exports.makeMove = (req, res) => {
  const { gameId, move } = req.body;
  const { id: playerId } = req.user;

  db.query('SELECT * FROM games WHERE id = ?', [gameId], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ message: 'Game not found' });

    const game = results[0];

    if (game.current_player !== playerId)
      return res.status(400).json({ message: 'Not your turn' });

    const board = JSON.parse(game.board || '["", "", "", "", "", "", "", "", ""]');

    if (board[move] !== '') return res.status(400).json({ message: 'Invalid move' });

    board[move] = playerId === game.player1_id ? 'X' : 'O';

    const nextPlayer = playerId === game.player1_id ? game.player2_id : game.player1_id;

    db.query(
      'UPDATE games SET board = ?, current_player = ? WHERE id = ?',
      [JSON.stringify(board), nextPlayer, gameId],
      (updateErr) => {
        if (updateErr) return res.status(500).json({ message: updateErr.message });
        res.status(200).json({ message: 'Move successful', board });
      }
    );
  });
};
