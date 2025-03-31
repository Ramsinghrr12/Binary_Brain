import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/contests.css';

const ContestCard = ({ contest }) => {
  const { id, title, startTime, endTime, duration, registered, status } = contest;
  
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  let timeDisplay = '';
  let timeClass = '';
  
  if (now < start) {
    const timeUntilStart = start - now;
    const days = Math.floor(timeUntilStart / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeUntilStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilStart % (1000 * 60 * 60)) / (1000 * 60));
    
    timeDisplay = `Starts in ${days}d ${hours}h ${minutes}m`;
    timeClass = 'contest-upcoming';
  } else if (now >= start && now <= end) {
    const timeRemaining = end - now;
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    
    timeDisplay = `Ends in ${hours}h ${minutes}m`;
    timeClass = 'contest-live';
  } else {
    timeDisplay = 'Contest ended';
    timeClass = 'contest-ended';
  }

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={`contest-card ${timeClass}`}>
      <div className="contest-card-header">
        <h3 className="contest-title">{title}</h3>
        <span className={`contest-status ${timeClass}`}>
          {status}
        </span>
      </div>
      <div className="contest-card-time">
        <div className="contest-time-info">
          <p>Start: {formatDate(startTime)}</p>
          <p>End: {formatDate(endTime)}</p>
          <p>Duration: {duration} minutes</p>
        </div>
        <div className="contest-countdown">
          <p className={timeClass}>{timeDisplay}</p>
        </div>
      </div>
      <div className="contest-card-footer">
        {now < start ? (
          <Link 
            to={`/contests/${id}`} 
            className={`contest-button ${registered ? 'registered' : 'register'}`}
          >
            {registered ? 'View Details' : 'Register'}
          </Link>
        ) : now >= start && now <= end ? (
          <Link 
            to={`/contests/${id}`} 
            className="contest-button enter"
          >
            {registered ? 'Enter Contest' : 'Register & Enter'}
          </Link>
        ) : (
          <Link 
            to={`/contests/${id}/results`} 
            className="contest-button results"
          >
            View Results
          </Link>
        )}
      </div>
    </div>
  );
};

export default ContestCard;