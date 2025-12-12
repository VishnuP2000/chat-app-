import axios from "axios";

const API_URL = import.meta.env.VITE_USER_BASE_URL;

// ---------------- Public instance (no access token needed) ----------------
export const publicAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send cookies (refresh token)
});

// ---------------- User instance (needs access token) ----------------
export const privateAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ---------------- Request Interceptor ----------------
privateAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("access-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------- Response Interceptor ----------------
privateAxios.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (originalRequest.url.includes("refresh-token")) {
      return Promise.reject(error);
    }

    // Access token expired → get new one using refresh token cookie
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();

        // Save new access token
        localStorage.setItem("access-token", newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return privateAxios(originalRequest);

      } catch (err) {
        localStorage.removeItem("access-token");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// ---------------- Refresh Token Function ----------------
const refreshAccessToken = async () => {
  const res = await publicAxios.post(
    "/user/refresh-token",
    {},
    { withCredentials: true }
  );

  return res.data.accessToken; // backend returns { accessToken }
};
