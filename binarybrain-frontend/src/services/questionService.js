import axios from 'axios';

const API_URL = 'http://localhost:5000/api/questions/';

const getQuestions = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getQuestion = async (id) => {
  const response = await axios.get(API_URL + id);
  return response.data;
};

const addQuestion = async (questionData) => {
  const response = await axios.post(API_URL + 'add', questionData);
  return response.data;
};

const submitCode = async (id, payload) => {
  const response = await axios.post(API_URL + id + '/submit', payload);
  return response.data;
};

export default { getQuestions, getQuestion, addQuestion, submitCode };
