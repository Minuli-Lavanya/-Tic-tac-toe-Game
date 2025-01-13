import React, { useState } from "react";
import { io } from "socket.io-client";
import Game from "./Game.tsx";

interface Props {
  token: string;
  playerName: string;
}

const Lobby: React.FC<Props> = ({ token, playerName }) => {
  const [opponent, setOpponent] = useState<string | null>(null);
  const [playingAs, setPlayingAs] = useState<string | null>(null);

  const socket = io("http://localhost:3000", {
    query: { token },
  });

  socket.emit("authenticate", { token });

  socket.on("OpponentFound", (data) => {
    setOpponent(data.opponentName);
    setPlayingAs(data.playingAs);
  });

  const requestToPlay = () => {
    if (socket) {
      socket.emit("request_to_play", { playerName });
    } else {
      console.error("Socket is not initialized.");
    }
  };
  

  if (opponent) {
    return <Game socket={socket} opponent={opponent} playingAs={playingAs!} />;
  }

  return (
    <div>
      <h2>Welcome, {playerName}</h2>
      <button onClick={requestToPlay}>Find an Opponent</button>
    </div>
  );
};

export default Lobby;
