console.log(import.meta.env);
const config = {
  standalone: import.meta.env.VITE_EXTENSION === '0',
  apiUrl: `${import.meta.env.VITE_SERVER_URL}/api`,
};

export default config;
