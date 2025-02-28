import axios from "axios";

const httpClient = axios.create({
  baseURL: "https://billsplitter-server.dekalouis.com",
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default httpClient;
