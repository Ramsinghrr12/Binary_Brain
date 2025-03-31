// src/pages/Problems.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getQuestions } from '../utils/api';
import '../styles/problems.css';

const Problems = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await getQuestions();
                setQuestions(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch questions');
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="problems-container">
            <header className="problems-header">
                <h1>Problems</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </header>
            {error && <div className="error-message">{error}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : questions.length === 0 ? (
                <div>No problems available.</div>
            ) : (
                <table className="problems-table">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Title</th>
                            <th>Difficulty</th>
                            <th>Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((question) => (
                            <tr key={question._id}>
                                <td>
                                    {question.solved && (
                                        <span className="solved-tick">✔</span>
                                    )}
                                </td>
                                <td>
                                    <Link to={`/problems/${question._id}`}>
                                        {question.title}
                                    </Link>
                                </td>
                                <td>
                                    <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
                                        {question.difficulty}
                                    </span>
                                </td>
                                <td>{question.tags.join(', ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Problems;