import axios from "axios";

const API_URL = "http://localhost:3001/auth";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Register user
export const registerUser = (username: string, password: string) =>
    api.post("/register", { username, password });

// Login user
export const loginUser = (username: string, password: string) =>
    api.post("/login", { username, password });

export default api;
