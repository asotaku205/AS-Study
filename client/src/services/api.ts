import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const setAccessToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const isRefreshCall = original?.url?.includes("/auth/refresh");

    if (status !== 401 || original?._retry || isRefreshCall) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (!refreshPromise) {
      refreshPromise = api
        .post("/auth/refresh")
        .then((r) => {
          const token = r.data.access_token;
          setAccessToken(token);
          return token;
        })
        .catch(() => {
          setAccessToken(null);
          return Promise.reject(error);
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const newToken = await refreshPromise;
    original.headers.Authorization = `Bearer ${newToken}`;
    return api(original);
  },
);

export default api;
