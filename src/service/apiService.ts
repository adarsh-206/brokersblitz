import axios from "axios";

const API_BASE_URL = "http://10.0.2.2:4050";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  get: async <T>(url: string, token?: string): Promise<T> => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosInstance.get<T>(url, { headers });
    return response.data;
  },

  post: async <T>(url: string, data: any, token?: string): Promise<T> => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosInstance.post<T>(url, data, { headers });
    return response.data;
  },
};
