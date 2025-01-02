import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const registerUser = async (username: string, password: string) => {
  return await API.post('/auth/register', { username, password });
};

export const loginUser = async (username: string, password: string) => {
  return await API.post('/auth/login', { username, password });
};

export const createGame = async (token: string) => {
  return await API.post(
    '/game',
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const makeMove = async (gameId: number, move: number, token: string) => {
  return await API.post(
    '/game/move',
    { gameId, move },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
