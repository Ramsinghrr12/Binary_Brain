import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Binary Brain</h3>
            <p>Practice coding, participate in contests, and improve your programming skills.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/problems">Problems</a></li>
              <li><a href="/contests">Contests</a></li>
              <li><a href="/leaderboard">Leaderboard</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: support@binarybrain.com</p>
            <p>GitHub: github.com/binarybrain</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Binary Brain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;