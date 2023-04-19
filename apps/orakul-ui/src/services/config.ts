const config = {
  standalone: process.env.REACT_APP_EXTENSION === '0',
  apiUrl: `${process.env.REACT_APP_SERVER_URL}/api`,
};

export default config;
