// src/pages/ProblemDetail.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import { getQuestionById } from '../utils/api';
import '../styles/problems.css';

const ProblemDetail = () => {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const data = await getQuestionById(id);
                setQuestion(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch question');
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [id]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!question) return <div>Question not found.</div>;

    return (
        <div className="problem-detail-container">
            <header className="problem-header">
                <Link to="/problems" className="back-link">← Back to Problems</Link>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </header>
            <div className="problem-content">
                <div className="problem-description">
                    <h2>{question.title}</h2>
                    <div className="problem-meta">
                        <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
                            {question.difficulty}
                        </span>
                    </div>
                    <div className="description-content">
                        <p>{question.description}</p>
                    </div>
                    {question.examples && question.examples.length > 0 && (
                        <div className="examples-section">
                            <h3>Examples</h3>
                            {question.examples.map((example, index) => (
                                <div key={index} className="example-box">
                                    <h4>Example {index + 1}</h4>
                                    <div className="example-content">
                                        <div><strong>Input:</strong> <code>{example.input}</code></div>
                                        <div><strong>Output:</strong> <code>{example.output}</code></div>
                                        {example.explanation && (
                                            <div><strong>Explanation:</strong> {example.explanation}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {question.constraints && (
                        <div className="constraints-section">
                            <h3>Constraints</h3>
                            <div dangerouslySetInnerHTML={{ __html: question.constraints }} />
                        </div>
                    )}
                    {question.testCases && question.testCases.length > 0 && (
                        <div className="test-cases-section">
                            <h3>Test Cases</h3>
                            {question.testCases
                                .filter(tc => !tc.isHidden)
                                .map((testCase, index) => (
                                    <div key={index} className="test-case-box">
                                        <h4>Test Case {index + 1}</h4>
                                        <div className="test-case-content">
                                            <div><strong>Input:</strong> <code>{testCase.input}</code></div>
                                            <div><strong>Expected Output:</strong> <code>{testCase.expectedOutput}</code></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
                <div className="code-editor-section">
                    <CodeEditor problemId={id} />
                </div>
            </div>
        </div>
    );
};

export default ProblemDetail;