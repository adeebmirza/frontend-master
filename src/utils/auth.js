export const getToken = () => {
    return localStorage.getItem('authToken');
  };
  
  export const setToken = (token) => {
    localStorage.setItem('authToken', token);
  };
  
  export const clearToken = () => {
    localStorage.removeItem('authToken');
  };

import axios from "axios";

const API = axios.create({
  baseURL: "https://api.intellihelper.tech", // your FastAPI backend
});

export default API;