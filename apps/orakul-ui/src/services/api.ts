import axios from 'axios';

const API_URL = `${process.env.REACT_APP_SERVER_URL}/api`;

export const getAnalysis = async () => {
  const { data } = await axios.get(`${API_URL}/analysis`);
  return data;
};

export const getSourceCode = async (fileId: string) => {
  const { data } = await axios.post(`${API_URL}/source-code`, { fileId });
  return data;
};
