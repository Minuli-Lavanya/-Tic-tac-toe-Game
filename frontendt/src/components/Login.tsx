import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface Props {
  setIsAuthenticated: (auth: boolean) => void;
  setToken: (token: string) => void;
  setPlayerName: (name: string) => void;
}

const Login: React.FC<Props> = ({ setIsAuthenticated, setToken, setPlayerName }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });
      setToken(res.data.token);
      setPlayerName(username);
      setIsAuthenticated(true);
      Swal.fire("Success", "Logged in successfully!", "success");
    } catch (error) {
      Swal.fire("Error", "Invalid credentials!", "error");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
