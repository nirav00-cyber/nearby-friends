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
export async function getNearbyFriends(userId, distance = null)
{
  try
  {
    const url = distance 
      ? `/friends/nearby/${userId}?distance=${distance}` 
      : `/friends/nearby/${ userId }`;
    
    const res = await api.get(url);
    if(res.status!== 200) {
      throw new Error("Failed to fetch nearby friends");
    }
    return await res.json(); 
  }
  catch (error) {
    console.error("Error fetching nearby friends:", error);
    return [];
  }
}