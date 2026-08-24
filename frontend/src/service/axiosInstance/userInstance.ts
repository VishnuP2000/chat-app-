import axios from "axios";



const API_URL = import.meta.env.VITE_USER_BASE_URL;

// ---------------- Public instance (no access token needed) ----------------
export const publicAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send cookies (refresh token)
});
console.log('API_URL',API_URL)

// ---------------- User instance (needs access token) ----------------
export const privateAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ---------------- Request Interceptor ----------------
privateAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  console.log('UserInstance accestoken',token)
  if (token) {
    console.log('usersInstance token',token)
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.map((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// ---------------- Response Interceptor ----------------
privateAxios.interceptors.response.use((response) => response,async (error) => {
    const originalRequest = error.config;
    console.log('originalRequest',originalRequest)

    // Prevent infinite loop
    if (originalRequest.url.includes("refresh-token")) {
      return Promise.reject(error);
    }

    // Access token expired → get new one using refresh token cookie
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('error.response?.status')
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(privateAxios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('enter newAccessToken')
        const newAccessToken = await refreshAccessToken();

        // Save new access token
        localStorage.setItem("accessToken", newAccessToken);

        isRefreshing = false;
        onRefreshed(newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return privateAxios(originalRequest);

      } catch (err) {
        isRefreshing = false;
        refreshSubscribers = [];
        localStorage.removeItem("accessToken");
        return Promise.reject(err);
      }
    }
    console.log('this is userInstance response')

    return Promise.reject(error);
  }
);

// ---------------- Refresh Token Function ----------------
const refreshAccessToken = async () => {
  console.log('enter refreshToken')
  const res = await publicAxios.post(
    "/user/refresh-token",
    {},
    { withCredentials: true }
  );

  return res.data.accessToken; // backend returns { accessToken }
};
