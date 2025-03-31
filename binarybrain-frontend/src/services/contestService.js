import axios from 'axios';

const API_URL = 'http://localhost:5000/api/contests/';

const createContest = async (contestData) => {
  const response = await axios.post(API_URL + 'create', contestData);
  return response.data;
};

const getContests = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export default { createContest, getContests };
