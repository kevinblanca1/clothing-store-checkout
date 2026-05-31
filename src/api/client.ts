import axios from "axios";

/** Shared axios instance for the fakestoreapi mock backend. */
export const apiClient = axios.create({
  baseURL: "https://fakestoreapi.com",
  headers: { "Content-Type": "application/json" },
});
