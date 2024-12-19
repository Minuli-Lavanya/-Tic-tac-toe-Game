const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');
const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

jest.mock('../db/connection', () => ({
  query: jest.fn(),
}));

const db = require('../db/connection');

const bcrypt = require('bcryptjs');
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Test registration
describe('POST /auth/register', () => {
  it('should register a new user successfully', async () => {
    bcrypt.hash.mockResolvedValue('hashedPassword');
    db.query.mockImplementation((query, values, callback) => callback(null, { insertId: 1 }));

    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered');
  });

  it('should return error if db query fails', async () => {
    db.query.mockImplementation((query, values, callback) => callback(new Error('DB error')));

    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal server error');
  });
});

// Test login
describe('POST /auth/login', () => {
  it('should log in a user successfully', async () => {
    const mockUser = { id: 1, username: 'testuser', password: 'hashedPassword' };
    db.query.mockImplementation((query, values, callback) => callback(null, [mockUser]));
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue('mocked_token');

    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe('mocked_token');
  });

  it('should return error for invalid credentials', async () => {
    db.query.mockImplementation((query, values, callback) => callback(null, []));
    
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'invaliduser', password: 'password123' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });
});
