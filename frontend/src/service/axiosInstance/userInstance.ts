import axios from "axios";

const API_URL = import.meta.env.VITE_USER_BASE_URL;

console.log("API_URL:", API_URL);

// ---------------- Public Axios ----------------
// Used for login, signup, refresh-token, etc.
export const publicAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ---------------- Private Axios ----------------
// Cookies are automatically sent with every request.
export const privateAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ------------------------------------------------
// Refresh token handling
// ------------------------------------------------

let isRefreshing = false;

let refreshSubscribers: (() => void)[] = [];

const onRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

// ------------------------------------------------
// Response Interceptor
// ------------------------------------------------

privateAxios.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    console.log("Axios error:", error);

    // No request config
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Don't try to refresh the refresh-token request itself
    if (originalRequest.url?.includes("/user/refresh-token")) {
      return Promise.reject(error);
    }

    // Access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      // Another request is already refreshing
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber(() => {
            resolve(privateAxios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("Refreshing access token...");

        // Backend reads refreshToken cookie
        // and creates a new accessToken cookie.
        await refreshAccessToken();

        isRefreshing = false;

        onRefreshed();

        // Retry original request.
        // Browser automatically sends new accessToken cookie.
        return privateAxios(originalRequest);

      } catch (refreshError) {
        console.log("Refresh token failed:", refreshError);

        isRefreshing = false;
        refreshSubscribers = [];

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ------------------------------------------------
// Refresh Access Token
// ------------------------------------------------

const refreshAccessToken = async () => {
  console.log("Calling refresh-token endpoint...");

  const response = await publicAxios.post(
    "/user/refresh-token",
    {}
  );

  console.log("Refresh response:", response.data);

  return response.data;
};