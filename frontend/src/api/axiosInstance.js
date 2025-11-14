import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "/api" : "https://your-prod-url.example.com/api");

export const api = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, //set true if your backend requires cookies
});

// Optional: request interceptor (e.g., auth header)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// Optional: response interceptor for error normalization
// api.interceptors.response.use(
//   (r) => r,
//   (error) => Promise.reject(error)
// );
