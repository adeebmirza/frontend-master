// src/api/newsApi.js
const API_URL = "https://api.intellihelper.tech/Intelli_news";

export const fetchNews = async (query = "") => {
  const url = query ? `${API_URL}/?query=${query}` : `${API_URL}/`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch news");
  return response.json();
};

export const fetchByCategory = async (category) => {
  const response = await fetch(`${API_URL}/category/${category}`);
  if (!response.ok) throw new Error("Failed to fetch category news");
  return response.json();
};
