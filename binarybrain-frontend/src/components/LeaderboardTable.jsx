
import React, { useState, useEffect } from 'react';
import { fetchLeaderboard } from '../utils/api';
import '../styles/leaderboard.css';

const LeaderboardTable = ({ contestId = null }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'rank',
    direction: 'asc'
  });
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await fetchLeaderboard(contestId, timeframe);
        setLeaderboard(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch leaderboard data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getLeaderboard();
  }, [contestId, timeframe]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  if (loading) {
    return <div className="loading-spinner">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="leaderboard-container">
      {!contestId && (
        <div className="leaderboard-filters">
          <button 
            className={`filter-btn ${timeframe === 'all' ? 'active' : ''}`}
            onClick={() => setTimeframe('all')}
          >
            All Time
          </button>
          <button 
            className={`filter-btn ${timeframe === 'monthly' ? 'active' : ''}`}
            onClick={() => setTimeframe('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`filter-btn ${timeframe === 'weekly' ? 'active' : ''}`}
            onClick={() => setTimeframe('weekly')}
          >
            Weekly
          </button>
        </div>
      )}

      <div className="leaderboard-table-wrapper">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th 
                className="sortable"
                onClick={() => requestSort('rank')}
              >
                Rank{getSortIndicator('rank')}
              </th>
              <th>User</th>
              <th 
                className="sortable"
                onClick={() => requestSort('score')}
              >
                Score{getSortIndicator('score')}
              </th>
              <th 
                className="sortable"
                onClick={() => requestSort('problemsSolved')}
              >
                Problems Solved{getSortIndicator('problemsSolved')}
              </th>
              {contestId && (
                <th 
                  className="sortable"
                  onClick={() => requestSort('timeElapsed')}
                >
                  Time{getSortIndicator('timeElapsed')}
                </th>
              )}
              {!contestId && (
                <>
                  <th 
                    className="sortable"
                    onClick={() => requestSort('easyCount')}
                  >
                    Easy{getSortIndicator('easyCount')}
                  </th>
                  <th 
                    className="sortable"
                    onClick={() => requestSort('mediumCount')}
                  >
                    Medium{getSortIndicator('mediumCount')}
                  </th>
                  <th 
                    className="sortable"
                    onClick={() => requestSort('hardCount')}
                  >
                    Hard{getSortIndicator('hardCount')}
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedLeaderboard.length > 0 ? (
              sortedLeaderboard.map((entry, index) => (
                <tr key={entry.userId} className={index < 3 ? `top-${index + 1}` : ''}>
                  <td className="rank-cell">
                    {entry.rank}
                    {index < 3 && <span className="rank-badge">🏆</span>}
                  </td>
                  <td className="user-cell">
                    <div className="user-info">
                      <span className="user-avatar">
                        {entry.username.charAt(0).toUpperCase()}
                      </span>
                      <span className="username">{entry.username}</span>
                    </div>
                  </td>
                  <td className="score-cell">{entry.score}</td>
                  <td>{entry.problemsSolved}</td>
                  {contestId && (
                    <td>{formatTime(entry.timeElapsed)}</td>
                  )}
                  {!contestId && (
                    <>
                      <td className="easy-cell">{entry.easyCount}</td>
                      <td className="medium-cell">{entry.mediumCount}</td>
                      <td className="hard-cell">{entry.hardCount}</td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={contestId ? 5 : 7} className="no-data-message">
                  No leaderboard data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
};

export default LeaderboardTable;