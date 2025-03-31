// src/utils/api.js
import axios from 'axios';

export const getQuestionById = async (id) => {
    const response = await axios.get(`/api/questions/${id}`);
    return response.data;
};

export const getQuestions = async () => {
    const response = await axios.get('/api/questions', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

export const submitCode = async (problemId, code, language) => {
    const response = await axios.post('/api/submissions/submit', {
        problemId,
        language,
        code,
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

export const addQuestion = async (questionData) => {
    const response = await axios.post('/api/questions/add', questionData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

export const deleteQuestion = async (questionId) => {
    const response = await axios.delete(`/api/questions/${questionId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

export const getLeaderboard = async () => {
    const response = await axios.get('/api/leaderboard');
    return response.data;
};

export const addAdmin = async (adminData) => {
    const response = await axios.post('/api/users/add-admin', adminData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await axios.post('/api/users/login', credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await axios.post('/api/users/register', userData);
    return response.data;
};

export const getUserProfile = async () => {
    const response = await axios.get('/api/users/profile', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

export const getUserStats = async (userId) => {
    const response = await axios.get(`/api/users/stats/${userId}`);
    return response.data;
};

export const getContests = async () => {
    const response = await axios.get('/api/contests');
    return response.data;
};

export const getContestById = async (id) => {
    const response = await axios.get(`/api/contests/${id}`);
    return response.data;
};

export const createContest = async (contestData) => {
    const response = await axios.post('/api/contests', contestData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};

export const deleteContest = async (contestId) => {
    const response = await axios.delete(`/api/contests/${contestId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.data;
};