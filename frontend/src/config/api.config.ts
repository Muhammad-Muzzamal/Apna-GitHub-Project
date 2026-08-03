import axios from "axios";
import ENV from "./env.config.js";

const api = axios.create({
  baseURL: ENV.SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
