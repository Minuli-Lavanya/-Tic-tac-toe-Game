const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/db');

exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: 'Username and Password are required' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO players (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: 'Username and Password are required' });

  db.query(
    'SELECT * FROM players WHERE username = ?',
    [username],
    async (err, results) => {
      if (err || results.length === 0)
        return res.status(401).json({ message: 'Invalid credentials' });

      const user = results[0];

      if (!(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', {
        expiresIn: '1h',
      });

      res.status(200).json({ token, username: user.username });
    }
  );
};
