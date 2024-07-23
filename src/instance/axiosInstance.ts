import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://189.49.250.161:3031',//https://send-emailsystem-back.onrender.com',
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;