import React, { useState } from "react";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import Lobby from "./components/Lobby.tsx";
//import Game from "./components/Game.tsx";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [playerName, setPlayerName] = useState("");

  if (!isAuthenticated) {
    return (
      <div>
        <Login
          setIsAuthenticated={setIsAuthenticated}
          setToken={setToken}
          setPlayerName={setPlayerName}
        />
        <Register />
      </div>
    );
  }

  return <Lobby token={token} playerName={playerName} />;
};

export default App;
