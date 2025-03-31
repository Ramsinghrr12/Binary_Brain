// src/components/CodeEditor.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AceEditor from 'react-ace';
import { submitCode } from '../utils/api';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-monokai';

const CodeEditor = ({ problemId }) => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('java');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await submitCode(problemId, code, language);
            setResult(response);
            // If the submission is Accepted, redirect to /problems to refresh the list
            if (response.status === 'Accepted') {
                setTimeout(() => {
                    navigate('/problems');
                }, 1000); // Delay to allow the user to see the "Accepted" message
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit code');
        } finally {
            setLoading(false);
        }
    };

    const languageOptions = [
        { value: 'java', label: 'Java' },
        { value: 'python', label: 'Python' },
        { value: 'cpp', label: 'C++' },
        { value: 'c', label: 'C' },
    ];

    const getAceMode = () => {
        if (language === 'java') return 'java';
        if (language === 'python') return 'python';
        if (language === 'cpp' || language === 'c') return 'c_cpp';
        return 'text';
    };

    return (
        <div className="code-editor">
            <h3>Code Editor</h3>
            <div className="editor-controls">
                <label>
                    Language:
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        {languageOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            {language === 'java' && (
                <div className="language-note">
                    <strong>Note:</strong> For Java submissions, please use <code>public class Main</code> as the class name.
                </div>
            )}
            <AceEditor
                mode={getAceMode()}
                theme="monokai"
                value={code}
                onChange={(newCode) => setCode(newCode)}
                name="code-editor"
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                }}
                style={{ width: '100%', height: '400px' }}
            />
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Code'}
            </button>
            {error && <div className="error-message">{error}</div>}
            {result && (
                <div className="submission-result">
                    <h4>Submission Result</h4>
                    <p><strong>Status:</strong> {result.status}</p>
                    <p><strong>Output:</strong> {result.output}</p>
                    {result.status === 'Wrong Answer' && result.failedTestCase && (
                        <div className="failed-test-case">
                            <h5>Failed Test Case Details:</h5>
                            <p><strong>Input:</strong> <code>{result.failedTestCase.input}</code></p>
                            <p><strong>Expected Output:</strong> <code>{result.failedTestCase.expectedOutput}</code></p>
                            <p><strong>Actual Output:</strong> <code>{result.failedTestCase.actualOutput}</code></p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CodeEditor;