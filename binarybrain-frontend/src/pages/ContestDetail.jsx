// src/pages/ContestDetail.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getContestById } from '../utils/api';
import '../styles/contests.css';

const ContestDetail = () => {
    const { id } = useParams();
    const [contest, setContest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContest = async () => {
            try {
                const data = await getContestById(id);
                setContest(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch contest details');
                setLoading(false);
            }
        };

        fetchContest();
    }, [id]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!contest) return <div>Contest not found.</div>;

    const now = new Date();
    const startTime = new Date(contest.startTime);
    const endTime = new Date(contest.endTime);
    const isOngoing = now >= startTime && now <= endTime;
    const isFinished = now > endTime;

    return (
        <div className="contest-detail-container">
            <header className="contest-header">
                <Link to="/contests" className="back-link">← Back to Contests</Link>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </header>
            <h2>{contest.title}</h2>
            <div className="contest-meta">
                <p><strong>Start Time:</strong> {new Date(contest.startTime).toLocaleString()}</p>
                <p><strong>End Time:</strong> {new Date(contest.endTime).toLocaleString()}</p>
                <p>
                    <strong>Status:</strong>{' '}
                    {isOngoing ? 'Ongoing' : isFinished ? 'Finished' : 'Upcoming'}
                </p>
            </div>
            <div className="contest-problems">
                <h3>Problems</h3>
                {contest.questions && contest.questions.length > 0 ? (
                    <ul>
                        {contest.questions.map((question) => (
                            <li key={question._id}>
                                {isOngoing || isFinished ? (
                                    <Link to={`/problems/${question._id}`}>
                                        {question.title}
                                    </Link>
                                ) : (
                                    <span>{question.title} (Available during contest)</span>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No problems available for this contest.</p>
                )}
            </div>
            {(isOngoing || isFinished) && contest.leaderboard && contest.leaderboard.length > 0 && (
                <div className="contest-leaderboard">
                    <h3>Leaderboard</h3>
                    <table className="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>User</th>
                                <th>Score</th>
                                <th>Time Elapsed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contest.leaderboard
                                .sort((a, b) => b.score - a.score || a.timeElapsed - b.timeElapsed)
                                .map((entry, index) => (
                                    <tr key={entry.user._id}>
                                        <td>{index + 1}</td>
                                        <td>{entry.user.name}</td>
                                        <td>{entry.score}</td>
                                        <td>{Math.round(entry.timeElapsed)} seconds</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ContestDetail;