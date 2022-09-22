import axios from "axios";
//const BASE_URL = "https://castrum-tactics.onrender.com";
const BASE_URL = "http://localhost:3500";

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true
});