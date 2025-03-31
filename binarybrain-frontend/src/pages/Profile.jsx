// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, getUserStats } from '../utils/api';
import '../styles/profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = await getUserProfile();
                setUser(userData.user);

                const statsData = await getUserStats(userData.user._id);
                setStats(statsData);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch profile or stats');
                setLoading(false);
            }
        };

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchProfile();
        }
    }, [navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            {user && (
                <div className="profile-details">
                    <h2>{user.name}</h2>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.isAdmin ? 'Admin' : 'User'}</p>
                </div>
            )}
            {stats && (
                <div className="stats-section">
                    <h2>Statistics</h2>
                    <p><strong>Total Solved:</strong> {stats.totalSolved}</p>
                    <p><strong>Easy Solved:</strong> {stats.easySolved}</p>
                    <p><strong>Medium Solved:</strong> {stats.mediumSolved}</p>
                    <p><strong>Hard Solved:</strong> {stats.hardSolved}</p>
                    <p><strong>Total Submissions:</strong> {stats.totalSubmissions}</p>
                    <p><strong>Acceptance Rate:</strong> {stats.acceptanceRate}%</p>
                    <p><strong>Rank:</strong> {stats.rank}</p>
                    <p><strong>Score:</strong> {stats.score}</p>
                    <p><strong>Current Streak:</strong> {stats.streak} days</p>
                    <p><strong>Longest Streak:</strong> {stats.longestStreak} days</p>
                </div>
            )}
        </div>
    );
};

export default Profile;