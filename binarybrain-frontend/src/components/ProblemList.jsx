import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/problems.css";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    fetch("/api/questions")
      .then((response) => response.json())
      .then((data) => setProblems(data))
      .catch((error) => console.error("Error fetching problems:", error));
  }, []);

  return (
    <div className="problem-list">
      <h2>Coding Problems</h2>
      <ul>
        {problems.map((problem) => (
          <li key={problem._id}>
            <Link to={`/problems/${problem._id}`}>
              <h3>{problem.title}</h3>
              <p>Difficulty: {problem.difficulty}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProblemList;