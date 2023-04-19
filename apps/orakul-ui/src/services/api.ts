import axios from 'axios';
import config from './config';

export const getAnalysis = async () => {
  const { data } = await axios.get(`${config.apiUrl}/analysis`);
  return data;
};

export const getSourceCode = async (fileId: string) => {
  const { data } = await axios.post(`${config.apiUrl}/source-code`, { fileId });
  return data;
};
