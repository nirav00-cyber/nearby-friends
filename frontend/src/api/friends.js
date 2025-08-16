import axios from "axios";

// use Vite dev proxy: see vite.config.js
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// USERS
export const getUsers = () => api.get("/users");
export const createUser = (data) => api.post("/friends/create", data);

// FRIENDS
export const getFriends = (userId) => api.get(`/friends/${userId}`);
export const addFriend = (payload) => api.post("/friends/add-friend", payload);
