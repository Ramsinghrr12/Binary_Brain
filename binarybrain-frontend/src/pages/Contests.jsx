// src/pages/Contests.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getContests } from '../utils/api';
import '../styles/contests.css';

const Contests = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContests = async () => {
            try {
                const data = await getContests();
                setContests(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch contests');
                setLoading(false);
            }
        };

        fetchContests();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="contests-container">
            <header className="contests-header">
                <h1>Contests</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </header>
            {error && <div className="error-message">{error}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : contests.length === 0 ? (
                <div>No contests available.</div>
            ) : (
                <table className="contests-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contests.map((contest) => {
                            const now = new Date();
                            const startTime = new Date(contest.startTime);
                            const endTime = new Date(contest.endTime);
                            let status = 'Upcoming';
                            if (now >= startTime && now <= endTime) {
                                status = 'Ongoing';
                            } else if (now > endTime) {
                                status = 'Finished';
                            }

                            return (
                                <tr key={contest._id}>
                                    <td>
                                        <Link to={`/contests/${contest._id}`}>
                                            {contest.title}
                                        </Link>
                                    </td>
                                    <td>{new Date(contest.startTime).toLocaleString()}</td>
                                    <td>{new Date(contest.endTime).toLocaleString()}</td>
                                    <td>{status}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Contests;