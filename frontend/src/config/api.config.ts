import ENV from "./env.config.js";
import axios from "axios";

const api = axios.create({
  baseURL: ENV.SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
