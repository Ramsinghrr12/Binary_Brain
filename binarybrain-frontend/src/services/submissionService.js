import axios from 'axios';

const API_URL = 'http://localhost:5000/api/submissions/';

const submitCode = async (id, payload) => {
  const response = await axios.post(API_URL + id, payload);
  return response.data;
};

export default { submitCode };
