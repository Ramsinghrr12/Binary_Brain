// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="home-page">
            <header className="home-header">
                <h1>BinaryBrain</h1>
                <nav className="home-nav">
                    <Link to="/problems" className="nav-link">Problems</Link>
                    <Link to="/contests" className="nav-link">Contests</Link>
                    {user ? (
                        <>
                            <Link to="/profile" className="nav-link">Profile</Link>
                            {user.isAdmin && (
                                <Link to="/admin" className="nav-link">Admin Panel</Link>
                            )}
                            <button
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                    window.location.href = '/login';
                                }}
                                className="nav-button"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link">Register</Link>
                        </>
                    )}
                </nav>
            </header>

            <main className="home-main">
                <section className="hero-section">
                    <h2>Welcome to BinaryBrain, RGUKT Students!</h2>
                    <p>
                        🚀 Calling all coding enthusiasts from Rajiv Gandhi University of Knowledge Technologies (RGUKT)! 
                        Dive into the world of competitive programming with BinaryBrain. Solve challenging problems, participate 
                        in exciting contests, and climb the leaderboard to showcase your skills. Whether you're a beginner or a pro, 
                        there's something here for everyone. Let’s code, compete, and grow together!
                    </p>
                    <div className="hero-buttons">
                        <Link to="/problems" className="hero-button">Start Solving</Link>
                        <Link to="/contests" className="hero-button">Join a Contest</Link>
                    </div>
                </section>

                <section className="features-section">
                    <h3>Why Choose BinaryBrain?</h3>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h4>Practice Problems</h4>
                            <p>Access a wide range of problems from easy to hard, designed to sharpen your coding skills.</p>
                        </div>
                        <div className="feature-card">
                            <h4>Compete in Contests</h4>
                            <p>Join live contests, compete with peers, and earn a spot on the leaderboard.</p>
                        </div>
                        <div className="feature-card">
                            <h4>Track Your Progress</h4>
                            <p>Monitor your performance, view stats, and see how you rank among RGUKT students.</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="home-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>About BinaryBrain</h4>
                        <p>
                            BinaryBrain is a platform created to foster coding talent among RGUKT students. 
                            Join us to enhance your programming skills and prepare for a bright future in tech!
                        </p>
                    </div>
                    <div className="footer-section">
                        <h4>Contact Us</h4>
                        <p>Email: ramsinghnayak5559@gmail.com</p>
                        <p>Phone: +91 7569833925</p>
                    </div>
                    <div className="footer-section">
                        <h4>Follow Us</h4>
                        <p>
                            <a href="https://facebook.com/dharavath-ramsingh" target="_blank" rel="noopener noreferrer">Facebook</a> | 
                            <a href="https://twitter.com/ramsingh fharavath" target="_blank" rel="noopener noreferrer">Twitter</a> | 
                            <a href="https://www.linkedin.com/in/ramsingh-dharavath-03bb771b5/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        </p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 BinaryBrain | All Rights Reserved | Designed for RGUKT Students</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;