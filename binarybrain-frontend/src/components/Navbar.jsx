import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Binary Brain
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/problems" className="navbar-link">Problems</Link>
          <Link to="/contests" className="navbar-link">Contests</Link>
          <Link to="/leaderboard" className="navbar-link">Leaderboard</Link>
          
          {user && user.role === 'admin' && (
            <Link to="/admin" className="navbar-link">Admin</Link>
          )}
          
          {user ? (
            <>
              <span className="navbar-username">Hello, {user.username}</span>
              <button className="navbar-button logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link navbar-button">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;