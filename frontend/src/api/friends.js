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

// ADD FRIEND
export const addFriend = (payload) => api.post("/friends/add-friend", payload);


//Get Nearby Friends 
export const getNearbyFriends = (userId, distance) =>
{
  return api.get(`/friends/nearby/${userId}`, {
    params: { distance },
  }); 
}

export const updateLocation = (userId, { latitude, longitude, online = true } = { online: true }) =>
{
  const payload = { online };
  // Only add coordinates if they exist
  if (latitude !== undefined && longitude !== undefined) {
    payload.latitude = latitude;
    payload.longitude = longitude;
  }
  return api.post(`/users/${userId}/location`, payload);
}

export const setAway = (userId) =>
{
  console.log(`Setting user ${userId} to away status`);
  return api.post(`/users/${userId}/away`); 
}