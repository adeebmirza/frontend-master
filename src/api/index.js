import axios from "axios";

const API = axios.create({
  baseURL: "https://api.intellihelper.tech/notes", // change if backend is hosted elsewhere
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
