import React from 'react';

const Dashboard: React.FC<{ username: string; onCreateGame: () => void }> = ({
  username,
  onCreateGame,
}) => {
  return (
    <div>
      <h2>Welcome, {username}</h2>
      <button onClick={onCreateGame}>Create Game</button>
    </div>
  );
};

export default Dashboard;
