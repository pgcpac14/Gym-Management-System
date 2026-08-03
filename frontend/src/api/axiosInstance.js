import axios from "axios";

function createApi(port) {
  const instance = axios.create({
    baseURL: `http://localhost:${port}/api`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
}

export const authApi = createApi(8081);
export const adminApi = createApi(8082);
export const trainerApi = createApi(8083);
export const memberApi = createApi(8084);
