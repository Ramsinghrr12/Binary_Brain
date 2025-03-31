import React, { useState } from 'react';
import { createQuestion, updateQuestion } from '../utils/api';
import '../styles/admin.css';

const QuestionForm = ({ question = null, onSuccess }) => {
  const isEditing = !!question;

  const [formData, setFormData] = useState({
    title: question?.title || '',
    description: question?.description || '',
    difficulty: question?.difficulty || 'easy',
    tags: question?.tags?.join(', ') || '',
    testCases: question?.testCases || [{ input: '', expectedOutput: '', isHidden: false }],
    solutionCode: question?.solutionCode || '',
    timeLimit: question?.timeLimit || 1,
    memoryLimit: question?.memoryLimit || 256,
    constraints: question?.constraints || '',
    examples: question?.examples || [{ input: '', output: '', explanation: '' }]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...formData.testCases];
    updatedTestCases[index] = { ...updatedTestCases[index], [field]: value };
    setFormData(prev => ({ ...prev, testCases: updatedTestCases }));
  };

  const handleExampleChange = (index, field, value) => {
    const updatedExamples = [...formData.examples];
    updatedExamples[index] = { ...updatedExamples[index], [field]: value };
    setFormData(prev => ({ ...prev, examples: updatedExamples }));
  };

  const addTestCase = () => {
    setFormData(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '', isHidden: false }]
    }));
  };

  const removeTestCase = (index) => {
    const updatedTestCases = [...formData.testCases];
    updatedTestCases.splice(index, 1);
    setFormData(prev => ({ ...prev, testCases: updatedTestCases }));
  };

  const addExample = () => {
    setFormData(prev => ({
      ...prev,
      examples: [...prev.examples, { input: '', output: '', explanation: '' }]
    }));
  };

  const removeExample = (index) => {
    const updatedExamples = [...formData.examples];
    updatedExamples.splice(index, 1);
    setFormData(prev => ({ ...prev, examples: updatedExamples }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const questionData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      if (isEditing) {
        await updateQuestion(question.id, questionData);
      } else {
        await createQuestion(questionData);
      }

      setSuccess(true);

      if (!isEditing) {
        setFormData({
          title: '',
          description: '',
          difficulty: 'easy',
          tags: '',
          testCases: [{ input: '', expectedOutput: '', isHidden: false }],
          solutionCode: '',
          timeLimit: 1,
          memoryLimit: 256,
          constraints: '',
          examples: [{ input: '', output: '', explanation: '' }]
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('Failed to save question. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="question-form-container">
      <h2>{isEditing ? 'Edit Question' : 'Add New Question'}</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Question successfully {isEditing ? 'updated' : 'created'}!</div>}
      <form onSubmit={handleSubmit} className="question-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="difficulty">Difficulty</label>
          <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange} required>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input type="text" id="tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="arrays, sorting, dynamic-programming" />
        </div>
        <div className="form-group">
          <label htmlFor="description">Problem Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="8" required />
        </div>
        <div className="form-group">
          <label htmlFor="constraints">Constraints</label>
          <textarea id="constraints" name="constraints" value={formData.constraints} onChange={handleChange} rows="4" />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update Question' : 'Create Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;