const request = require('supertest');
const express = require('express');
const gameRoutes = require('../routes/game');
const app = express();

app.use(express.json());
app.use('/games', gameRoutes);

jest.mock('../db/connection', () => ({
  query: jest.fn(),
}));

const db = require('../db/connection');

// Test GET /games
describe('GET /games', () => {
  it('should return all games', async () => {
    const mockGames = [
      { id: 1, player1_id: 1, player2_id: 2, state: '[["", "", ""], ["", "", ""], ["", "", ""]]' },
    ];
    db.query.mockImplementation((query, callback) => callback(null, mockGames));

    const response = await request(app).get('/games');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockGames);
  });

  it('should return error if db query fails', async () => {
    db.query.mockImplementation((query, callback) => callback(new Error('DB error')));

    const response = await request(app).get('/games');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
  });
});

// Test POST /games
describe('POST /games', () => {
  it('should create a new game', async () => {
    db.query.mockImplementation((query, values, callback) => callback(null, { insertId: 1 }));

    const response = await request(app)
      .post('/games')
      .send({ player1_id: 1, player2_id: 2 });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Game created');
    expect(response.body.gameId).toBe(1);
  });

  it('should return error if db query fails', async () => {
    db.query.mockImplementation((query, values, callback) => callback(new Error('DB error')));

    const response = await request(app)
      .post('/games')
      .send({ player1_id: 1, player2_id: 2 });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal server error');
  });
});

// Test POST /game/:id/move
describe('POST /game/:id/move', () => {
  it('should update the game state with a valid move', async () => {
    const mockState = [["", "", ""], ["", "", ""], ["", "", ""]];
    db.query.mockImplementation((query, values, callback) => callback(null, [{ state: JSON.stringify(mockState) }]));

    const response = await request(app)
      .post('/games/1/move')
      .send({ row: 0, col: 0 });

    expect(response.status).toBe(200);
    expect(response.body.state[0][0]).toBe('X');
  });

  it('should return error if the cell is already occupied', async () => {
    const mockState = [["X", "", ""], ["", "", ""], ["", "", ""]];
    db.query.mockImplementation((query, values, callback) => callback(null, [{ state: JSON.stringify(mockState) }]));

    const response = await request(app)
      .post('/games/1/move')
      .send({ row: 0, col: 0 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Cell already occupied');
  });

  it('should return error if game is not found', async () => {
    db.query.mockImplementation((query, values, callback) => callback(null, []));

    const response = await request(app)
      .post('/games/999/move')
      .send({ row: 0, col: 0 });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Game not found');
  });
});
