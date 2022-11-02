import axios from "axios";
let BASE_URL = "";

if (process.env.NODE_ENV === "development")
    BASE_URL = "http://localhost:3500";
else
    BASE_URL = "https://castrum-tactics.onrender.com";

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true
});