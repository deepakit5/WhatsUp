import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.VITE_BACKEND_URL,
  headers: {"Content-Type": "application/json"},
});

export default axiosInstance;
