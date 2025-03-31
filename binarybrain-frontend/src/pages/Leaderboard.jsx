import React from 'react';
import LeaderboardTable from '../components/LeaderboardTable';
import '../styles/leaderboard.css';

const Leaderboard = () => {
  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1>Global Leaderboard</h1>
        <p>
          See how you rank among coders from around the world. Solve problems, participate in contests, and climb the rankings!
        </p>
      </div>
      <LeaderboardTable />
    </div>
  );
};

export default Leaderboard;