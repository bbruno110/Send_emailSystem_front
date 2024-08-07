import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.90:3031',//https://send-emailsystem-back.onrender.com',
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;