import axios from "axios";

const API_URL = import.meta.env.VITE_USER_BASE_URL;

// ---------------- Public Axios ----------------
// Used for login, signup, refresh-token, etc.
export const publicAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true, // needed to send/receive the refreshToken cookie
});

// ---------------- Private Axios ----------------
// Sends accessToken via Authorization: Bearer header from localStorage.
export const privateAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true, // needed so refreshToken cookie is sent on refresh calls
});

// ------------------------------------------------
// Request Interceptor — attach accessToken from localStorage
// ------------------------------------------------

privateAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ------------------------------------------------
// Refresh token handling
// ------------------------------------------------

let isRefreshing = false;

let refreshSubscribers: ((error: any) => void)[] = [];

const onRefreshed = (error: any = null) => {
  refreshSubscribers.forEach((callback) => callback(error));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (error: any) => void) => {
  refreshSubscribers.push(callback);
};

// ------------------------------------------------
// Response Interceptor — handle 401, refresh, retry
// ------------------------------------------------

privateAxios.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

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
      // Another request is already refreshing — queue this one
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((error: any) => {
            if (error) {
              return reject(error);
            }
            originalRequest._retry = true;
            resolve(privateAxios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Backend reads refreshToken cookie, returns new accessToken in body
        const newAccessToken = await refreshAccessToken();

        // Store the new accessToken in localStorage
        localStorage.setItem("accessToken", newAccessToken);

        isRefreshing = false;
        onRefreshed(null);

        // Retry the original request — request interceptor will attach new token
        return privateAxios(originalRequest);

      } catch (refreshError) {
        console.log("Refresh token failed:", refreshError);

        isRefreshing = false;
        onRefreshed(refreshError);

        // Clear invalid token
        localStorage.removeItem("accessToken");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ------------------------------------------------
// Refresh Access Token
// ------------------------------------------------

const refreshAccessToken = async (): Promise<string> => {
  console.log("Calling refresh-token endpoint...");

  const response = await publicAxios.post(
    "/user/refresh-token",
    {}
  );

  console.log("Refresh response:", response.data);

  // Backend now returns { success, message, accessToken }
  return response.data.accessToken;
};