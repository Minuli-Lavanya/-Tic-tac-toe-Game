import React, { useState } from 'react';
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import Dashboard from './components/Dashboard.tsx';
import GameBoard from './components/GameBoard.tsx';
import { createGame } from './services/api.ts';

const App: React.FC = () => {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [gameId, setGameId] = useState<number | null>(null);
  const [showRegister, setShowRegister] = useState(false); // Toggle between Login and Register

  const handleLogin = (token: string, username: string) => {
    setToken(token);
    setUsername(username);
  };

  const handleCreateGame = async () => {
    try {
      const { data } = await createGame(token);
      setGameId(data.gameId);
    } catch (err) {
      console.error('Failed to create game:', err);
    }
  };

  if (!token) {
    return showRegister ? (
      <Register />
    ) : (
      <div>
        <Login onLogin={handleLogin} />
        <p>
          Don't have an account?{' '}
          <button onClick={() => setShowRegister(true)}>Register</button>
        </p>
      </div>
    );
  }

  if (!gameId) return <Dashboard username={username} onCreateGame={handleCreateGame} />;
  return <GameBoard gameId={gameId} token={token} />;
};

export default App;









// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Login from "../src/components/Login.tsx";
// import Register from "./components/Register.tsx";
// import Dashboard from "./components/Dashboard.tsx";

// const App: React.FC = () => {
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
//                 <Route path="/dashboard" element={<Dashboard />} />
//                 <Route path="/" element={<Login />} />
//             </Routes>
//         </Router>
//     );
// };

// export default App;
