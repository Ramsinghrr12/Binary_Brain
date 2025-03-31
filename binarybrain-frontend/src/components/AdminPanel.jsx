// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addQuestion, getLeaderboard, addAdmin, getQuestions, createContest, deleteQuestion, getContests, deleteContest } from '../utils/api';
import '../styles/admin.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [questionData, setQuestionData] = useState({
        title: '',
        description: '',
        difficulty: 'Easy',
        tags: '',
        testCases: [{ input: '', expectedOutput: '', isHidden: false }],
        allowedLanguages: ['C', 'C++', 'Java', 'Python'],
        solutionCode: '',
        timeLimit: 1,
        memoryLimit: 256,
        constraints: '',
        examples: [{ input: '', output: '', explanation: '' }],
    });
    const [adminData, setAdminData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [contestData, setContestData] = useState({
        title: '',
        startTime: '',
        endTime: '',
        questions: [],
    });
    const [allQuestions, setAllQuestions] = useState([]);
    const [allContests, setAllContests] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
    const [loadingQuestions, setLoadingQuestions] = useState(true);
    const [loadingContests, setLoadingContests] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.isAdmin) {
            navigate('/login');
        }

        const fetchLeaderboard = async () => {
            try {
                const data = await getLeaderboard();
                setLeaderboard(data);
                setLoadingLeaderboard(false);
            } catch (err) {
                setError('Failed to fetch leaderboard');
                setLoadingLeaderboard(false);
            }
        };

        const fetchQuestions = async () => {
            try {
                const data = await getQuestions();
                setAllQuestions(data);
                setLoadingQuestions(false);
            } catch (err) {
                setError('Failed to fetch questions');
                setLoadingQuestions(false);
            }
        };

        const fetchContests = async () => {
            try {
                const data = await getContests();
                setAllContests(data);
                setLoadingContests(false);
            } catch (err) {
                setError('Failed to fetch contests');
                setLoadingContests(false);
            }
        };

        fetchLeaderboard();
        fetchQuestions();
        fetchContests();
    }, [navigate]);

    const handleQuestionChange = (e) => {
        const { name, value } = e.target;
        setQuestionData({ ...questionData, [name]: value });
    };

    const handleTestCaseChange = (index, field, value) => {
        const newTestCases = [...questionData.testCases];
        newTestCases[index][field] = value;
        setQuestionData({ ...questionData, testCases: newTestCases });
    };

    const addTestCase = () => {
        setQuestionData({
            ...questionData,
            testCases: [...questionData.testCases, { input: '', expectedOutput: '', isHidden: false }],
        });
    };

    const handleExampleChange = (index, field, value) => {
        const newExamples = [...questionData.examples];
        newExamples[index][field] = value;
        setQuestionData({ ...questionData, examples: newExamples });
    };

    const addExample = () => {
        setQuestionData({
            ...questionData,
            examples: [...questionData.examples, { input: '', output: '', explanation: '' }],
        });
    };
    
    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        try {
            const formattedData = {
                ...questionData,
                tags: questionData.tags.split(',').map(tag => tag.trim()),
                timeLimit: parseFloat(questionData.timeLimit),
                memoryLimit: parseInt(questionData.memoryLimit),
            };
            await addQuestion(formattedData);
            setSuccess('Question added successfully!');
            setQuestionData({
                title: '',
                description: '',
                difficulty: 'Easy',
                tags: '',
                testCases: [{ input: '', expectedOutput: '', isHidden: false }],
                allowedLanguages: ['C', 'C++', 'Java', 'Python'],
                solutionCode: '',
                timeLimit: 1,
                memoryLimit: 256,
                constraints: '',
                examples: [{ input: '', output: '', explanation: '' }],
            });
            const data = await getQuestions();
            setAllQuestions(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add question');
        }
    };
    
    const handleAdminChange = (e) => {
        const { name, value } = e.target;
        setAdminData({ ...adminData, [name]: value });
    };
    
    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        try {
            await addAdmin(adminData);
            setSuccess('Admin added successfully!');
            setAdminData({ name: '', email: '', password: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add admin');
        }
    };
    
    const handleContestChange = (e) => {
        const { name, value } = e.target;
        setContestData({ ...contestData, [name]: value });
    };
    
    const handleQuestionSelection = (e) => {
        const selectedQuestions = Array.from(e.target.selectedOptions, option => option.value);
        setContestData({ ...contestData, questions: selectedQuestions });
    };
    
    const handleContestSubmit = async (e) => {
        e.preventDefault();
        try {
            await createContest(contestData);
            setSuccess('Contest created successfully!');
            setContestData({ title: '', startTime: '', endTime: '', questions: [] });
            const data = await getContests();
            setAllContests(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create contest');
        }
    };
    
    const handleDeleteQuestion = async (questionId) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await deleteQuestion(questionId);
                setSuccess('Question deleted successfully!');
                const data = await getQuestions();
                setAllQuestions(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete question');
            }
        }
    };
    
    const handleDeleteContest = async (contestId) => {
        if (window.confirm('Are you sure you want to delete this contest?')) {
            try {
                await deleteContest(contestId);
                setSuccess('Contest deleted successfully!');
                const data = await getContests();
                setAllContests(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete contest');
            }
        }
    };
    
    return (
        <div className="admin-panel">
            <h1>Admin Panel</h1>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
    
            <div className="admin-section">
                <h2>Add New Question</h2>
                <form onSubmit={handleQuestionSubmit}>
                    <div className="form-group">
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={questionData.title}
                            onChange={handleQuestionChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={questionData.description}
                            onChange={handleQuestionChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Difficulty:</label>
                        <select
                            name="difficulty"
                            value={questionData.difficulty}
                            onChange={handleQuestionChange}
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Tags (comma-separated):</label>
                        <input
                            type="text"
                            name="tags"
                            value={questionData.tags}
                            onChange={handleQuestionChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Test Cases:</label>
                        {questionData.testCases.map((testCase, index) => (
                            <div key={index} className="test-case">
                                <input
                                    type="text"
                                    placeholder="Input"
                                    value={testCase.input}
                                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Expected Output"
                                    value={testCase.expectedOutput}
                                    onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                                    required
                                />
                                <label>
                                    Hidden:
                                    <input
                                        type="checkbox"
                                        checked={testCase.isHidden}
                                        onChange={(e) => handleTestCaseChange(index, 'isHidden', e.target.checked)}
                                    />
                                </label>
                            </div>
                        ))}
                        <button type="button" onClick={addTestCase}>Add Test Case</button>
                    </div>
                    <div className="form-group">
                        <label>Examples:</label>
                        {questionData.examples.map((example, index) => (
                            <div key={index} className="example">
                                <input
                                    type="text"
                                    placeholder="Input"
                                    value={example.input}
                                    onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Output"
                                    value={example.output}
                                    onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
                                    required
                                />
                                <textarea
                                    placeholder="Explanation"
                                    value={example.explanation}
                                    onChange={(e) => handleExampleChange(index, 'explanation', e.target.value)}
                                />
                            </div>
                        ))}
                        <button type="button" onClick={addExample}>Add Example</button>
                    </div>
                    <div className="form-group">
                        <label>Solution Code:</label>
                        <textarea
                            name="solutionCode"
                            value={questionData.solutionCode}
                            onChange={handleQuestionChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Time Limit (seconds):</label>
                        <input
                            type="number"
                            name="timeLimit"
                            value={questionData.timeLimit}
                            onChange={handleQuestionChange}
                            step="0.1"
                            min="0.1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Memory Limit (MB):</label>
                        <input
                            type="number"
                            name="memoryLimit"
                            value={questionData.memoryLimit}
                            onChange={handleQuestionChange}
                            min="1"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Constraints:</label>
                        <textarea
                            name="constraints"
                            value={questionData.constraints}
                            onChange={handleQuestionChange}
                        />
                    </div>
                    <button type="submit">Add Question</button>
                </form>
            </div>
    
            <div className="admin-section">
                <h2>Manage Questions</h2>
                {loadingQuestions ? (
                    <div>Loading questions...</div>
                ) : allQuestions.length === 0 ? (
                    <div>No questions available.</div>
                ) : (
                    <table className="questions-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Difficulty</th>
                                <th>Tags</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allQuestions.map((question) => (
                                <tr key={question._id}>
                                    <td>{question.title}</td>
                                    <td>{question.difficulty}</td>
                                    <td>{question.tags.join(', ')}</td>
                                    <td>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDeleteQuestion(question._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
    
            <div className="admin-section">
                <h2>Add New Admin</h2>
                <form onSubmit={handleAdminSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={adminData.name}
                            onChange={handleAdminChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={adminData.email}
                            onChange={handleAdminChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={adminData.password}
                            onChange={handleAdminChange}
                            required
                        />
                    </div>
                    <button type="submit">Add Admin</button>
                </form>
            </div>
    
            <div className="admin-section">
                <h2>Create New Contest</h2>
                <form onSubmit={handleContestSubmit}>
                    <div className="form-group">
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={contestData.title}
                            onChange={handleContestChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Start Time:</label>
                        <input
                            type="datetime-local"
                            name="startTime"
                            value={contestData.startTime}
                            onChange={handleContestChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>End Time:</label>
                        <input
                            type="datetime-local"
                            name="endTime"
                            value={contestData.endTime}
                            onChange={handleContestChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Select Questions:</label>
                        {loadingQuestions ? (
                            <div>Loading questions...</div>
                        ) : allQuestions.length === 0 ? (
                            <div>No questions available. Please add some questions first.</div>
                        ) : (
                            <select
                                multiple
                                value={contestData.questions}
                                onChange={handleQuestionSelection}
                            >
                                {allQuestions.map((question) => (
                                    <option key={question._id} value={question._id}>
                                        {question.title}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <button type="submit">Create Contest</button>
                </form>
            </div>
    
            <div className="admin-section">
                <h2>Manage Contests</h2>
                {loadingContests ? (
                    <div>Loading contests...</div>
                ) : allContests.length === 0 ? (
                    <div>No contests available.</div>
                ) : (
                    <table className="contests-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Questions</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allContests.map((contest) => (
                                <tr key={contest._id}>
                                    <td>{contest.title}</td>
                                    <td>{new Date(contest.startTime).toLocaleString()}</td>
                                    <td>{new Date(contest.endTime).toLocaleString()}</td>
                                    <td>
                                        {contest.questions.map(q => q.title).join(', ') || 'No questions'}
                                    </td>
                                    <td>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDeleteContest(contest._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
    
            <div className="admin-section">
                <h2>Leaderboard</h2>
                {loadingLeaderboard ? (
                    <div>Loading...</div>
                ) : leaderboard.length === 0 ? (
                    <div>No leaderboard entries yet.</div>
                ) : (
                    <table className="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((entry, index) => (
                                <tr key={entry._id}>
                                    <td>{index + 1}</td>
                                    <td>{entry.user.name}</td>
                                    <td>{entry.user.email}</td>
                                    <td>{entry.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
    };
    
    export default AdminPanel;