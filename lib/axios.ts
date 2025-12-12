import axios, { AxiosError } from "axios";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://nexlearn.noviindusdemosites.in";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

if (typeof window !== "undefined") {
  const at = localStorage.getItem("access_token");
  if (at) {
    api.defaults.headers.common["Authorization"] = `Bearer ${at}`;
  }
}

let isRefreshing = false;
let subscribers: ((token: string | null) => void)[] = [];

function onRefreshed(token: string | null) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError & { config?: any }) => {
    const original = err.config;
    if (err.response?.status === 401 && !original?._retry) {
      original._retry = true;

      const refresh = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;

      if (!refresh) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          delete api.defaults.headers.common["Authorization"];
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribers.push((token) => {
            if (!token) return reject(err);
            original.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      isRefreshing = true;
      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          delete api.defaults.headers.common["Authorization"];
          onRefreshed(null);
          isRefreshing = false;
          window.location.href = "/login";
        }
        return Promise.reject(err);
      } catch (e) {
        onRefreshed(null);
        isRefreshing = false;
        return Promise.reject(e);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
