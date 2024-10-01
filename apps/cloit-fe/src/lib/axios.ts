import axios, { Axios } from "axios";

// endpoint v1 , client > external api
export const axiosV1Api: Axios = axios.create({
  baseURL: process.env.NEXT_API_URL,
  timeout: 10000,
});

export const axiosV1ApiClient: Axios = axios.create({
  baseURL: process.env.NEXT_BASE_URL,
  timeout: 10000,
});

axiosV1ApiClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      // do something here
    }
    if (err.response?.status === 503) {
      // do something here
    }
    return Promise.reject(err);
  }
);
